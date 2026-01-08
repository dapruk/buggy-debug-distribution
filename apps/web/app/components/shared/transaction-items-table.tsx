import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

interface TransactionItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

interface TransactionItemsTableProps {
  items: TransactionItem[];
  showStock?: boolean;
  currentStock?: Record<string, number>;
}

export function TransactionItemsTable({
  items,
  showStock = false,
  currentStock,
}: TransactionItemsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product Name</TableHead>
          <TableHead className="text-right">Quantity</TableHead>
          <TableHead className="text-right">Price</TableHead>
          <TableHead className="text-right">Subtotal</TableHead>
          {showStock && <TableHead className="text-right">Availability</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.productId}>
            <TableCell className="font-medium">{item.name}</TableCell>
            <TableCell className="text-right">{item.quantity}</TableCell>
            <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
            <TableCell className="text-right">${(item.price * item.quantity).toFixed(2)}</TableCell>
            {showStock && (
              <TableCell className="text-right">
                {currentStock?.[item.productId] ?? "N/A"}
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
