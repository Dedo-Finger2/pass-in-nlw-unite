import fastify from "fastify";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";

const app = fastify();
const baseUrl = "/api/v1";
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

import { createEvent } from "./routes/create-event";
import { registerForEvent } from "./routes/register-for-event";
import { getEvent } from "./routes/get-event";

app.register(createEvent, { prefix: baseUrl });
app.register(registerForEvent, { prefix: baseUrl });
app.register(getEvent, { prefix: baseUrl });

app.listen({ port: 3333 }, () => {
  console.log("🚀 Server running...");
});
