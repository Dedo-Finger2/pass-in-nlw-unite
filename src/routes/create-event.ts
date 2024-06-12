import { FastifyInstance } from "fastify";
import z from "zod";
import { prisma } from "./../config/prisma";
import { randomUUID } from "node:crypto";
import { createSlug } from "../utils/create-slug";

export async function createEvent(app: FastifyInstance) {
  app.post("/events", async (request, reply) => {
    const requestBodySchema = z.object({
      title: z.string().min(4),
      details: z.string().nullable(),
      maximumAttendees: z.number().int().positive().nullable()
    });

    try {
      const { title, details, maximumAttendees } = requestBodySchema.parse(request.body);
      
      const event = await prisma.event.create({
        data: {
          id: randomUUID(),
          title,
          details,
          maximumAttendees,
          slug: createSlug(title),
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
