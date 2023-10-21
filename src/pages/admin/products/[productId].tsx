import { AddProductForm } from "@/components/interfaces/admin/products/add-product-form";
import { UpdateProductForm } from "@/components/interfaces/admin/products/edit-product-form";
import LayoutAdmin from "@/components/layouts/admin";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NextPageWithLayout } from "@/pages/_app";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";

const Page: NextPageWithLayout = () => {
  const router = useRouter();
  const productId = router.query.productId as string;

  const { data: product } = trpc.admin.products.getOne.useQuery(productId, {
    enabled: Boolean(productId),
  });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Edit product</CardTitle>
          <CardDescription>
            Edit your product information, or delete it
          </CardDescription>
        </CardHeader>
        <CardContent>
          {product ? (
            <UpdateProductForm product={product} />
          ) : (
            <p>Loading...</p>
          )}
        </CardContent>
      </Card>
    </>
  );
};

Page.getLayout = LayoutAdmin;

export default Page;
