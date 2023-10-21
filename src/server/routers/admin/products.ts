import { adminProcedure, router } from "@/server/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const productsAdminRouter = router({
  get: adminProcedure.query(async ({ ctx }) => {
    const [count, products] = await ctx.prisma.$transaction([
      ctx.prisma.product.count(),
      ctx.prisma.product.findMany({
        include: {
          collection: true,
          images: true,
        },
      }),
    ]);
    return { count, products };
  }),

  getOne: adminProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const product = await ctx.prisma.product.findUnique({
      where: {
        id: input,
      },
      include: {
        images: true,
        collection: true,
      },
    });
    if (!product)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Product not found!",
      });
    return product;
  }),

  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(3),
        price: z.number().min(0),
        collectionId: z.string(),
        description: z.string().min(3),
        images: z.array(z.string()),
        inventory: z.number().default(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.image.deleteMany({
        where: {
          productId: input.id,
        },
      });

      const product = await ctx.prisma.product.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          price: input.price,
          collectionId: input.collectionId,
          description: input.description,
          images: {
            create: input.images.map((imageUrl) => ({
              url: imageUrl,
            })),
          },
        },
      });

      return product;
    }),

  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(3),
        price: z.number().min(0),
        collectionId: z.string(),
        description: z.string().min(3),
        images: z.array(z.string()),
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
