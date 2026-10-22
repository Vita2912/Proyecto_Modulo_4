// Jalamos el generador de IDs para asignarle un ID único a cada movimiento
import { generarId } from "../utils/helpers.js";

// Modelo para guardar el registro de cada operación bancaria
export class Movimiento {
  // Seteamos las propiedades por defecto
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
    // Guardamos las propiedades del movimiento
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
