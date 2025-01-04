import express from "express";
import {
  createCheckoutSession,
  verifySession,
} from "../controllers/checkout.controller.js";

const router = express.Router();

/**
 * @route POST /api/checkout/session
 * @desc Create a Stripe checkout session
 * @access Private
 */
router.post("/session", createCheckoutSession);

/**
 * @route GET /api/checkout/verify/:sessionId
 * @desc Verify a completed checkout session
 * @access Private
 */
router.get("/verify/:sessionId", verifySession);

export default router;
