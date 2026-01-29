"use client";

import dynamic from "next/dynamic";
import type { JSX } from "react";
import type { DataTableProps } from "./data-table";

const LazyDataTableInner = dynamic(
  () => import("./data-table").then((mod) => ({ default: mod.DataTable })),
  {
    ssr: false,
    loading: () => <p>...loading</p>,
  },
) as <TData>(props: DataTableProps<TData>) => JSX.Element;

export function LazyDataTable<TData>(props: DataTableProps<TData>) {
  return <LazyDataTableInner {...props} />;
}
