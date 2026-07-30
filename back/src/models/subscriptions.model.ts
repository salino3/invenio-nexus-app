import { QueryResult } from "pg";
import Stripe from "stripe";
import { query } from "../db";
import {
  SubscriptionsProps,
  TypePlaneType,
  TypeSubscriptionStatus,
} from "../interfaces/subscriptions.interface";

export class Subscriptions {
  public id: number;
  public account_id: number;
  public plan_type: TypePlaneType;
  public status: TypeSubscriptionStatus;
  public current_period_start: Date;
  public current_period_end: Date;
  public stripe_customer_id: string;
  public created_at: Date;
  public updated_at: Date;

  constructor(data: SubscriptionsProps) {
    this.id = data.id;
    this.account_id = data.account_id;
    this.plan_type = data.plan_type;
    this.status = data.status;
    this.current_period_start = data.current_period_start;
    this.current_period_end = data.current_period_end;
    this.stripe_customer_id = data.stripe_customer_id;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  //
  static async checkSubscription(accountId: number): Promise<QueryResult<any>> {
    const checkSubscriptionSql = `
      SELECT id, plan_type, current_period_end 
      FROM subscriptions 
      WHERE account_id = $1 
        AND status = 'active' 
        AND current_period_end > NOW() 
      LIMIT 1;
    `;

    return await query(checkSubscriptionSql, [accountId]);
  }

  static async upsertSubscription(
    accountId: string,
    planType: string,
    paymentIntent: Stripe.PaymentIntent,
  ): Promise<QueryResult<any>> {
    const customerId =
      typeof paymentIntent.customer === "string"
        ? paymentIntent.customer
        : paymentIntent.customer?.id || null;

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

    return await query(upsertSubscriptionSql, [
      accountId,
      planType,
      customerId,
    ]);
  }
}
