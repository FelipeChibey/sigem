/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { aplicarDerivadosAeronave } from "./services";

const prisma = new PrismaClient();

const crearRevisionSchema = z.object({
  nombreRevisor: z.string().min(1),
  aeronaveId: z.number().int().positive(),
  fecha: z.coerce.date(),
});

export async function crearRevision(input: z.infer<typeof crearRevisionSchema>) {
  const { nombreRevisor, aeronaveId, fecha } = crearRevisionSchema.parse(input);

  const inicio = new Date(Date.UTC(fecha.getUTCFullYear(), fecha.getUTCMonth(), fecha.getUTCDate(), 0, 0, 0));
  const fin = new Date(Date.UTC(fecha.getUTCFullYear(), fecha.getUTCMonth(), fecha.getUTCDate(), 23, 59, 59, 999));

  const existe = await prisma.revision.findFirst({
    where: {
      aeronaveId,
      fecha: { gte: inicio, lte: fin },
    },
  });
  if (existe) throw new Error("Ya existe una revisión para esta aeronave en la fecha indicada.");

  const pasajerosABordo = await prisma.pasajero.findMany({ where: { aeronaveId } });

  const revision = await prisma.revision.create({
    data: {
      nombreRevisor,
      fecha,
      aeronave: { connect: { oid: aeronaveId } },
      pasajeros: {
        createMany: {
          data: pasajerosABordo.map((p) => ({ pasajeroId: p.oid })),
          skipDuplicates: true,
        },
      },
    },
  });

  return revision;
}

const crearPasajeroSchema = z.object({
  oid: z.number().int().positive().optional(),
  nombre: z.string().min(1),
});

export async function crearPasajero(input: z.infer<typeof crearPasajeroSchema>) {
  const parsed = crearPasajeroSchema.parse(input);
  const pasajero = await prisma.pasajero.create({
    data: {
      oid: parsed.oid,
      nombre: parsed.nombre,
    },
  });
  return pasajero;
}

const subirPasajeroSchema = z.object({
  pasajeroId: z.number().int().positive(),
  aeronaveId: z.number().int().positive(),
});

export async function subirPasajero(input: z.infer<typeof subirPasajeroSchema>) {
  const { pasajeroId, aeronaveId } = subirPasajeroSchema.parse(input);

  const pasajero = await prisma.pasajero.findUnique({ where: { oid: pasajeroId } });
  if (!pasajero) throw new Error("Pasajero no encontrado");
  if (pasajero.aeronaveId) throw new Error("El pasajero ya está a bordo de una aeronave.");

  const aeronave = await prisma.aeronave.findUnique({
    where: { oid: aeronaveId },
    include: { pasajeros: true },
  });
  if (!aeronave) throw new Error("Aeronave no encontrada");

  const ocupantes = aeronave.pasajeros.length;
  if (ocupantes >= aeronave.capacidadMaxima)
    throw new Error("La aeronave ha alcanzado su capacidad máxima.");

  const updated = await prisma.pasajero.update({
    where: { oid: pasajeroId },
    data: { aeronaveId },
  });
  return updated;
}

const bajarPasajeroSchema = z.object({ pasajeroId: z.number().int().positive() });

export async function bajarPasajero(input: z.infer<typeof bajarPasajeroSchema>) {
  const { pasajeroId } = bajarPasajeroSchema.parse(input);
  const pasajero = await prisma.pasajero.findUnique({ where: { oid: pasajeroId } });
  if (!pasajero) throw new Error("Pasajero no encontrado");

  const updated = await prisma.pasajero.update({ where: { oid: pasajeroId }, data: { aeronaveId: null } });
  return updated;
}

const crearAeronaveSchema = z.object({
  nombre: z.string().min(1),
  capacidadMaxima: z.number().int().nonnegative(),
  origenId: z.number().int().positive(),
  destinoId: z.number().int().positive(),
});

export async function crearAeronave(input: z.infer<typeof crearAeronaveSchema>) {
  const { nombre, capacidadMaxima, origenId, destinoId } = crearAeronaveSchema.parse(input);

  const [origen, destino] = await Promise.all([
    prisma.naveNodriza.findUnique({ where: { oid: origenId } }),
    prisma.naveNodriza.findUnique({ where: { oid: destinoId } }),
  ]);
  if (!origen || !destino) throw new Error("Origen o destino no existen");

  const aeronave = await prisma.aeronave.create({
    data: {
      nombre,
      capacidadMaxima,
      origen: { connect: { oid: origenId } },
      destino: { connect: { oid: destinoId } },
    },
  });
  return aeronave;
}

const crearNaveNodrizaSchema = z.object({ nombre: z.string().min(1) });

export async function crearNaveNodriza(input: z.infer<typeof crearNaveNodrizaSchema>) {
  const { nombre } = crearNaveNodrizaSchema.parse(input);
  return prisma.naveNodriza.create({ data: { nombre } });
}

export async function listarNavesNodrizas() {
  return prisma.naveNodriza.findMany({ orderBy: { oid: "asc" } });
}

export async function listarAeronavesConCapacidad() {
  const aeronaves = await prisma.aeronave.findMany({ include: { pasajeros: true } });
  return aeronaves.map((a) => aplicarDerivadosAeronave(a as any, a.pasajeros.length));
}

export async function listarPasajeros() {
  return prisma.pasajero.findMany({ orderBy: { oid: "asc" } });
}

export async function listarRevisiones() {
  return prisma.revision.findMany({ include: { aeronave: true } });
}

export async function obtenerDetalleAeronave(id: number) {
  const aeronave = await prisma.aeronave.findUnique({
    where: { oid: id },
    include: { pasajeros: true, origen: true, destino: true },
  });
  if (!aeronave) return null;
  const conDerivados = aplicarDerivadosAeronave(aeronave as any, aeronave.pasajeros.length);
  return conDerivados;
}
