import type { IPasswordHash } from "./IPasswordHash";
import type { Rol } from "./Rol";

/**
 * Usuario almacenado (cuenta).
 * Incluye los datos necesarios para autenticar.
 * Se persiste en localStorage bajo la clave "users".
 */
export interface IStoredUser {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  role: Rol;
  password: IPasswordHash;
  createdAt: string;
}
