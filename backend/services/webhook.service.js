import { createTransaction, updateWalletBalance } from "./payment.service.js";
import { sendCheckoutNotifications } from "./email/notification.service.js";
import { TransactionModel } from "../models/transaction.model.js";

/**
 * Handle different types of Stripe events
 */
export const handleStripeEvent = async (event) => {
  if (!event?.id) {
    console.log("Invalid event object received");
    return;
  }

  // Check if we've already processed this event
  const existingTransaction = await TransactionModel.findOne({
    "metadata.stripeEventId": event.id,
  });

  if (existingTransaction) {
    console.log(`Event ${event.id} has already been processed`);
    return;
  }

  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutSuccess(event.data.object, event.id);
      break;
    // Add other event types as needed
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
};

/**
 * Handle successful checkout completion
 */
const handleCheckoutSuccess = async (session, eventId) => {
  try {
    // Check if we've already processed this session
    const existingTransaction = await TransactionModel.findOne({
      "metadata.stripeSessionId": session.id,
    });

    if (existingTransaction) {
      console.log(`Session ${session.id} has already been processed`);
      return;
    }

    const { userId, planId, type, tokens, userName, email, businessName } =
      session.metadata;

    // Create transaction with session ID in metadata
    const transaction = await createTransaction({
      userId,
      planId,
      amount: session.amount_total / 100,
      currency: session.currency.toUpperCase(),
      type,
      metadata: {
        stripeSessionId: session.id,
        stripeEventId: eventId,
      },
    });

    // Only proceed if transaction was created successfully
    if (transaction) {
      // Update wallet balance
      await updateWalletBalance({
        userId,
        tokens: parseInt(tokens),
        transactionId: transaction._id,
      });

      // Send notifications
      await sendCheckoutNotifications({
        session,
        userName: userName,
        email,
        businessName,
      });
    }
  } catch (error) {
    // If error is due to duplicate session ID, ignore it
    if (
      error.code === 11000 &&
      error.keyPattern?.["metadata.stripeSessionId"]
    ) {
      console.log(`Duplicate transaction prevented for session: ${session.id}`);
      return;
    }
    throw error;
  }
};
