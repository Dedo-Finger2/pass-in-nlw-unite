import { FastifyInstance } from "fastify"
import { ZodError } from "zod";
import { BadRequest } from "../routes/_errors/bad-request";
import { NotFound } from "../routes/_errors/not-found";

type FastifyErrorHanlder = FastifyInstance['errorHandler'];

export const errorHandler: FastifyErrorHanlder = (error, request, reply) => {
  console.error(error);

  if (error instanceof ZodError) {
    return reply.status(400).send({
      error: true,
      success: false,
      code: 400,
      message: "Error during validation.",
      errors: error.flatten().fieldErrors,  
    });
  }

  if (error instanceof BadRequest) {
    return reply.status(400).send({
      error: true,
      success: false,
      code: 400,
      message: error.message,
    });
  }

  if (error instanceof NotFound) {
    return reply.status(404).send({
      error: true,
      success: false,
      code: 404,
      message: error.message,
    });
  }
  
  return reply.status(500).send({
    error: true,
    success: false,
    code: 500,
    message: "Internal Server Error, try again later.",
  });
}