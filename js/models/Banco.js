// Jalamos el modelo de Movimiento para registrar las operaciones
import { Movimiento } from "./Movimiento.js";

export class Banco {
  // Inicializamos el banco con sus arreglos de usuarios, cuentas y movimientos
  constructor({ usuarios = [], cuentas = [], movimientos = [] } = {}) {
    this.usuarios = usuarios;
    this.cuentas = cuentas;
    this.movimientos = movimientos;
  }

  // Métodos para administrar usuarios
  agregarUsuario(usuario) {
    // Checamos que el usuario no exista ya
    const existe = this.usuarios.some((item) => item.id === usuario.id);

    if (existe) {
      throw new Error("El usuario ya existe.");
    }

    // Lo agregamos a la lista
    this.usuarios.push(usuario);

    return usuario;
  }

  // Buscamos un usuario por su ID
  buscarUsuarioPorId(usuarioId) {
    return this.usuarios.find((usuario) => usuario.id === usuarioId) || null;
  }

  // Métodos para administrar cuentas bancarias
  agregarCuenta(cuenta) {
    // Checamos que el dueño exista
    const usuario = this.buscarUsuarioPorId(cuenta.usuarioId);

    if (!usuario) {
      throw new Error("El usuario propietario de la cuenta no existe.");
    }

    // Verificamos que no esté duplicada por id o por número de cuenta
    const existe = this.cuentas.some(
      (item) =>
        item.id === cuenta.id || item.numeroCuenta === cuenta.numeroCuenta,
    );

    if (existe) {
      throw new Error("La cuenta ya existe.");
    }

    this.cuentas.push(cuenta);

    return cuenta;
  }

  // Busca cuenta por su ID interno
  buscarCuentaPorId(cuentaId) {
    return this.cuentas.find((cuenta) => cuenta.id === cuentaId) || null;
  }

  // Busca cuenta por el número de cuenta visible
  buscarCuentaPorNumero(numeroCuenta) {
    return (
      this.cuentas.find((cuenta) => cuenta.numeroCuenta === numeroCuenta) ||
      null
    );
  }

  // Filtra todas las cuentas de un usuario específico
  obtenerCuentasDeUsuario(usuarioId) {
    return this.cuentas.filter((cuenta) => cuenta.usuarioId === usuarioId);
  }

  // Manejo del historial de movimientos
  registrarMovimiento(movimiento) {
    this.movimientos.push(movimiento);

    return movimiento;
  }

  // Trae los movimientos donde participe la cuenta (como origen o destino)
  obtenerMovimientosDeCuenta(cuentaId) {
    return this.movimientos.filter(
      (movimiento) =>
        movimiento.cuentaOrigen === cuentaId ||
        movimiento.cuentaDestino === cuentaId,
    );
  }

  // Proceso para abonar lana a una cuenta
  realizarDeposito({ cuentaId, monto, descripcion = "" }) {
    // Convertimos el monto a número por si viene como texto
    const montoNumerico = Number(monto);

    // Validamos que sea un número válido y mayor a 0
    if (!Number.isFinite(montoNumerico) || montoNumerico <= 0) {
      throw new Error("Monto inválido, el monto debe ser mayor a cero.");
    }

    // Buscamos la cuenta a la que le va a caer el depósito
    const cuenta = this.buscarCuentaPorId(cuentaId);

    if (!cuenta) {
      throw new Error("La cuenta no existe.");
    }

    // Le sumamos la lana a la cuenta
    cuenta.depositar(montoNumerico);

    // Creamos el registro del movimiento
    const movimiento = new Movimiento({
      tipo: "DEPOSITO",
      monto: montoNumerico,
      descripcion,
      cuentaOrigen: cuenta.id,
      saldoResultante: cuenta.saldo,
    });

    // Lo guardamos en el historial del banco
    this.registrarMovimiento(movimiento);

    return movimiento;
  }

  // Proceso para mover lana entre cuentas
  realizarTransferencia({
    cuentaOrigenId,
    cuentaDestinoId,
    monto,
    descripcion = "",
  }) {
    // Aseguramos que el monto sea numérico
    const montoNumerico = Number(monto);

    // Que sea número mayor a cero
    if (!Number.isFinite(montoNumerico) || montoNumerico <= 0) {
      throw new Error("Monto inválido, el monto debe ser mayor a cero.");
    }

    // Jalamos las dos cuentas participantes
    const origen = this.buscarCuentaPorId(cuentaOrigenId);
    const destino = this.buscarCuentaPorId(cuentaDestinoId);

    if (!origen) {
      throw new Error("La cuenta origen no existe.");
    }

    if (!destino) {
      throw new Error("La cuenta destino no existe.");
    }

    // Verificamos que ambas cuentas estén activas
    if (!origen.activa) {
      throw new Error("La cuenta origen no está activa.");
    }

    if (!destino.activa) {
      throw new Error("La cuenta destino no está activa.");
    }

    // Que no intenten mandarse dinero a sí mismos
    if (origen.id === destino.id) {
      throw new Error("No puedes transferir dinero a la misma cuenta");
    }

    // Que la cuenta origen traiga lana suficiente
    if (origen.saldo < montoNumerico) {
      throw new Error("Saldo insuficiente");
    }

    // Le quitamos a uno y le sumamos al otro
    origen.retirar(montoNumerico);
    destino.depositar(montoNumerico);

    // Creamos el movimiento desde el lado del que envía
    const movimientoEnviado = new Movimiento({
      tipo: "TRANSFERENCIA_ENVIADA",
      monto: montoNumerico,
      descripcion,
      cuentaOrigen: origen.id,
      cuentaDestino: destino.id,
      saldoResultante: origen.saldo,
    });

    // Creamos el movimiento desde el lado del que recibe
    const movimientoRecibido = new Movimiento({
      tipo: "TRANSFERENCIA_RECIBIDA",
      monto: montoNumerico,
      descripcion,
      cuentaOrigen: origen.id,
      cuentaDestino: destino.id,
      saldoResultante: destino.saldo,
    });

    // Guardamos los dos movimientos en el historial
    this.registrarMovimiento(movimientoEnviado);
    this.registrarMovimiento(movimientoRecibido);

    return {
      origen,
      destino,
      movimientoEnviado,
      movimientoRecibido,
    };
  }
}
