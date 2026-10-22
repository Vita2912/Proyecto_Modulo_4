// Jalamos los modelos, utilidades y servicios que vamos a ocupar
import { Usuario } from "./models/Usuario.js";
import { Cuenta } from "./models/Cuenta.js";
import { generarNumeroCuenta } from "./utils/helpers.js";
import { validarCampoObligatorio } from "./utils/validators.js";
import { STORAGE_KEYS, storageService } from "./services/StorageService.js";

// Aquí traemos la parte del login/registro
import { authService } from "./services/AuthService.js";

// Seteamos el localStorage por si viene vacío al inicio
function inicializarStorage() {
  // Checamos si ya hay usuarios guardados
  const usuarios = storageService.obtener(STORAGE_KEYS.USUARIOS, null);

  // Misma historia pero con las cuentas
  const cuentas = storageService.obtener(STORAGE_KEYS.CUENTAS, null);

  // Y aquí checamos los movimientos
  const movimientos = storageService.obtener(STORAGE_KEYS.MOVIMIENTOS, null);

  // Si no hay usuarios, creamos la lista vacía
  if (usuarios === null) {
    storageService.guardar(STORAGE_KEYS.USUARIOS, []);
  }

  // Si no hay cuentas, también creamos lista vacía
  if (cuentas === null) {
    storageService.guardar(STORAGE_KEYS.CUENTAS, []);
  }

  // Igual para los movimientos
  if (movimientos === null) {
    storageService.guardar(STORAGE_KEYS.MOVIMIENTOS, []);
  }
}

// Todo lo que pasa cuando alguien le da a registrarse
function manejarRegistro(event) {
  // Que no se recargue la página al mandar el form
  event.preventDefault();

  // Limpiamos espacios en blanco del nombre
  const nombre = document.querySelector("#registroNombre").value.trim();

  // El correo lo dejamos limpio y todo en minúsculas
  const email = document
    .querySelector("#registroEmail")
    .value.trim()
    .toLowerCase();

  // Limpiamos el teléfono
  const telefono = document.querySelector("#registroTelefono").value.trim();

  // Agarramos la contraseña tal cual
  const password = document.querySelector("#registroPassword").value;

  // Y la confirmación de la contraseña
  const confirmarPassword = document.querySelector(
    "#registroConfirmPassword",
  ).value;

  // Validamos que no hayan dejado los campos obligatorios en blanco
  if (
    !validarCampoObligatorio(nombre) ||
    !validarCampoObligatorio(email) ||
    !validarCampoObligatorio(password)
  ) {
    Swal.fire({
      icon: "warning",
      title: "Campos incompletos",
      text: "Completa los campos obligatorios.",
    });

    return;
  }

  // Mínimo 6 caracteres para la contraseña o no pasa
  if (password.length < 6) {
    Swal.fire({
      icon: "warning",
      title: "Contraseña inválida",
      text: "La contraseña debe tener al menos 6 caracteres.",
    });

    return;
  }

  // Si las contraseñas no coinciden, avisams
  if (password !== confirmarPassword) {
    Swal.fire({
      icon: "warning",
      title: "Contraseñas diferentes",
      text: "Las contraseñas no coinciden.",
    });

    return;
  }

  // Obtenemos los usuarios que ya están en el sistema
  const usuarios = storageService.obtener(STORAGE_KEYS.USUARIOS, []);

  // Revisamos si el correo ya existe
  const emailExistente = usuarios.some(
    (usuario) => usuario.email.toLowerCase() === email,
  );

  // Si ya está registrado, lanzamos error
  if (emailExistente) {
    Swal.fire({
      icon: "error",
      title: "Correo registrado",
      text: "Ya existe un usuario con este correo.",
    });

    return;
  }

  // Armamos el objeto con el nuevo usuario
  const nuevoUsuario = new Usuario({
    nombre,
    email,
    telefono,
    password,
  });

  // Generamos un número de cuenta aleatorio y verificamos que no esté repetido
  let numeroCuenta;

  do {
    numeroCuenta = generarNumeroCuenta();
  } while (
    storageService
      .obtener(STORAGE_KEYS.CUENTAS, [])
      .some((cuenta) => cuenta.numeroCuenta === numeroCuenta)
  );

  // Le creamos su cuenta de ahorros en 0 por defecto
  const nuevaCuenta = new Cuenta({
    numeroCuenta,
    tipo: "Ahorro",
    saldo: 0,
    usuarioId: nuevoUsuario.id,
  });

  // Agarramos las cuentas guardadas
  const cuentas = storageService.obtener(STORAGE_KEYS.CUENTAS, []);

  // Metemos el nuevo usuario y la nueva cuenta a sus listas
  usuarios.push(nuevoUsuario);
  cuentas.push(nuevaCuenta);

  // Guardamos todo de vuelta en el storage
  storageService.guardar(STORAGE_KEYS.USUARIOS, usuarios);
  storageService.guardar(STORAGE_KEYS.CUENTAS, cuentas);

  // Avisamos que todo salió bien y le pasamos su correo al login
  Swal.fire({
    icon: "success",
    title: "Registro exitoso",
    text: "Tu usuario y cuenta bancaria fueron creados correctamente.",
    confirmButtonText: "Continuar",
  }).then(() => {
    // Reseteamos el formulario de registro
    document.querySelector("#formRegistro").reset();

    // Copiamos el email para que no lo tenga que volver a escribir en el login
    document.querySelector("#loginEmail").value = email;
  });
}

// Función para manejar el inicio de sesión
function manejarLogin(event) {
  // Evitamos que se recargue la página
  event.preventDefault();

  // Agarramos el email ingresado
  const email = document
    .querySelector("#loginEmail")
    .value.trim()
    .toLowerCase();

  // Agarramos el password
  const password = document.querySelector("#loginPassword").value;

  // Si falta alguno, mostramos aviso
  if (!validarCampoObligatorio(email) || !validarCampoObligatorio(password)) {
    Swal.fire({
      icon: "warning",
      title: "Campos incompletos",
      text: "Ingresa tu correo y contraseña.",
    });

    return;
  }

  // Intentamos iniciar sesión
  try {
    const usuario = authService.login(email, password);

    // Si entra bien, mostramos mensaje y mandamos al dashboard
    Swal.fire({
      icon: "success",
      title: `Bienvenido, ${usuario.nombre}`,
      text: "Inicio de sesión correcto.",
      timer: 1500,
      showConfirmButton: false,
    }).then(() => {
      window.location.href = "dashboard.html";
    });
  } catch (error) {
    // Si algo falla en las credenciales, atrapamos el error
    Swal.fire({
      icon: "error",
      title: "No fue posible iniciar sesión",
      text: error.message,
    });
  }
}

// Función principal para arrancar la app
function init() {
  // Preparamos el storage
  inicializarStorage();

  // Si ya tiene sesión abierta, directo al dashboard
  if (authService.getCurrentUser()) {
    window.location.href = "dashboard.html";

    return;
  }

  // Buscamos los formularios en el DOM
  const formLogin = document.querySelector("#formLogin");
  const formRegistro = document.querySelector("#formRegistro");

  // Escuchamos el evento submit del login
  if (formLogin) {
    formLogin.addEventListener("submit", manejarLogin);
  }

  // Escuchamos el evento submit del registro
  if (formRegistro) {
    formRegistro.addEventListener("submit", manejarRegistro);
  }
}

// Arrancamos la aplicación
init();
