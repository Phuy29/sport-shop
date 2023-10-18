import LayoutSite from "@/components/layouts/store";
import { NextPageWithLayout } from "../_app";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { trpc } from "@/utils/trpc";

const Page: NextPageWithLayout = () => {
  return (
    <>
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
            <Link href="/products">
              Buy now
              <span className="sr-only">Buy now</span>
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
};

Page.getLayout = LayoutSite;

export default Page;
