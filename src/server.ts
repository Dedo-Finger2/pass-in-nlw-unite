import fastify from "fastify";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";

const app = fastify();
const baseUrl = "/api/v1";
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

import { createEvent } from "./routes/create-event";
import { registerForEvent } from "./routes/register-for-event";
import { getEvent } from "./routes/get-event";
import { getAttendeeBadge } from "./routes/get-attendee-badge";
import { checkIn } from "./routes/check-in";
import { getEventAttendees } from "./routes/get-event-attendees";

app.register(createEvent, { prefix: baseUrl });
app.register(registerForEvent, { prefix: baseUrl });
app.register(getEvent, { prefix: baseUrl });
app.register(getAttendeeBadge, { prefix: baseUrl });
app.register(checkIn, { prefix: baseUrl });
app.register(getEventAttendees, { prefix: baseUrl });

app.listen({ port: 3333 }, () => {
  console.log("🚀 Server running...");
});
