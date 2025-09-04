import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.revisionesPasajeros.deleteMany();
  await prisma.revision.deleteMany();
  await prisma.pasajero.deleteMany();
  await prisma.aeronave.deleteMany();
  await prisma.naveNodriza.deleteMany();

  const [n1, n2] = await Promise.all([
    prisma.naveNodriza.create({ data: { nombre: "Andrómeda" } }),
    prisma.naveNodriza.create({ data: { nombre: "Orión" } }),
  ]);

  const a1 = await prisma.aeronave.create({
    data: {
      nombre: "Falcon-1",
      capacidadMaxima: 3,
      origen: { connect: { oid: n1.oid } },
      destino: { connect: { oid: n2.oid } },
    },
  });

  const a2 = await prisma.aeronave.create({
    data: {
      nombre: "Eagle-7",
      capacidadMaxima: 5,
      origen: { connect: { oid: n2.oid } },
      destino: { connect: { oid: n1.oid } },
    },
  });

  const [p1, p2, p3, p4] = await Promise.all([
    prisma.pasajero.create({ data: { nombre: "Leia" } }),
    prisma.pasajero.create({ data: { nombre: "Han" } }),
    prisma.pasajero.create({ data: { nombre: "Luke" } }),
    prisma.pasajero.create({ data: { nombre: "Chewie" } }),
  ]);

  await prisma.pasajero.update({ where: { oid: p1.oid }, data: { aeronaveId: a1.oid } });
  await prisma.pasajero.update({ where: { oid: p2.oid }, data: { aeronaveId: a1.oid } });
  await prisma.pasajero.update({ where: { oid: p3.oid }, data: { aeronaveId: a2.oid } });

  const hoy = new Date();
  await prisma.revision.create({
    data: {
      nombreRevisor: "R2-D2",
      fecha: hoy,
      aeronave: { connect: { oid: a1.oid } },
      pasajeros: {
        createMany: {
          data: [p1, p2].map((p) => ({ pasajeroId: p.oid })),
        },
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
