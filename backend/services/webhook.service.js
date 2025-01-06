import { createTransaction, updateWalletBalance } from "./payment.service.js";

/**
 * Handles successful checkout session
 * @param {Object} session - Stripe session object
 * @returns {Promise<void>}
 */
export const handleCheckoutSuccess = async (session) => {
  try {
    const { userId, planId, type, tokens } = session.metadata;

    // Create transaction with session ID in metadata
    const transaction = await createTransaction({
      userId,
      planId,
      amount: session.amount_total / 100,
      currency: session.currency.toUpperCase(),
      type,
      metadata: {
        stripeSessionId: session.id,
      },
    });

    // Only update wallet if transaction was created successfully
    if (transaction) {
      await updateWalletBalance({
        userId,
        tokens: parseInt(tokens),
        transactionId: transaction._id,
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
