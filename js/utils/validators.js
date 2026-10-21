// VALIDACIONES GENERALES

// Verifica que un campo obligatorio no esté vacío, nulo o indefinido.
export function validarCampoObligatorio(valor) {
  return valor !== undefined && valor !== null && String(valor).trim() !== "";
}

// Valida que el monto sea un número mayor a cero.
export function validarMonto(monto) {
  const montoNumerico = Number(monto);

  return Number.isFinite(montoNumerico) && montoNumerico > 0;
}
