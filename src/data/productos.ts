import bebida from "../assets/img/bebida.jpg";
import hamburguesa from "../assets/img/hamburguesa.jpg";
import papas from "../assets/img/papas.jpg";
import pizza from "../assets/img/pizza.jpg";
import type { IProduct } from "../types/IProduct";

/**
 * Fuente única de productos de Food Store.
 *
 * La importan tanto el catálogo del cliente como el panel de administración,
 * de modo que ambos trabajan siempre con el mismo modelo `IProduct` y los
 * mismos datos. Las imágenes se importan para que Vite resuelva la URL
 * (con hash) tanto en desarrollo como en el build de producción.
 *
 * Datos recuperados de `TrabajoPracticoDOM/js/data.js`.
 *
 * Stock: el panel original de `TrabajoPracticoHTML/admin.html` mostraba
 * 12, 5 y 0 para los tres primeros productos. No incluía la bebida, por lo
 * que se conserva el stock 0 por no disponer de un dato real.
 */
export const PRODUCTOS: readonly IProduct[] = [
  {
    id: 1,
    nombre: "Hamburguesa simple",
    descripcion:
      "Hamburguesa Simple con Tomate, Lechuga, Queso Cheddar y Ketchup.",
    precio: 25000,
    imagen: hamburguesa,
    categoria: "Hamburguesas",
    stock: 12,
  },
  {
    id: 2,
    nombre: "Pizza Muzzarella",
    descripcion:
      "Pizza con salsa de tomate y abundante queso Muzzarella.",
    precio: 18000,
    imagen: pizza,
    categoria: "Pizzas",
    stock: 5,
  },
  {
    id: 3,
    nombre: "Papas Fritas",
    descripcion: "Papas Con Cheddar.",
    precio: 8000,
    imagen: papas,
    categoria: "Papas Fritas",
    stock: 0,
  },
  {
    id: 4,
    nombre: "Coca-Cola 500 ml",
    descripcion:
      "Bebida gaseosa sabor cola, bien fría, en botella de 500 ml.",
    precio: 3500,
    imagen: bebida,
    categoria: "Bebidas",
    stock: 0,
  },
];
