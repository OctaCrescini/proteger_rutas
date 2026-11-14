import type { IPasswordHash } from "../types/IPasswordHash";
import type { IStoredUser } from "../types/IStoredUser";
import type { IUser } from "../types/IUser";
import { isRol } from "../types/Rol";

export const USERS_KEY = "users";
export const SESSION_KEY = "userData";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.length > 0;

const isPasswordHash = (value: unknown): value is IPasswordHash => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    value.algorithm === "PBKDF2-SHA256" &&
    isNonEmptyString(value.salt) &&
    isNonEmptyString(value.hash) &&
    typeof value.iterations === "number" &&
    Number.isFinite(value.iterations) &&
    value.iterations > 0
  );
};

export const isStoredUser = (value: unknown): value is IStoredUser => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isNonEmptyString(value.id) &&
    typeof value.nombre === "string" &&
    typeof value.apellido === "string" &&
    isNonEmptyString(value.email) &&
    isRol(value.role) &&
    isPasswordHash(value.password) &&
    typeof value.createdAt === "string"
  );
};

export const isSessionUser = (value: unknown): value is IUser => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isNonEmptyString(value.id) &&
    isNonEmptyString(value.email) &&
    isRol(value.role)
  );
};

/**
 * Lee las cuentas registradas.
 * - Devuelve [] si la clave no existe.
 * - Devuelve null si el JSON es inválido o la forma no es la esperada.
 *   En ese caso no se sobrescribe nada automáticamente.
 */
export const readStoredUsers = (): IStoredUser[] | null => {
  const raw = localStorage.getItem(USERS_KEY);
  if (raw === null) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.every(isStoredUser)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

/**
 * Cuentas registradas con recuperación segura: ante datos inválidos
 * devuelve una lista vacía en lugar de romper la aplicación.
 */
export const getStoredUsers = (): IStoredUser[] => readStoredUsers() ?? [];

export const saveStoredUsers = (users: IStoredUser[]): void => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const findStoredUserByEmail = (
  email: string
): IStoredUser | undefined =>
  getStoredUsers().find((user) => user.email === email);

/**
 * Sesión activa. Nunca contiene contraseñas ni hashes.
 * Si el contenido es inválido o está corrupto, se descarta la sesión.
 */
export const getSession = (): IUser | null => {
  const raw = localStorage.getItem(SESSION_KEY);
  if (raw === null) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isSessionUser(parsed)) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return parsed;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
};

export const saveSession = (user: IUser): void => {
  const session: IUser = {
    id: user.id,
    email: user.email,
    role: user.role,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

/**
 * Cierra la sesión activa. No elimina las cuentas registradas.
 */
export const removeSession = (): void => {
  localStorage.removeItem(SESSION_KEY);
};
