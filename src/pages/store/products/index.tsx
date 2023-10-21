import LayoutSite from "@/components/layouts/store";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NextPageWithLayout } from "@/pages/_app";
import { Shell } from "@/components/shell";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { trpc } from "@/utils/trpc";
import { ProductCard } from "@/components/interfaces/store/product-card";

const Page: NextPageWithLayout = () => {
  const { data: products } = trpc.store.products.get.useQuery();

  return (
    <Shell>
      <PageHeader>
        <PageHeaderHeading size="sm">Products</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          Buy products from our store
        </PageHeaderDescription>
      </PageHeader>
      {products ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </Shell>
  );
};

Page.getLayout = LayoutSite;

export default Page;
