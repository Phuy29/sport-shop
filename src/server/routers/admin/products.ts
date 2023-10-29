import { adminProcedure, router } from "@/server/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const productsAdminRouter = router({
  get: adminProcedure.query(async ({ ctx }) => {
    const products = ctx.prisma.product.findMany({
      include: {
        collection: true,
        images: true,
        variants: true,
        options: true,
      },
    });

    return products;
  }),

  getOne: adminProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const product = await ctx.prisma.product.findUnique({
      where: {
        id: input,
      },
      include: {
        images: true,
        collection: true,
        options: {
          include: {
            optionValue: true,
          },
        },
        variants: {
          include: {
            optionValue: true,
          },
        },
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
        description: z.string().min(3),
        collectionId: z.string(),
        images: z.array(z.string()),
        options: z.array(
          z.object({
            name: z.string(),
            values: z.array(z.string()),
          })
        ),
        variants: z.array(
          z.object({
            name: z.string(),
            price: z.number(),
            inventory: z.number(),
            options: z.array(z.object({ name: z.string(), value: z.string() })),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.image.deleteMany({
        where: {
          productId: input.id,
        },
      });

      await ctx.prisma.productOptionValue.deleteMany({
        where: {
          productId: input.id,
        },
      });

      await ctx.prisma.productOption.deleteMany({
        where: {
          productId: input.id,
        },
      });

      await ctx.prisma.productVariant.deleteMany({
        where: {
          productId: input.id,
        },
      });

      await ctx.prisma.product.delete({
        where: {
          id: input.id,
        },
      });

      const product = await ctx.prisma.product.create({
        data: {
          name: input.name,
          collectionId: input.collectionId,
          description: input.description,
          images: {
            create: input.images.map((imageUrl) => ({
              url: imageUrl,
            })),
          },
          options: {
            create: input.options.map((option) => ({
              name: option.name,
            })),
          },
        },
        include: {
          options: true,
        },
      });

      for (const variant of input.variants) {
        await ctx.prisma.productVariant.create({
          data: {
            name: variant.name,
            price: variant.price,
            inventory: variant.inventory,
            optionValue: {
              create: variant.options.map((option) => ({
                value: option.value,
                optionId: product.options.find((x) => x.name === option.name)
                  ?.id,
                productId: product.id,
              })),
            },
            productId: product.id,
          },
        });
      }

      return product;
    }),

  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(3),
        description: z.string().min(3),
        collectionId: z.string(),
        images: z.array(z.string()),
        options: z.array(
          z.object({
            name: z.string(),
            values: z.array(z.string()),
          })
        ),
        variants: z.array(
          z.object({
            name: z.string(),
            price: z.number(),
            inventory: z.number(),
            options: z.array(z.object({ name: z.string(), value: z.string() })),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const product = await ctx.prisma.product.create({
        data: {
          name: input.name,
          collectionId: input.collectionId,
          description: input.description,
          images: {
            create: input.images.map((imageUrl) => ({
              url: imageUrl,
            })),
          },
          options: {
            create: input.options.map((option) => ({
              name: option.name,
            })),
          },
        },
        include: {
          options: true,
        },
      });

      for (const variant of input.variants) {
        await ctx.prisma.productVariant.create({
          data: {
            name: variant.name,
            price: variant.price,
            inventory: variant.inventory,
            optionValue: {
              create: variant.options.map((option) => ({
                value: option.value,
                optionId: product.options.find((x) => x.name === option.name)
                  ?.id,
                productId: product.id,
              })),
            },
            productId: product.id,
          },
        });
      }

      return product;
    }),

  delete: adminProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    await ctx.prisma.image.deleteMany({
      where: {
        productId: input,
      },
    });

    await ctx.prisma.productOptionValue.deleteMany({
      where: {
        productId: input,
      },
    });

    await ctx.prisma.productOption.deleteMany({
      where: {
        productId: input,
      },
    });

    await ctx.prisma.productVariant.deleteMany({
      where: {
        productId: input,
      },
    });

    const product = await ctx.prisma.product.delete({
      where: {
        id: input,
      },
    });

    return product;
  }),
});
