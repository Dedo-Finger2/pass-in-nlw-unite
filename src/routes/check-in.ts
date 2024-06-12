import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../config/prisma";

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
      try {
        const { attendeeId } = request.params;

        const atteendeeCheckIn = await prisma.checkIn.findUnique({
          where: {
            attendeeId
          }
        });

        if (atteendeeCheckIn !== null) return reply.status(400).send({
          error: true,
          success: false,
          code: 400,
          message: "Attendee already checked in.",
        });

        await prisma.checkIn.create({
          data: {
            attendeeId,
            createdAt: new Date(),
          }
        });

        return reply.status(201).send();
      } catch (error) {
        console.error(error);
        
        return reply.status(500).send(
          { 
            error: true,
            success: false,
            code: 500,
            message: "Internal Server Error."
          }
        );
      }
    });
} 