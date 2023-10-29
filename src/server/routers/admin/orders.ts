import prisma from "@/lib/prisma";
import { adminProcedure, router } from "@/server/trpc";

export const ordersRouter = router({
  get: adminProcedure.query(async ({ ctx }) => {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            productVariant: true,
          },
        },
      },
    });

    return orders;
  }),
});
