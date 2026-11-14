import { initProtectedPage } from "../../../main";
import { PRODUCTOS } from "../../../data/productos";
import type { IProduct } from "../../../types/IProduct";
import { logout } from "../../../utils/auth";
import { formatearPrecio } from "../../../utils/catalogo";
import { getElement } from "../../../utils/dom";
import "../../../styles/admin.css";

/**
 * Panel de administración.
 * Reutiliza la misma fuente de productos que el catálogo del cliente.
 */

const crearCelda = (texto: string | number): HTMLTableCellElement => {
  const celda = document.createElement("td");
  celda.textContent = String(texto);
  return celda;
};

const crearFilaProducto = (producto: IProduct): HTMLTableRowElement => {
  const fila = document.createElement("tr");

  fila.append(crearCelda(producto.id));

  const celdaImagen = document.createElement("td");
  const imagen = document.createElement("img");
  imagen.className = "tabla__imagen";
  imagen.src = producto.imagen;
  imagen.alt = producto.nombre;
  imagen.width = 50;
  imagen.loading = "lazy";
  celdaImagen.append(imagen);
  fila.append(celdaImagen);

  fila.append(crearCelda(producto.nombre));
  fila.append(crearCelda(producto.categoria));
  fila.append(crearCelda(formatearPrecio(producto.precio)));
  fila.append(crearCelda(producto.stock));

  // Acciones del HTML original sin lógica asociada: se muestran deshabilitadas.
  const celdaAcciones = document.createElement("td");
  celdaAcciones.className = "tabla__acciones";

  const crearAccionDeshabilitada = (
    texto: string,
    producto: IProduct
  ): HTMLSpanElement => {
    const accion = document.createElement("span");
    accion.className = "tabla__accion tabla__accion--deshabilitada";
    accion.textContent = texto;
    accion.title = "Acción no implementada en este práctico";
    accion.setAttribute("aria-disabled", "true");
    accion.setAttribute("aria-label", `${texto} ${producto.nombre}: no disponible`);
    return accion;
  };

  celdaAcciones.append(
    crearAccionDeshabilitada("Editar", producto),
    crearAccionDeshabilitada("Eliminar", producto)
  );
  fila.append(celdaAcciones);

  return fila;
};

// Guard: sin sesión redirige al login; con rol incorrecto, a su home.
const user = initProtectedPage("admin");

if (user) {
  const email = getElement<HTMLSpanElement>("session-email");
  if (email) {
    email.textContent = user.email;
  }

  const logoutButton = getElement<HTMLButtonElement>("logoutButton");
  logoutButton?.addEventListener("click", () => {
    logout();
  });

  const tbody = getElement<HTMLTableSectionElement>("tabla-productos");
  if (tbody) {
    const fragmento = document.createDocumentFragment();
    PRODUCTOS.forEach((producto) => {
      fragmento.append(crearFilaProducto(producto));
    });
    tbody.append(fragmento);
  }

  // El botón original no tenía comportamiento: abre y enfoca el formulario.
  const detalleFormulario = getElement<HTMLDetailsElement>("detalle-producto");
  const inputNombre = getElement<HTMLInputElement>("nombre");
  getElement<HTMLButtonElement>("nuevo-producto")?.addEventListener(
    "click",
    () => {
      if (detalleFormulario) {
        detalleFormulario.open = true;
      }
      inputNombre?.focus();
    }
  );

  // El HTML original solo maqueta el formulario, sin alta de productos.
  // Se conserva tal cual y se informa que no modifica el catálogo compartido.
  const formProducto = getElement<HTMLFormElement>("form-producto");
  const mensaje = getElement<HTMLParagraphElement>("admin-message");

  if (formProducto && mensaje) {
    formProducto.addEventListener("submit", (evento) => {
      evento.preventDefault();
      mensaje.textContent =
        "Formulario demostrativo: no guarda cambios ni modifica el catálogo compartido.";
      mensaje.hidden = false;
    });
  }
}
