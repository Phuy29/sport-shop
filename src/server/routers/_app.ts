import { z } from "zod";
import { router } from "../trpc";
import { adminRouter } from "./admin";
import { storeRouter } from "./store";

export const appRouter = router({
  admin: adminRouter,
  store: storeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
