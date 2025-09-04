export interface NaveNodriza {
  oid: number;
  nombre: string;
}

export interface Aeronave {
  oid: number;
  nombre: string;
  capacidadMaxima: number;
  origenId: number;
  destinoId: number;
  capacidadActual?: number; // derivado, no persistente
  capacidadRestante?: number; // derivado, no persistente
}

export interface Pasajero {
  oid: number;
  nombre: string;
  aeronaveId?: number | null;
}

export interface Revision {
  oid: number;
  nombreRevisor: string;
  fecha: Date;
  aeronaveId: number;
}

export interface AeronaveDetalle extends Aeronave {
  origen?: NaveNodriza;
  destino?: NaveNodriza;
  pasajeros?: Pasajero[];
}
