export type TypeSubscriptionStatus =
  | "active"
  | "canceled"
  | "past_due"
  | "expired";

export type TypePlaneType =
  | "begin"
  | "pro"
  | "business"
  | "canceled"
  | "expired";

export interface SubscriptionsProps {
  id: number;
  account_id: number;
  plan_type: TypePlaneType;
  status: TypeSubscriptionStatus;
  current_period_start: Date;
  current_period_end: Date;
  stripe_customer_id: string;
  created_at: Date;
  updated_at: Date;
}
