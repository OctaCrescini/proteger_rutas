import type { IUser } from "./types/IUser";
import type { Rol } from "./types/Rol";
import { getSession, SESSION_KEY } from "./utils/localStorage";
import { navigate } from "./utils/navigate";
import { homeForRole, ROUTES } from "./utils/routes";

/**
 * Guard central de rutas.
 *
 * Se ejecuta al cargar cada página protegida, por lo que cubre:
 * - ingreso directo por URL,
 * - recarga,
 * - apertura en pestaña nueva.
 *
 * Además revalida al restaurar desde bfcache (botón Atrás) y cuando
 * la sesión cambia en otra pestaña.
 */

const revealApp = (): void => {
  document.getElementById("app")?.removeAttribute("hidden");
};

const enforceRole = (requiredRole: Rol): IUser | null => {
  const session = getSession();

  if (!session) {
    navigate(ROUTES.login);
    return null;
  }

  if (session.role !== requiredRole) {
    navigate(homeForRole(session.role));
    return null;
  }

  return session;
};

/**
 * Debe invocarse al inicio de cada página privada.
 * Devuelve la sesión válida o null si ya se redirigió.
 */
export const initProtectedPage = (requiredRole: Rol): IUser | null => {
  const session = enforceRole(requiredRole);

  if (session) {
    revealApp();
  }

  window.addEventListener("pageshow", (event: PageTransitionEvent) => {
    if (!event.persisted) {
      return;
    }
    if (enforceRole(requiredRole)) {
      revealApp();
    }
  });

  window.addEventListener("storage", (event: StorageEvent) => {
    if (event.key !== null && event.key !== SESSION_KEY) {
      return;
    }
    if (enforceRole(requiredRole)) {
      revealApp();
    }
  });

  return session;
};

/**
 * Para páginas públicas (login y registro): si ya hay sesión, redirige
 * al home del rol correspondiente.
 */
export const initPublicPage = (): IUser | null => {
  const session = getSession();

  if (session) {
    navigate(homeForRole(session.role));
    return session;
  }

  revealApp();

  window.addEventListener("pageshow", (event: PageTransitionEvent) => {
    if (!event.persisted) {
      return;
    }
    const current = getSession();
    if (current) {
      navigate(homeForRole(current.role));
      return;
    }
    revealApp();
  });

  return null;
};
