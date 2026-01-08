import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { DataTable, type ColumnDef } from "~/components/ui/data-table";
import { fetchCustomers } from "~/lib/data/fetch-customers";

// Frontend Interface expects camelCase
interface Customer {
  id: string;
  name: string;
  // Frontend expects camelCase (phoneNumber, isActive), backend returns snake_case (phone_number, is_active).
  email: string;
}

export default function CustomerList() {
  const { data: customers = [], isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: fetchCustomers,
  });

  const [search, setSearch] = useState("");

  const filteredCustomers = customers.filter((c: any) => 
    // .includes() is case-sensitive. "budi" won't match "Budi".
    c.name.includes(search)
  );

  const columns: ColumnDef<Customer>[] = [
    {
      id: "name",
      header: "Name",
      accessorKey: "name",
    },
    {
      id: "email",
      header: "Email",
      accessorKey: "email",
    },
    {
      id: "phone",
      header: "Phone",
      accessorKey: "phoneNumber", 
      cell: (value) => value || <span className="text-muted-foreground italic">No Phone</span>,
    },
    {
      id: "status",
      header: "Status",
      cell: (value) => (
        <span className={value ? "text-green-600" : "text-red-600"}>
          {value ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
          <div className="pt-2">
            <Input 
              placeholder="Search customers..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <DataTable 
            data={filteredCustomers} 
            columns={columns} 
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
