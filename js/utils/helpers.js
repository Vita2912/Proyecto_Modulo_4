// Generamos un ID único combinando la fecha actual y unas cuantas letras/números al azar
export function generarId() {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// Función para armar el número de cuenta
export function generarNumeroCuenta() {
  // Aquí vamos a ir guardando los dígitos
  let numeroCuenta = "";

  // Un loop sencillo para ir armando los 12 dígitos uno por uno
  for (let i = 0; i < 12; i += 1) {
    // Le pegamos un número al azar del 0 al 9
    numeroCuenta += Math.floor(Math.random() * 10);
  }

  // Y devolvemos la cuenta lista
  return numeroCuenta;
}
