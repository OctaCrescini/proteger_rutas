/**
 * Credencial derivada con PBKDF2-SHA256.
 * Solo se guarda el hash y su salt, nunca la contraseña original.
 */
export interface IPasswordHash {
  algorithm: "PBKDF2-SHA256";
  salt: string;
  hash: string;
  iterations: number;
}
