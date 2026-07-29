import { QueryResult } from "pg";
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

    const result = await query(checkSubscriptionSql, [accountId]);

    return result;
  }
}
