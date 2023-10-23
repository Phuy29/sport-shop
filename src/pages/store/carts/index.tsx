import { Icons } from "@/components/icons";
import LayoutSite from "@/components/layouts/store";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { Shell } from "@/components/shell";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn, formatPrice } from "@/lib/utils";
import { NextPageWithLayout } from "@/pages/_app";
import { useCartStore } from "@/stores/cart";
import { MinusIcon, PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";

const CheckoutButtonNoSSR = dynamic(
  () => import("@/components/interfaces/store/checkout-button"),
  {
    ssr: false,
  }
);

const Page: NextPageWithLayout = () => {
  const cartStore = useCartStore((state) => ({
    carts: state.carts,
    removeProduct: state.removeProduct,
    setQuantity: state.setQuantity,
    addOneItem: state.addOneItem,
    removeOneItem: state.removeOneItem,
  }));

  return (
    <Shell>
      <PageHeader
        id="cart-page-header"
        aria-labelledby="cart-page-header-heading"
      >
        <PageHeaderHeading size="sm">Checkout</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          Checkout with your cart items
        </PageHeaderDescription>
      </PageHeader>
      {cartStore.carts.length > 0 ? (
        <Card>
          <CardHeader className="flex flex-row items-center space-x-4 py-4">
            <CardTitle className="flex-1">Shopping Carts</CardTitle>
            <CheckoutButtonNoSSR />
          </CardHeader>
          <Separator className="mb-4" />
          <CardContent className="pb-6 px-6">
            <div className={cn("flex w-full flex-col gap-5")}>
              {cartStore.carts.map((c) => {
                const product = c.product;

                return (
                  <div key={product.id} className="space-y-3">
                    <div
                      className={cn("flex items-start justify-between gap-4")}
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="relative aspect-square h-16 w-16 min-w-fit overflow-hidden rounded">
                          {product.image ? (
                            <Image
                              src={
                                product.image ??
                                "/images/product-placeholder.webp"
                              }
                              alt={"alt"}
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              fill
                              className="absolute object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center bg-secondary">
                              <Icons.placeholder
                                className="h-4 w-4 text-muted-foreground"
                                aria-hidden="true"
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col space-y-1 self-start">
                          <span className="line-clamp-1 text-sm font-medium">
                            {product.name}
                          </span>
                          <span className="line-clamp-1 text-xs text-muted-foreground">
                            {formatPrice(product.price)} x {c.quantity} ={" "}
                            {formatPrice(
                              (
                                Number(product.price) * Number(c.quantity)
                              ).toFixed(2)
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-none items-center justify-between space-x-2 xs:w-auto xs:justify-normal">
                        <div className="flex items-center">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-r-none"
                            onClick={() => {
                              cartStore.removeOneItem(product.id);
                            }}
                          >
                            <MinusIcon className="h-3 w-3" aria-hidden="true" />
                            <span className="sr-only">Remove one item</span>
                          </Button>
                          <Input
                            type="number"
                            min="0"
                            className="h-8 w-14 rounded-none border-x-0"
                            value={c.quantity}
                            onChange={(e) => {
                              cartStore.setQuantity(
                                product.id,
                                Number(e.target.value)
                              );
                            }}
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-l-none"
                            onClick={() => {
                              cartStore.addOneItem(product.id);
                            }}
                          >
                            <PlusIcon className="h-3 w-3" aria-hidden="true" />
                            <span className="sr-only">Add one item</span>
                          </Button>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 hover:bg-red-300 hover:text-red-600"
                          onClick={() => {
                            cartStore.removeProduct(product.id);
                          }}
                        >
                          <TrashIcon className="h-3 w-3" aria-hidden="true" />
                          <span className="sr-only">Delete item</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
          <Separator className="mb-4" />
          <CardFooter className="space-x-4">
            <span className="flex-1">
              Total (
              {cartStore.carts.reduce((acc, item) => acc + item.quantity, 0)})
            </span>
            <span>
              {formatPrice(
                cartStore.carts.reduce(
                  (acc, item) =>
                    acc + Number(item.product.price) * item.quantity,
                  0
                )
              )}
            </span>
          </CardFooter>
        </Card>
      ) : (
        <section
          id="cart-page-empty-cart"
          aria-labelledby="cart-page-empty-cart-heading"
          className="flex h-full flex-col items-center justify-center space-y-1 pt-16"
        >
          <Icons.cart
            className="mb-4 h-16 w-16 text-muted-foreground"
            aria-hidden="true"
          />
          <div className="text-xl font-medium text-muted-foreground">
            Your cart is empty
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
            Add items to your cart to checkout
          </Link>
        </section>
      )}
    </Shell>
  );
};

Page.getLayout = LayoutSite;

export default Page;