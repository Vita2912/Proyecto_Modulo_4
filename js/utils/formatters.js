// FORMATEADORES DE INFORMACIÓN

// FORMATEAR MONEDA

// Convierte un valor a formato monetario utilizando pesos mexicanos.
export function formatCurrency(valor) {
  const numero = Number(valor);

  // Si el resultado no es un número válido, regresamos un monto por defecto.
  if (!Number.isFinite(numero)) {
    return "$0.00";
  }

  return numero.toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
  });
}

// FORMATEAR FECHA

export function formatDate(fecha) {
  // Convertimos el valor a un objeto Date
  const fechaObjeto = new Date(fecha);

  // Comprobamos que sea una fecha válida
  if (Number.isNaN(fechaObjeto.getTime())) {
    return "";
  }

  return fechaObjeto.toLocaleDateString("es-MX");
}

// FORMATEAR NÚMERO DE CUENTA

export function formatAccountNumber(numeroCuenta) {
  const numero = String(numeroCuenta ?? "");

  // Utilizamos una expresión regular para separar grupos de cuatro dígitos.
  return numero.replace(/(\d{4})(?=\d)/g, "$1 ");
}
