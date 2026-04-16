---
name: nextjs-clean-refactor
description: >
  Refactoriza proyectos Next.js (App Router) aplicando principios DRY y Clean
  Architecture con separación por features. Úsalo cuando el usuario pida
  refactorizar, reorganizar, limpiar o mejorar la arquitectura de un proyecto
  Next.js existente, o cuando mencione duplicación de código, separación de
  responsabilidades, capas de dominio, manejo de errores, convenciones de
  nombrado, o estructura de carpetas por features. No activar para proyectos
  nuevos sin código existente ni para debugging puntual sin intención de
  reestructurar.
---

# Next.js Clean Refactor

## Reglas críticas — leer antes de cualquier acción

- [ ] **Leer `package.json` siempre primero.** Nunca proponer una librería que no esté listada ahí.
- [ ] **No inventar dependencias.** Si la solución óptima requiere una librería ausente, implementar con lo disponible. Solo mencionar alternativas externas si el usuario pregunta explícitamente por opciones.
- [ ] **Refactoring incremental por feature.** Nunca proponer una reestructuración global. Trabajar únicamente el feature que el usuario indique.
- [ ] **Usar Result pattern para manejo de errores.** Toda operación falible en `application/` e `infrastructure/` retorna `Result<T, E>` en lugar de lanzar excepciones. Ver definición canónica abajo.
- [ ] **Aplicar convenciones de nombrado siempre.** Todo archivo y carpeta generado o modificado debe cumplir las reglas de la sección siguiente sin excepción.
- [ ] **Consultar Context7 MCP** solo cuando necesites documentación específica de una librería ya presente en `package.json` y no tengas suficiente contexto para usarla correctamente.

---

## Convenciones de nombrado

Aplicar en **todo** archivo y carpeta que se cree o modifique. Si durante la auditoría se detecta un archivo existente que viola estas reglas, mencionarlo como observación en el plan antes de ejecutar.

### Resumen rápido

| Artefacto                              | Convención   | Ejemplo                                                               |
| -------------------------------------- | ------------ | --------------------------------------------------------------------- |
| Carpetas de rutas (`src/app/`)         | `kebab-case` | `user-profile/`, `order-detail/`                                      |
| Carpetas de features (`src/features/`) | `kebab-case` | `user-profile/`, `shopping-cart/`                                     |
| Carpetas internas de feature           | `kebab-case` | `use-cases/`, `domain/`                                               |
| Archivos especiales de Next.js         | `lowercase`  | `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx` |
| Componentes React                      | `PascalCase` | `ProductCard.tsx`, `UserAvatar.tsx`                                   |
| Hooks                                  | `camelCase`  | `useProduct.ts`, `useAuthSession.ts`                                  |
| Entidades de dominio                   | `PascalCase` | `Product.ts`, `OrderRepository.ts`                                    |
| Use-cases                              | `camelCase`  | `getProductById.ts`, `createOrder.ts`                                 |
| Schemas de validación                  | `camelCase`  | `product.schema.ts`, `order.schema.ts`                                |
| Archivos de tipos compartidos          | `PascalCase` | `Result.ts`, `ApiError.ts`                                            |

### Reglas detalladas

**Rutas y carpetas — siempre `kebab-case`:**

```
src/app/
├── user-profile/
│   ├── page.tsx          ✅ archivo especial Next.js → lowercase
│   └── loading.tsx       ✅ archivo especial Next.js → lowercase
└── order-detail/
    └── [order-id]/       ✅ segmentos dinámicos también en kebab-case
        └── page.tsx
```

**Componentes — siempre `PascalCase`:**

```
features/user-profile/presentation/components/
├── UserAvatar.tsx        ✅
├── ProfileHeader.tsx     ✅
└── user-avatar.tsx       ❌
```

**Hooks — siempre `camelCase` con prefijo `use`:**

```
features/user-profile/presentation/hooks/
├── useUserProfile.ts     ✅
├── useAvatarUpload.ts    ✅
└── UseUserProfile.ts     ❌
└── use-user-profile.ts   ❌
```

**Archivos especiales de Next.js — siempre `lowercase` sin excepción:**

```
page.tsx        ✅       Page.tsx        ❌
layout.tsx      ✅       Layout.tsx      ❌
loading.tsx     ✅       Loading.tsx     ❌
error.tsx       ✅       Error.tsx       ❌
not-found.tsx   ✅       NotFound.tsx    ❌
template.tsx    ✅
route.ts        ✅
middleware.ts   ✅
```

### Verificación en el plan

Antes de ejecutar cualquier refactor, el plan mostrado al usuario debe incluir una columna de nombrado:

```
Archivo                                          Acción     Convención
─────────────────────────────────────────────────────────────────────
features/user-profile/domain/UserProfile.ts      crear      PascalCase ✅
features/user-profile/application/use-cases/
  getUserProfile.ts                              crear      camelCase  ✅
features/user-profile/presentation/hooks/
  useUserProfile.ts                              crear      camelCase  ✅
features/user-profile/presentation/components/
  ProfileHeader.tsx                              crear      PascalCase ✅
src/app/user-profile/page.tsx                    modificar  lowercase  ✅
```

---

## Result pattern — definición canónica del proyecto

Usar esta implementación en todos los features. No instalar librerías externas para esto salvo que ya estén en `package.json` (ej. `neverthrow`).

```ts
// src/shared/domain/Result.ts
export type Success<T> = { ok: true; value: T };
export type Failure<E> = { ok: false; error: E };
export type Result<T, E = string> = Success<T> | Failure<E>;

export const ok = <T>(value: T): Success<T> => ({ ok: true, value });
export const fail = <E>(error: E): Failure<E> => ({ ok: false, error });
```

**Reglas de uso:**

- `domain/` — define los tipos de error específicos del dominio como `type` o `enum`
- `application/` — los use-cases retornan `Result<T, DomainError>`, nunca hacen `throw`
- `infrastructure/` — captura excepciones de red/ORM/validación y las convierte a `Result`
- `presentation/` — es el único lugar donde se "abre" el Result y se maneja el caso `ok: false` para mostrar feedback al usuario

Lee `references/clean-architecture-layers.md` **solo si** necesitas ver ejemplos concretos de Result aplicado en cada capa o el usuario pregunta sobre responsabilidades entre capas.

---

## Pipeline de trabajo

Para cada feature que se pida refactorizar, seguir este orden sin saltarse pasos:

- [ ] **1. Leer `package.json`** — identificar librerías disponibles (estado, fetching, validación, UI, etc.)
- [ ] **2. Auditar el feature actual** — leer los archivos existentes e identificar:
  - Duplicación de lógica (DRY)
  - Mezcla de responsabilidades (Clean Architecture)
  - Acoplamiento a frameworks en capas de dominio
  - `try/catch` dispersos que deben convertirse a Result
  - Violaciones de convenciones de nombrado
- [ ] **3. Mapear a la estructura target** — definir qué archivos nuevos se crearán y cuáles se modifican, verificando convenciones de nombrado
- [ ] **4. Proponer el plan incremental** — mostrar al usuario el plan con tabla de nombrado antes de escribir código
- [ ] **5. Ejecutar capa por capa** — en el orden: `domain → application → infrastructure → presentation`
- [ ] **6. Verificar DRY, Result y nombrado post-refactor** — confirmar que no quedó lógica duplicada, excepciones no capturadas, ni archivos con nombre incorrecto

---

## Estructura target por feature

```
src/
├── shared/
│   └── domain/
│       └── Result.ts                         # PascalCase — tipo compartido
└── features/
    └── [feature-name]/                       # kebab-case
        ├── domain/                           # kebab-case
        │   ├── [Feature].ts                  # PascalCase — entidad
        │   └── [Feature]Repository.ts        # PascalCase — interface
        ├── application/
        │   └── use-cases/                    # kebab-case
        │       └── [actionName][Feature].ts  # camelCase — use-case
        ├── infrastructure/
        │   ├── [Feature]RepositoryImpl.ts    # PascalCase — implementación
        │   └── [feature].schema.ts           # camelCase — schema
        └── presentation/
            ├── components/
            │   └── [FeatureComponent].tsx    # PascalCase — componente
            ├── hooks/
            │   └── use[Feature].ts           # camelCase — hook
            └── [route-segment]/              # kebab-case
                └── page.tsx                  # lowercase — archivo especial Next.js
```

---

## Reglas DRY para Next.js App Router

1. **Server Components no comparten hooks con Client Components.** Si hay lógica compartida entre ambos, extraerla a `application/use-cases/` como función pura (sin hooks).
2. **Un solo lugar para fetching por entidad.** Todo fetch de un recurso vive en `infrastructure/[Feature]RepositoryImpl.ts`.
3. **Tipos y esquemas una sola vez.** La entidad en `domain/[Feature].ts` es la única fuente de verdad de tipos.
4. **Hooks de presentación sin lógica de negocio.** Los `hooks/use[Feature].ts` solo orquestan llamadas a use-cases, manejan estado UI, y procesan el `Result` recibido.
5. **`Result.ts` nunca se duplica.** Existe una sola vez en `src/shared/domain/Result.ts`. Todos los features lo importan desde ahí.

Lee `references/dry-patterns.md` **solo si** encuentras un patrón de duplicación que no encaje con las reglas anteriores.

---

## Uso de Context7 MCP

Consultar Context7 **únicamente** cuando:

- La librería está en `package.json` y necesitas conocer una API específica que no recuerdas con certeza
- El comportamiento de la librería puede haber cambiado entre versiones y la versión en `package.json` es relevante

No consultar Context7 para librerías estándar de Next.js (`next`, `react`, `react-dom`).

---

## Comunicación con el usuario

- Mostrar siempre el **plan de archivos con tabla de nombrado** antes de escribir código
- Indicar explícitamente **qué capa se está trabajando** en cada bloque de código
- Si se detecta un `try/catch` que debería convertirse a Result fuera del feature actual, **mencionarlo como observación** sin modificarlo
- Si se detecta una violación de nombrado fuera del feature actual, **mencionarlo como observación** sin modificarlo
- Nunca modificar archivos fuera del feature solicitado salvo confirmación explícita del usuario
