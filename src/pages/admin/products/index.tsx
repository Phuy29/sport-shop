import { columns } from "@/components/interfaces/admin/products/data-table/column";
import { DataTable } from "@/components/interfaces/admin/products/data-table/data-table";
import { taskData } from "@/components/interfaces/admin/products/data/tasks";
import LayoutAdmin from "@/components/layouts/admin";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NextPageWithLayout } from "@/pages/_app";

const Page: NextPageWithLayout = () => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>
            Here&apos;s a list of your products!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable data={taskData} columns={columns} />
        </CardContent>
      </Card>
    </>
  );
};

Page.getLayout = LayoutAdmin;

export default Page;
