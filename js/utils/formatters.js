// Funciones para darle formato bonito a los datos antes de mostrarlos

// Formateamos cualquier número a pesos mexicanos
export function formatCurrency(valor) {
  const numero = Number(valor);

  // Si nos pasan algo raro que no sea número, devolvemos $0.00 para no romper la pantalla
  if (!Number.isFinite(numero)) {
    return "$0.00";
  }

  return numero.toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
  });
}

// Convertimos cualquier texto/timestamp a una fecha legible en español
export function formatDate(fecha) {
  // Intentamos crear el objeto fecha
  const fechaObjeto = new Date(fecha);

  // Si la fecha es inválida o viene vacía, regresamos un string vacío
  if (Number.isNaN(fechaObjeto.getTime())) {
    return "";
  }

  return fechaObjeto.toLocaleDateString("es-MX");
}

// Separamos los 12 dígitos de la cuenta en bloques de 4 para que sea fácil de leer
export function formatAccountNumber(numeroCuenta) {
  const numero = String(numeroCuenta ?? "");

  // Usamos regex para meter un espacio cada 4 números
  return numero.replace(/(\d{4})(?=\d)/g, "$1 ");
}
