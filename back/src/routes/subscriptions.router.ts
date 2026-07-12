import express, { Router } from "express";
import { stripeServices } from "../services/stripe-services";

const routerSubscriptions = Router();

routerSubscriptions.post("/create-payment", stripeServices.createPaymentIntent);

export default routerSubscriptions;
