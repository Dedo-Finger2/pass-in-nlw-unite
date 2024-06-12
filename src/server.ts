import fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";

const app = fastify();
const baseUrl = "/api/v1";
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.register(fastifySwagger, {
  swagger: {
    consumes: ['application/json'],
    produces: ['application/json'],
    info: {
      title: "pass-in",
      description: "Documentação da API pass-in construída durante o evento do NLW Unite.",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
});
app.register(fastifySwaggerUI, {
  routePrefix: "/docs"
});

import { createEvent } from "./routes/create-event";
import { registerForEvent } from "./routes/register-for-event";
import { getEvent } from "./routes/get-event";
import { getAttendeeBadge } from "./routes/get-attendee-badge";
import { checkIn } from "./routes/check-in";
import { getEventAttendees } from "./routes/get-event-attendees";
import { errorHandler } from "./utils/error-handler";

app.register(createEvent, { prefix: baseUrl });
app.register(registerForEvent, { prefix: baseUrl });
app.register(getEvent, { prefix: baseUrl });
app.register(getAttendeeBadge, { prefix: baseUrl });
app.register(checkIn, { prefix: baseUrl });
app.register(getEventAttendees, { prefix: baseUrl });

app.setErrorHandler(errorHandler);

app.listen({ port: 3333 }, () => {
  console.log("🚀 Server running...");
});
