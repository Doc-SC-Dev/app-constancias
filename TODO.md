# Plan de Implementación: `createCertificateAction`

Este documento detalla los pasos exactos y concretos para implementar la Server Action encargada de guardar un certificado nuevo en la base de datos utilizando el nuevo modelo polimórfico `CertificateTemplate`.

## 1. Validación de Entrada (Backend Security)

- [x] Importar el esquema `certificateCreateSchema` desde `@/lib/types/certificate`.
- [x] Importar la clase `Result` desde `@/shared/core/Result`.
- [x] Procesar `data` verificando contra el esquema de ArkType (`certificateCreateSchema(data)`).
- [x] Si la validación falla, retornar usando el patrón Result: `return Result.fail("Datos de formulario inválidos").serialize()`.

## 2. Definición y Construcción de los Registros `CertificateTemplate`

No crearemos entidades dispersas. Aprovecharemos Prisma para enviar un arreglo de la relación `template` directamente durante la creación del certificado.

- [x] Crear una variable let vacía: `let templatesToCreate: any[] = [];`
- [x] **Caso `templateLocation === 'role'`**:
  - [x] Iterar `data.roles`.
  - [x] Por cada rol, agregar al arreglo un objeto con formato: `{ role: rolSeleccionado.name, template: rolSeleccionado.template }`.
- [x] **Caso `templateLocation === 'activity'`**:
  - [x] Iterar `data.activityTypes`.
  - [x] Por cada actividad, agregar al arreglo un objeto con formato: `{ activityTypeId: actividad.id, template: actividad.template }`.
  - _Nota Arquitectónica: Al asignarle solo el `activityTypeId` estamos indicando que esta plantilla es global para TODOS los participantes que hayan cursado esa actividad._
- [x] **Caso `templateLocation === 'participant'`**:
  - [x] Iterar `data.participantTypes`.
  - [x] Por cada tipo de participante, agregar al arreglo un objeto con formato: `{ participantTypeId: participante.id, template: participante.template }`.
  - _Nota Arquitectónica: Al tener el `participantTypeId`, al consultar a futuro Prisma permitirá hacer el join con `ActivityType` como acordamos en el diseño del dashboard._

## 3. Transacción en Base de Datos (Insertar Certificado + Plantillas)

Aprovechando que usamos tablas unificadas, no necesitamos transacciones complejas. Prisma nos permite hacer una "inserción anidada" (Nested Write) atómica en un solo query.

- [x] Ejecutar `await prisma.certificate.create(...)`.
- [x] Dentro de la data de creación, establecer el nombre base: `name: data.name`.
- [x] En la misma configuración de la data, crear la relación con sus dependientes insertando el Array que construimos antes:
  ```typescript
  template: {
    create: templatesToCreate;
  }
  ```
- _Opcional: Si necesitas manejar el campo global de `roles` del modelo `Certificate` base (que por defecto es `[PROFESSOR, STUDENT]`), puedes asignar los roles directamente extrayéndolos del payload si `templateLocation` era `"role"`, o puedes omitirlo y dejar el Default._

## 4. Respuestas y Actualización de UI (Transacción)

- [x] Envolver el bloque de `prisma.certificate.create(...)` en un `try-catch`.
- [x] En caso de éxito al final de la operación, retornar usando el patrón Result: `return Result.ok("Certificado creado con éxito").serialize()`.
- [x] En caso de caer en el bloque `catch (error)`, hacer un `console.error(error)` internamente para el log del servidor y retornar un error usando el patrón Result: `return Result.fail("Error interno creando el certificado.").serialize()`.
- [x] Añadir (si es necesario) el llamado a `revalidatePath('/admin/certificate')` de Next.js (`next/cache`) ANTES de retornar el `Result.ok()`.

---

## 5. Integración del Formulario con la Server Action (Frontend)

Ahora que el motor (Server Action) está listo, necesitamos conectarlo al volante (Formulario).

- [ ] Importar `createCertificateAction` en `CreateCertificateForm.tsx`.
- [ ] Implementar `useTransition` para gestionar el estado `isPending`.
- [ ] Actualizar la función `onSubmit`:
  - [ ] Llamar a `createCertificateAction(data)`.
  - [ ] Usar `toast.success` o `toast.error` (de `sonner`) según el `Result`.
  - [ ] Opcional: Deshabilitar el botón de "Guardar" mientras `isPending` es true.

**Tip Senior:** Recuerda que `createCertificateAction` devuelve un objeto serializado. Usa el campo `isSuccess` para decidir qué toast mostrar. Puedes usar `form.reset()` si el resultado es exitoso.

---

## 6. Página de Detalles del Certificado (`/admin/certificate/[id]`)

Refinamiento de la visualización y gestión del ciclo de vida del certificado.

- [ ] **Refactor de Acciones**: En `[id]/actions.ts`, actualizar `findCertificateById` para usar `Result.ok().serialize()`. Asegurar el mapeo de `participantTypes` y `activityTypes` al tipo `Certificate` del frontend.
- [ ] **Acción de Borrado**: Implementar `deleteCertificateAction(id: string)` en `[id]/actions.ts` usando `db.certificate.delete` y `revalidatePath`.
- [ ] **UI de Confirmación**: Implementar `AlertDialog` de Radix en la página de detalles para confirmar el borrado.
- [ ] **Integración de Toast**: Al eliminar, mostrar `toast.success` y redirigir a `/admin?tab=certificates` usando `router.push`.
- [ ] **Navegación de Edición**: Añadir botón "Editar" persistente con `Link` hacia `/admin/certificate/[id]/edit`.

## 7. Página de Edición de Certificado (`/admin/certificate/[id]/edit`)

Flujo de edición aprovechando la lógica polimórfica existente.

- [ ] **Server Component de Edición**: Crear `edit/page.tsx` que obtenga los datos vía `findCertificateById` y los pase al formulario.
- [ ] **Refactor de `CreateCertificateForm.tsx`**:
  - [ ] Añadir props `initialData?: CertificateCreateDto` e `id?: string`.
  - [ ] Inicializar el estado del formulario con `initialData` si está presente.
  - [ ] Modificar el `onSubmit` para invocar la acción de actualización si existe un `id`.
- [ ] **Server Action de Actualización**:
  - [ ] Implementar `updateCertificateAction(id: string, data: CertificateCreateDto)`.
  - [ ] **Lógica Prisma Atómica**: Usar `db.$transaction` para limpiar los templates antiguos con `deleteMany({ where: { certificateId: id } })` e insertar los nuevos dentro del `update` del certificado.
- [ ] **Sincronización de Estado**: Revalidar tanto la lista general como la página de detalles específica tras una edición exitosa.

**Tip Senior:** Para la edición, vaciar la tabla de templates y volver a insertarlos es el patrón más seguro cuando manejas relaciones polimórficas complejas. Esto evita conflictos de IDs y lógica de "diffing" innecesaria en el servidor.
