import type { Rol } from "../types/Rol";

/**
 * Rutas relativas al documento actual.
 *
 * Todas las páginas viven en `src/pages/<area>/<pagina>/`, por lo que
 * cualquier página puede resolver estas rutas con el prefijo `../../`.
 * Esto funciona igual en desarrollo, en `dist` servido desde la raíz y
 * en un subpath (por ejemplo GitHub Pages), sin depender de `base`.
 */
export const ROUTES = {
  login: "../../auth/login/login.html",
  registro: "../../auth/registro/registro.html",
  clientHome: "../../client/home/home.html",
  adminHome: "../../admin/home/home.html",
} as const;

export const homeForRole = (role: Rol): string =>
  role === "admin" ? ROUTES.adminHome : ROUTES.clientHome;
