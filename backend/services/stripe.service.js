import dotenv from "dotenv";
dotenv.config();

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Retrieves and validates a Stripe session
 * @param {string} sessionId - Stripe session ID
 * @returns {Promise<Object>} Validated session
 */
export const getValidatedSession = async (sessionId) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (!session) {
    throw new Error("Session not found");
  }

  if (session.payment_status !== "paid") {
    throw new Error("Payment not completed");
  }

  return session;
};

/**
 * Creates a Stripe checkout session
 * @param {Object} plan - Plan details
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Created session
 */
export const createStripeSession = async (plan, userId) => {
  return stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: plan.currency.toLowerCase(),
          product_data: {
            name: plan.name,
            description: `Plan Type: ${plan.type}`,
          },
          unit_amount: plan.price * 100, // Stripe expects amount in cents
        },
        quantity: 1,
      },
    ],
    mode: plan.type === "subscription" ? "subscription" : "payment",
    success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/cancel`,
    metadata: {
      userId,
      planId: plan._id.toString(),
      type: plan.type,
      name: plan.name,
      tokens: plan.tokens.toString(),
    },
  });
};
