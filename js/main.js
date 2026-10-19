// Importación de funciones y constantes desde el módulo de configuración
import { APP_CONFIG, getAppInfo } from "./utils/config.js";

/**
 * Evento que asegura la ejecución del script una vez que el árbol DOM
 * ha sido cargado completamente en el navegador.
 */
document.addEventListener("DOMContentLoaded", () => {
  // 1. Mensaje de depuración en la consola del navegador
  console.log(
    `[${APP_CONFIG.name}] Inicializando versión ${APP_CONFIG.version}...`,
  );
  console.log(`[Información]: ${getAppInfo()}`);

  // 2. Localizar el nodo del DOM donde se mostrará la confirmación de carga
  const statusElement = document.getElementById("status-message");

  // 3. Si el elemento existe, actualizar su texto para confirmar la lectura del módulo ES6
  if (statusElement) {
    statusElement.textContent = `🚀 ${getAppInfo()}`;
  }
});
