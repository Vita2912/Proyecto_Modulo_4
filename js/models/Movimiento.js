// IMPORTAR UTILIDADES
import { generarId } from "../utils/helpers.js";

// MODELO MOVIMIENTO

// Representa una operación bancaria realizada en una cuenta.
export class Movimiento {
  // CONSTRUCTOR
  constructor({
    id = generarId(),
    tipo,
    monto,
    descripcion = "",
    cuentaOrigen = null,
    cuentaDestino = null,
    saldoResultante = null,
    fecha = new Date().toISOString(),
  }) {
    // PROPIEDADES
    this.id = id;
    this.tipo = tipo;
    this.monto = Number(monto);
    this.descripcion = descripcion;
    this.cuentaOrigen = cuentaOrigen;
    this.cuentaDestino = cuentaDestino;
    this.saldoResultante = saldoResultante;
    this.fecha = fecha;
  }
}
