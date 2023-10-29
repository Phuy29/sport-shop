import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

interface ProductVariantCart {
  id: string;
  productName: string;
  productVariantName: string;
  price: number;
  image: string;
}

type CartItem = {
  productVariant: ProductVariantCart;
  quantity: number;
};

type CartState = {
  carts: CartItem[];
  addProduct: (product: ProductVariantCart) => void;
  removeProduct: (id: string) => void;
  removeProducts: (ids: string[]) => void;
  addOneItem: (id: string) => void;
  removeOneItem: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set) => ({
        carts: [],
        addProduct: (product) => {
          set((state) => ({
            carts: state.carts.some((c) => c.productVariant.id === product.id)
              ? state.carts.map((c) => {
                  if (c.productVariant.id === product.id) {
                    return {
                      productVariant: c.productVariant,
                      quantity: c.quantity + 1,
                    };
                  }

                  return c;
                })
              : [...state.carts, { productVariant: product, quantity: 1 }],
          }));
        },
        removeProduct: (id: string) => {
          set((state) => ({
            carts: state.carts.filter((c) => c.productVariant.id !== id),
          }));
        },
        removeProducts: (ids: string[]) => {
          set((state) => ({
            carts: state.carts.filter(
              (c) => !ids.includes(c.productVariant.id)
            ),
          }));
        },
        addOneItem: (id: string) => {
          set((state) => ({
            carts: state.carts.map((c) => {
              if (c.productVariant.id === id) {
                return {
                  ...c,
                  quantity: c.quantity + 1,
                };
              }
              return c;
            }),
          }));
        },
        removeOneItem: (id: string) => {
          set((state) => ({
            carts: state.carts.map((c) => {
              if (c.productVariant.id === id) {
                return {
                  ...c,
                  quantity: c.quantity - 1,
                };
              }
              return c;
            }),
          }));
        },
        setQuantity: (id: string, quantity: number) => {
          set((state) => ({
            carts: state.carts.map((c) => {
              if (c.productVariant.id === id) {
                return {
                  ...c,
                  quantity,
                };
              }
              return c;
            }),
          }));
        },
        clear: () => {
          set((state) => ({
            carts: [],
          }));
        },
        isLoading: false,
      }),
      {
        name: "cart",
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);
