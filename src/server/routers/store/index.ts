import { router } from "@/server/trpc";
import { productsStoreRouter } from "./products";
import { stripeRouter } from "./stripe";

export const storeRouter = router({
  products: productsStoreRouter,
  stripe: stripeRouter,
});
