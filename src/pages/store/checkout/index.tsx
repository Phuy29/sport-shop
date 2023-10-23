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
import { ProductCard } from "@/components/interfaces/store/product-card";

const Page: NextPageWithLayout = () => {
  return (
    <Shell>
      <PageHeader>
        <PageHeaderHeading size="sm">Checkout</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          Buy products from our store
        </PageHeaderDescription>
      </PageHeader>
    </Shell>
  );
};

Page.getLayout = LayoutSite;

export default Page;