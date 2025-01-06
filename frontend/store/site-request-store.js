import { create } from "zustand";
import { persist } from "zustand/middleware";

const useSiteRequestStore = create(
  persist(
    (set) => ({
      formData: null,
      setFormData: (data) => set({ formData: data }),
      clearFormData: () => set({ formData: null }),
    }),
    {
      name: "site_request_data",
    }
  )
);

export default useSiteRequestStore;
