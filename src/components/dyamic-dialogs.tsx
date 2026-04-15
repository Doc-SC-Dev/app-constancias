"use client";

import dynamic from "next/dynamic";
import type { ComponentType, ReactNode } from "react";
import type { Role } from "@/lib/authorization/permissions";
import type { User } from "@/lib/types/users";
export function createLazyDialog<T>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  loading: () => ReactNode,
  ssr: boolean,
) {
  return dynamic(importFn, {
    ssr,
    loading,
  });
}

export const LazyCreateRequestDialog = createLazyDialog<{ user: User }>(
  () =>
    import(
      "@/app/(dashboard)/dashboard/history/_components/dialog/create-request-dialog"
    ),
  () => <p>...Cargando</p>,
  false,
);
const LazyCreateUserDialogInternal = createLazyDialog(
  () => import("@/app/(dashboard)/dashboard/users/_components/newuser-dialog"),
  () => <p>...Cargando</p>,
  false,
);

const LazyCreateActivityDialogInternal = createLazyDialog(
  () =>
    import(
      "@/app/(dashboard)/dashboard/activity/_components/create-activity-dialog"
    ),
  () => <p>...Cargando</p>,
  false,
);

export function LazyCreateUserDialog({ userRole }: { userRole: Role }) {
  return <LazyCreateUserDialogInternal userRole={userRole} />;
}

export function LazyCreateActivityDialog() {
  return <LazyCreateActivityDialogInternal />;
}
