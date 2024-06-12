import fastify from "fastify";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";

const app = fastify();
const baseUrl = "/api/v1";
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

import { createEvent } from "./routes/create-event";

app.register(createEvent, { prefix: baseUrl });

app.listen({ port: 3333 }, () => {
  console.log("🚀 Server running...");
});
