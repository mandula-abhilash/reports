import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import bodyParser from "body-parser";
import compression from "compression";
import cookieParser from "cookie-parser";

import visdakSesamModule from "visdak-sesam";
import visdakWalletRoutes, { handleStripeWebhook } from "visdak-wallet";

const startServer = async () => {
  const app = express();

  // CORS configuration
  app.use(
    cors({
      origin: process.env.CLIENT_URL,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
      exposedHeaders: ["Set-Cookie"],
    })
  );

  // Cookie settings
  app.use(cookieParser());
  app.use(helmet()); // Security headers
  app.use(compression()); // GZIP compression

  /**
   * @route POST /api/checkout/webhook
   * @desc Handle Stripe webhook events
   * @access Public
   */
  app.post(
    "/api/checkout/webhook",
    bodyParser.raw({ type: "application/json" }),
    handleStripeWebhook
  );

  app.use(express.json());
  app.use(morgan("combined")); // Logging HTTP requests

  // Trust proxy for Nginx or other reverse proxies
  app.set("trust proxy", 1);

  try {
    // Initialize the visdak-sesam auth module
    const { authRoutes, middleware } = visdakSesamModule();

    // Mount the auth router
    app.use("/api/auth", authRoutes);

    const {
      planRoutes,
      walletRoutes,
      subscriptionRoutes,
      transactionRoutes,
      checkoutRoutes,
    } = visdakWalletRoutes(middleware);

    // Mount the visdak wallet routes
    app.use("/api/plans", planRoutes);
    app.use("/api/wallet", walletRoutes);
    app.use("/api/subscriptions", subscriptionRoutes);
    app.use("/api/transactions", transactionRoutes);
    app.use("/api/checkout", checkoutRoutes);

    // Example of a protected route
    app.get("/api/protected", middleware.protect, (req, res) => {
      res.json({ message: "This is a protected route.", user: req.user });
    });

    // Example of an admin-only route
    app.get("/api/admin", middleware.protect, middleware.admin, (req, res) => {
      res.json({ message: "This is an admin-only route.", user: req.user });
    });

    // Catch-all for undefined routes
    app.use((req, res) => {
      res.status(404).json({ error: "Route not found" });
    });

    // Global error handler
    app.use((err, req, res, next) => {
      console.error("Unhandled error:", err.message);
      res.status(500).json({ error: "Internal server error" });
    });

    const instanceId = parseInt(process.env.NODE_APP_INSTANCE || 0, 10);
    const basePort = Number(process.env.PORT);

    const PORT = basePort + instanceId;

    app.listen(PORT, () => {
      console.log(
        `Server running in ${
          process.env.NODE_ENV || "development"
        } mode on port ${PORT}`
      );
    });
  } catch (error) {
    console.error("Failed to initialize the application:", error.message);
    process.exit(1);
  }
};

startServer();
