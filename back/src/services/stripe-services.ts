import { Request, Response } from "express";
import Stripe from "stripe";
import { STRIPE_SECRET_KEY } from "../constants";

export const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2026-06-24.dahlia",
  typescript: true,
});

export class StripeServices {
  public async createPaymentIntent(req: Request, res: Response) {
    const { amount, currency, accountId, email, planType } = req.body;

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        receipt_email: email,
        metadata: {
          accountId: String(accountId),
          planType: planType || "pro",
        },
      });

      return res.status(200).json({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      console.error("Error creating PaymentIntent:", error);
      return res.status(500).json({ error: "Failed to create payment intent" });
    }
  }
}

export const stripeServices = new StripeServices();
