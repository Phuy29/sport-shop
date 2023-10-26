import { protectedProcedure, router } from "@/server/trpc";
import { TRPCError } from "@trpc/server";
import Stripe from "stripe";
import { z } from "zod";

export const stripeRouter = router({
  createCheckoutSession: protectedProcedure
    .input(
      z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          price: z.number(),
          quantity: z.number().min(1),
        })
      )
    )
    .mutation(async ({ ctx, input }) => {
      const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] =
        input.map((product) => ({
          quantity: product.quantity,
          price_data: {
            currency: "USD",
            product_data: {
              name: product.name,
            },
            unit_amount: product.price * 100,
          },
        }));

      const baseUrl =
        process.env.NODE_ENV === "development"
          ? `http://${ctx.req.headers.host}`
          : `https://${ctx.req.headers.host}`;

      const order = await ctx.prisma.order.create({
        data: {
          userId: ctx.session?.user?.id,
          isPaid: false,
          items: {
            create: input.map((product) => ({
              productId: product.id,
              quantity: product.quantity,
            })),
          },
        },
      });

      const checkoutSession = await ctx.stripe.checkout.sessions.create({
        line_items,
        mode: "payment",
        billing_address_collection: "required",
        phone_number_collection: {
          enabled: true,
        },
        success_url: `${baseUrl}/store/checkout/success`,
        cancel_url: `${baseUrl}/store/carts`,
        metadata: {
          orderId: order.id,
        },
      });

      if (!checkoutSession) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not create checkout session",
        });
      }
      return { checkoutUrl: checkoutSession.url };
    }),
});
