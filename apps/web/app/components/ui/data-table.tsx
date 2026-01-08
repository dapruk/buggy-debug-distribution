import { type ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Skeleton } from "~/components/ui/skeleton";

export interface ColumnDef<T> {
  id: string;
  header: string | ReactNode;
  accessorKey?: keyof T;
  accessorFn?: (row: T) => ReactNode;
  cell?: (value: any, row: T) => ReactNode;
  className?: string;
  headerClassName?: string;
}

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  emptyMessage?: string;
  isLoading?: boolean;
  className?: string;
  keyFn?: (row: TData, index: number) => string | number;
}

export function DataTable<TData>({
  columns,
  data,
  className,
  keyFn,
  emptyMessage = "No results.",
  isLoading = false,
}: DataTableProps<TData>) {
  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table className={className}>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.id} className={column.headerClassName}>
                  {typeof column.header === "string" ? column.header : column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {columns.map((column, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <Table className={className}>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.id} className={column.headerClassName}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={columns.length} className="text-muted-foreground py-8 text-center">
              {emptyMessage}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  return (
    <Table className={className}>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.id} className={column.headerClassName}>
              {column.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, index) => {
          const key = keyFn ? keyFn(row, index) : index;
          return (
            <TableRow key={key}>
              {columns.map((column) => {
                let cellContent: ReactNode = null;

                if (column.cell) {
                  const value = column.accessorKey
                    ? (row as any)[column.accessorKey]
                    : column.accessorFn?.(row);
                  cellContent = column.cell(value, row);
                } else if (column.accessorFn) {
                  cellContent = column.accessorFn(row);
                } else if (column.accessorKey) {
                  cellContent = (row as any)[column.accessorKey];
                }

                return (
                  <TableCell key={`${key}-${column.id}`} className={column.className}>
                    {cellContent}
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export function useColumns<T extends Record<string, any>>(cols: ColumnDef<T>[]): ColumnDef<T>[] {
  return cols;
}
