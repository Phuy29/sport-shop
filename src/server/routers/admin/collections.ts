import { adminProcedure, router } from "@/server/trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const collectionsAdminRouter = router({
  get: adminProcedure.query(async ({ ctx }) => {
    const [count, collections] = await ctx.prisma.$transaction([
      ctx.prisma.productCollection.count(),
      ctx.prisma.productCollection.findMany({
        include: {
          products: true,
        },
      }),
    ]);
    return { count, collections };
  }),

  getOne: adminProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const collection = await ctx.prisma.productCollection.findUnique({
      where: {
        id: input,
      },
    });
    if (!collection)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Collection not found!",
      });
    return collection;
  }),

  create: adminProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const collection = await ctx.prisma.productCollection.create({
        data: {
          name: input.name,
        },
      });
      return collection;
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const collection = await ctx.prisma.productCollection.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
        },
      });

      return collection;
    }),

  delete: adminProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const collection = await ctx.prisma.productCollection.delete({
      where: {
        id: input,
      },
    });

    return collection;
  }),
});
