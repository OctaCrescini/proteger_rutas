export interface RegistroInput {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const normalizeEmail = (email: string): string =>
  email.trim().toLowerCase();

export const isValidEmail = (email: string): boolean =>
  EMAIL_PATTERN.test(normalizeEmail(email));

const passwordError = (password: string): string | null => {
  if (password.length < 8) {
    return "La contraseña debe tener al menos 8 caracteres.";
  }
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return "La contraseña debe incluir al menos una letra y un número.";
  }
  return null;
};

/**
 * Devuelve el primer error de validación o null si el formulario es válido.
 */
export const validateRegistro = (input: RegistroInput): string | null => {
  if (input.nombre.trim().length < 2) {
    return "Ingresá tu nombre (mínimo 2 caracteres).";
  }
  if (input.apellido.trim().length < 2) {
    return "Ingresá tu apellido (mínimo 2 caracteres).";
  }
  if (!isValidEmail(input.email)) {
    return "Ingresá un email válido.";
  }

  const passwordMessage = passwordError(input.password);
  if (passwordMessage) {
    return passwordMessage;
  }
  if (input.password !== input.confirmPassword) {
    return "Las contraseñas no coinciden.";
  }

  return null;
};

/**
 * Valida los datos mínimos del login antes de consultar las cuentas.
 */
export const validateLogin = (email: string, password: string): string | null => {
  if (email.trim().length === 0 || password.length === 0) {
    return "Completá email y contraseña.";
  }
  if (!isValidEmail(email)) {
    return "Ingresá un email válido.";
  }
  return null;
};
