// GENERAR IDENTIFICADOR

// Genera un identificador combinando el tiempo actual con una cadena pseudoaleatoria.
export function generarId() {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
