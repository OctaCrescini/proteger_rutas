import type { Categoria } from "../data/categorias";

/**
 * Producto del catálogo de Food Store.
 * Es el modelo compartido por la vista de cliente y el panel de administración.
 */
export interface IProduct {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  /** URL del asset resuelta por Vite (dev y build). */
  imagen: string;
  categoria: Categoria;
  stock: number;
}
