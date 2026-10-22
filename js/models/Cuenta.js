// Jalamos el generador de IDs para asignarle uno a cada cuenta nueva
import { generarId } from "../utils/helpers.js";

// Modelo que representa la cuenta bancaria del usuario
export class Cuenta {
  // Seteamos las propiedades por defecto si no nos pasan valores
  constructor({
    id = generarId(),
    numeroCuenta,
    tipo = "Ahorro",
    saldo = 0,
    usuarioId,
    fechaApertura = new Date().toISOString(),
    activa = true,
  }) {
    // Asignamos las propiedades
    this.id = id;
    this.numeroCuenta = numeroCuenta;
    this.tipo = tipo;
    this.saldo = Number(saldo);
    this.usuarioId = usuarioId;
    this.fechaApertura = fechaApertura;
    this.activa = activa;
  }

  // Le sumamos dinero al saldo de la cuenta
  depositar(monto) {
    this.saldo += Number(monto);

    return this.saldo;
  }

  // Le descontamos dinero al saldo de la cuenta
  retirar(monto) {
    this.saldo -= Number(monto);

    return this.saldo;
  }
}
