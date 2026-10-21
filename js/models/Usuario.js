// IMPORTAR UTILIDADES

// Utilizamos generarId() para asignar automáticamente identificadores.
import { generarId } from "../utils/helpers.js";

// MODELO USUARIO

// Representa una persona registrada dentro del sistema bancario.
export class Usuario {
  // CONSTRUCTOR
  constructor({
    id = generarId(),
    nombre,
    email,
    telefono = "",
    password,
    activo = true,
  }) {
    // PROPIEDADES
    this.id = id;
    this.nombre = nombre;
    this.email = email;
    this.telefono = telefono;
    this.password = password;
    this.activo = activo;
  }
}
