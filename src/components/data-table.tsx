"use client";

import { rankItem } from "@tanstack/match-sorter-utils";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import {
  type ColumnDef,
  type FilterFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type Row,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
/* ----------- */
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PaginationResponse } from "@/lib/types/pagination";
import { cn } from "@/lib/utils";
import { EmptyPage } from "./empty-page";
import { Spinner } from "./ui/spinner";

export interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  placeholder: string;
  queryKey: string;
  queryFn: ({
    pageParam,
  }: {
    pageParam: number;
  }) => Promise<PaginationResponse<TData>>;

  createDialog?: React.ComponentType;
  emptyTitle: string;
  emptyDescription?: string;
  onDialog?: boolean;
  size?: "bg" | "md" | "sm";
  containerClassName?: string;
}

export function DataTable<TData>({
  columns,
  placeholder,
  queryKey,
  queryFn,
  createDialog: CreateDialog,
  emptyDescription,
  emptyTitle,
  onDialog = false,
  size = "bg",
  containerClassName,
}: DataTableProps<TData>) {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [globalFilter, setGlobalFilter] = useState<"">("");
  const [sorting, setSorting] = useState<SortingState>([]);

  /* ----------- */
  const { data, fetchNextPage, isFetching, isLoading } = useInfiniteQuery({
    /* ----------- */
    queryKey: [queryKey],
    queryFn: async ({ pageParam }) => await queryFn({ pageParam }),
    initialPageParam: 0,
    getNextPageParam: (
      _lastPage: PaginationResponse<TData>,
      allPages: PaginationResponse<TData>[],
    ) => allPages.length,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

  const flatData = useMemo(
    () => data?.pages.flatMap((page) => page.data) || [],
    [data],
  );

  const totalDBRowCount = data?.pages.at(0)?.totalRows || 0;
  const totalFetched = flatData.length;

  const fetchMoreOnBottomReached = useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        //once the user has scrolled within 500px of the bottom of the table, fetch more data if we can
        if (
          scrollHeight - scrollTop - clientHeight < 500 &&
          !isFetching &&
          totalFetched < totalDBRowCount
        ) {
          fetchNextPage();
        }
      }
    },
    [fetchNextPage, isFetching, totalFetched, totalDBRowCount],
  );
  useEffect(() => {
    fetchMoreOnBottomReached(tableContainerRef.current);
  }, [fetchMoreOnBottomReached]);

  const memoColumns = useMemo(() => columns, [columns]);
  const fuzzyFilter: FilterFn<TData> = (row, columnId, value, addMeta) => {
    // Rank the item
    const itemRank = rankItem(row.getValue(columnId), value);

    // Store the itemRank info
    addMeta({ itemRank });

    // Return if the item should be filtered in/out
    return itemRank.passed;
  };
  const table = useReactTable({
    data: flatData,
    columns: memoColumns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      globalFilter,
      sorting,
    },
  });

  const { rows } = table.getRowModel();

  const columnWidths = useMemo(() => {
    const widths: Record<string, number> = {};

    memoColumns.forEach((col: ColumnDef<TData>) => {
      const colId =
        col.id || (col as { accessorKey?: string; id: string }).accessorKey;
      if (!colId) return;

      let maxLen = typeof col.header === "string" ? col.header.length : 11;
      const colKey = (col as { accessorKey?: string; id: string }).accessorKey;
      if (colKey) {
        flatData.forEach((row: TData) => {
          const val = (row as Record<string, unknown>)[colKey];
          if (typeof val === "string") {
            maxLen = Math.max(maxLen, val.length);
          } else if (typeof val === "number") {
            maxLen = Math.max(maxLen, String(val).length);
          } else if (val instanceof Date) {
            maxLen = Math.max(maxLen, 12);
          }
        });
      }
      const estimated = Math.max(100, Math.min(maxLen * 8 + 48, 500));
      widths[colId] = estimated;
    });
    return widths;
  }, [flatData, memoColumns]);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 33, //estimate row height for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
    //measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement:
      typeof window !== "undefined" &&
      navigator.userAgent.indexOf("Firefox") === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  });

  const getHeight = () => {
    switch (size) {
      case "bg":
        return 600;
      case "md":
        return 300;
      case "sm":
        return 200;
      default:
        return 600;
    }
  };

  if (data?.pages.at(0)?.totalRows === 0) {
    return (
      <EmptyPage
        title={emptyTitle}
        description={emptyDescription}
        createDialog={CreateDialog}
      />
    );
  }
  return (
    <div className="container flex-1 flex flex-col mx-auto min-h-0 gap-4">
      {!onDialog && (
        <div className="flex items-end justify-between gap-4">
          <div className="grid w-full max-w-sm items-center gap-3">
            <Label htmlFor="fuzzy-input">Filtrar</Label>
            <Input
              id="fuzzy-input"
              className="max-w-sm"
              placeholder={placeholder}
              value={globalFilter ?? ""}
              onChange={(e) => table.setGlobalFilter(String(e.target.value))}
            />
          </div>
          {CreateDialog && <CreateDialog />}
        </div>
      )}
      <div
        className={cn(
          "container rounded-md border relative",
          containerClassName,
        )}
        style={
          containerClassName
            ? {
                overflow: "auto",
              }
            : { height: `${getHeight()}px`, overflow: "auto" }
        }
        ref={tableContainerRef}
        onScroll={(e) => fetchMoreOnBottomReached(e.currentTarget)}
      >
        <Table className="grid">
          <TableHeader
            className="sticky z-20 bg-background"
            style={{
              display: "grid",
              width: "100%",
              position: "sticky",
              top: 0,
            }}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="flex w-full gap-4">
                {headerGroup.headers.map((header) => {
                  const colKey = header.column.id;
                  const dynamicWidth = columnWidths[colKey];

                  return (
                    <TableHead
                      key={header.id}
                      className={cn("flex items-center", "flex-1")}
                      style={
                        dynamicWidth
                          ? { minWidth: `${dynamicWidth}px` }
                          : undefined
                      }
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody
            className={`grid relative w-full`}
            style={{
              /* ----------- */
              height: isLoading
                ? "auto"
                : `${rowVirtualizer.getTotalSize() ? rowVirtualizer.getTotalSize() : 100}px`,
            }}
          >
            {rowVirtualizer.getVirtualItems().length
              ? /* ----------- */
                rowVirtualizer
                  .getVirtualItems()
                  .map((virtualRow) => {
                    const row = rows[virtualRow.index] as Row<TData>;
                    return (
                      <TableRow
                        data-index={virtualRow.index}
                        ref={(node) => rowVirtualizer.measureElement(node)}
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        className="flex absolute w-full gap-4"
                        style={{
                          transform: `translateY(${virtualRow.start}px)`,
                        }}
                      >
                        {row.getVisibleCells().map((cell) => {
                          const colKey = cell.column.id;
                          const dynamicWidth = columnWidths[colKey];

                          return (
                            <TableCell
                              key={cell.id}
                              className={cn(
                                "flex flex-1",
                                cell.column.columnDef.meta?.className,
                              )}
                              style={
                                dynamicWidth
                                  ? { minWidth: `${dynamicWidth}px` }
                                  : undefined
                              }
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })
              : !isFetching && (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No hay resultados.
                    </TableCell>
                  </TableRow>
                )}
          </TableBody>
        </Table>
        {isFetching && !isLoading && (
          <span className="flex flex-1 justify-center items-center gap-4 pb-4">
            <Spinner /> Cargando...
          </span>
        )}
      </div>
    </div>
  );
}
