import type { Rol } from "./Rol";

/**
 * Usuario de sesión.
 * Solo contiene datos públicos: nunca contraseñas ni hashes.
 * Se persiste en localStorage bajo la clave "userData".
 */
export interface IUser {
  id: string;
  email: string;
  role: Rol;
}
