import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../config/prisma";

export async function getEvent(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get("/events/:eventId", {
      schema: {
        summary: "Return an event.",
        tags: ["events"],
        params: z.object({
          eventId: z.string().uuid(),
        }),
        response: {
          200: z.object({
            error: z.boolean(),
            success: z.boolean(),
            code: z.number().int().positive(),
            message: z.object({ event: z.object({
              id: z.string().uuid(),
              title: z.string(),
              details: z.string().nullable(),
              slug: z.string(),
              maximumAttendees: z.number().int().positive().nullable(),
              currentAmountOfAttendees: z.number().int().positive(),
            }) }),
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
        },
      }
    }, async (request, reply) => {
      try {
        const { eventId } = request.params;
  
        const event = await prisma.event.findUnique({
          select: {
            id: true,
            title: true,
            slug: true,
            details: true,
            maximumAttendees: true,
            _count: {
              select: {
                attendees: true,
              }
            }
          },
          where: {
            id: eventId,
          }
        });
  
        if (event === null) return reply.status(404).send({
          error: true,
          success: false,
          code: 400,
          message: "Event not found.",
        });

        return reply.status(200).send({
          error: false,
          success: true,
          code: 200,
          message: {
            event: {
              id: event.id,
              title: event.title,
              details: event.details,
              slug: event.slug,
              maximumAttendees: event.maximumAttendees,
              currentAmountOfAttendees: event._count.attendees,
            }
          },
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
