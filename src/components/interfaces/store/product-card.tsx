import * as React from "react";
import Image from "next/image";
import Link from "next/link";

import { cn, formatPrice } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { useCartStore } from "@/stores/cart";
import { RouterOutputs } from "@/utils/trpc";

interface ProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  product: RouterOutputs["store"]["products"]["get"][number];
  variant?: "default" | "switchable";
  isAddedToCart?: boolean;
  onSwitch?: () => Promise<void>;
}

export function ProductCard({
  product,
  variant = "default",
  isAddedToCart = false,
  onSwitch,
  className,
  ...props
}: ProductCardProps) {
  return (
    <Card
      className={cn("h-full overflow-hidden rounded-sm", className)}
      {...props}
    >
      <Link aria-label={product.name} href={`/store/products/${product.id}`}>
        <CardHeader className="border-b p-0">
          <AspectRatio ratio={4 / 3}>
            {product.images.length ? (
              <Image
                src={
                  product.images[0].url ?? "/images/product-placeholder.webp"
                }
                alt={"alt"}
                className="object-cover"
                sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
                fill
                loading="lazy"
              />
            ) : (
              <div
                aria-label="Placeholder"
                role="img"
                aria-roledescription="placeholder"
                className="flex h-full w-full items-center justify-center bg-secondary"
              >
                <Icons.placeholder
                  className="h-9 w-9 text-muted-foreground"
                  aria-hidden="true"
                />
              </div>
            )}
          </AspectRatio>
        </CardHeader>
        <span className="sr-only">{product.name}</span>
        <CardContent className="grid gap-2.5 p-4">
          <CardTitle className="line-clamp-1">{product.name}</CardTitle>
          <CardDescription className="line-clamp-2">
            {product.variants.length === 1 ? (
              formatPrice(product.variants[0].price)
            ) : (
              <>
                {formatPrice(product.minVariantPrice)} -{" "}
                {formatPrice(product.maxVariantPrice)}
              </>
            )}
          </CardDescription>
        </CardContent>
      </Link>
    </Card>
  );
}
