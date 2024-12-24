import api from "../axiosInstance";

export async function createCheckoutSession(planData) {
  try {
    const response = await api.post("/api/checkout/session", planData);
    return response.data;
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw new Error(
      error.response?.data?.message || "Failed to create checkout session"
    );
  }
}

export async function verifyPaymentSession(sessionId) {
  try {
    const response = await api.get(`/api/checkout/verify/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error("Error verifying payment session:", error);
    throw new Error(
      error.response?.data?.message || "Failed to verify payment session"
    );
  }
}
