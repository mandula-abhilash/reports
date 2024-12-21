import api from "@/services/axiosInstance";

export async function getWalletBalance() {
  const response = await api.get("/api/wallet");
  return response.data;
}
