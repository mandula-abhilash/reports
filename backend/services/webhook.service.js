import { createTransaction, updateWalletBalance } from "./payment.service.js";

/**
 * Handles successful checkout session
 * @param {Object} session - Stripe session object
 * @returns {Promise<void>}
 */
export const handleCheckoutSuccess = async (session) => {
  const { userId, planId, type, tokens } = session.metadata;

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

  if (transaction) {
    await updateWalletBalance({
      userId,
      tokens: parseInt(tokens),
      transactionId: transaction._id,
    });
  }
};
