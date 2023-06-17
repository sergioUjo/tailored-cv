import Stripe from "stripe";
import { env } from "../env.mjs";
// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});
type Plan = "sniffer" | "hunter" | "professional";
const planWords = {
  sniffer: 50000,
  hunter: 110000,
  professional: 250000,
};
const planPrices = {
  sniffer: 569,
  hunter: 1069,
  professional: 2069,
};
export function createCheckoutSession(userId: string, plan: Plan) {
  return stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: planPrices[plan],
          product_data: {
            name: "Sniffer",
          },
        },
        quantity: 1,
      },
    ],
    payment_intent_data: {
      metadata: {
        userId,
        words: planWords[plan],
      },
    },
    mode: "payment",
    success_url: "https://example.com/success",
    cancel_url: "https://example.com/failure",
  });
}
