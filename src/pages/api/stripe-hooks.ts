import { type NextApiRequest, type NextApiResponse } from "next";
import { env } from "../../env.mjs";
import Stripe from "stripe";
import { buffer } from "micro";
import { increaseProfileTokens, retrieveProfile } from "../../server/profile";

export const config = { api: { bodyParser: false } };
async function handler(req: NextApiRequest, res: NextApiResponse) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: "2022-11-15",
  });
  console.log("webhook");
  const signature = req.headers["stripe-signature"]!;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const signingSecret = env.STRIPE_SIGNING_SECRET;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
  const reqBuffer = await buffer(req);

  let event;

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    event = stripe.webhooks.constructEvent(reqBuffer, signature, signingSecret);
  } catch (error) {
    console.log(error);
    return res.status(400).send(`Webhook error`);
  }

  console.log({ event });
  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntentSucceeded = event.data.object;
      console.log(paymentIntentSucceeded);
      const profile = await retrieveProfile(
        paymentIntentSucceeded.metadata.userId
      );
      await increaseProfileTokens(
        profile,
        parseInt(paymentIntentSucceeded.metadata.words as string)
      );
      // Then define and call a function to handle the event payment_intent.succeeded
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.send({ received: true });
}
export default handler;
