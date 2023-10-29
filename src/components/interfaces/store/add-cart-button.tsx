import { useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart";
import { RouterOutputs } from "@/utils/trpc";
import { toast } from "sonner";

export function AddToCartButton({
  product,
  variants,
}: {
  product: RouterOutputs["store"]["products"]["getOne"];
  variants: RouterOutputs["store"]["products"]["getOne"]["variants"];
}) {
  const searchParams = useSearchParams();
  const cartState = useCartStore((state) => ({
    addProduct: state.addProduct,
  }));

  const variant = variants.find((variant) => {
    const isMatch = variant.optionValue.every((item) => {
      return (
        searchParams.get(item.option?.name.toLocaleLowerCase() ?? "") ===
        item.value
      );
    });

    return isMatch;
  });

  return (
    <Button
      disabled={!variant}
      className="w-full"
      size={"lg"}
      onClick={() => {
        if (variant) {
          cartState.addProduct({
            id: variant.id,
            productName: product.name,
            productVariantName: variant.name,
            price: variant.price,
            image: product.images[0].url,
          });
        } else {
          toast("Please select product variant!");
        }
      }}
    >
      <Plus className="h-4 w-4 mr-2" />
      Add To Cart
    </Button>
  );
}
