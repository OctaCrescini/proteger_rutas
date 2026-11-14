import {
  CATEGORIA_TODAS,
  CATEGORIAS,
  type FiltroCategoria,
} from "../data/categorias";
import type { IProduct } from "../types/IProduct";

/**
 * Utilidades de presentación del catálogo.
 * Se comparten entre la vista de cliente y el panel de administración para
 * no duplicar formato ni lógica de filtrado.
 */

/** Formato original del catálogo: 25000 -> "$25.000". */
export const formatearPrecio = (precio: number): string =>
  `$${precio.toLocaleString("es-AR")}`;

/**
 * Devuelve los productos que pertenecen al filtro elegido y, opcionalmente,
 * cuyo nombre o descripción contiene el término buscado.
 *
 * "Todas" no excluye por categoría, pero el término de búsqueda sigue
 * aplicándose. Se usa `.filter()` en todos los casos.
 */
export const filtrarProductos = (
  productos: readonly IProduct[],
  filtro: FiltroCategoria,
  termino = ""
): IProduct[] => {
  const busqueda = termino.trim().toLowerCase();

  return productos.filter((producto) => {
    const coincideCategoria =
      filtro === CATEGORIA_TODAS || producto.categoria === filtro;
    const coincideBusqueda =
      busqueda.length === 0 ||
      producto.nombre.toLowerCase().includes(busqueda) ||
      producto.descripcion.toLowerCase().includes(busqueda);

    return coincideCategoria && coincideBusqueda;
  });
};

const escaparHtml = (valor: string): string =>
  valor.replace(
    /[&<>"']/g,
    (caracter) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[caracter] ?? caracter
  );

/** Arma el `<article>` de un producto con la estructura del catálogo original. */
const crearTarjetaProducto = (producto: IProduct): HTMLElement => {
  const articulo = document.createElement("article");
  articulo.className = "producto";
  articulo.dataset.id = String(producto.id);

  articulo.innerHTML = `
    <img class="producto__imagen" src="${escaparHtml(producto.imagen)}" alt="${escaparHtml(producto.nombre)}" loading="lazy">
    <div class="producto__cuerpo">
      <span class="producto__categoria">${escaparHtml(producto.categoria)}</span>
      <h3 class="producto__nombre">${escaparHtml(producto.nombre)}</h3>
      <p class="producto__descripcion">${escaparHtml(producto.descripcion)}</p>
      <p class="producto__precio">Precio: <strong>${formatearPrecio(producto.precio)}</strong></p>
      <div class="producto__acciones">
        <button type="button" class="boton boton--primario" data-accion="agregar" data-nombre="${escaparHtml(producto.nombre)}">Agregar</button>
      </div>
    </div>
  `;

  return articulo;
};

/** Reemplaza el contenido del contenedor con las tarjetas recibidas. */
export const renderProductos = (
  contenedor: HTMLElement,
  productos: readonly IProduct[]
): void => {
  contenedor.innerHTML = "";

  if (productos.length === 0) {
    const vacio = document.createElement("p");
    vacio.className = "catalogo__vacio";
    vacio.textContent =
      "No se encontraron productos para la categoría o búsqueda elegida.";
    contenedor.append(vacio);
    return;
  }

  const fragmento = document.createDocumentFragment();
  productos.forEach((producto) => {
    fragmento.append(crearTarjetaProducto(producto));
  });
  contenedor.append(fragmento);
};

/** Genera la lista de categorías, incluyendo "Todas" al principio. */
export const renderCategorias = (
  lista: HTMLElement,
  filtroActivo: FiltroCategoria
): void => {
  lista.innerHTML = "";

  const opciones: FiltroCategoria[] = [CATEGORIA_TODAS, ...CATEGORIAS];
  const fragmento = document.createDocumentFragment();

  opciones.forEach((categoria) => {
    const item = document.createElement("li");
    const enlace = document.createElement("a");

    enlace.href = "#";
    enlace.className = "categoria__enlace";
    enlace.dataset.categoria = categoria;
    enlace.textContent = categoria;
    enlace.classList.toggle(
      "categoria__enlace--activa",
      categoria === filtroActivo
    );

    if (categoria === filtroActivo) {
      enlace.setAttribute("aria-current", "true");
    }

    item.append(enlace);
    fragmento.append(item);
  });

  lista.append(fragmento);
};

/** Marca visual y semánticamente la categoría seleccionada. */
export const marcarCategoriaActiva = (
  lista: HTMLElement,
  filtroActivo: FiltroCategoria
): void => {
  const enlaces =
    lista.querySelectorAll<HTMLAnchorElement>("a[data-categoria]");

  enlaces.forEach((enlace) => {
    const activa = enlace.dataset.categoria === filtroActivo;
    enlace.classList.toggle("categoria__enlace--activa", activa);
    if (activa) {
      enlace.setAttribute("aria-current", "true");
    } else {
      enlace.removeAttribute("aria-current");
    }
  });
};

/**
 * Delega el click de los botones "Agregar" y muestra el alert original
 * del catálogo de la cátedra.
 */
export const activarBotonesAgregar = (contenedor: HTMLElement): void => {
  contenedor.addEventListener("click", (evento) => {
    if (!(evento.target instanceof Element)) {
      return;
    }

    const boton = evento.target.closest<HTMLButtonElement>(
      'button[data-accion="agregar"]'
    );

    if (!boton) {
      return;
    }

    alert(`Producto seleccionado: ${boton.dataset.nombre ?? ""}`);
  });
};
