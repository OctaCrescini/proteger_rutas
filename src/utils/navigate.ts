/**
 * Navegación centralizada entre páginas del MPA.
 * Las rutas son relativas al documento (ver utils/routes.ts).
 */
export const navigate = (route: string): void => {
  window.location.href = route;
};

/**
 * Navega reemplazando la entrada del historial actual.
 * Se usa al cerrar sesión para que "Atrás" no vuelva a una página privada.
 */
export const replaceWith = (route: string): void => {
  window.location.replace(route);
};
