// Importamos la autenticación y los servicios del banco
import { authService } from "../services/AuthService.js";
import { bancoService } from "../services/BancoService.js";

// Importamos formateadores para las fechas y montos
import { formatCurrency, formatDate } from "../utils/formatters.js";

// Aquí guardamos qué filtro tiene seleccionado el usuario (empieza en "TODOS")
let filtroActual = "TODOS";

// Configuración del botón para cerrar sesión
function initLogout() {
  const btn = document.querySelector("#logoutBtn");

  if (!btn) {
    return;
  }

  // Escuchamos el clic para lanzar la confirmación
  btn.addEventListener("click", () => {
    Swal.fire({
      icon: "question",
      title: "Cerrar sesión",
      text: "¿Seguro que deseas salir?",
      showCancelButton: true,
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      // Si cancelan, no hacemos nada
      if (!result.isConfirmed) {
        return;
      }

      // Si confirman, cerramos sesión y mandamos al login
      authService.logout();
      window.location.href = "index.html";
    });
  });
}

// Convertimos los tipos técnicos a texto amigable para mostrar en pantalla
function obtenerEtiquetaTipo(tipo) {
  const etiquetas = {
    DEPOSITO: "Depósito",
    TRANSFERENCIA_ENVIADA: "Transferencia enviada",
    TRANSFERENCIA_RECIBIDA: "Transferencia recibida",
  };

  return etiquetas[tipo] || tipo;
}

// Le ponemos un signo menos si fue salida, o más si fue entrada
function obtenerSignoMovimiento(tipo) {
  if (tipo === "TRANSFERENCIA_ENVIADA") {
    return "-";
  }

  return "+";
}

// Definimos la clase CSS según el tipo para cambiarle el color/estilo
function obtenerClaseMovimiento(tipo) {
  if (tipo === "TRANSFERENCIA_ENVIADA") {
    return "movimiento-salida";
  }

  return "movimiento-entrada";
}

// Función principal para pintar toda la vista de movimientos
function renderMovimientos(usuario) {
  const root = document.querySelector("#movimientosRoot");

  if (!root) {
    return;
  }

  // Traemos los contadores totales para las tarjetas del resumen
  const resumen = bancoService.obtenerResumenMovimientos(usuario.id);

  // Jalamos los movimientos aplicando el filtro que esté seleccionado
  const movimientos = bancoService.obtenerMovimientosUsuario(
    usuario.id,
    filtroActual,
  );

  // Inyectamos todo el HTML a la pantalla
  root.innerHTML = `

        <!-- ENCABEZADO DE LA VISTA -->
        <section
            class="movimientos-header"
        >
            <div>

                <span
                    class="dashboard-label"
                >
                    Actividad bancaria
                </span>

                <h2>
                    Historial de movimientos
                </h2>

                <p>
                    Consulta las operaciones
                    realizadas en tus cuentas.
                </p>

            </div>
        </section>


        <!-- CARDS DE RESUMEN CON CONTADORES -->
        <section
            class="movimientos-summary"
        >

            <article
                class="movimiento-summary-card"
            >
                <span>
                    Todos
                </span>

                <strong>
                    ${resumen.total}
                </strong>
            </article>


            <article
                class="movimiento-summary-card"
            >
                <span>
                    Depósitos
                </span>

                <strong>
                    ${resumen.depositos}
                </strong>
            </article>


            <article
                class="movimiento-summary-card"
            >
                <span>
                    Enviadas
                </span>

                <strong>
                    ${resumen.enviadas}
                </strong>
            </article>


            <article
                class="movimiento-summary-card"
            >
                <span>
                    Recibidas
                </span>

                <strong>
                    ${resumen.recibidas}
                </strong>
            </article>

        </section>


        <!-- PANEL CON BOTONES DE FILTRO Y LA TABLA -->
        <section
            class="movimientos-panel"
        >

            <header
                class="movimientos-toolbar"
            >

                <div>

                    <h3>
                        Operaciones
                    </h3>

                    <p>
                        Filtra el historial
                        por tipo de movimiento.
                    </p>

                </div>


                <!-- BOTONES PARA FILTRAR EL HISTORIAL -->
                <div
                    class="movimientos-filtros"
                >

                    <button
                        type="button"
                        class="
                            filtro-btn
                            ${filtroActual === "TODOS" ? "active" : ""}
                        "
                        data-filtro="TODOS"
                    >
                        Todos
                    </button>


                    <button
                        type="button"
                        class="
                            filtro-btn
                            ${filtroActual === "DEPOSITO" ? "active" : ""}
                        "
                        data-filtro="DEPOSITO"
                    >
                        Depósitos
                    </button>


                    <button
                        type="button"
                        class="
                            filtro-btn
                            ${
                              filtroActual === "TRANSFERENCIA_ENVIADA"
                                ? "active"
                                : ""
                            }
                        "
                        data-filtro="TRANSFERENCIA_ENVIADA"
                    >
                        Enviadas
                    </button>


                    <button
                        type="button"
                        class="
                            filtro-btn
                            ${
                              filtroActual === "TRANSFERENCIA_RECIBIDA"
                                ? "active"
                                : ""
                            }
                        "
                        data-filtro="TRANSFERENCIA_RECIBIDA"
                    >
                        Recibidas
                    </button>

                </div>

            </header>


            <!-- MOSTRAR MENSAJE SI NO HAY MOVIMIENTOS O MOSTRAR LA TABLA -->
            ${
              movimientos.length === 0
                ? `
                        <div
                            class="movimientos-empty"
                        >
                            <strong>
                                No hay movimientos
                                para mostrar.
                            </strong>

                            <p>
                                Realiza un depósito
                                o una transferencia
                                para generar actividad.
                            </p>
                        </div>
                    `
                : `
                        <div
                            class="table-wrapper"
                        >

                            <table
                                class="movimientos-table"
                            >

                                <thead>

                                    <tr>
                                        <th>
                                            Fecha
                                        </th>

                                        <th>
                                            Tipo
                                        </th>

                                        <th>
                                            Descripción
                                        </th>

                                        <th>
                                            Monto
                                        </th>

                                        <th>
                                            Saldo
                                        </th>
                                    </tr>

                                </thead>


                                <tbody>

                                    ${movimientos
                                      .map((movimiento) => {
                                        // Jalamos el signo y la clase visual según la operación
                                        const signo = obtenerSignoMovimiento(
                                          movimiento.tipo,
                                        );

                                        const clase = obtenerClaseMovimiento(
                                          movimiento.tipo,
                                        );

                                        return `
                                                    <tr>

                                                        <td>
                                                            ${formatDate(
                                                              movimiento.fecha,
                                                            )}
                                                        </td>


                                                        <td>
                                                            <span
                                                                class="
                                                                    movimiento-tipo
                                                                    ${clase}
                                                                "
                                                            >
                                                            ${obtenerEtiquetaTipo(
                                                              movimiento.tipo,
                                                            )}
                                                            </span>
                                                        </td>


                                                        <td>
                                                            ${
                                                              movimiento.descripcion ||
                                                              "Sin descripción"
                                                            }
                                                        </td>


                                                        <td
                                                            class="
                                                                movimiento-monto
                                                                ${clase}
                                                            "
                                                        >
                                                            ${signo}${formatCurrency(
                                                              movimiento.monto,
                                                            )}
                                                        </td>


                                                        <td>
                                                            ${formatCurrency(
                                                              movimiento.saldoResultante,
                                                            )}
                                                        </td>

                                                    </tr>
                                                `;
                                      })
                                      .join("")}

                                </tbody>

                            </table>

                        </div>
                    `
            }

        </section>
    `;

  // Enganchamos los clics de los filtros que acabamos de meter al DOM
  initFiltros(usuario);
}

// Le damos vida a los botones de filtro
function initFiltros(usuario) {
  const botones = document.querySelectorAll("[data-filtro]");

  botones.forEach((boton) => {
    boton.addEventListener("click", () => {
      // Guardamos el filtro seleccionado
      filtroActual = boton.dataset.filtro;

      // Volvemos a pintar la lista actualizada
      renderMovimientos(usuario);
    });
  });
}

// Inicialización de la vista
function init() {
  // Primero aseguramos que haya iniciado sesión
  const accesoPermitido = authService.protegerRuta();

  if (!accesoPermitido) {
    return;
  }

  // Preparamos el logout
  initLogout();

  // Jalamos los datos del usuario actual
  const usuario = authService.getCurrentUser();

  if (!usuario) {
    return;
  }

  try {
    // Recargamos el banco para traer los datos más frescos
    bancoService.recargarBanco();

    // Renderizamos el historial
    renderMovimientos(usuario);
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "No fue posible cargar los movimientos",
      text: error.message,
    });
  }
}

// Corremos la vista únicamente si estamos parados en movimientos.html
if (document.querySelector(".app-movimientos")) {
  init();
}
