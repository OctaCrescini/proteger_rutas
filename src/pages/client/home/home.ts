import { initProtectedPage } from "../../../main";
import {
  CATEGORIA_TODAS,
  isFiltroCategoria,
  type FiltroCategoria,
} from "../../../data/categorias";
import { PRODUCTOS } from "../../../data/productos";
import { logout } from "../../../utils/auth";
import {
  activarBotonesAgregar,
  filtrarProductos,
  marcarCategoriaActiva,
  renderCategorias,
  renderProductos,
} from "../../../utils/catalogo";
import { getElement } from "../../../utils/dom";
import "../../../styles/catalogo.css";

// Guard: sin sesión redirige al login; con rol incorrecto, a su home.
const user = initProtectedPage("client");

if (user) {
  const email = getElement<HTMLSpanElement>("session-email");
  if (email) {
    email.textContent = user.email;
  }

  const logoutButton = getElement<HTMLButtonElement>("logoutButton");
  logoutButton?.addEventListener("click", () => {
    logout();
  });

  const listaCategorias = getElement<HTMLUListElement>("lista-categorias");
  const contenedorProductos = getElement<HTMLElement>("contenedor-productos");
  const formBusqueda = getElement<HTMLFormElement>("form-busqueda");
  const inputBusqueda = getElement<HTMLInputElement>("BuscarProducto");

  if (listaCategorias && contenedorProductos && formBusqueda && inputBusqueda) {
    let filtroActivo: FiltroCategoria = CATEGORIA_TODAS;
    let terminoBusqueda = "";

    const actualizarCatalogo = (): void => {
      renderProductos(
        contenedorProductos,
        filtrarProductos(PRODUCTOS, filtroActivo, terminoBusqueda)
      );
      marcarCategoriaActiva(listaCategorias, filtroActivo);
    };

    renderCategorias(listaCategorias, filtroActivo);
    actualizarCatalogo();
    activarBotonesAgregar(contenedorProductos);

    // Filtro por categoría, delegado en la lista (igual que el original).
    listaCategorias.addEventListener("click", (evento) => {
      if (!(evento.target instanceof Element)) {
        return;
      }

      const enlace = evento.target.closest<HTMLAnchorElement>(
        "a[data-categoria]"
      );
      const categoria = enlace?.dataset.categoria;

      if (!enlace || !categoria || !isFiltroCategoria(categoria)) {
        return;
      }

      evento.preventDefault();
      filtroActivo = categoria;
      actualizarCatalogo();
    });

    // El formulario original no tenía comportamiento: se implementa una
    // búsqueda mínima por nombre o descripción para no recargar la página.
    formBusqueda.addEventListener("submit", (evento) => {
      evento.preventDefault();
      terminoBusqueda = inputBusqueda.value;
      actualizarCatalogo();
    });
  }
}
