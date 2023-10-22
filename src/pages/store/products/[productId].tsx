import LayoutSite from "@/components/layouts/store";
import { NextPageWithLayout } from "@/pages/_app";
import { Shell } from "@/components/shell";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import { ProductImage } from "@/components/interfaces/store/product-image";
import { Icons } from "@/components/icons";

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

      <div className="flex flex-col gap-8 md:flex-row md:gap-16">
        <div className="col-span-4 w-[550px]">
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
              <ProductImage
                src={product.images[0].url}
                alt={"alt"}
                height="h-96"
                width="w-full"
              />
              {product.images.length > 1 && (
                <>
                  <div className="flex items-center justify-start gap-2 mt-2 overflow-auto flex-nowrap">
                    {product.images.slice(1).map((image) => (
                      <div key={image.id} className="relative h-24 w-24">
                        <Image
                          src={image.url}
                          alt={"alt"}
                          fill
                          className="object-cover h-24 w-24"
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {/* <ProductImageCarousel
          className="w-full md:w-1/2"
          images={product.images.map((item) => item.url)}
          options={{
            loop: true,
          }}
        /> */}
        <Separator className="mt-4 md:hidden" />
        <div className="flex w-full flex-col gap-4 md:w-1/2">
          <div className="space-y-2">
            <h2 className="line-clamp-1 text-2xl font-bold">{product.name}</h2>
            <p className="text-base text-muted-foreground">
              {formatPrice(product.price)}
            </p>
          </div>
          {/* <AddToCartForm productId={productId} /> */}
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
