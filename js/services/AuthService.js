// Jalamos el storageService y sus claves para manejar la sesión en localStorage
import { STORAGE_KEYS, storageService } from "./StorageService.js";

// Lógica para autenticación y manejo de sesión
class AuthService {
  // Función para hacer login
  login(email, password) {
    // Jalamos la lista de usuarios guardados
    const usuarios = storageService.obtener(STORAGE_KEYS.USUARIOS, []);

    // Limpiamos el email por si traía espacios y lo pasamos a minúsculas
    const emailNormalizado = String(email).trim().toLowerCase();

    // Buscamos que coincidan email, password y que el usuario esté activo
    const usuario = usuarios.find(
      (u) =>
        u.email.toLowerCase() === emailNormalizado &&
        u.password === password &&
        u.activo !== false,
    );

    // Si no lo encontramos, mostramos el error
    if (!usuario) {
      throw new Error("Correo o contraseña incorrectos.");
    }

    // Armamos el objeto de la sesión con su id y fecha de inicio
    const sesion = {
      usuarioId: usuario.id,
      fechaInicio: new Date().toISOString(),
    };

    // Guardamos la sesión en el localStorage
    storageService.guardar(STORAGE_KEYS.SESION, sesion);

    // Devolvemos los datos del usuario logueado
    return usuario;
  }

  // Borramos la sesión para salir
  logout() {
    storageService.eliminar(STORAGE_KEYS.SESION);
  }

  // Traemos el usuario que tiene la sesión activa actualmente
  getCurrentUser() {
    // Buscamos si hay una sesión guardada
    const sesion = storageService.obtener(STORAGE_KEYS.SESION, null);

    // Si no hay sesión activa, devolvemos null
    if (!sesion) {
      return null;
    }

    // Jalamos los usuarios
    const usuarios = storageService.obtener(STORAGE_KEYS.USUARIOS, []);

    // Buscamos cuál usuario coincide con el id de la sesión
    return usuarios.find((usuario) => usuario.id === sesion.usuarioId) || null;
  }

  // Para proteger las pantallas que requieren inicio de sesión
  protegerRuta() {
    // Revisamos si hay usuario logueado
    const usuario = this.getCurrentUser();

    // Si no está logueado, lo mandamos directo al index
    if (!usuario) {
      window.location.href = "index.html";

      return false;
    }

    // Si todo bien, dejamos pasar
    return true;
  }
}

// Exportamos la instancia única lista para usarse
export const authService = new AuthService();
