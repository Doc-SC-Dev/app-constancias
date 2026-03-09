// src/types/tanstack-table.d.ts
import "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    className?: string; // Debe ser string para que el plugin lo detecte
  }
}
