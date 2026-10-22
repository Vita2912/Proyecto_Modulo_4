// Centralizamos las llaves del localStorage para no andar escribiendo textos a mano por todos lados
export const STORAGE_KEYS = {
  USUARIOS: "usuarios",
  CUENTAS: "cuentas",
  MOVIMIENTOS: "movimientos",
  SESION: "sesion",
};

// Clase para manejar todo lo que entra y sale de localStorage
class StorageService {
  // Para guardar datos convirtiéndolos a JSON
  guardar(clave, valor) {
    const valorJSON = JSON.stringify(valor);

    // Guardamos la cadena JSON con su clave
    localStorage.setItem(clave, valorJSON);
  }

  // Para recuperar y parsear los datos guardados
  obtener(clave, valorPorDefecto = null) {
    // Si la clave no existe, localStorage nos devuelve null
    const valor = localStorage.getItem(clave);

    // Si no hay nada guardado, regresamos el valor por defecto que le pasemos
    if (valor === null) {
      return valorPorDefecto;
    }

    // Intentamos convertir la cadena de texto a un objeto JS
    try {
      return JSON.parse(valor);
    } catch (error) {
      console.error(
        `No fue posible leer la clave "${clave}" de LocalStorage.`,
        error,
      );

      return valorPorDefecto;
    }
  }

  // Para borrar una sola clave en específico
  eliminar(clave) {
    localStorage.removeItem(clave);
  }

  // Para borrar absolutamente todo el localStorage
  limpiar() {
    localStorage.clear();
  }
}

// Exportamos una sola instancia lista para reusar en todo el proyecto
export const storageService = new StorageService();
