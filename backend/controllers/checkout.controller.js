import Stripe from "stripe";
import { PlanModel } from "../models/plan.model.js";
import { findOrCreateUser } from "../services/user.service.js";
import {
  getValidatedSession,
  createStripeSession,
} from "../services/stripe.service.js";
import { handleStripeEvent } from "../services/webhook.service.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Create a Stripe Checkout Session
 */
export const createCheckoutSession = async (req, res) => {
  try {
    const { planId, email, name, businessName } = req.body;

    if (!planId || !email || !name || !businessName) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    const user = await findOrCreateUser({ email, name, businessName });
    const plan = await PlanModel.findById(planId);

    if (!plan || !plan.isActive) {
      return res.status(404).json({
        error: "Plan not found or inactive",
      });
    }

    const session = await createStripeSession(plan, user);
    res.json({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({
      error: "Failed to create checkout session",
    });
  }
};

/**
 * Verify a completed checkout session
 */
export const verifySession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await getValidatedSession(sessionId);

    if (!session) {
      return res.status(404).json({
        error: "Session not found",
      });
    }

    res.json({
      status: session.status,
      paymentStatus: session.payment_status,
      metadata: session.metadata,
      siteRequest: session.metadata.siteRequest
        ? JSON.parse(session.metadata.siteRequest)
        : null,
    });
  } catch (error) {
    console.error("Error verifying session:", error);
    res.status(500).json({
      error: "Failed to verify session",
    });
  }
};

/**
 * Handle Stripe Webhook Events
 */
export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    await handleStripeEvent(event);
    res.json({ received: true });
  } catch (error) {
    console.error("Error handling webhook event:", error);
    res.status(500).send("Internal server error");
  }
};
