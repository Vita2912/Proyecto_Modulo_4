// IMPORTAR UTILIDADES
import { generarId } from "../utils/helpers.js";

// MODELO CUENTA

// Representa una cuenta bancaria perteneciente a un usuario.
export class Cuenta {
  // CONSTRUCTOR
  constructor({
    id = generarId(),
    numeroCuenta,
    tipo = "Ahorro",
    saldo = 0,
    usuarioId,
    fechaApertura = new Date().toISOString(),
    activa = true,
  }) {
    // PROPIEDADES
    this.id = id;
    this.numeroCuenta = numeroCuenta;
    this.tipo = tipo;
    this.saldo = Number(saldo);
    this.usuarioId = usuarioId;
    this.fechaApertura = fechaApertura;
    this.activa = activa;
  }

  // METODOS DEPOSITAR Y RETIRAR

  // Agrega un monto al saldo actual.
  depositar(monto) {
    this.saldo += Number(monto);

    return this.saldo;
  }

  // Resta un monto del saldo actual.
  retirar(monto) {
    this.saldo -= Number(monto);

    return this.saldo;
  }
}
