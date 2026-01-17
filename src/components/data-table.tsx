"use client";

import { rankItem } from "@tanstack/match-sorter-utils";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import {
  type ColumnDef,
  type FilterFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  type Row,
  useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PaginationResponse } from "@/lib/types/pagination";
import { EmptyPage } from "./empty-page";
import { Spinner } from "./ui/spinner";

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  children: ReactNode;
  placeholder: string;
  queryKey: string;
  queryFn: ({
    pageParam,
  }: {
    pageParam: number;
  }) => Promise<PaginationResponse<TData>>;

  createDialog?: React.ComponentType<{ closeDialog: () => void }>;
  buttonLabel?: string;
  emptyTitle: string;
  emptyDescription?: string;
  onDialog?: boolean;
  size?: "bg" | "md" | "sm";
}

export function DataTable<TData>({
  columns,
  children,
  placeholder,
  queryKey,
  queryFn,
  createDialog: CreateDialog,
  buttonLabel,
  emptyDescription,
  emptyTitle,
  onDialog = false,
  size = "bg",
}: DataTableProps<TData>) {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [globalFilter, setGlobalFilter] = useState<"">("");

  const { data, fetchNextPage, isFetching } = useInfiniteQuery({
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
    state: {
      globalFilter,
    },
  });

  const { rows } = table.getRowModel();

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
        return 100;
      default:
        return 600;
    }
  };

  if (data?.pages.length === 0) {
    return (
      <EmptyPage
        title={emptyTitle}
        description={emptyDescription}
        buttonLabel={buttonLabel}
        createDialog={CreateDialog}
      />
    );
  }
  return (
    <div className="container flex flex-col mx-auto h-full gap-4">
      {!onDialog && (
        <div className="flex items-center justify-between">
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
          {children}
        </div>
      )}
      <div
        className={`container h-[${getHeight()}px] overflow-auto relative  rounded-md border`}
        ref={tableContainerRef}
        onScroll={(e) => fetchMoreOnBottomReached(e.currentTarget)}
      >
        <Table className="grid">
          <TableHeader
            style={{
              display: "grid",
              position: "sticky",
              top: 0,
              zIndex: 1,
              width: "100%",
            }}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="flex w-full gap-4">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="flex flex-1 items-center"
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
              height: `${rowVirtualizer.getTotalSize() ? rowVirtualizer.getTotalSize() : 100}px`,
            }}
          >
            {rowVirtualizer.getVirtualItems().length && !isFetching ? (
              rowVirtualizer.getVirtualItems().map((virtualRow) => {
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
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="flex w-full"
                        style={{}}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {!isFetching && "No hay resultados."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {isFetching && (
          <span className="flex flex-1 justify-center items-center gap-4 pb-4">
            <Spinner /> Cargando...
          </span>
        )}
      </div>
    </div>
  );
}
