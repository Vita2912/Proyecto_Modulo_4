// IMPORTAR VALIDADORES, HELPERS, FORMATEADORES Y MODELOS

// Funciones encargadas de comprobar información ingresada al sistema.
import { validarCampoObligatorio, validarMonto } from "./utils/validators.js";

// Funciones auxiliares generales.
import { generarId } from "./utils/helpers.js";

// Funciones utilizadas para preparar información antes de mostrarla.
import {
  formatCurrency,
  formatDate,
  formatAccountNumber,
} from "./utils/formatters.js";

// Importamos el modelo que representa a los usuarios del banco.
import { Usuario } from "./models/Usuario.js";

// Importamos el modelo que representa las cuentas bancarias.
import { Cuenta } from "./models/Cuenta.js";

// Importamos el modelo que registra las operaciones bancarias.
import { Movimiento } from "./models/Movimiento.js";

// Importamos el modelo encargado de administrar el banco.
import { Banco } from "./models/Banco.js";

// IMPORTAR SERVICIO DE PERSISTENCIA

// STORAGE_KEYS: contiene las claves oficiales.
// storageService: permite guardar y recuperar los datos.
import { STORAGE_KEYS, storageService } from "./services/StorageService.js";

// VERSIÓN ACTUAL

// Mostrar la versión actual
console.log("Sistema de Gestión Bancaria - v0.5.0");

// FUNCIONES DE PERSISTENCIA EN LOCAL STORAGE

// Guardamos los usuarios, cuentas y movimientos registrados en el banco.
function guardarBanco(banco) {
  // Guardamos la lista de usuarios.
  storageService.guardar(STORAGE_KEYS.USUARIOS, banco.usuarios);

  // Guardamos las cuentas bancarias.
  storageService.guardar(STORAGE_KEYS.CUENTAS, banco.cuentas);

  // Guardamos el historial de movimientos.
  storageService.guardar(STORAGE_KEYS.MOVIMIENTOS, banco.movimientos);
}

// FUNCION PARA CARGAR LOS DATOS DEL BANCO

// Recuperamos la información almacenada anteriormente.
function cargarBanco() {
  // Obtenemos los usuarios guardados o un arreglo vacío.
  const usuariosGuardados = storageService.obtener(STORAGE_KEYS.USUARIOS, []);

  // Obtenemos las cuentas registradas.
  const cuentasGuardadas = storageService.obtener(STORAGE_KEYS.CUENTAS, []);

  // Obtenemos los movimientos realizados.
  const movimientosGuardados = storageService.obtener(
    STORAGE_KEYS.MOVIMIENTOS,
    [],
  );

  // RECONSTRUIMOS LAS INSTANCIAS
  // PARA RECUPERAR USUARIO, Y SUS METODOS

  // Convertimos los datos guardados en objetos Usuario.
  const usuarios = usuariosGuardados.map((usuario) => new Usuario(usuario));

  // Recuperamos las cuentas como instancias de Cuenta.
  const cuentas = cuentasGuardadas.map((cuenta) => new Cuenta(cuenta));

  // Reconstruimos los movimientos bancarios.
  const movimientos = movimientosGuardados.map(
    (movimiento) => new Movimiento(movimiento),
  );

  // RECONSTRUIMOS NUEVAMENTE EL BANCO

  // Creamos el banco utilizando la información recuperada.
  return new Banco({
    usuarios,
    cuentas,
    movimientos,
  });
}

// PRUEBAS DE UTILIDADES

// PROBAR CAMPO OBLIGATORIO
console.log("Campo obligatorio:", validarCampoObligatorio("Banco Digital"));

// PROBAR MONTO
console.log("Monto válido:", validarMonto(1000));

// PROBAR GENERACIÓN DE IDENTIFICADOR
console.log("ID generado:", generarId());

// PROBAR FORMATO DE MONEDA
console.log("Monto formateado:", formatCurrency(1500));

// PROBAR FORMATO DE FECHA
console.log("Fecha formateada:", formatDate(new Date()));

// PROBAR FORMATO DE CUENTA
console.log("Número de cuenta:", formatAccountNumber("123456789012"));

// CARGAR BANCO PERSISTIDO

// cargarBanco() primero busca información guardada antes de crear la instancia.
const bancoDemo = cargarBanco();

// DATOS INICIALES
// VALIDAR SI EL BANCO ESTÁ VACÍO

// Comprobamos si existen usuarios antes de crear los datos iniciales.
if (bancoDemo.usuarios.length === 0) {
  // CREAR USUARIO INICIAL DEMO

  // Creamos un usuario con sus datos personales.
  const usuarioDemo = new Usuario({
    nombre: "Juan Suarez",
    email: "juan@correo.com",
    telefono: "5512345678",
    password: "123456",
  });

  // REGISTRAR USUARIO

  // Agregamos el usuario a la lista del banco.
  bancoDemo.agregarUsuario(usuarioDemo);

  // CREAR CUENTA INICIAL DEMO

  // Creamos una cuenta asociada al usuario registrado.
  const cuentaDemo = new Cuenta({
    numeroCuenta: "123456789012",
    usuarioId: usuarioDemo.id,
  });

  // REGISTRAR CUENTA

  // Guardamos la cuenta en el banco.
  bancoDemo.agregarCuenta(cuentaDemo);

  // REALIZAR DEPÓSITO INICIAL DEMO

  // Ingresamos dinero a la cuenta y generamos un movimiento.
  bancoDemo.realizarDeposito({
    cuentaId: cuentaDemo.id,
    monto: 1000,
    descripcion: "Depósito inicial",
  });

  // GUARDAR BANCO DEMO

  // Almacenamos la información para conservarla al recargar la página.
  guardarBanco(bancoDemo);

  console.log("Datos iniciales creados y guardados.");
}

// COMPROBAR DATOS RECUPERADOS

// Mostramos la información general del banco.
console.log("Banco recuperado:", bancoDemo);

// Mostramos los usuarios que están registrados.
console.log("Usuarios almacenados:", bancoDemo.usuarios);

// Mostramos las cuentas bancarias registradas.
console.log("Cuentas almacenadas:", bancoDemo.cuentas);

// Mostramos las operaciones realizadas.
console.log("Movimientos almacenados:", bancoDemo.movimientos);

// OBTENER PRIMERA CUENTA

// Buscamos la primera cuenta del banco, si no existe regresamos null.
const cuentaPrincipal = bancoDemo.cuentas[0] || null;

// SI EXISTE MOSTRAR SALDO PERSISTIDO

// Comprobamos que exista una cuenta antes de consultar sus datos.
if (cuentaPrincipal) {
  // Mostramos el saldo que se recuperó de LocalStorage.
  console.log("Saldo persistido:", formatCurrency(cuentaPrincipal.saldo));

  // Verificamos que la cuenta recuperada conserve su clase original.
  console.log(
    "¿La cuenta recuperada sigue siendo una instancia de Cuenta?",
    cuentaPrincipal instanceof Cuenta,
  );

  // Comprobamos que el método depositar siga disponible.
  console.log("Tipo de depositar:", typeof cuentaPrincipal.depositar);
}
