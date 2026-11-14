import type { IPasswordHash } from "../types/IPasswordHash";

const ALGORITHM = "PBKDF2-SHA256" as const;
const ITERATIONS = 150_000;
const SALT_BYTES = 16;
const KEY_BITS = 256;

const bytesToBase64 = (bytes: Uint8Array): string => {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
};

const base64ToBytes = (value: string): Uint8Array => {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
};

const deriveHash = async (
  password: string,
  salt: Uint8Array,
  iterations: number
): Promise<Uint8Array> => {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations,
      hash: "SHA-256",
    },
    keyMaterial,
    KEY_BITS
  );

  return new Uint8Array(bits);
};

const safeEqual = (left: string, right: string): boolean => {
  if (left.length !== right.length) {
    return false;
  }

  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
};

/**
 * Genera un hash PBKDF2-SHA256 con salt aleatorio.
 * No se almacena la contraseña en texto plano en ningún momento.
 */
export const hashPassword = async (password: string): Promise<IPasswordHash> => {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const hash = await deriveHash(password, salt, ITERATIONS);

  return {
    algorithm: ALGORITHM,
    salt: bytesToBase64(salt),
    hash: bytesToBase64(hash),
    iterations: ITERATIONS,
  };
};

/**
 * Recalcula el hash con el salt guardado y lo compara.
 * Devuelve false ante credenciales mal formadas, sin lanzar excepciones.
 */
export const verifyPassword = async (
  password: string,
  stored: IPasswordHash
): Promise<boolean> => {
  if (stored.algorithm !== ALGORITHM) {
    return false;
  }

  try {
    const salt = base64ToBytes(stored.salt);
    const candidate = await deriveHash(password, salt, stored.iterations);
    return safeEqual(bytesToBase64(candidate), stored.hash);
  } catch {
    return false;
  }
};
