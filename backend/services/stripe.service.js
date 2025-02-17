import dotenv from "dotenv";
dotenv.config();

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Retrieves and validates a Stripe session
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

const getProductDescription = (name) => {
  switch (name) {
    case "Full Report":
      return "Expert-reviewed site risk reports for quick, shareable insights.";
    case "Topography Report":
      return "Topographical reports giving you accurate height data quickly.";
    default:
      return "";
  }
};

/**
 * Creates a Stripe checkout session
 */
export const createStripeSession = async (plan, user, siteRequest) => {
  // Format site request data for metadata
  const formattedSiteRequest = {
    siteName: siteRequest.siteName || siteRequest.siteLocation,
    siteLocation: siteRequest.siteLocation,
    coordinates: siteRequest.coordinates
      ? `${siteRequest.coordinates.lat},${siteRequest.coordinates.lng}`
      : null,
  };

  // Get product description
  const description = getProductDescription(plan.name);

  // Ensure all metadata values are strings
  const metadata = {
    userId: user._id.toString(),
    planId: plan._id.toString(),
    type: plan.type,
    name: plan.name,
    tokens: plan.tokens?.toString() || "0",
    email: user.email,
    userName: user.name,
    businessName: user.businessName,
    siteRequest: JSON.stringify(formattedSiteRequest),
  };

  return stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: plan.currency.toLowerCase(),
          product_data: {
            name: plan.name,
            description: description,
          },
          unit_amount: plan.price * 100, // Stripe expects amount in cents
        },
        quantity: 1,
      },
    ],
    mode: plan.type === "subscription" ? "subscription" : "payment",
    success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/cancel`,
    metadata,
    custom_text: {
      submit: {
        message: "We'll email your report once the payment is processed.",
      },
    },
  });
};
