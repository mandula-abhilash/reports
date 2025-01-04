import Stripe from "stripe";
import { PlanModel } from "../models/plan.model.js";
import { findOrCreateUser } from "../services/user.service.js";
import {
  getValidatedSession,
  createStripeSession,
} from "../services/stripe.service.js";
import {
  createTransaction,
  updateWalletBalance,
} from "../services/payment.service.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Create a Stripe Checkout Session
 */
export const createCheckoutSession = async (req, res) => {
  try {
    const { planId, email, name, businessName } = req.body;

    // Find or create user based on email
    const user = await findOrCreateUser({ email, name, businessName });

    // Fetch the plan from the database
    const plan = await PlanModel.findById(planId);
    if (!plan || !plan.isActive) {
      return res.status(404).json({ error: "Plan not found or inactive" });
    }

    // Create a checkout session with current tokens
    const session = await createStripeSession(plan, user._id);
    res.json({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Verify a completed checkout session
 */
export const verifySession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { email } = req.query;

    // Validate the session
    const session = await getValidatedSession(sessionId);

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    // Get user by email
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the session belongs to the current user
    if (session.metadata.userId !== user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Return session status and details
    res.json({
      status: session.status,
      paymentStatus: session.payment_status,
      metadata: {
        type: session.metadata.type,
        name: session.metadata.name,
        tokens: session.metadata.tokens,
        planId: session.metadata.planId,
      },
    });
  } catch (error) {
    console.error("Error verifying session:", error);
    res.status(500).json({ error: "Internal server error" });
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
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object;
        const { userId, planId, type, tokens } = session.metadata;

        // Create transaction record
        const transaction = await createTransaction({
          userId,
          planId,
          amount: session.amount_total / 100, // Convert cents to currency
          currency: session.currency.toUpperCase(),
          type,
        });

        // Handle wallet recharge if applicable
        if (type === "wallet-recharge") {
          await updateWalletBalance({
            userId,
            tokens: parseInt(tokens),
            transactionId: transaction._id,
          });
        }
        break;

      default:
        if (process.env.NODE_ENV === "development") {
          console.log(`Unhandled event type ${event.type}`);
        }
        break;
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Error handling webhook event:", error);
    res.status(500).send("Internal server error");
  }
};
