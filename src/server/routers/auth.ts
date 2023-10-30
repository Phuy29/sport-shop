import { publicProcedure, router } from "@/server/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import bcrypt from "bcrypt";

export const signinRouter = router({
  signIn: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          email: input.email,
        },
      });

      if (user && user.active) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email already exists!",
        });
      }

      const hashingPassword = await bcrypt.hash(input.password, 10);

      const newUser = await ctx.prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
          password: hashingPassword,
        },
      });

      return newUser;
    }),
});
