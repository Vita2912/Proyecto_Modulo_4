// Jalamos la función para generar un ID único para cada usuario
import { generarId } from "../utils/helpers.js";

// Modelo que representa a los usuarios del banco
export class Usuario {
  // Inicializamos la clase con sus datos por defecto
  constructor({
    id = generarId(),
    nombre,
    email,
    telefono = "",
    password,
    activo = true,
  }) {
    // Seteamos los datos de la persona
    this.id = id;
    this.nombre = nombre;
    this.email = email;
    this.telefono = telefono;
    this.password = password;
    this.activo = activo;
  }
}
