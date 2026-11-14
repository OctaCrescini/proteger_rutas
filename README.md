# Food Store — Protección de rutas con TypeScript

Trabajo práctico integrador de **TypeScript y Autenticación**. El proyecto evoluciona la aplicación dinámica **Food Store** hacia un sistema con registro, inicio de sesión, roles (`admin` / `client`) y protección de páginas, manteniendo la arquitectura de **Vite + TypeScript** con múltiples páginas HTML.

El objetivo es demostrar, con fines exclusivamente académicos, cómo separar la lógica de autenticación de la interfaz y cómo restringir el acceso a cada vista según el rol del usuario.

---

## 🚀 Vistas principales

| Vista | Ruta (desde `src/pages/`) | Acceso |
|---|---|---|
| Login | `auth/login/login.html` | Público; redirige si ya hay sesión |
| Registro | `auth/registro/registro.html` | Público; siempre crea rol `client` |
| Catálogo | `client/home/home.html` | Solo `client` |
| Panel de administración | `admin/home/home.html` | Solo `admin` |

La raíz del sitio (`index.html`) redirige al login.

---

## 🧰 Tecnologías utilizadas

- **Vite 7** como servidor de desarrollo y empaquetador.
- **TypeScript 5.8** en modo `strict` (`noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`, `erasableSyntaxOnly`).
- **HTML5** con arquitectura multi-página (MPA).
- **CSS3** con variables, grid, flexbox y media queries.
- **Web Crypto API**: PBKDF2-SHA256 para derivar contraseñas.
- **localStorage** para cuentas y sesión.
- **pnpm 12** mediante Corepack.

No se utilizan frameworks de UI, librerías de estado ni dependencias de autenticación.

---

## 📋 Requisitos previos

- **Node.js 20.19+** (recomendado 22 o superior).
- **Corepack**, incluido con Node.js.
- No es necesario instalar `pnpm` globalmente.

---

## 📦 Instalación con pnpm

`pnpm` es el gestor oficial del proyecto. La versión está fijada en `package.json`:

```json
"packageManager": "pnpm@12.18.0"
```

Desde la raíz del repositorio:

```bash
corepack pnpm --version
corepack pnpm install --frozen-lockfile
```

> El único lockfile es `pnpm-lock.yaml`. `package-lock.json` no se utiliza.
> `pnpm-workspace.yaml` autoriza el script de compilación de `esbuild` mediante `allowBuilds`.

---

## ▶️ Cómo ejecutar el proyecto

### Desarrollo

```bash
corepack pnpm dev
```

Vite mostrará la URL local (normalmente `http://localhost:5173`). La raíz redirige al login.

### Build de producción

```bash
corepack pnpm exec tsc
corepack pnpm build
```

El resultado se genera en `dist/`.

### Vista previa del build

```bash
corepack pnpm preview
```

Abrir la URL indicada (por defecto `http://localhost:4173`). Las rutas relativas del MPA funcionan tanto en la raíz como en un subpath.

> `dist/` y `node_modules/` están excluidos por `.gitignore`.

---

## 👤 Usuarios y credenciales de demostración

La cátedra no definió una cuenta de administrador inicial. El proyecto crea una de forma **idempotente** en `src/utils/seed.ts`:

| Rol | Email | Contraseña |
|---|---|---|
| Administrador | `admin@foodstore.local` | `Admin123!` |
| Cliente | Se crea desde el formulario de registro | La elegida al registrarse |

No hay cuentas de cliente preinstaladas. Para probar el rol `client`, registrate desde el formulario con cualquier email y contraseña válidos; la cuenta se guarda en el `localStorage` del navegador utilizado.

> ⚠️ La cuenta de administrador es **exclusivamente para demostración académica**. No deben reutilizarse estas credenciales en un sistema real. En producción, el alta de administradores debe ocurrir en el backend.

El seed no duplica la cuenta si ya existe y no sobrescribe `users` si el almacenamiento está corrupto.

---

## 🔐 Roles y protección de rutas

Cada página protegida ejecuta `initProtectedPage(<rol>)` de `src/main.ts` antes de mostrar su contenido. La protección es lógica, no solo visual: no alcanza con ocultar enlaces.

| Situación | Resultado |
|---|---|
| Sin sesión → panel admin | Redirige al login |
| Sin sesión → catálogo cliente | Redirige al login |
| `client` → panel admin | Deniega y redirige al catálogo |
| `admin` → catálogo cliente | Deniega y redirige al panel |
| `admin` → panel admin | Permite |
| `client` → catálogo cliente | Permite |
| Logout | Elimina solo la sesión y vuelve al login |

La política es de **separación estricta de roles**: cada rol accede únicamente a sus vistas.

La validación se ejecuta al cargar la página, por lo que cubre:

- ingreso directo por URL,
- recarga,
- apertura en pestaña nueva,
- restauración desde el caché de retroceso (bfcache),
- cambios de sesión realizados en otra pestaña.

---

## 💾 Persistencia en localStorage

### `users` — cuentas registradas

Array de objetos `IStoredUser`:

```ts
{
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  role: "client" | "admin";
  password: {
    algorithm: "PBKDF2-SHA256";
    salt: string;
    hash: string;
    iterations: number;
  };
  createdAt: string;
}
```

Las contraseñas **nunca** se guardan en texto plano. Se derivan con:

- PBKDF2,
- SHA-256,
- salt aleatorio de 16 bytes,
- 150.000 iteraciones.

### `userData` — sesión activa

Objeto `IUser` con únicamente:

```ts
{ id: string; email: string; role: "client" | "admin" }
```

No contiene contraseñas ni hashes.

### Manejo de datos inválidos

`src/utils/localStorage.ts` valida la forma de los datos y contempla:

- claves ausentes,
- JSON corrupto,
- sesiones con forma inválida (se descartan),
- cuentas corruptas (no se sobrescriben automáticamente).

El logout elimina solo `userData`; las cuentas de `users` permanecen.

---

## 🍔 Funcionalidades del catálogo

- Cuatro productos originales: hamburguesa, pizza, papas fritas y Coca-Cola.
- Cuatro imágenes locales integradas a Vite.
- Categorías: **Hamburguesas**, **Pizzas**, **Papas Fritas**, **Bebidas** y **Todas**.
- Filtrado por categoría mediante `.filter()`.
- Búsqueda por nombre o descripción.
- Búsqueda y categoría funcionan combinadas.
- Tarjetas con imagen, categoría, nombre, descripción y precio.
- Botón **Agregar** con el `alert` original: `Producto seleccionado: <nombre>`.
- Navegación con email de la sesión y **Cerrar sesión**.
- Diseño responsive con grilla automática y categorías adaptadas a móvil.

---

## 🛠️ Panel de administración

El panel se adaptó desde `TrabajoPracticoHTML/admin.html` y conserva:

- encabezado,
- tabla de productos (ID, imagen, nombre, categoría, precio, stock y acciones),
- botón **+ Nuevo Producto**,
- formulario de alta rápida,
- pie de página.

El panel es de **solo consulta**:

- La tabla refleja la misma fuente de datos que el catálogo.
- **Editar** y **Eliminar** se muestran deshabilitados porque el práctico original no incluía su implementación.
- El formulario **Agregar Producto Rápido** es demostrativo: al enviarse muestra un mensaje y no persiste cambios.
- No se implementó CRUD porque no forma parte de los requisitos de la consigna.
- En pantallas pequeñas la tabla se desplaza horizontalmente dentro de su contenedor; el panel muestra una ayuda para acceder a todas las columnas.

---

## 🗂️ Datos compartidos

`src/data/productos.ts` es la **única fuente de productos**:

```ts
export const PRODUCTOS: readonly IProduct[] = [ ... ];
```

Tanto el catálogo como el panel importan ese array. El modelo `IProduct` (`src/types/IProduct.ts`) contiene:

```ts
{
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  categoria: Categoria;
  stock: number;
}
```

Las imágenes se importan desde `src/assets/img/`, de modo que Vite genera URLs con hash en desarrollo y en producción.

### Datos y decisiones

- **Precios:** 25.000, 18.000, 8.000 y 3.500; se muestran con formato `$25.000`.
- **Stock:** 12, 5, 0 y 0. El panel original no incluía la bebida; ante la ausencia de un dato real se conserva stock **0** para Coca-Cola.
- **Nombre:** el panel original rotulaba el tercer producto “Papas con Cheddar”; se unificó como **“Papas Fritas”**, con descripción “Papas Con Cheddar”.

---

## 📁 Estructura del proyecto

```text
/
├── index.html                      # Redirección al login
├── package.json                    # Scripts, dependencias y versión de pnpm
├── pnpm-lock.yaml                  # Lockfile oficial
├── pnpm-workspace.yaml             # allowBuilds de esbuild
├── tsconfig.json                   # TypeScript strict
├── vite.config.ts                  # Entradas del MPA
├── public/
│   └── vite.svg
├── src/
│   ├── main.ts                     # Guards: initProtectedPage / initPublicPage
│   ├── style.css
│   ├── vite-env.d.ts
│   ├── assets/
│   │   └── img/                    # Cuatro imágenes del catálogo
│   ├── data/
│   │   ├── categorias.ts           # Categorías y unión Categoria
│   │   └── productos.ts            # Fuente única de productos
│   ├── pages/
│   │   ├── admin/home/             # Panel de consulta (rol admin)
│   │   ├── auth/login/             # Login
│   │   ├── auth/registro/          # Registro (rol client)
│   │   └── client/home/            # Catálogo (rol client)
│   ├── styles/
│   │   ├── auth.css                # Login y registro
│   │   ├── catalogo.css            # Catálogo del cliente
│   │   └── admin.css               # Panel de administración
│   ├── types/
│   │   ├── IProduct.ts             # Producto compartido
│   │   ├── IPasswordHash.ts        # Credencial derivada
│   │   ├── IStoredUser.ts          # Cuenta almacenada
│   │   ├── IUser.ts                # Usuario de sesión
│   │   └── Rol.ts                  # Unión "client" | "admin"
│   └── utils/
│       ├── auth.ts                 # Registro, login y logout
│       ├── catalogo.ts             # Filtros, tarjetas y precios
│       ├── dom.ts                  # getElement tipado
│       ├── id.ts                   # Identificadores únicos
│       ├── localStorage.ts         # Persistencia y validación
│       ├── navigate.ts             # Navegación centralizada
│       ├── password.ts             # PBKDF2-SHA256 con Web Crypto
│       ├── routes.ts               # Rutas relativas del MPA
│       ├── seed.ts                 # Administrador inicial idempotente
│       └── validators.ts           # Validaciones de formularios
└── README.md
```

---

## ⚠️ Limitaciones de seguridad

Este proyecto es una práctica académica con almacenamiento local. **No es un sistema de autenticación de producción.**

- La autenticación y la autorización se ejecutan en el navegador.
- Cualquier usuario con acceso a las herramientas de desarrollo puede inspeccionar, modificar o eliminar `localStorage`.
- Los guards del frontend mejoran la experiencia y ordenan el acceso, pero no reemplazan la validación del servidor.
- `crypto.subtle` requiere un contexto seguro: funciona en `localhost` y en HTTPS, no en `file://`.
- Las credenciales de demostración están visibles en el código y en la interfaz.
- En un sistema real se debe implementar autenticación en el backend, sesiones seguras, control de acceso del servidor y altas de administradores fuera del cliente.

### Otras limitaciones funcionales

- No hay backend ni base de datos real.
- No hay CRUD de productos: el panel es de consulta y el formulario es demostrativo.
- No hay carrito ni pedidos: los enlaces “Mis Pedidos” y “Carrito” son ilustrativos y conservan el comportamiento del HTML original.
- La política de roles es estricta: el administrador no puede recorrer el catálogo del cliente.

---

## ✅ Compilación y verificación

Comandos utilizados para validar la entrega:

```bash
corepack pnpm install --frozen-lockfile
corepack pnpm exec tsc
corepack pnpm build
corepack pnpm preview
```

Comprobaciones realizadas:

- TypeScript strict sin diagnósticos.
- Build de producción correcto.
- Consola del navegador sin errores.
- Sin recursos 404.
- Imágenes cargando en desarrollo y producción.
- Rutas relativas correctas en el build.
- Pruebas funcionales de registro, login, roles, guards, logout, sesión, catálogo, filtros, búsqueda y panel.
- Revisión visual en viewports de escritorio, tablet y móvil.

---

## 🌐 Publicación en GitHub

La consigna de la cátedra requiere un **repositorio en GitHub** con un README detallado e instrucciones de instalación. El proyecto ya está preparado para publicarse.

Pasos sugeridos (no ejecutados por el asistente):

```bash
# Crear el repositorio en GitHub y luego:
git remote add origin https://github.com/<usuario>/<repositorio>.git
git add .
git commit -m "Entrega: Food Store con autenticación, roles y catálogo"
git push -u origin feature/food-store-auth
```

Luego se puede abrir un Pull Request hacia `main` o renombrar la rama según lo indique la cátedra. El README debe quedar visible en la página principal del repositorio.

> No se incluyen `node_modules/` ni `dist/`: se regeneran con `corepack pnpm install` y `corepack pnpm build`.

---

## 📌 Notas de implementación

- Los guards están centralizados en `src/main.ts`; las páginas solo declaran el rol requerido.
- Los tipos de sesión y de cuenta están separados: `IUser` nunca contiene credenciales.
- El rol del registro se asigna por código (`client`); no existe selector de rol en el formulario.
- Las rutas son relativas al documento y no dependen de `base`, por lo que funcionan en desarrollo, en `dist` servido desde la raíz y en un subpath.
- Los estilos están separados por página (`auth.css`, `catalogo.css`, `admin.css`) y usan selectores acotados para evitar conflictos.
- Los proyectos originales `TrabajoPracticoDOM` y `TrabajoPracticoHTML` se usaron como fuente de diseño y datos, pero **no fueron modificados**.
