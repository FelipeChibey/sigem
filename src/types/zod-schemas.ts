import { z } from "zod";

export const naveNodrizaSchema = z.object({
  oid: z.number().int().positive(),
  nombre: z.string().min(1),
});

export const aeronaveSchema = z.object({
  oid: z.number().int().positive(),
  nombre: z.string().min(1),
  capacidadMaxima: z.number().int().nonnegative(),
  origenId: z.number().int().positive(),
  destinoId: z.number().int().positive(),
});

export const pasajeroSchema = z.object({
  oid: z.number().int().positive(),
  nombre: z.string().min(1),
  aeronaveId: z.number().int().positive().nullable().optional(),
});

export const revisionSchema = z.object({
  oid: z.number().int().positive(),
  nombreRevisor: z.string().min(1),
  fecha: z.coerce.date(),
  aeronaveId: z.number().int().positive(),
});

export const revisionesPasajerosSchema = z.object({
  revisionId: z.number().int().positive(),
  pasajeroId: z.number().int().positive(),
});
