import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../config/prisma";

export async function getAttendeeBadge(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get("/attendees/:attendeeId/badge", {
      schema: {
        params: z.object({
          attendeeId: z.coerce.number().int().positive(),
        }),
        response: {
          200: z.object({
            error: z.boolean(),
            success: z.boolean(),
            code: z.number().int().positive(),
            message: z.object({ badge: z.object({
              name: z.string(),
              email: z.string().email(),
              event: z.object({ id: z.string().uuid(), title: z.string() }),
              checkInURL: z.string().url(),
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
        const { attendeeId } = request.params;

        const attendee = await prisma.attendee.findUnique({
          select: {
            name: true,
            email: true,
            event: {
              select: {
                id: true,
                title: true,
              }
            }
          },
          where: {
            id: attendeeId,
          }
        });

        if (attendee === null) return reply.status(404).send({
          error: true,
          success: false,
          code: 404,
          message: "Attendee not found.",
        });

        const baseURL = `${request.protocol}://${request.hostname}`;

        const checkInURL = new URL(`/attendees/${attendeeId}/check-in`, baseURL);

        return reply.status(200).send({
          error: false,
          success: true,
          code: 200,
          message: {
            badge: {
              name: attendee.name,
              email: attendee.email,
              event: attendee.event,
              checkInURL: checkInURL.toString(),
            },
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