# Patrones DRY — Next.js App Router

Usar este archivo cuando encuentres duplicación que no encaje con las reglas básicas del SKILL.md.

---

## Patrón 1 — Lógica de fetching duplicada entre features

**Síntoma:** Dos features distintos hacen `fetch` al mismo endpoint o consultan la misma tabla.

**Solución:** Extraer un repositorio compartido en `src/shared/infrastructure/`.

```
src/
└── shared/
    └── infrastructure/
        └── UserRepositoryImpl.ts   # usado por features/orders y features/profile
```

Regla: `shared/` solo contiene infraestructura e interfaces de domain. Nunca componentes ni hooks.

---

## Patrón 2 — Tipos duplicados entre features

**Síntoma:** `User` definido en `features/auth/domain/` y redefinido parcialmente en `features/profile/domain/`.

**Solución:** Mover la entidad base a `src/shared/domain/` y extender en cada feature si es necesario.

```ts
// src/shared/domain/User.ts
export interface User {
  id: string;
  email: string;
}

// src/features/profile/domain/ProfileUser.ts
import { User } from "@/shared/domain/User";
export interface ProfileUser extends User {
  avatarUrl: string;
  bio: string;
}
```

---

## Patrón 3 — Componentes UI duplicados entre features

**Síntoma:** `ButtonLoading.tsx` copiado en tres features distintos.

**Solución:** Mover a `src/shared/presentation/components/`. No crear una librería de componentes nueva — usar lo que está en `package.json` (shadcn, MUI, etc. si están presentes).

---

## Patrón 4 — Validación duplicada

**Síntoma:** El mismo schema Zod (u otra librería de validación del `package.json`) definido en múltiples lugares.

**Solución:** Un solo schema en `infrastructure/[feature].schema.ts`. Si otro feature lo necesita, importarlo directamente. Si es verdaderamente compartido, moverlo a `src/shared/infrastructure/schemas/`.

---

## Patrón 5 — Hooks con lógica de negocio repetida

**Síntoma:** Dos hooks en features distintos repiten la misma transformación o cálculo.

**Solución:** Extraer la lógica a una función pura en `application/` o `shared/application/`. Los hooks llaman esa función; no la reimplementan.

---

## Cuándo NO aplicar DRY

- **No abstraer por similitud superficial.** Si dos fragmentos parecen iguales hoy pero pertenecen a dominios distintos, dejarlos separados. La abstracción prematura crea acoplamiento artificial.
- **No compartir Server Component logic con Client Component logic** a través de un hook. Usar una función pura en `application/` como punto de convergencia.
- **No crear `utils/` genéricos.** Cada función de utilidad debe vivir en la capa y feature que la origina. Solo mover a `shared/` cuando sea usada por 2+ features reales.
