import { FastifyInstance } from "fastify"

type FastifyErrorHanlder = FastifyInstance['errorHandler'];

export const errorHandler: FastifyErrorHanlder = (error, request, reply) => {
  
}