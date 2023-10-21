import LayoutSite from "@/components/layouts/store";
import { NextPageWithLayout } from "../_app";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { trpc } from "@/utils/trpc";
import Balancer from "react-wrap-balancer";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/interfaces/store/product-card";
import { Shell } from "@/components/shell";

const Page: NextPageWithLayout = () => {
  const { data: products } = trpc.store.products.get.useQuery();
  const someProducts = products?.slice(0, 8);

  return (
    <Shell>
      <section
        id="hero"
        aria-labelledby="hero-heading"
        className="mx-auto flex w-full max-w-[64rem] flex-col items-center justify-center gap-4 py-12 text-center md:pt-28"
      >
        <p className="font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
          An e-commerce sportshop built with everythingin Next.js 13
        </p>
        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          Discover a world of athletic excellence at our sport shop, where
          passion meets precision in every product we offer.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button asChild>
            <Link href="/store/products">
              Buy now
              <span className="sr-only">Buy now</span>
            </Link>
          </Button>
        </div>
      </section>

      <section
        id="featured-products"
        aria-labelledby="featured-products-heading"
        className="space-y-6 overflow-hidden py-8 md:pt-12 lg:pt-24"
      >
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 overflow-visible text-center">
          <h2 className="font-heading text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
            Featured products
          </h2>
          <Balancer className="max-w-[46rem] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Explore products from around the world
          </Balancer>
        </div>
        <div className="flex flex-col space-y-10">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {someProducts ? (
              someProducts.length > 0 ? (
                someProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="flex h-full flex-col items-center justify-center space-y-1 pt-10">
                  <Icons.product
                    className="mb-4 h-16 w-16 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <div className="text-xl font-medium text-muted-foreground">
                    No products found
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Please try again later
                  </div>
                </div>
              )
            ) : (
              <p>Loading...</p>
            )}
          </div>
          <Link
            href="/store/products"
            className={cn(
              buttonVariants({
                className: "mx-auto",
              })
            )}
          >
            View all products
            <span className="sr-only">View all products</span>
          </Link>
        </div>
      </section>
    </Shell>
  );
};

Page.getLayout = LayoutSite;

export default Page;
