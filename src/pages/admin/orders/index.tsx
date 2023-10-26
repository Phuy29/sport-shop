import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import LayoutAdmin from "@/components/layouts/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatPrice } from "@/lib/utils";
import { NextPageWithLayout } from "@/pages/_app";
import { Order, Product } from "@/types/admin";
import { trpc } from "@/utils/trpc";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import Link from "next/link";

const Page: NextPageWithLayout = () => {
  const { data } = trpc.admin.orders.get.useQuery();

  const columns: ColumnDef<Order>[] = [
    // {
    //   id: "select",
    //   header: ({ table }) => (
    //     <Checkbox
    //       checked={table.getIsAllPageRowsSelected()}
    //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //       aria-label="Select all"
    //       className="translate-y-[2px]"
    //     />
    //   ),
    //   cell: ({ row }) => (
    //     <Checkbox
    //       checked={row.getIsSelected()}
    //       onCheckedChange={(value) => row.toggleSelected(!!value)}
    //       aria-label="Select row"
    //       className="translate-y-[2px]"
    //     />
    //   ),
    //   enableSorting: false,
    //   enableHiding: false,
    // },
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Order Id" />
      ),
    },
    {
      accessorKey: "isPaid",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Paid" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <Badge variant="outline">{`${row.original.isPaid}`}</Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Total Price" />
      ),
      cell: ({ row }) => {
        return formatPrice(
          row.original.items.reduce((total, item) => {
            return total + Number(item.product.price);
          }, 0)
        );
      },
    },
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Create At" />
      ),
      cell: ({ row }) => {
        return format(new Date(row.original.createdAt), "dd MMM yyyy");
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              aria-label="Open menu"
              variant="ghost"
              className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
            >
              <DotsHorizontalIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuItem asChild>
              <Link href={`/admin/products/${row.original.id}`}>
                View Stripe
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/store/products/${row.original.id}`}>
                View Detail
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <>
      <Card>
        <div className="flex justify-between p-6">
          <CardHeader className="p-0">
            <CardTitle>Orders</CardTitle>
            <CardDescription>
              Here&apos;s a list of your orders!
            </CardDescription>
          </CardHeader>
        </div>
        <CardContent>
          <DataTable data={data ?? []} columns={columns} />
        </CardContent>
      </Card>
    </>
  );
};

Page.getLayout = LayoutAdmin;

export default Page;
