/**
 * Atajo tipado para getElementById.
 * Devuelve null si el elemento no existe, obligando a comprobarlo.
 */
export const getElement = <T extends HTMLElement>(id: string): T | null =>
  document.getElementById(id) as T | null;
