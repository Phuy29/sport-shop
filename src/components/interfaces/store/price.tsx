import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { RouterOutputs } from "@/utils/trpc";
import { useSearchParams } from "next/navigation";
import React from "react";

export const Price = ({
  minVariantPrice,
  maxVariantPrice,
  variants,
}: {
  minVariantPrice: number;
  maxVariantPrice: number;
  variants: RouterOutputs["store"]["products"]["getOne"]["variants"];
}) => {
  const searchParams = useSearchParams();

  const newVariant = variants.find((variant) => {
    const isMatch = variant.optionValue.every((item) => {
      return (
        searchParams.get(item.option?.name.toLocaleLowerCase() ?? "") ===
        item.value
      );
    });

    return isMatch;
  });

  return (
    <div>
      <Badge>
        {newVariant ? (
          formatPrice(newVariant.price)
        ) : (
          <>
            {variants.length === 1
              ? formatPrice(variants[0].price)
              : `${formatPrice(minVariantPrice)} - ${formatPrice(
                  maxVariantPrice
                )}`}
          </>
        )}
      </Badge>
    </div>
  );
};
