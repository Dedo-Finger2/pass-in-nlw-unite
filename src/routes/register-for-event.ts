import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../config/prisma";

export async function registerForEvent(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post("/events/:eventId/attendees", {
      schema: {
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

        if (attendeeFromEmail !== null) return reply.status(400).send({
          error: true,
          success: false,
          code: 400,
          message: "This email is already registered in this event.",
        });

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
          return reply.status(400).send({
            error: true,
            success: false,
            code: 400,
            message: "This event is full."
          });
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
