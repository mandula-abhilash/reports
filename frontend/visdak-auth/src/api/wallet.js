import api from "./axiosInstance";

export async function getWalletBalance() {
  const response = await api.get("/api/wallet");
  return response.data;
}

export async function creditWelcomeBonus() {
  const response = await api.post("/api/wallet/credit", {
    amount: 50,
    currency: "GBP",
    paymentGateway: "system",
    type: "wallet-recharge",
  });
  return response.data;
}
