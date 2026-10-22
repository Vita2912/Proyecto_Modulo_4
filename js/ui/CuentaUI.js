// Traemos los servicios que necesitamos para la auth y el banco
import { authService } from "../services/AuthService.js";
import { bancoService } from "../services/BancoService.js";

// Y los formateadores para presentar los datos chidos en pantalla
import {
  formatCurrency,
  formatDate,
  formatAccountNumber,
} from "../utils/formatters.js";

// Configuramos la salida de la sesión
function initLogout() {
  // Buscamos el botón de salir
  const btn = document.querySelector("#logoutBtn");

  // Si no está en la página, ni le movemos
  if (!btn) {
    return;
  }

  // Le metemos el listener para cuando den clic
  btn.addEventListener("click", () => {
    // Preguntamos si neta se quieren salir
    Swal.fire({
      icon: "question",
      title: "Cerrar sesión",
      text: "¿Seguro que deseas salir?",
      showCancelButton: true,
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      // Si se arrepienten, cancelamos
      if (!result.isConfirmed) {
        return;
      }

      // Cerramos sesión y los mandamos al inicio
      authService.logout();
      window.location.href = "index.html";
    });
  });
}

// Pintamos toda la interfaz de la cuenta
function renderCuenta(usuario, cuenta) {
  // Agarramos el contenedor principal
  const root = document.querySelector("#cuentaRoot");

  // Si falta algo de info, no renderizamos nada
  if (!root || !usuario || !cuenta) {
    return;
  }

  // Inyectamos todo el HTML de la tarjeta y los formularios
  root.innerHTML = `
        <section
            class="cuenta-layout"
        >

            <article
                class="cuenta-card"
            >

                <header
                    class="cuenta-card-header"
                >

                    <div>
                        <h2>
                            ${usuario.nombre}
                        </h2>

                        <p
                            class="cuenta-meta"
                        >
                            Titular de la cuenta
                        </p>
                    </div>

                    <span
                        class="
                            badge
                            ${cuenta.activa ? "badge-success" : "badge-danger"}
                        "
                    >
                        ${cuenta.activa ? "Activa" : "Inactiva"}
                    </span>

                </header>

                <section
                    class="cuenta-detalle"
                >

                    <p>
                        <strong>
                            Número de cuenta:
                        </strong>

                        ${formatAccountNumber(cuenta.numeroCuenta)}
                    </p>

                    <p>
                        <strong>
                            Tipo:
                        </strong>

                        ${cuenta.tipo}
                    </p>

                    <p>
                        <strong>
                            Saldo actual:
                        </strong>

                        ${formatCurrency(cuenta.saldo)}
                    </p>

                    <p>
                        <strong>
                            Fecha de apertura:
                        </strong>

                        ${formatDate(cuenta.fechaApertura)}
                    </p>

                </section>

            </article>

            <section
                class="cuenta-panel"
            >

                <article
                    class="cuenta-section"
                >

                    <h3>
                        Información personal
                    </h3>

                    <form
                        id="formInfoPersonal"
                        class="cuenta-form"
                        novalidate
                    >

                        <div
                            class="form-group"
                        >

                            <label
                                for="infoNombre"
                            >
                                Nombre completo
                            </label>

                            <input
                                id="infoNombre"
                                type="text"
                                value="${usuario.nombre}"
                            >

                            <p
                                class="field-error"
                                data-error-for="infoNombre"
                            >
                            </p>

                        </div>

                        <div
                            class="form-group"
                        >

                            <label
                                for="infoEmail"
                            >
                                Correo electrónico
                            </label>

                            <input
                                id="infoEmail"
                                type="email"
                                value="${usuario.email}"
                            >

                            <p
                                class="field-error"
                                data-error-for="infoEmail"
                            >
                            </p>

                        </div>

                        <div
                            class="form-group"
                        >

                            <label
                                for="infoTelefono"
                            >
                                Teléfono
                            </label>

                            <input
                                id="infoTelefono"
                                type="tel"
                                value="${usuario.telefono || ""}"
                            >

                            <p
                                class="field-error"
                                data-error-for="infoTelefono"
                            >
                            </p>

                        </div>

                        <button
                            type="submit"
                            class="btn btn-primary"
                        >
                            Guardar cambios
                        </button>

                    </form>

                </article>

                <article
                    class="cuenta-section"
                >

                    <h3>
                        Seguridad
                    </h3>

                    <form
                        id="formSeguridad"
                        class="cuenta-form"
                        novalidate
                    >

                        <div
                            class="form-group"
                        >

                            <label
                                for="segPasswordActual"
                            >
                                Contraseña actual
                            </label>

                            <input
                                id="segPasswordActual"
                                type="password"
                            >

                            <p
                                class="field-error"
                                data-error-for="segPasswordActual"
                            >
                            </p>

                        </div>

                        <div
                            class="form-group"
                        >

                            <label
                                for="segPasswordNueva"
                            >
                                Nueva contraseña
                            </label>

                            <input
                                id="segPasswordNueva"
                                type="password"
                            >

                            <p
                                class="field-error"
                                data-error-for="segPasswordNueva"
                            >
                            </p>

                        </div>

                        <div
                            class="form-group"
                        >

                            <label
                                for="segPasswordConfirmar"
                            >
                                Confirmar nueva contraseña
                            </label>

                            <input
                                id="segPasswordConfirmar"
                                type="password"
                            >

                            <p
                                class="field-error"
                                data-error-for="segPasswordConfirmar"
                            >
                            </p>

                        </div>

                        <button
                            type="submit"
                            class="btn btn-primary"
                        >
                            Cambiar contraseña
                        </button>

                    </form>

                </article>

                <article
                    class="
                        cuenta-section
                        cuenta-section-danger
                    "
                >

                    <h3>
                        Zona peligrosa
                    </h3>

                    <p
                        class="cuenta-warning"
                    >
                        Eliminar tu cuenta
                        es una acción
                        irreversible.
                    </p>

                    <button
                        type="button"
                        id="btnEliminarCuenta"
                        class="btn btn-danger"
                    >
                        Eliminar mi cuenta
                    </button>

                </article>

            </section>

        </section>
    `;

  // Enganchamos los eventos a los formularios recién creados
  inicializarFormulariosCuenta(usuario, cuenta);
}

// Vinculamos la lógica de envio a cada formulario
function inicializarFormulariosCuenta(usuario, cuenta) {
  // Buscamos los formularios y botones
  const formInfo = document.querySelector("#formInfoPersonal");
  const formSeguridad = document.querySelector("#formSeguridad");
  const btnEliminar = document.querySelector("#btnEliminarCuenta");

  // Para actualizar los datos personales
  if (formInfo) {
    formInfo.addEventListener("submit", (event) =>
      manejarActualizarInfo(event, usuario),
    );
  }

  // Para cambiar el password
  if (formSeguridad) {
    formSeguridad.addEventListener("submit", (event) =>
      manejarCambiarPassword(event, usuario),
    );
  }

  // Por si quieren borrar la cuenta
  if (btnEliminar) {
    btnEliminar.addEventListener("click", () =>
      manejarEliminarCuenta(usuario, cuenta),
    );
  }
}

// Muestra el mensaje de error debajo del input que falló
function mostrarError(campoId, mensaje) {
  const elemento = document.querySelector(`[data-error-for="${campoId}"]`);

  if (elemento) {
    elemento.textContent = mensaje;
  }
}

// Limpia todos los avisos de error
function limpiarErroresCuenta() {
  document.querySelectorAll(".field-error").forEach((elemento) => {
    elemento.textContent = "";
  });
}

// Actualiza los datos del usuario
function manejarActualizarInfo(event, usuario) {
  // Evitamos que recargue
  event.preventDefault();

  // Borramos errores anteriores
  limpiarErroresCuenta();

  // Jalamos los valores
  const nombre = document.querySelector("#infoNombre").value.trim();
  const email = document.querySelector("#infoEmail").value.trim().toLowerCase();
  const telefono = document.querySelector("#infoTelefono").value.trim();

  let valido = true;

  // Checamos que el nombre no venga vacío
  if (!nombre) {
    mostrarError("infoNombre", "El nombre es obligatorio.");
    valido = false;
  }

  // Validamos la estructura del correo
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!email || !emailValido) {
    mostrarError("infoEmail", "Ingresa un correo válido.");
    valido = false;
  }

  // Validamos el teléfono
  if (!telefono) {
    mostrarError("infoTelefono", "El teléfono es obligatorio.");
    valido = false;
  }

  // Si algo falló, nos detenemos
  if (!valido) {
    return;
  }

  // Intentamos actualizar
  try {
    const actualizado = bancoService.actualizarUsuario(usuario.id, {
      nombre,
      email,
      telefono,
    });

    // Avisamos que se guardó y volvemos a renderizar
    Swal.fire({
      icon: "success",
      title: "Datos actualizados",
      timer: 1500,
      showConfirmButton: false,
    }).then(() => {
      const { cuentas } = bancoService.obtenerDatosUsuario(actualizado.id);
      renderCuenta(actualizado, cuentas[0]);
    });
  } catch (error) {
    mostrarError("infoEmail", error.message);
  }
}

// Para hacer el cambio de contraseña
function manejarCambiarPassword(event, usuario) {
  // Que no recargue la página
  event.preventDefault();

  // Limpiamos los mensajes rojos
  limpiarErroresCuenta();

  // Leemos las 3 contraseñas
  const actual = document.querySelector("#segPasswordActual").value.trim();
  const nueva = document.querySelector("#segPasswordNueva").value.trim();
  const confirmar = document
    .querySelector("#segPasswordConfirmar")
    .value.trim();

  let valido = true;

  // Checamos que ponga la contraseña actual
  if (!actual) {
    mostrarError("segPasswordActual", "Ingresa tu contraseña actual.");
    valido = false;
  }

  // Mínimo 6 caracteres para la nueva
  if (!nueva || nueva.length < 6) {
    mostrarError(
      "segPasswordNueva",
      "La nueva contraseña debe tener al menos 6 caracteres.",
    );
    valido = false;
  }

  // Que no ponga la misma que ya tiene
  if (nueva === actual) {
    mostrarError("segPasswordNueva", "La nueva contraseña debe ser diferente.");
    valido = false;
  }

  // Que coincidan la nueva y la confirmación
  if (!confirmar || confirmar !== nueva) {
    mostrarError("segPasswordConfirmar", "Las contraseñas no coinciden.");
    valido = false;
  }

  // Si no pasa las validaciones, paramos
  if (!valido) {
    return;
  }

  // Intentamos hacer el cambio en el servicio
  try {
    bancoService.cambiarPassword(usuario.id, actual, nueva);

    // Limpiamos los campos del formulario
    document.querySelector("#formSeguridad").reset();

    // Mostramos aviso de éxito
    Swal.fire({
      icon: "success",
      title: "Contraseña actualizada",
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (error) {
    mostrarError("segPasswordActual", error.message);
  }
}

// Proceso para eliminar la cuenta del usuario
function manejarEliminarCuenta(usuario) {
  // Pedimos confirmación porque no hay vuelta atrás
  Swal.fire({
    icon: "warning",
    title: "Eliminar cuenta",
    text: "¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar mi cuenta",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#dc2626",
  }).then((result) => {
    // Si cancela, no hacemos nada
    if (!result.isConfirmed) {
      return;
    }

    // Eliminamos el usuario y cerramos la sesión
    try {
      bancoService.eliminarUsuario(usuario.id);
      authService.logout();

      // Avisamos que ya quedó eliminada y mandamos al login
      Swal.fire({
        icon: "success",
        title: "Cuenta eliminada",
        text: "Tu usuario y sus datos han sido eliminados.",
        confirmButtonText: "Continuar",
      }).then(() => {
        window.location.href = "index.html";
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "No se puede eliminar",
        text: error.message,
      });
    }
  });
}

// Arrancamos la vista
function init() {
  // Verificamos si tiene acceso
  const accesoPermitido = authService.protegerRuta();

  // Si no tiene permiso, lo saca protegerRuta y paramos aquí
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

  // Jalamos los datos frescos del banco y los mostramos
  try {
    bancoService.recargarBanco();

    // Agarramos las cuentas asociadas
    const { cuentas } = bancoService.obtenerDatosUsuario(usuario.id);
    const cuentaPrincipal = cuentas[0] || null;

    // Si no tiene cuenta bancaria mostramos error
    if (!cuentaPrincipal) {
      Swal.fire({
        icon: "error",
        title: "Cuenta no encontrada",
        text: "No existe una cuenta bancaria asociada a este usuario.",
      });
      return;
    }

    // Renderizamos los datos en pantalla
    renderCuenta(usuario, cuentaPrincipal);
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "No fue posible cargar la cuenta",
      text: error.message,
    });
  }
}

// Corremos el script únicamente si estamos dentro de la página de Mi Cuenta
if (document.querySelector(".app-cuenta")) {
  init();
}
