import api from "./api";

export const getWalletDetails = async () => {
  try {
    const response = await api.get("/api/wallet");
    return response.data;
  } catch (error) {
    console.error("Error fetching wallet details:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch wallet details"
    );
  }
};
