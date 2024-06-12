import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../config/prisma";
import { BadRequest } from "./_errors/bad-request";

export async function registerForEvent(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post("/events/:eventId/attendees", {
      schema: {
        summary: "Register an attendee for an event.",
        tags: ["events"],
        body: z.object({
          name: z.string().min(4),
          email: z.string().email(),
        }),
        params: z.object({
          eventId: z.string().uuid(),
        }),
        response: {
          201: z.object({
            error: z.boolean(),
            success: z.boolean(),
            code: z.number().int().positive(),
            message: z.object({ attendeeId: z.number().int().positive() }),
          }),
          400: z.object({
            error: z.boolean(),
            success: z.boolean(),
            code: z.number().int().positive(),
            message: z.string(),
            errors: z.object({
              eventId: z.array(z.string()).nullish(),
              name: z.array(z.string()).nullish(),
              email: z.array(z.string()).nullish(),
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
      const { eventId } = request.params;
      const { name, email } = request.body;
      
      const attendeeFromEmail = await prisma.attendee.findUnique({
        where: {
          eventId_email: {
            eventId,
            email,
          }
        }
      });

      if (attendeeFromEmail !== null) throw new BadRequest("This email is already registered in this event.");

      const [ event, amountOfAttendeesInEvent ] = await Promise.all([
        prisma.event.findUnique({
          where: {
            id: eventId,
          }
        }),
        prisma.attendee.count({
          where: {
            eventId,
          }
        }),
      ]);

      if (event?.maximumAttendees && amountOfAttendeesInEvent >= event.maximumAttendees) {
        throw new BadRequest("This event is full.");
      }

      const attendee = await prisma.attendee.create({
        data: {
          name,
          email,
          eventId,
          createdAt: new Date(),
        }
      });

      return reply.status(201).send({
        error: false,
        success: true,
        code: 201,
        message: { attendeeId: attendee.id },
      });
    });
}
