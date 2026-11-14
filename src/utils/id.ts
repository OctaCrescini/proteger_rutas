/**
 * Identificador único para cuentas y productos.
 * randomUUID requiere contexto seguro (localhost o https).
 */
export const createId = (): string => {
  if (typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
};
