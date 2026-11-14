import type { IStoredUser } from "../types/IStoredUser";
import type { IUser } from "../types/IUser";
import { createId } from "./id";
import {
  findStoredUserByEmail,
  getStoredUsers,
  removeSession,
  saveSession,
  saveStoredUsers,
} from "./localStorage";
import { replaceWith } from "./navigate";
import { hashPassword, verifyPassword } from "./password";
import { ROUTES } from "./routes";
import { ensureSeedAdmin } from "./seed";
import {
  normalizeEmail,
  validateLogin,
  validateRegistro,
  type RegistroInput,
} from "./validators";

export type AuthResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

const CREDENTIALS_ERROR = "Email o contraseña incorrectos.";
const DUPLICATED_EMAIL_ERROR =
  "Ya existe una cuenta registrada con ese email.";

/**
 * Alta de cliente.
 * El rol se asigna siempre por código ("client"): el formulario no puede
 * elegirlo ni modificarlo.
 */
export const registerUser = async (
  input: RegistroInput
): Promise<AuthResult<IUser>> => {
  await ensureSeedAdmin();

  const validationError = validateRegistro(input);
  if (validationError) {
    return { ok: false, error: validationError };
  }

  const email = normalizeEmail(input.email);
  if (findStoredUserByEmail(email)) {
    return { ok: false, error: DUPLICATED_EMAIL_ERROR };
  }

  const password = await hashPassword(input.password);

  // Segunda comprobación: el hash tarda y otra pestaña pudo registrar el email.
  const users = getStoredUsers();
  if (users.some((user) => user.email === email)) {
    return { ok: false, error: DUPLICATED_EMAIL_ERROR };
  }

  const stored: IStoredUser = {
    id: createId(),
    nombre: input.nombre.trim(),
    apellido: input.apellido.trim(),
    email,
    role: "client",
    password,
    createdAt: new Date().toISOString(),
  };

  saveStoredUsers([...users, stored]);

  return {
    ok: true,
    data: { id: stored.id, email: stored.email, role: stored.role },
  };
};

/**
 * Autenticación real contra las cuentas registradas.
 * El rol de la sesión proviene de la cuenta, nunca del formulario.
 */
export const loginUser = async (
  emailInput: string,
  password: string
): Promise<AuthResult<IUser>> => {
  await ensureSeedAdmin();

  const validationError = validateLogin(emailInput, password);
  if (validationError) {
    return { ok: false, error: validationError };
  }

  const email = normalizeEmail(emailInput);
  const stored = findStoredUserByEmail(email);
  if (!stored) {
    return { ok: false, error: CREDENTIALS_ERROR };
  }

  const isValid = await verifyPassword(password, stored.password);
  if (!isValid) {
    return { ok: false, error: CREDENTIALS_ERROR };
  }

  const session: IUser = {
    id: stored.id,
    email: stored.email,
    role: stored.role,
  };
  saveSession(session);

  return { ok: true, data: session };
};

/**
 * Cierra la sesión activa y vuelve al login.
 * Las cuentas registradas permanecen intactas.
 */
export const logout = (): void => {
  removeSession();
  replaceWith(ROUTES.login);
};
