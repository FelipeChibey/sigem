import { Aeronave } from "@/types/domain";

export function calcularCapacidades(ocupantes: number, capacidadMaxima: number) {
  const capacidadActual = ocupantes;
  const capacidadRestante = Math.max(0, capacidadMaxima - ocupantes);
  return { capacidadActual, capacidadRestante };
}

export function aplicarDerivadosAeronave<T extends Aeronave>(aeronave: T, ocupantes: number): T & {
  capacidadActual: number;
  capacidadRestante: number;
} {
  const { capacidadActual, capacidadRestante } = calcularCapacidades(
    ocupantes,
    aeronave.capacidadMaxima
  );
  return { ...aeronave, capacidadActual, capacidadRestante };
}
