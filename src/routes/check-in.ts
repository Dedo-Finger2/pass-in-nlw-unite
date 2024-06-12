import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../config/prisma";
import { BadRequest } from "./_errors/bad-request";
import { NotFound } from "./_errors/not-found";

export async function checkIn(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get("/attendees/:attendeeId/check-in", {
      schema: {
        summary: "Check-in an attendee.",
        tags: ["attendees"],
        params: z.object({
          attendeeId: z.coerce.number().int().positive(),
        }),
        response: {
          201: z.null(),
          400: z.object({
            error: z.boolean(),
            success: z.boolean(),
            code: z.number().int().positive(),
            message: z.string(),
            errors: z.object({
              attendeeId: z.array(z.string()).nullish(),
            }).nullish(),
          }),
          500: z.object({
            error: z.boolean(),
            success: z.boolean(),
            code: z.number().int().positive(),
            message: z.string(),
          }),
        }
      }
    }, async (request, reply) => {
      const { attendeeId } = request.params;

      const attendee = await prisma.attendee.findUnique({
        where: {
          id: attendeeId,
        }
      });

      if (attendee === null) throw new NotFound("Attnedee not found.");

      const atteendeeCheckIn = await prisma.checkIn.findUnique({
        where: {
          attendeeId
        }
      });

      if (atteendeeCheckIn !== null) throw new BadRequest("Attendee already checked in.");

      await prisma.checkIn.create({
        data: {
          attendeeId,
          createdAt: new Date(),
        }
      });

      return reply.status(201).send();
    });
} 