import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../config/prisma";
import { NotFound } from "./_errors/not-found";

export async function getAttendeeBadge(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get("/attendees/:attendeeId/badge", {
      schema: {
        summary: "Returns an attendee's badge.",
        tags: ["attendees"],
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
            errors: z.object({
              attendeeId: z.array(z.string()).nullish(),
            }).nullish(),
          }),
          404: z.object({
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

      if (attendee === null) throw new NotFound("Attendee not found.");

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
    });
}