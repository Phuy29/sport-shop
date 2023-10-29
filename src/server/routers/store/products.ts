import { publicProcedure, router } from "@/server/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const productsStoreRouter = router({
  get: publicProcedure.query(async ({ ctx }) => {
    const result = await ctx.prisma.product.findMany({
      include: {
        images: true,
        options: true,
        variants: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const products = result.map((product) => {
      const productVariantPriceArr = product.variants.map(
        (variant) => variant.price
      );

      return {
        ...product,
        minVariantPrice: productVariantPriceArr.reduce(function (min, current) {
          return Math.min(min, current);
        }, productVariantPriceArr[0]),
        maxVariantPrice: productVariantPriceArr.reduce(function (max, current) {
          return Math.max(max, current);
        }, productVariantPriceArr[0]),
      };
    });

    return products;
  }),

  getOne: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const product = await ctx.prisma.product.findUnique({
      where: {
        id: input,
      },
      include: {
        images: true,
        options: {
          include: {
            optionValue: {
              distinct: "value",
            },
          },
        },
        variants: {
          include: {
            optionValue: {
              include: {
                option: true,
              },
            },
          },
        },
      },
    });

    if (!product) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Product not found!",
      });
    }

    const productVariantPriceArr = product.variants.map(
      (variant) => variant.price
    );

    return {
      ...product,
      minVariantPrice: productVariantPriceArr.reduce(function (min, current) {
        return Math.min(min, current);
      }, productVariantPriceArr[0]),
      maxVariantPrice: productVariantPriceArr.reduce(function (max, current) {
        return Math.max(max, current);
      }, productVariantPriceArr[0]),
    };
  }),
});
