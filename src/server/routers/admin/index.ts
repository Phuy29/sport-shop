import { router } from "@/server/trpc";
import { productsAdminRouter } from "./products";
import { collectionsAdminRouter } from "./collections";

export const adminRouter = router({
  products: productsAdminRouter,
  collections: collectionsAdminRouter,
});
