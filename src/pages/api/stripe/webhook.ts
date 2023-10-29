import { NextApiRequest, NextApiResponse, PageConfig } from "next";
import { stripe } from "@/lib/stripe";
import { buffer } from "micro";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

// Stripe requires the raw body to construct the event.
export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
};

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"];

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(buf, sig as string, webhookSecret);

      switch (event.type) {
        // Handling payment events
        case "payment_intent.payment_failed":
          const paymentIntentPaymentFailed = event.data.object;
          console.log(
            `❌ Payment failed: ${paymentIntentPaymentFailed.last_payment_error?.message}`
          );
          break;
        case "payment_intent.processing":
          const paymentIntentProcessing = event.data.object;
          console.log(`⏳ Payment processing: ${paymentIntentProcessing.id}`);
          break;
        case "checkout.session.completed":
          const session = event.data.object;
          const address = session.customer_details?.address;

          const addressStr = [
            address?.line1,
            address?.city,
            address?.city,
            address?.state,
            address?.postal_code,
            address?.country,
          ]
            .filter((c) => c !== null)
            .join(", ");

          const order = await prisma.order.update({
            where: {
              id: session.metadata?.orderId,
            },
            data: {
              isPaid: true,
              address: addressStr,
              phone: session.customer_details?.phone ?? "",
              stripePaymentIntentId: session.payment_intent as string,
              stripePaymentIntentStatus: session.payment_status,
            },
            include: {
              items: true,
            },
          });

          for (const item of order.items) {
            const productVariant = await prisma.productVariant.findFirst({
              where: {
                id: item.productVariantId ?? "",
              },
              select: {
                id: true,
                inventory: true,
              },
            });

            if (!productVariant) {
              throw new Error("Product variant not found.");
            }

            const inventory = productVariant.inventory - item.quantity;

            if (inventory < 0) {
              throw new Error("Product out of stock.");
            }

            console.log({ inventory });

            const newProductVariant = await prisma.productVariant.update({
              where: {
                id: item.productVariantId ?? "",
              },
              data: {
                inventory,
              },
            });

            console.log({ newProductVariant });
          }
          break;
        case "application_fee.created":
          const applicationFeeCreated = event.data.object;
          console.log(`Application fee id: ${applicationFeeCreated.id}`);
          break;
        case "charge.succeeded":
          const chargeSucceeded = event.data.object;
          console.log(`Charge id: ${chargeSucceeded.id}`);
          break;
        default:
          console.warn(`Unhandled event type: ${event.type}`);
      }

      res.json({ received: true });
    } catch (error) {
      res
        .status(400)
        .send(
          `Webhook Error: ${error instanceof Error ? error.message : error}`
        );
      return;
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
