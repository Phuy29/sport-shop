import { router } from "@/server/trpc";
import { productsStoreRouter } from "./products";

export const storeRouter = router({
  products: productsStoreRouter,
});
