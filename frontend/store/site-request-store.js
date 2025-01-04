import { create } from "zustand";

const useSiteRequestStore = create((set) => ({
  formData: null,
  setFormData: (data) => set({ formData: data }),
  clearFormData: () => set({ formData: null }),
}));

export default useSiteRequestStore;
