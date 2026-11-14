/**
 * Categorías del catálogo. La unión `Categoria` se deriva del array,
 * de modo que agregar o quitar una categoría mantiene los tipos alineados.
 */
export const CATEGORIAS = [
  "Hamburguesas",
  "Pizzas",
  "Papas Fritas",
  "Bebidas",
] as const;

export type Categoria = (typeof CATEGORIAS)[number];

/** Opción que muestra el catálogo completo. */
export const CATEGORIA_TODAS = "Todas";

export type FiltroCategoria = Categoria | typeof CATEGORIA_TODAS;

export const isCategoria = (value: string): value is Categoria =>
  (CATEGORIAS as readonly string[]).includes(value);

export const isFiltroCategoria = (value: string): value is FiltroCategoria =>
  value === CATEGORIA_TODAS || isCategoria(value);
