// Importamos los servicios para la sesión y los datos del banco
import { authService } from "../services/AuthService.js";
import { bancoService } from "../services/BancoService.js";

// Y las utilidades para dejar limpios los números y cuentas
import { formatCurrency, formatAccountNumber } from "../utils/formatters.js";

// Función para pintar todo el dashboard en pantalla
function renderDashboard(resumen) {
  // Buscamos el contenedor donde va a ir todo
  const root = document.querySelector("#dashboardRoot");

  // Si no existe la etiqueta en el HTML, ahí la dejamos
  if (!root) {
    return;
  }

  // Desestructuramos lo que nos mandaron en el resumen
  const { usuario, cuentas, saldoTotal, totalCuentas, totalMovimientos } =
    resumen;

  // Agarramos la primera cuenta de la lista si existe
  const cuentaPrincipal = cuentas[0] || null;

  // Inyectamos todo el HTML de la bienvenida, las tarjetas de resumen y la cuenta principal
  root.innerHTML = `
        <section
            class="dashboard-welcome"
        >
            <div>
                <p
                    class="dashboard-label"
                >
                    Bienvenido
                </p>

                <h2>
                    ${usuario.nombre}
                </h2>

                <p>
                    Consulta el estado
                    actual de tus cuentas.
                </p>
            </div>
        </section>


        <section
            class="summary-grid"
        >

            <article
                class="summary-card"
            >
                <span>
                    Saldo total
                </span>

                <strong>
                    ${formatCurrency(saldoTotal)}
                </strong>
            </article>


            <article
                class="summary-card"
            >
                <span>
                    Cuentas
                </span>

                <strong>
                    ${totalCuentas}
                </strong>
            </article>


            <article
                class="summary-card"
            >
                <span>
                    Movimientos
                </span>

                <strong>
                    ${totalMovimientos}
                </strong>
            </article>

        </section>


        <section
            class="dashboard-section"
        >

            <header
                class="section-header"
            >
                <div>
                    <span>
                        Cuenta principal
                    </span>

                    <h3>
                        Información bancaria
                    </h3>
                </div>
            </header>


            ${
              cuentaPrincipal
                ? `
                        <article
                            class="account-card"
                        >
                            <div>
                                <span>
                                    Número de cuenta
                                </span>

                                <strong>
                                    ${formatAccountNumber(
                                      cuentaPrincipal.numeroCuenta,
                                    )}
                                </strong>
                            </div>


                            <div>
                                <span>
                                    Tipo
                                </span>

                                <strong>
                                    ${cuentaPrincipal.tipo}
                                </strong>
                            </div>


                            <div>
                                <span>
                                    Saldo disponible
                                </span>

                                <strong>
                                    ${formatCurrency(cuentaPrincipal.saldo)}
                                </strong>
                            </div>
                        </article>
                    `
                : `
                        <p>
                            No tienes cuentas
                            bancarias registradas.
                        </p>
                    `
            }

        </section>
    `;
}

// Preparamos el evento para el botón de cerrar sesión
function initLogout() {
  const btn = document.querySelector("#logoutBtn");

  if (!btn) {
    return;
  }

  // Si le dan clic al botón, pedimos confirmación con SweetAlert
  btn.addEventListener("click", () => {
    Swal.fire({
      icon: "question",
      title: "Cerrar sesión",
      text: "¿Seguro que deseas salir?",
      showCancelButton: true,
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      // Si le dan a cancelar, nos regresamos
      if (!result.isConfirmed) {
        return;
      }

      // Si confirman, cerramos la sesión y los mandamos al inicio
      authService.logout();
      window.location.href = "index.html";
    });
  });
}

// Arrancamos la vista
function init() {
  // Primero revisamos si el usuario tiene permiso de estar aquí
  const accesoPermitido = authService.protegerRuta();

  // Si no tiene acceso, detener ejecución
  if (!accesoPermitido) {
    return;
  }

  // Traemos el usuario logueado
  const usuario = authService.getCurrentUser();

  if (!usuario) {
    return;
  }

  try {
    // Recargamos el banco para tener los datos más recientes
    bancoService.recargarBanco();

    // Jalamos el resumen completo con saldos y totales
    const resumen = bancoService.obtenerResumenUsuario(usuario.id);

    // Pintamos la información en pantalla
    renderDashboard(resumen);

    // Activamos la funcionalidad de cerrar sesión
    initLogout();
  } catch (error) {
    // Si algo sale mal, mostramos una alerta
    Swal.fire({
      icon: "error",
      title: "No fue posible cargar el dashboard",
      text: error.message,
    });
  }
}

// Ejecutamos la función de inicio
init();
