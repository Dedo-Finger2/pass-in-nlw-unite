import { prisma } from "../src/config/prisma";

async function seed() {
  await prisma.event.create({
    data: {
      id: "d431c6b7-209f-4e46-8188-013aeac58abd",
      title: "Evento Teste",
      slug: "evento-teste",
      details: "Um evento de teste feito aqui.",
      maximumAttendees: 540,

    }
  })
}

seed().then(() => {
  console.log("🌐 Database seeded.");
  prisma.$disconnect();
});