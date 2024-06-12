import { FastifyInstance } from "fastify";
import z from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "./../config/prisma";
import { randomUUID } from "node:crypto";
import { createSlug } from "../utils/create-slug";

export async function createEvent(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post("/events", {
      schema: {
        summary: "Create an event.",
        tags: ["events"],
        body: z.object({
          title: z.string().min(4),
          details: z.string().nullable(),
          maximumAttendees: z.number().int().positive().nullable()
        }),
        response: {
          201: z.object({
            error: z.boolean(),
            success: z.boolean(),
            code: z.number().int().positive(),
            message: z.object({ eventId: z.string().uuid() }),
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
        const { title, details, maximumAttendees } = request.body;
        
        const slug = createSlug(title);

        const eventWithSameSlug = await prisma.event.findUnique({
          where: {
            slug,
          }
        });

        if (eventWithSameSlug) return reply.status(400).send({
          error: true,
          success: false,
          code: 400,
          message: "There is an event with the same name.",
        });

        const event = await prisma.event.create({
          data: {
            id: randomUUID(),
            title,
            details,
            maximumAttendees,
            slug,
          }
        });

        return reply.status(201).send({
          error: false,
          success: true,
          code: 201,
          message: { eventId: event.id }
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
