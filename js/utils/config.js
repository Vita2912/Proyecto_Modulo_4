/**
 * Objeto de configuración principal que almacena metadatos del proyecto.
 * Exportado como constante inmutable.
 */
export const APP_CONFIG = {
  name: "Sistema de Gestión Bancaria",
  version: "v0.1.0",
  status: "Estructura inicial configurada correctamente",
  author: "Proyecto Integrador Módulo 4",
};

/**
 * Obtiene un resumen formateado con la información actual de la aplicación.
 * @returns {string} Cadena de texto descriptiva sobre el estado de la versión.
 */
export function getAppInfo() {
  return `${APP_CONFIG.name} (${APP_CONFIG.version}) - ${APP_CONFIG.status}`;
}
