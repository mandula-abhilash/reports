import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["one-time", "subscription", "wallet-recharge"],
      required: true,
    },
    flow: {
      type: String,
      enum: ["debit", "credit"],
      required: true,
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
    },
    paymentGateway: {
      type: String,
      enum: ["stripe", "razorpay", "system"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    metadata: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true, collection: "vd_wallet_transactions" }
);

// Add compound index for userId and status
transactionSchema.index({ userId: 1, status: 1 });

// Add unique index for stripeSessionId to prevent duplicates
transactionSchema.index(
  { "metadata.stripeSessionId": 1 },
  { unique: true, sparse: true }
);

export const TransactionModel = mongoose.model(
  "Transaction",
  transactionSchema
);
