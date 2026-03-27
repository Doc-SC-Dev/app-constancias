# Clean Architecture — Capas en Next.js App Router

## Regla fundamental

Las capas internas no conocen las externas. El flujo de dependencias siempre apunta hacia adentro:

```
presentation → application → domain
infrastructure → domain (implementa contratos)
```

Ninguna capa lanza excepciones no controladas. Toda operación falible retorna `Result<T, E>`.
Importar siempre desde `@/shared/domain/Result`.

---

## Domain

**Qué va aquí:**

- Tipos e interfaces de la entidad
- Tipos de error específicos del dominio
- Reglas de negocio puras que retornan `Result` cuando pueden fallar
- Interface del repositorio con firmas que retornan `Result`

**Qué NO va aquí:**

- Ningún import de Next.js, React, librerías de fetching, ORMs, o validación externa
- `try/catch` de ningún tipo

**Ejemplo:**

```ts
// features/products/domain/Product.ts
import { Result, ok, fail } from "@/shared/domain/Result";

export interface Product {
  id: string;
  name: string;
  price: number;
  isAvailable: boolean;
}

export type ProductError =
  | { type: "NOT_FOUND"; id: string }
  | { type: "INVALID_PRICE"; price: number }
  | { type: "UNAVAILABLE"; id: string };

export function applyDiscount(
  product: Product,
  discount: number
): Result<Product, ProductError> {
  if (discount <= 0 || discount >= product.price) {
    return fail({ type: "INVALID_PRICE", price: discount });
  }
  return ok({ ...product, price: product.price - discount });
}
```

```ts
// features/products/domain/ProductRepository.ts
import { Result } from "@/shared/domain/Result";
import { Product, ProductError } from "./Product";

export interface ProductRepository {
  findById(id: string): Promise<Result<Product, ProductError>>;
  findAll(): Promise<Result<Product[], ProductError>>;
  save(product: Product): Promise<Result<void, ProductError>>;
}
```

---

## Application

**Qué va aquí:**

- Casos de uso: una función por operación de negocio
- Orquesta domain + infrastructure, retorna `Result` — nunca hace `throw`
- Recibe el repositorio por parámetro para ser testeable

**Qué NO va aquí:**

- Hooks de React
- Imports de `next/navigation`, `next/headers`, etc.
- `try/catch` — los errores ya vienen como `Result` desde infrastructure

**Ejemplo:**

```ts
// features/products/application/use-cases/getProductById.ts
import { Result, fail } from "@/shared/domain/Result";
import { Product, ProductError } from "../../domain/Product";
import { ProductRepository } from "../../domain/ProductRepository";

export async function getProductById(
  repo: ProductRepository,
  id: string
): Promise<Result<Product, ProductError>> {
  const result = await repo.findById(id);
  if (!result.ok) return result; // propaga el error sin transformar
  if (!result.value.isAvailable) {
    return fail({ type: "UNAVAILABLE", id });
  }
  return result;
}
```

---

## Infrastructure

**Qué va aquí:**

- Implementación concreta del repositorio
- **El único lugar donde se usan `try/catch`** — captura errores externos y los convierte a `Result`
- Schemas de validación que verifican datos externos antes de pasarlos al domain

**Qué NO va aquí:**

- Lógica de negocio
- Componentes o hooks

**Ejemplo:**

```ts
// features/products/infrastructure/ProductRepositoryImpl.ts
import { Result, ok, fail } from "@/shared/domain/Result";
import { Product, ProductError } from "../domain/Product";
import { ProductRepository } from "../domain/ProductRepository";
import { productSchema } from "./product.schema";

export class ProductRepositoryImpl implements ProductRepository {
  async findById(id: string): Promise<Result<Product, ProductError>> {
    try {
      const res = await fetch(`/api/products/${id}`);
      if (res.status === 404) return fail({ type: "NOT_FOUND", id });
      if (!res.ok) return fail({ type: "NOT_FOUND", id });
      const raw = await res.json();
      const parsed = productSchema.safeParse(raw);
      if (!parsed.success) return fail({ type: "NOT_FOUND", id });
      return ok(parsed.data);
    } catch {
      return fail({ type: "NOT_FOUND", id });
    }
  }

  async findAll(): Promise<Result<Product[], ProductError>> {
    try {
      const res = await fetch("/api/products");
      if (!res.ok) return fail({ type: "NOT_FOUND", id: "all" });
      const raw = await res.json();
      const products = raw
        .map((item: unknown) => productSchema.safeParse(item))
        .filter((r: { success: boolean }) => r.success)
        .map((r: { data: Product }) => r.data);
      return ok(products);
    } catch {
      return fail({ type: "NOT_FOUND", id: "all" });
    }
  }

  async save(product: Product): Promise<Result<void, ProductError>> {
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product)
      });
      if (!res.ok) return fail({ type: "NOT_FOUND", id: product.id });
      return ok(undefined);
    } catch {
      return fail({ type: "NOT_FOUND", id: product.id });
    }
  }
}
```

---

## Presentation

**Qué va aquí:**

- Componentes React (Server y Client)
- Hooks que orquestan use-cases y **abren el Result** para manejar `ok: false`
- `page.tsx` como orquestador puro — no contiene lógica de negocio ni manejo de errores directo

**Regla Result en presentation:**

- El hook es el único responsable de abrir el `Result` y traducir `error` a estado de UI
- Los componentes reciben datos ya resueltos o un prop `error` tipado — nunca reciben un `Result` directamente
- En Server Components, abrir el Result en el propio `page.tsx` y pasar props limpios al componente

**Ejemplo de hook (Client Component):**

```ts
// features/products/presentation/hooks/useProduct.ts
"use client";
import { useState, useEffect } from "react";
import { Product, ProductError } from "../../domain/Product";
import { ProductRepositoryImpl } from "../../infrastructure/ProductRepositoryImpl";
import { getProductById } from "../../application/use-cases/getProductById";

type State =
  | { status: "loading" }
  | { status: "success"; product: Product }
  | { status: "error"; error: ProductError };

export function useProduct(id: string) {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    const repo = new ProductRepositoryImpl();
    getProductById(repo, id).then((result) => {
      if (result.ok) {
        setState({ status: "success", product: result.value });
      } else {
        setState({ status: "error", error: result.error });
      }
    });
  }, [id]);

  return state;
}
```

**Ejemplo de Server Component (page.tsx):**

```tsx
// src/app/products/[id]/page.tsx
import { ProductRepositoryImpl } from "@/features/products/infrastructure/ProductRepositoryImpl";
import { getProductById } from "@/features/products/application/use-cases/getProductById";
import { ProductDetail } from "@/features/products/presentation/components/ProductDetail";
import { notFound } from "next/navigation";

export default async function ProductPage({
  params
}: {
  params: { id: string };
}) {
  const repo = new ProductRepositoryImpl();
  const result = await getProductById(repo, params.id);

  if (!result.ok) {
    if (result.error.type === "NOT_FOUND") notFound();
    // otros tipos de error pueden redirigir o lanzar según convenga
  }

  return <ProductDetail product={result.value} />;
}
```
