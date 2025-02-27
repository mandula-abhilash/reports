import { create } from "zustand";
import { persist } from "zustand/middleware";

const useSiteRequestStore = create(
  persist(
    (set) => ({
      formData: null,
      selectedPlan: null,
      setFormData: (data) => set({ formData: data }),
      setSelectedPlan: (plan) => set({ selectedPlan: plan }),
      clearFormData: () => set({ formData: null }),
      clearSelectedPlan: () => set({ selectedPlan: null }),
      clearAll: () => set({ formData: null, selectedPlan: null }),
    }),
    {
      name: "site_request_data",
    }
  )
);

export default useSiteRequestStore;
