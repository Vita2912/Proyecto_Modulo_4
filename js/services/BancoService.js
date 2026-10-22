// Jalamos los modelos que representan el dominio del banco
import { Banco } from "../models/Banco.js";
import { Usuario } from "../models/Usuario.js";
import { Cuenta } from "../models/Cuenta.js";
import { Movimiento } from "../models/Movimiento.js";

// Y el servicio para manejar la lectura/escritura en localStorage
import { STORAGE_KEYS, storageService } from "./StorageService.js";

class BancoService {
  constructor() {
    // Aquí guardaremos la instancia principal del banco
    this._banco = null;
  }

  // Carga y reconstrucción de las instancias guardadas en localStorage
  cargarBanco() {
    // Obtenemos los arreglos guardados o un arreglo vacío por si es la primera vez
    const usuariosGuardados = storageService.obtener(STORAGE_KEYS.USUARIOS, []);
    const cuentasGuardadas = storageService.obtener(STORAGE_KEYS.CUENTAS, []);
    const movimientosGuardados = storageService.obtener(
      STORAGE_KEYS.MOVIMIENTOS,
      [],
    );

    // Convertimos los objetos planos recuperados en instancias de nuestras clases
    const usuarios = usuariosGuardados.map((usuario) => new Usuario(usuario));
    const cuentas = cuentasGuardadas.map((cuenta) => new Cuenta(cuenta));
    const movimientos = movimientosGuardados.map(
      (movimiento) => new Movimiento(movimiento),
    );

    // Armamos de nuevo la instancia general del Banco
    this._banco = new Banco({
      usuarios,
      cuentas,
      movimientos,
    });

    return this._banco;
  }

  // Nos asegura tener siempre una instancia lista para usar
  obtenerInstanciaBanco() {
    // Si aún no se ha cargado, lo armamos
    if (!this._banco) {
      return this.cargarBanco();
    }

    return this._banco;
  }

  // Fuerza la relectura desde el localStorage por si cambiaron los datos
  recargarBanco() {
    this._banco = null;
    return this.cargarBanco();
  }

  // Guarda el estado actual del banco en localStorage
  guardarBanco() {
    const banco = this.obtenerInstanciaBanco();

    // Guardamos cada colección por separado usando el servicio de storage
    storageService.guardar(STORAGE_KEYS.USUARIOS, banco.usuarios);
    storageService.guardar(STORAGE_KEYS.CUENTAS, banco.cuentas);
    storageService.guardar(STORAGE_KEYS.MOVIMIENTOS, banco.movimientos);

    return true;
  }

  // Métodos para consultar datos del usuario
  obtenerDatosUsuario(usuarioId) {
    const banco = this.obtenerInstanciaBanco();

    // Buscamos al usuario por su ID
    const usuario = banco.buscarUsuarioPorId(usuarioId);

    if (!usuario) {
      throw new Error("El usuario no existe.");
    }

    // Traemos las cuentas asociadas
    const cuentas = banco.obtenerCuentasDeUsuario(usuarioId);

    // Sacamos únicamente los IDs de sus cuentas para filtrar fácil sus movimientos
    const cuentasIds = cuentas.map((cuenta) => cuenta.id);

    // Filtramos los movimientos que le pertenecen a sus cuentas
    const movimientos = banco.movimientos.filter((movimiento) => {
      // Si fue depósito, le pertenece al dueño de la cuenta origen
      if (movimiento.tipo === "DEPOSITO") {
        return cuentasIds.includes(movimiento.cuentaOrigen);
      }

      // Si envió una transferencia, la cuenta origen es la suya
      if (movimiento.tipo === "TRANSFERENCIA_ENVIADA") {
        return cuentasIds.includes(movimiento.cuentaOrigen);
      }

      // Si recibió una transferencia, la cuenta destino es la suya
      if (movimiento.tipo === "TRANSFERENCIA_RECIBIDA") {
        return cuentasIds.includes(movimiento.cuentaDestino);
      }

      return false;
    });

    return {
      usuario,
      cuentas,
      movimientos,
    };
  }

  // Trae un resumen rápido con el saldo total y conteos
  obtenerResumenUsuario(usuarioId) {
    const { usuario, cuentas, movimientos } =
      this.obtenerDatosUsuario(usuarioId);

    // Sumamos el saldo de todas las cuentas que tenga
    const saldoTotal = cuentas.reduce(
      (acumulado, cuenta) => acumulado + Number(cuenta.saldo),
      0,
    );

    return {
      usuario,
      cuentas,
      movimientos,
      saldoTotal,
      totalCuentas: cuentas.length,
      totalMovimientos: movimientos.length,
    };
  }

  // Filtra y ordena los movimientos
  obtenerMovimientosUsuario(usuarioId, tipo = "TODOS") {
    const { movimientos } = this.obtenerDatosUsuario(usuarioId);

    // Hacemos una copia para no alterar el arreglo original al ordenar
    let resultado = [...movimientos];

    // Si pasaron un filtro específico, dejamos solo esos movimientos
    if (tipo !== "TODOS") {
      resultado = resultado.filter((movimiento) => movimiento.tipo === tipo);
    }

    // Ordenamos para que los más recientes salgan primero
    resultado.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    return resultado;
  }

  // Contadores para las tarjetas del historial
  obtenerResumenMovimientos(usuarioId) {
    const movimientos = this.obtenerMovimientosUsuario(usuarioId);

    // Contamos depósitos
    const depositos = movimientos.filter(
      (movimiento) => movimiento.tipo === "DEPOSITO",
    ).length;

    // Contamos enviadas
    const enviadas = movimientos.filter(
      (movimiento) => movimiento.tipo === "TRANSFERENCIA_ENVIADA",
    ).length;

    // Contamos recibidas
    const recibidas = movimientos.filter(
      (movimiento) => movimiento.tipo === "TRANSFERENCIA_RECIBIDA",
    ).length;

    return {
      total: movimientos.length,
      depositos,
      enviadas,
      recibidas,
    };
  }

  // Realiza el proceso de depósito
  realizarDeposito({ cuentaId, monto, descripcion = "" }) {
    const banco = this.obtenerInstanciaBanco();

    // Delegamos la operación al modelo Banco
    const movimiento = banco.realizarDeposito({
      cuentaId,
      monto,
      descripcion,
    });

    // Guardamos los cambios
    this.guardarBanco();

    return movimiento;
  }

  // Realiza el proceso de transferencia
  realizarTransferencia({
    cuentaOrigenId,
    numeroCuentaDestino,
    monto,
    descripcion = "",
  }) {
    const banco = this.obtenerInstanciaBanco();

    // Le quitamos espacios al número de cuenta destino ingresado
    const numeroDestino = String(numeroCuentaDestino).replace(/\s/g, "").trim();

    // Buscamos la cuenta destino por su número visible
    const cuentaDestino = banco.buscarCuentaPorNumero(numeroDestino);

    if (!cuentaDestino) {
      throw new Error("La cuenta destino no existe.");
    }

    // Pasamos la transferencia al modelo Banco
    const resultado = banco.realizarTransferencia({
      cuentaOrigenId,
      cuentaDestinoId: cuentaDestino.id,
      monto,
      descripcion,
    });

    // Persistimos los nuevos saldos y movimientos
    this.guardarBanco();

    return resultado;
  }

  // Actualización de perfil del usuario
  actualizarUsuario(usuarioId, { nombre, email, telefono }) {
    const usuarios = storageService.obtener(STORAGE_KEYS.USUARIOS, []);

    const usuario = usuarios.find((item) => item.id === usuarioId);

    if (!usuario) {
      throw new Error("El usuario no existe.");
    }

    // Normalizamos el correo a minúsculas
    const emailNormalizado = String(email).trim().toLowerCase();

    // Verificamos que ningún otro usuario tenga ese mismo correo
    const emailDuplicado = usuarios.some(
      (item) =>
        item.email.toLowerCase() === emailNormalizado && item.id !== usuarioId,
    );

    if (emailDuplicado) {
      throw new Error("Ya existe un usuario con este correo.");
    }

    // Actualizamos la lista de usuarios con el nuevo perfil
    const usuariosActualizados = usuarios.map((item) =>
      item.id === usuarioId
        ? {
            ...item,
            nombre: nombre.trim(),
            email: emailNormalizado,
            telefono: telefono.trim(),
          }
        : item,
    );

    storageService.guardar(STORAGE_KEYS.USUARIOS, usuariosActualizados);
    this.recargarBanco();

    return usuariosActualizados.find((item) => item.id === usuarioId) || null;
  }

  // Cambio de contraseña
  cambiarPassword(usuarioId, passwordActual, passwordNueva) {
    const usuarios = storageService.obtener(STORAGE_KEYS.USUARIOS, []);

    const usuario = usuarios.find((item) => item.id === usuarioId);

    if (!usuario) {
      throw new Error("El usuario no existe.");
    }

    if (usuario.password !== passwordActual) {
      throw new Error("La contraseña actual no es correcta.");
    }

    if (passwordNueva === passwordActual) {
      throw new Error("La nueva contraseña debe ser diferente.");
    }

    if (passwordNueva.length < 6) {
      throw new Error("La nueva contraseña debe tener al menos 6 caracteres.");
    }

    const usuariosActualizados = usuarios.map((item) =>
      item.id === usuarioId
        ? {
            ...item,
            password: passwordNueva,
          }
        : item,
    );

    storageService.guardar(STORAGE_KEYS.USUARIOS, usuariosActualizados);
    this.recargarBanco();

    return true;
  }

  // Borrado de usuario, sus cuentas y movimientos asociados
  eliminarUsuario(usuarioId) {
    const usuarios = storageService.obtener(STORAGE_KEYS.USUARIOS, []);
    const cuentas = storageService.obtener(STORAGE_KEYS.CUENTAS, []);
    const movimientos = storageService.obtener(STORAGE_KEYS.MOVIMIENTOS, []);

    const usuario = usuarios.find((item) => item.id === usuarioId);

    if (!usuario) {
      throw new Error("El usuario no existe.");
    }

    const cuentasUsuario = cuentas.filter(
      (cuenta) => cuenta.usuarioId === usuarioId,
    );

    // No permitimos eliminar si todavía le queda lana en alguna cuenta
    const tieneSaldo = cuentasUsuario.some(
      (cuenta) => Number(cuenta.saldo) > 0,
    );

    if (tieneSaldo) {
      throw new Error(
        "No puedes eliminar tu cuenta mientras tengas saldo disponible.",
      );
    }

    const cuentasUsuarioIds = cuentasUsuario.map((cuenta) => cuenta.id);

    // Filtramos y quitamos al usuario, sus cuentas y sus movimientos
    const usuariosFiltrados = usuarios.filter((item) => item.id !== usuarioId);
    const cuentasFiltradas = cuentas.filter(
      (cuenta) => cuenta.usuarioId !== usuarioId,
    );

    const movimientosFiltrados = movimientos.filter(
      (movimiento) =>
        !cuentasUsuarioIds.includes(movimiento.cuentaOrigen) &&
        !cuentasUsuarioIds.includes(movimiento.cuentaDestino),
    );

    // Guardamos las listas ya limpias en storage
    storageService.guardar(STORAGE_KEYS.USUARIOS, usuariosFiltrados);
    storageService.guardar(STORAGE_KEYS.CUENTAS, cuentasFiltradas);
    storageService.guardar(STORAGE_KEYS.MOVIMIENTOS, movimientosFiltrados);

    this.recargarBanco();

    return true;
  }
}

export const bancoService = new BancoService();
