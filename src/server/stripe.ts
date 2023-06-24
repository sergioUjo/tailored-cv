import Stripe from "stripe";
import { env } from "../env.mjs";
import { type Plan, planStore } from "../utils/plans";

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

export function createCheckoutSession(userId: string, plan: Plan) {
  return stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: planStore[plan].price,
          product_data: {
            name: planStore[plan].name,
            description: [
              planStore[plan].description,
              ...planStore[plan].features,
            ].join(" | "),
          },
        },
        quantity: 1,
      },
    ],
    payment_intent_data: {
      metadata: {
        userId,
        words: planStore[plan].words,
      },
    },
    mode: "payment",
    success_url: "https://app.tailoredcv.app/",
    cancel_url: "https://app.tailoredcv.app/",
  });
}
