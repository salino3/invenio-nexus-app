import express, { Router } from "express";
import { stripeServices } from "../services/stripe-services";

const routerSubscriptions = Router();

// POST /api/v1/subscriptions/create-payment-intent
routerSubscriptions.post("/create-payment", stripeServices.createPaymentIntent);

routerSubscriptions.post(
  "/stripe/webhook",
  express.raw({ type: "application/json" }),
  stripeServices.handleStripeWebhook,
);

export default routerSubscriptions;
