import fastify from "fastify";

const app = fastify();
const baseUrl = "/api/v1";

import { createEvent } from "./routes/create-event";

app.register(createEvent, { prefix: baseUrl });

app.listen({ port: 3333 }, () => {
  console.log("🚀 Server running...");
});
