import { Request, Response } from "express";
import Stripe from "stripe";
import { query } from "../db";
import { Subscriptions } from "../models/subscriptions.model";
import { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } from "../constants";

export const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2026-06-24.dahlia",
  typescript: true,
});

export class StripeServices {
  public async createPaymentIntent(req: Request, res: Response) {
    const { amount, currency, accountId, email, planType } = req.body;

    if (!accountId || !amount || !currency) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      // 1. Check if the account already has an active subscription in database
      const existingSubscription =
        await Subscriptions.checkSubscription(accountId);

      if (existingSubscription.rows.length > 0) {
        return res.status(409).json({
          error: "Account already has an active subscription",
          subscription: existingSubscription.rows[0],
        });
      }

      // 2. Create Stripe Customer
      const customer = await stripe.customers.create({
        email,
        metadata: {
          accountId: String(accountId),
        },
      });

      // 3. Create PaymentIntent attached to Customer
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        customer: customer.id,
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

  //
  public async handleStripeWebhook(req: Request, res: Response) {
    const signature = req.headers["stripe-signature"];

    if (!signature) {
      return res.status(400).json({ error: "Missing stripe-signature header" });
    }

    let event: Stripe.Event;
    try {
      // req.body must be the RAW buffer, not JSON parsed
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,

        STRIPE_WEBHOOK_SECRET,
      );
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle successful payment event
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const accountId = paymentIntent.metadata.accountId;
      const planType = paymentIntent.metadata.planType || "pro";

      if (accountId) {
        try {
          // Upsert active subscription for 30 days
          const upsertSubscriptionSql = `
            INSERT INTO subscriptions (
              account_id, 
              plan_type, 
              status, 
              current_period_start, 
              current_period_end, 
              stripe_customer_id
            )
            VALUES ($1, $2, 'active', NOW(), NOW() + INTERVAL '30 days', $3)
            ON CONFLICT (account_id) DO UPDATE SET
              plan_type = EXCLUDED.plan_type,
              status = 'active',
              current_period_start = NOW(),
              current_period_end = NOW() + INTERVAL '30 days',
              stripe_customer_id = EXCLUDED.stripe_customer_id,
              updated_at = NOW();
          `;

          await query(upsertSubscriptionSql, [
            accountId,
            planType,
            (paymentIntent.customer as string) || null,
          ]);

          console.log(
            `Subscription successfully updated for accountId: ${accountId}`,
          );
        } catch (dbError) {
          console.error("Error updating subscription in database:", dbError);
          return res
            .status(500)
            .json({ error: "Database error processing webhook" });
        }
      }
    }

    // Acknowledge receipt of the event to Stripe
    return res.status(200).json({ received: true });
  }
}

export const stripeServices = new StripeServices();
