"use client";

import dynamic from "next/dynamic";
import type { ComponentType, ReactNode } from "react";
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
  () => import("@/app/(dashboard)/dashboard/_components/create-request-dialog"),
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

export function LazyCreateUserDialog() {
  return <LazyCreateUserDialogInternal />;
}

export function LazyCreateActivityDialog() {
  return <LazyCreateActivityDialogInternal />;
}
