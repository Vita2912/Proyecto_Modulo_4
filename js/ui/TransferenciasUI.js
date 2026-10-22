// Jalamos las dependencias para autenticación y servicios del banco
import { authService } from "../services/AuthService.js";
import { bancoService } from "../services/BancoService.js";

// Y las utilidades para formatear y validar los campos del formulario
import { formatCurrency, formatAccountNumber } from "../utils/formatters.js";
import { validarMonto, validarCampoObligatorio } from "../utils/validators.js";

// Preparamos el evento para cerrar sesión
function initLogout() {
  const btn = document.querySelector("#logoutBtn");

  if (!btn) {
    return;
  }

  // Escuchamos el clic para preguntar si neta quiere salir
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

      // Si confirman, cerramos sesión y mandamos al index
      authService.logout();
      window.location.href = "index.html";
    });
  });
}

// Pintamos toda la vista de transferencias y depósitos
function renderFormulario(usuario, cuentas) {
  const root = document.querySelector("#transferenciaRoot");

  if (!root) {
    return;
  }

  // Traemos la cuenta principal
  const cuentaPrincipal = cuentas[0] || null;

  // Si no tiene cuenta, avisamos
  if (!cuentaPrincipal) {
    root.innerHTML = `
            <section
                class="transferencia-card"
            >
                <h2>
                    No tienes cuentas
                    disponibles.
                </h2>
            </section>
        `;

    return;
  }

  // Armamos el HTML con las tarjetas y los selectores de cuentas
  root.innerHTML = `
        <!-- ENCABEZADO Y SALDO DISPONIBLE -->
        <section
            class="transferencia-header"
        >

            <div>
                <span
                    class="dashboard-label"
                >
                    Operaciones bancarias
                </span>

                <h2>
                    Transferir dinero
                </h2>

                <p>
                    Realiza transferencias
                    entre cuentas registradas.
                </p>
            </div>


            <article
                class="saldo-disponible"
            >
                <span>
                    Saldo disponible
                </span>

                <strong
                    id="saldoActual"
                >
                    ${formatCurrency(cuentaPrincipal.saldo)}
                </strong>
            </article>

        </section>


        <!-- GRID CON LOS FORMULARIOS DE TRANSFERENCIA Y DEPÓSITO -->
        <section
            class="operaciones-grid"
        >

            <!-- FORMULARIO DE NUEVA TRANSFERENCIA -->
            <article
                class="transferencia-card"
            >

                <h3>
                    Nueva transferencia
                </h3>


                <form
                    id="formTransferencia"
                    novalidate
                >

                    <div
                        class="form-group"
                    >
                        <label
                            for="cuentaOrigen"
                        >
                            Cuenta origen
                        </label>

                        <select
                            id="cuentaOrigen"
                        >
                            <option
                                value=""
                            >
                                Selecciona una cuenta
                            </option>

                            ${cuentas
                              .map(
                                (cuenta) => `
                                        <option
                                            value="${cuenta.id}"
                                        >
                                            ${formatAccountNumber(
                                              cuenta.numeroCuenta,
                                            )}
                                            -
                                            ${formatCurrency(cuenta.saldo)}
                                        </option>
                                    `,
                              )
                              .join("")}
                        </select>
                    </div>


                    <div
                        class="form-group"
                    >
                        <label
                            for="cuentaDestino"
                        >
                            Número de cuenta destino
                        </label>

                        <input
                            id="cuentaDestino"
                            type="text"
                            placeholder="123456789012"
                            maxlength="14"
                        >
                    </div>


                    <div
                        class="form-group"
                    >
                        <label
                            for="montoTransferencia"
                        >
                            Monto
                        </label>

                        <input
                            id="montoTransferencia"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                        >
                    </div>


                    <div
                        class="form-group"
                    >
                        <label
                            for="descripcionTransferencia"
                        >
                            Descripción
                        </label>

                        <input
                            id="descripcionTransferencia"
                            type="text"
                            maxlength="80"
                            placeholder="Concepto de la transferencia"
                        >
                    </div>


                    <button
                        type="submit"
                        class="btn btn-primary"
                    >
                        Confirmar transferencia
                    </button>

                </form>

            </article>


            <!-- FORMULARIO PARA DEPOSITAR SALDO -->
            <article
                class="transferencia-card"
            >

                <h3>
                    Depositar saldo
                </h3>

                <p
                    class="operation-help"
                >
                    Utiliza esta operación
                    para cargar saldo en tu
                    cuenta durante la práctica.
                </p>


                <form
                    id="formDeposito"
                    novalidate
                >

                    <div
                        class="form-group"
                    >
                        <label
                            for="cuentaDeposito"
                        >
                            Cuenta
                        </label>

                        <select
                            id="cuentaDeposito"
                        >

                            ${cuentas
                              .map(
                                (cuenta) => `
                                        <option
                                            value="${cuenta.id}"
                                        >
                                            ${formatAccountNumber(
                                              cuenta.numeroCuenta,
                                            )}
                                        </option>
                                    `,
                              )
                              .join("")}

                        </select>
                    </div>


                    <div
                        class="form-group"
                    >
                        <label
                            for="montoDeposito"
                        >
                            Monto
                        </label>

                        <input
                            id="montoDeposito"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                        >
                    </div>


                    <button
                        type="submit"
                        class="btn btn-secondary"
                    >
                        Realizar depósito
                    </button>

                </form>

            </article>

        </section>
    `;

  // Asignamos la lógica a los formularios recién creados
  initEventosOperaciones(usuario);
}

// Enganchamos el evento submit de los dos formularios
function initEventosOperaciones(usuario) {
  const formTransferencia = document.querySelector("#formTransferencia");
  const formDeposito = document.querySelector("#formDeposito");

  // Para mandar la lana a otra cuenta
  if (formTransferencia) {
    formTransferencia.addEventListener("submit", (event) =>
      manejarTransferencia(event, usuario),
    );
  }

  // Para meterle dinero a la cuenta
  if (formDeposito) {
    formDeposito.addEventListener("submit", (event) =>
      manejarDeposito(event, usuario),
    );
  }
}

// Lógica para procesar un depósito
function manejarDeposito(event, usuario) {
  // Evitamos que recargue la pantalla
  event.preventDefault();

  // Leemos el selector y el input de dinero
  const cuentaId = document.querySelector("#cuentaDeposito").value;
  const monto = document.querySelector("#montoDeposito").value;

  // Validamos que le pongan un número válido
  if (!validarMonto(monto)) {
    Swal.fire({
      icon: "warning",
      title: "Monto inválido",
      text: "El monto debe ser mayor a cero.",
    });

    return;
  }

  // Depositamos mediante el servicio y refrescamos
  try {
    bancoService.realizarDeposito({
      cuentaId,
      monto,
      descripcion: "Depósito desde interfaz",
    });

    Swal.fire({
      icon: "success",
      title: "Depósito exitoso",
      text: `Se depositaron ${formatCurrency(monto)}.`,
    }).then(() => {
      recargarFormulario(usuario);
    });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "No fue posible depositar",
      text: error.message,
    });
  }
}

// Lógica para procesar una transferencia
function manejarTransferencia(event, usuario) {
  // Evitamos la recarga
  event.preventDefault();

  // Jalamos los valores cargados en el form
  const cuentaOrigenId = document.querySelector("#cuentaOrigen").value;
  const numeroCuentaDestino = document
    .querySelector("#cuentaDestino")
    .value.trim();
  const monto = document.querySelector("#montoTransferencia").value;
  const descripcion = document
    .querySelector("#descripcionTransferencia")
    .value.trim();

  // Checamos si eligieron la cuenta de origen
  if (!validarCampoObligatorio(cuentaOrigenId)) {
    Swal.fire({
      icon: "warning",
      title: "Selecciona la cuenta origen ",
    });

    return;
  }

  // Checamos que hayan puesto la cuenta a donde van a transferir
  if (!validarCampoObligatorio(numeroCuentaDestino)) {
    Swal.fire({
      icon: "warning",
      title: "Ingresa la cuenta destino a la que deseas transferir",
    });

    return;
  }

  // Que el monto sea mayor a 0
  if (!validarMonto(monto)) {
    Swal.fire({
      icon: "warning",
      title: "Monto inválido",
      text: "El monto debe ser mayor a cero.",
    });

    return;
  }

  // Le mostramos la alerta de confirmación antes de mover el dinero
  Swal.fire({
    icon: "question",
    title: "Confirmar transferencia",
    html: `
            <p>
                Estás por transferir
                <strong>
                    ${formatCurrency(monto)}
                </strong>
            </p>

            <p>
                Cuenta destino:
                <strong>
                    ${numeroCuentaDestino}
                </strong>
            </p>
        `,
    showCancelButton: true,
    confirmButtonText: "Transferir",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    // Si cancela, ahí muere el proceso
    if (!result.isConfirmed) {
      return;
    }

    // Si confirma, ejecutamos la transferencia
    try {
      bancoService.realizarTransferencia({
        cuentaOrigenId,
        numeroCuentaDestino,
        monto,
        descripcion,
      });

      Swal.fire({
        icon: "success",
        title: "Transferencia exitosa",
        text: `${formatCurrency(monto)} fueron transferidos correctamente.`,
      }).then(() => {
        recargarFormulario(usuario);
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "No fue posible realizar la transferencia",
        text: error.message,
      });
    }
  });
}

// Función para actualizar los datos en el form tras una operación
function recargarFormulario(usuario) {
  bancoService.recargarBanco();

  const { cuentas } = bancoService.obtenerDatosUsuario(usuario.id);

  renderFormulario(usuario, cuentas);
}

// Inicialización de la pantalla
function init() {
  // Aseguramos que haya sesión iniciada
  const accesoPermitido = authService.protegerRuta();

  if (!accesoPermitido) {
    return;
  }

  // Preparamos el logout
  initLogout();

  // Traemos el usuario que inició sesión
  const usuario = authService.getCurrentUser();

  if (!usuario) {
    return;
  }

  // Cargamos la información fresca de sus cuentas
  try {
    bancoService.recargarBanco();

    const { cuentas } = bancoService.obtenerDatosUsuario(usuario.id);

    renderFormulario(usuario, cuentas);
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "No fue posible cargar las operaciones",
      text: error.message,
    });
  }
}

// Corremos esto únicamente en la pantalla de transferencias
if (document.querySelector(".app-transferencia")) {
  init();
}
