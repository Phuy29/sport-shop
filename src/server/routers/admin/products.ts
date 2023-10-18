import { adminProcedure, router } from "@/server/trpc";
import { Prisma } from "@prisma/client";
import { z } from "zod";

export const productsAdminRouter = router({
  get: adminProcedure.query(async ({ ctx }) => {
    const [count, products] = await ctx.prisma.$transaction([
      ctx.prisma.product.count(),
      ctx.prisma.product.findMany({
        include: {
          collection: true,
        },
      }),
    ]);
    return { count, products };
  }),

  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(3),
        price: z.number().min(0),
        collectionId: z.string(),
        description: z.string().min(3),
        images: z.array(z.string()),
        rating: z.number().min(0).max(5),
        inventory: z.number().default(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const product = await ctx.prisma.product.create({
        data: {
          name: input.name,
          price: input.price,
          collectionId: input.collectionId,
          description: input.description,
          rating: input.rating,
          inventory: input.inventory,
          images: {
            create: input.images.map((imageUrl) => ({
              url: imageUrl,
            })),
          },
        },
      });
      return product;
    }),

  delete: adminProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const product = await ctx.prisma.product.delete({
      where: {
        id: input,
      },
    });

    await ctx.prisma.image.deleteMany({
      where: {
        productId: input,
      },
    });

    return product;
  }),
});
