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
}) => {
  const transaction = new TransactionModel({
    userId,
    planId,
    amount,
    currency: currency.toUpperCase(),
    type,
    flow: "credit",
    paymentGateway: "stripe",
    status: "completed",
  });

  return await transaction.save();
};

/**
 * Updates wallet balance after successful payment
 * @param {Object} params - Update parameters
 * @returns {Promise<Object>} Updated wallet
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
