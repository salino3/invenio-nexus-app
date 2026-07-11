import { Router } from "express";
import { stripeServices, StripeServices } from "../services/stripe-services";

const routerSubscriptions = Router();

// POST /api/v1/subscriptions/create-payment-intent
routerSubscriptions.post(
  "/create-payment",
  stripeServices.createPaymentIntent.bind(StripeServices),
);

export default routerSubscriptions;
