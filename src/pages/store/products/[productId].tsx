import LayoutSite from "@/components/layouts/store";
import { NextPageWithLayout } from "@/pages/_app";
import { Shell } from "@/components/shell";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Icons } from "@/components/icons";
import { Gallery } from "@/components/interfaces/store/gallery";
import { VariantSelector } from "@/components/interfaces/store/variant-selector";
import { Price } from "@/components/interfaces/store/price";

const Page: NextPageWithLayout = () => {
  const router = useRouter();
  const productId = router.query.productId as string;
  const { data: product, isLoading } =
    trpc.store.products.getOne.useQuery(productId);

  //TODO: Add placeholder loading
  if (!product) return <p>Loading...</p>;

  return (
    <Shell>
      <Breadcrumbs
        segments={[
          {
            title: "Products",
            href: "/store/products",
          },
          {
            title: product.name,
            href: `/store/product/${productId}`,
          },
        ]}
      />

      <div className="flex flex-col rounded-lg lg:flex-row lg:gap-8 w-full">
        <div className="h-full w-full basis-full lg:basis-4/6">
          {product.images.length === 0 ? (
            <div
              aria-label="Product Placeholder"
              role="img"
              aria-roledescription="placeholder"
              className="flex aspect-square h-full w-full flex-1 items-center justify-center bg-secondary"
            >
              <Icons.placeholder
                className="h-9 w-9 text-muted-foreground"
                aria-hidden="true"
              />
            </div>
          ) : (
            <>
              <Gallery
                images={product.images.map((image) => ({
                  src: image.url,
                  altText: "dsads",
                }))}
              />
            </>
          )}
        </div>

        <div className="basis-full lg:basis-2/6">
          <div className="mb-6 flex flex-col border-b pb-6 dark:border-neutral-700">
            <h1 className="mb-2 text-5xl font-medium">{product.name}</h1>
            <Price
              variants={product.variants}
              minVariantPrice={product.minVariantPrice}
              maxVariantPrice={product.maxVariantPrice}
            />
          </div>

          <VariantSelector
            options={product.options}
            variants={product.variants}
          />

          <Separator className="mt-5" />

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="description">
              <AccordionTrigger>Description</AccordionTrigger>
              <AccordionContent>
                {product.description ??
                  "No description is available for this product."}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </Shell>
  );
};

Page.getLayout = LayoutSite;

export default Page;
