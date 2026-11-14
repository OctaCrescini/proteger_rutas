export type Rol = "client" | "admin";

export const ROLES: readonly Rol[] = ["client", "admin"];

export const isRol = (value: unknown): value is Rol =>
  value === "client" || value === "admin";
