import type { IStoredUser } from "../types/IStoredUser";
import { createId } from "./id";
import { readStoredUsers, saveStoredUsers } from "./localStorage";
import { hashPassword } from "./password";

/**
 * Cuenta de demostración creada por la cátedra.
 * Estas credenciales son exclusivamente académicas.
 */
export const SEED_ADMIN_EMAIL = "admin@foodstore.local";
export const SEED_ADMIN_PASSWORD = "Admin123!";

/**
 * Crea el administrador inicial de forma idempotente:
 * - Si la cuenta ya existe, no la duplica ni la sobrescribe.
 * - Si el almacenamiento está corrupto, no lo pisa.
 * - Si el almacenamiento está vacío, crea la cuenta.
 */
export const ensureSeedAdmin = async (): Promise<void> => {
  const users = readStoredUsers();
  if (users === null) {
    return;
  }
  if (users.some((user) => user.email === SEED_ADMIN_EMAIL)) {
    return;
  }

  const password = await hashPassword(SEED_ADMIN_PASSWORD);

  // Se relee antes de escribir para no pisar altas concurrentes (otra pestaña).
  const latest = readStoredUsers() ?? [];
  if (latest.some((user) => user.email === SEED_ADMIN_EMAIL)) {
    return;
  }

  const admin: IStoredUser = {
    id: createId(),
    nombre: "Administrador",
    apellido: "Food Store",
    email: SEED_ADMIN_EMAIL,
    role: "admin",
    password,
    createdAt: new Date().toISOString(),
  };

  saveStoredUsers([...latest, admin]);
};
