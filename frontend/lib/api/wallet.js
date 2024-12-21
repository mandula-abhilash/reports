import api from "../axiosInstance";

export async function getWalletBalance() {
  const response = await api.get("/api/wallet");
  return response.data;
}

export async function creditWelcomeBonus() {
  const response = await api.post("/api/wallet/credit", {
    amount: 50,
    description: "Welcome bonus tokens",
  });
  return response.data;
}
