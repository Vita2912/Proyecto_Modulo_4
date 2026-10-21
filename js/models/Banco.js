// IMPORTAR MODELO MOVIMIENTO

// Banco utilizará Movimiento para crear
// registros automáticos de las operaciones.
import { Movimiento } from "./Movimiento.js";

// MODELO BANCO

// Coordina los usuarios, cuentas y movimientos
// y concentra las reglas del dominio bancario.
export class Banco {
  constructor({
    // Usuarios registrados
    usuarios = [],
    // Cuentas registradas
    cuentas = [],
    // Movimientos realizados
    movimientos = [],
  } = {}) {
    this.usuarios = usuarios;
    this.cuentas = cuentas;
    this.movimientos = movimientos;
  }

  // AGREGAR USUARIO

  agregarUsuario(usuario) {
    const existe = this.usuarios.some((u) => u.id === usuario.id);

    // No permitir usuarios duplicados
    if (existe) {
      throw new Error("El usuario ya existe.");
    }

    // Registrar usuario
    this.usuarios.push(usuario);

    return usuario;
  }

  // BUSCAR USUARIO POR ID

  buscarUsuarioPorId(usuarioId) {
    //find() devuelve el primer usuario cuyo ID coincida.
    return this.usuarios.find((usuario) => usuario.id === usuarioId) || null;
  }

  // AGREGAR CUENTA

  agregarCuenta(cuenta) {
    // Buscamos al propietario indicado por usuarioId.
    const usuario = this.buscarUsuarioPorId(cuenta.usuarioId);

    //No permitimos crear cuentas asociadas con usuarios inexistentes.
    if (!usuario) {
      throw new Error("El usuario propietario de la cuenta no existe.");
    }

    // Comprobamos si existe otra cuenta con el mismo ID o número.
    const existe = this.cuentas.some(
      (c) => c.id === cuenta.id || c.numeroCuenta === cuenta.numeroCuenta,
    );

    // Evitar cuentas duplicadas
    if (existe) {
      throw new Error("La cuenta ya existe.");
    }

    // Registrar la cuenta
    this.cuentas.push(cuenta);

    return cuenta;
  }

  // BUSCAR CUENTA POR ID

  buscarCuentaPorId(cuentaId) {
    return this.cuentas.find((cuenta) => cuenta.id === cuentaId) || null;
  }

  // BUSCAR CUENTA POR NÚMERO

  buscarCuentaPorNumero(numeroCuenta) {
    return (
      this.cuentas.find((cuenta) => cuenta.numeroCuenta === numeroCuenta) ||
      null
    );
  }

  // OBTENER CUENTAS DE UN USUARIO

  // filter() devuelve todas las cuentas cuyo usuarioId corresponda al usuario
  obtenerCuentasDeUsuario(usuarioId) {
    return this.cuentas.filter((cuenta) => cuenta.usuarioId === usuarioId);
  }

  // REGISTRAR MOVIMIENTO

  registrarMovimiento(movimiento) {
    this.movimientos.push(movimiento);

    return movimiento;
  }

  // REALIZAR DEPÓSITO

  realizarDeposito({ cuentaId, monto, descripcion = "" }) {
    // CONVERTIR MONTO

    const montoNumerico = Number(monto);

    // VALIDAR MONTO

    if (!Number.isFinite(montoNumerico) || montoNumerico <= 0) {
      throw new Error("Monto inválido, el monto debe ser mayor a cero.");
    }

    // BUSCAR CUENTA

    const cuenta = this.buscarCuentaPorId(cuentaId);

    // VALIDAR CUENTA

    if (!cuenta) {
      throw new Error("La cuenta no existe.");
    }

    // REALIZAR DEPÓSITO

    //La cuenta administra directamente la modificación de su saldo.
    cuenta.depositar(montoNumerico);

    // CREAR MOVIMIENTO

    const movimiento = new Movimiento({
      tipo: "DEPOSITO",
      monto: montoNumerico,
      descripcion,
      cuentaOrigen: cuenta.id,
      saldoResultante: cuenta.saldo,
    });

    // REGISTRAR MOVIMIENTO

    this.registrarMovimiento(movimiento);

    // RETORNAR MOVIMIENTO

    return movimiento;
  }

  // OBTENER MOVIMIENTOS DE UNA CUENTA

  obtenerMovimientosDeCuenta(cuentaId) {
    // Recuperamos los movimientos donde la cuenta aparezca como origen
    // o como destino.
    return this.movimientos.filter(
      (movimiento) =>
        movimiento.cuentaOrigen === cuentaId ||
        movimiento.cuentaDestino === cuentaId,
    );
  }
}
