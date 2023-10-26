import { Product } from "@prisma/client";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

type CartItem = {
  product: Pick<Product, "id" | "name" | "price"> & { image: string };
  quantity: number;
};

type CartState = {
  carts: CartItem[];
  addProduct: (
    product: Pick<Product, "id" | "name" | "price"> & { image: string }
  ) => void;
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
            carts: state.carts.some((c) => c.product.id === product.id)
              ? state.carts.map((c) => {
                  if (c.product.id === product.id) {
                    return {
                      product: c.product,
                      quantity: c.quantity + 1,
                    };
                  }

                  return c;
                })
              : [...state.carts, { product, quantity: 1 }],
          }));
        },
        removeProduct: (id: string) => {
          set((state) => ({
            carts: state.carts.filter((c) => c.product.id !== id),
          }));
        },
        removeProducts: (ids: string[]) => {
          set((state) => ({
            carts: state.carts.filter((c) => !ids.includes(c.product.id)),
          }));
        },
        addOneItem: (id: string) => {
          set((state) => ({
            carts: state.carts.map((c) => {
              if (c.product.id === id) {
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
              if (c.product.id === id) {
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
              if (c.product.id === id) {
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
