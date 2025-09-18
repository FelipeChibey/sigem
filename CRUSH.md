CRUSH quickstart for agents working in this repo

Stack
- Next.js 15 (App Router), React 19, TypeScript 5, ESLint 9 (flat config), Tailwind CSS 4
- Path alias: @/* -> src/*

Install/build/run
- Install: npm i
- Dev: npm run dev (Next + Turbopack on http://localhost:3000)
- Build: npm run build (Turbopack)
- Start prod: npm start

Lint/typecheck/format
- Lint all: npm run lint
- Lint specific file: npx eslint path/to/file.{ts,tsx}
- Typecheck: npx tsc --noEmit
- Format: use Prettier defaults if present; otherwise follow rules below (no formatter script defined)

Testing
- No test framework configured. If you add tests, prefer Vitest or Jest. Example single test run: npx vitest run path/to/test.spec.ts or npx jest path/to/test.test.ts.

Code style guidelines
- Imports: use type-only imports for types (import type { X }); absolute imports via @/ for src; group as: built-ins, external, internal(@/), then relative; no default-export unless React components/pages; prefer named exports.
- Formatting: 2-space indent; semicolons required; single quotes in TS/JS, double quotes in JSON; trailing commas where valid; max line ~100-120.
- Types: strict TypeScript enabled; avoid any; prefer unknown over any; narrow with type guards; define interfaces for object shapes; reuse Next.js/React types from next and react.
- React/Next: Server Components by default; use 'use client' only when needed; keep components small and pure; prefer async server functions; avoid fetch in client unless necessary.
- Naming: camelCase for variables/functions; PascalCase for React components/types; UPPER_SNAKE_CASE for env constants; files kebab-case for non-components, PascalCase for components.
- Error handling: never swallow errors; throw new Error with message (no console logs in prod paths); in API/server actions return typed Result objects or throw and handle at boundary; validate inputs (zod or similar) before use.
- State/data: prefer React useState/useReducer minimally in client; cache/fetch on server; use Suspense for data fetching components.
- CSS: Tailwind CSS v4; keep globals in src/app/globals.css; co-locate component styles; avoid arbitrary values when a token exists.

Project conventions
- ESLint config extends next/core-web-vitals and next/typescript; respect its rules, fix warnings before commit.
- tsconfig uses "moduleResolution": "bundler"; do not rely on Node-style path resolution outside that model.
- Env: do not hardcode secrets; if you add envs, document them in .env.example and reference via process.env only on server.

Cursor/Copilot rules
- No Cursor or Copilot instruction files found in this repo. If added later (.cursor/rules/, .cursorrules, .github/copilot-instructions.md), mirror their key points here.

## Prompt
Actúa como un desarrollador full-stack experto en Next.js. Tu tarea es generar el código completo para un módulo funcional que implemente un sistema de gestión de naves, aeronaves y pasajeros, basándote en los tres modelos de diseño de WebRatio (Dominio, Acciones y Vistas).

1. Stack Tecnológico

La solución debe utilizar Next.js (App Router) + TypeScript + Prisma (PostgreSQL) + shadcn/ui + Zod.

2. Requisitos de Salida

Genera el código para los siguientes archivos, asegurando que las dependencias y la lógica de negocio se integren de manera cohesiva:
-	schema.prisma con todos los modelos necesarios y la tabla de unión.
-	src/types/domain.ts con interfaces de TypeScript que reflejen el modelo de dominio.
-	src/backend/index.ts con todas las Server Actions y lógica de negocio.
-	prisma/seed.ts con datos de ejemplo coherentes.
-	Un servicio de ejemplo en src/backend/services.ts para calcular los atributos derivados.
-	Un fragmento de package.json con las dependencias y scripts necesarios.
-	Un archivo src/app/page.tsx para la navegación principal.
-	Archivos page.tsx para cada una de las vistas solicitadas, ubicados en sus respectivas carpetas (src/app/.../page.tsx).

3. Modelo de Dominio (WebRatio style)

Traduce el siguiente modelo de dominio a un esquema de Prisma y sus tipos de TypeScript, siguiendo las reglas de modelado para asegurar la validez y la integridad de los datos.

Entidades del Modelo:

-	NaveNodriza: oid (integer, PK), nombre (string). Tiene 2 relaciones 1:N con Aeronave (una para el origen y otra para el destino).
-	Aeronave: oid (integer, PK), nombre (string), capacidadMaxima (integer). Posee atributos derivados (capacidadActual, capacidadRestante) no persistentes. Se relaciona N:1 con NaveNodriza (origen y destino), y 1:N con Pasajero y Revisión.
-	Pasajero: oid (integer, PK), nombre (string). Se relaciona N:1 con Aeronave y N:M con Revisión (vía tabla de unión).
-	Revisión: oid (integer, PK), nombreRevisor (string), fecha (date). Se relaciona N:1 con Aeronave y N:M con Pasajero (vía tabla de unión). Restricción: solo puede haber una Revisión por día y por Aeronave.

4. Modelo de Acciones (WebRatio style)

Implementa las siguientes lógicas de negocio en un único archivo src/backend/index.ts utilizando use server y Prisma Client. Este archivo debe incluir todas las funciones asíncronas necesarias para las siguientes operaciones.

Crear Revisión
Entradas:
-	nombreRevisor: string (nombre del revisor de la aeronave).
-	aeronaveId: number (identificador de la aeronave).
-	Fecha: Date (fecha de la revisión)
Lógica de negocio: Recibe nombreRevisor, aeronaveId, fecha. Lanza un error si ya existe una revisión para la misma Aeronave en la misma fecha y asocia a los pasajeros actualmente a bordo.


Crear Pasajero
Entradas:
-	oid: number (identificador del pasajero).
-	nombre: string (nombre del pasajero).
Lógica de Negocio: La función debe recibir el oid y el nombre del pasajero y crear un nuevo registro en la base de datos para la entidad Pasajero.

Subir Pasajero
Entradas:
-	pasajeroId: number (identificador del pasajero).
-	aeronaveId: number (identificador de la aeronave).
Lógica de negocio: Obtener la aeronave y la lista actual de pasajeros a bordo para calcular la capacidad actual. Si el número de pasajeros actual es igual o mayor que la capacidad máxima de la aeronave, lanzar un error con el mensaje: "La aeronave ha alcanzado su capacidad máxima." En caso de que haya espacio, actualizar el registro del Pasajero para asociarlo a la Aeronave. No puede subir un pasajero que ya esté a bordo de una nave.

Bajar Pasajero
Entradas:
-	pasajeroId: number (ID del pasajero).
Lógica de Negocio: La función debe recibir el pasajeroId y actualizar el registro de la entidad Pasajero en la base de datos, desasociándolo de cualquier Aeronave a la que esté vinculado.

Crear Aeronave
Entradas:
-	Nombre: string (nombre de la aeronave).
-	capacidadMaxima: number (capacidad máxima de la aeronave).
-	origenId: number (Origen de la aeronave).
-	destinoId: number (Destino de la aeronave).
Lógica de negocio: Verificar que las NaveNodriza con origenId y destinoId existan. Si alguna no existe, lanzar un error. Crear una nueva Aeronave y asociarla con las NaveNodriza de origen y de destino.

Crear Nave Nodriza
Entradas:
-	nombre: string (nombre de la nave nodriza)
Lógica de Negocio: La función debe recibir el nombre de la nave nodriza y crear un nuevo registro para la entidad NaveNodriza en la base de datos.


5. Modelo de Vistas (WebRatio style)

Genera los componentes de interfaz de usuario de Next.js para las siguientes vistas, asegurando una correcta navegación entre ellas. Utiliza Server Components para las operaciones de lectura de datos y forms con acciones locales para las operaciones de creación y actualización. Para el estilo visual, utiliza el framework shadcn/ui y sus componentes para construir la interfaz y Tailwind CSS para asegurar un diseño limpio y una estética consistente en toda la aplicación.

Página Principal: Un componente Page con un menú de navegación con enlaces a todas las demás vistas.

Vistas de Formulario:
-	Crear nave nodriza: Un EntryUnit para los campos de entrada. El form debe invocar la Server Action crearNaveNodriza.
-	Crear Aeronave: Un EntryUnit similar para la creación de aeronaves. Invoca la Server Action crearAeronave.
-	Gestionar pasajeros: Dos EntryUnits separados, cada uno con su propio <form>, para las acciones de subirPasajero y bajarPasajero.
-	Crear pasajero: Un EntryUnit para crear un pasajero.
-	Crear revisión: Un EntryUnit que incluye un selector de fecha. Invoca la Server Action crearRevision.

Vistas de Listado (PowerIndexUnit):
-	Ver naves nodrizas: Un Server Component que obtiene todas las naves nodrizas y las muestra en una Tabla.
-	Ver aeronaves: Un Server Component que lista todas las aeronaves en una Tabla, incluyendo los atributos derivados (capacidadActual, capacidadRestante), los cuales se deben calcular en el backend. Cada fila de la tabla debe contener un enlace para ver los detalles de la aeronave específica, navegando a la ruta aeronave-detail/[id].
-	Ver pasajeros: Un Server Component que lista todos los pasajeros en una Tabla.
-	Ver revisiones: Un Server Component que lista todas las revisiones en una Tabla.

Vistas de Detalle (DataUnit):
-	Detalle aeronave: Esta vista debe ser una ruta dinámica. El Server Component debe leer el id de los props de la URL, buscar en la base de datos la aeronave correspondiente y los pasajeros asociados. Muestra los detalles de la aeronave en un Card de shadcn/ui y la lista de pasajeros a bordo en una Tabla.
