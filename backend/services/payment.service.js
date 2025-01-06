import { WalletModel } from "../models/wallet.model.js";
import { TransactionModel } from "../models/transaction.model.js";

/**
 * Creates a transaction record
 * @param {Object} params - Transaction parameters
 * @returns {Promise<Object>} Created transaction
 */
export const createTransaction = async ({
  userId,
  planId,
  amount,
  currency,
  type,
  metadata,
}) => {
  try {
    // Check for existing transaction with same session ID
    if (metadata?.stripeSessionId) {
      const existing = await TransactionModel.findOne({
        "metadata.stripeSessionId": metadata.stripeSessionId,
      });
      if (existing) {
        console.log(
          `Transaction already exists for session: ${metadata.stripeSessionId}`
        );
        return null;
      }
    }

    const transaction = new TransactionModel({
      userId,
      planId,
      amount,
      currency: currency.toUpperCase(),
      type,
      flow: "credit",
      paymentGateway: "stripe",
      status: "completed",
      metadata,
    });

    return await transaction.save();
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw error;
  }
};

/**
 * Updates wallet balance after successful payment
 */
export const updateWalletBalance = async ({
  userId,
  tokens,
  transactionId,
}) => {
  return await WalletModel.findOneAndUpdate(
    { userId },
    {
      $inc: { balance: tokens },
      $push: { transactions: transactionId },
    },
    { new: true, upsert: true }
  );
};
