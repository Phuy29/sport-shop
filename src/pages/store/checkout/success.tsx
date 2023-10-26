import LayoutSite from "@/components/layouts/store";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { NextPageWithLayout } from "@/pages/_app";
import { Shell } from "@/components/shell";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/stores/cart";
import { useEffect } from "react";

const Page: NextPageWithLayout = () => {
  const cartStore = useCartStore((state) => ({
    clear: state.clear,
  }));

  useEffect(() => {
    cartStore.clear();
  }, []);

  return (
    <Shell>
      <PageHeader>
        <PageHeaderHeading size="sm">Checkout</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          We will contact you soon!
        </PageHeaderDescription>
      </PageHeader>
      <section
        id="cart-page-empty-cart"
        aria-labelledby="cart-page-empty-cart-heading"
        className="flex h-full flex-col items-center justify-center space-y-1 pt-16"
      >
        <CheckCircle
          className="mb-4 h-16 w-16 text-muted-foreground"
          aria-hidden="true"
        />
        <div className="text-xl font-medium text-muted-foreground">
          Order successfully!
        </div>
        <Link
          aria-label="Add items to your cart to checkout"
          href="/store/products"
          className={cn(
            buttonVariants({
              variant: "link",
              size: "sm",
              className: "text-sm text-muted-foreground",
            })
          )}
        >
          Continue to buy
        </Link>
      </section>
    </Shell>
  );
};

Page.getLayout = LayoutSite;

export default Page;
