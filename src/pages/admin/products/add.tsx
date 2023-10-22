import { Breadcrumbs } from "@/components/breadcrumbs";
import { AddProductForm } from "@/components/interfaces/admin/products/add-product-form";
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
        <Breadcrumbs
          className="pt-6 px-6"
          segments={[
            {
              title: "Products",
              href: "/admin/products",
            },
            {
              title: "New Product",
              href: `/admin/product/add`,
            },
          ]}
        />
        <CardHeader>
          <CardTitle>Add product</CardTitle>
          <CardDescription>Add a new product to your store</CardDescription>
        </CardHeader>
        <CardContent>
          <AddProductForm />
        </CardContent>
      </Card>
    </>
  );
};

Page.getLayout = LayoutAdmin;

export default Page;
