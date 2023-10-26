import { router } from "@/server/trpc";
import { productsAdminRouter } from "./products";
import { collectionsAdminRouter } from "./collections";
import { ordersRouter } from "./orders";

export const adminRouter = router({
  products: productsAdminRouter,
  collections: collectionsAdminRouter,
  orders: ordersRouter,
});
