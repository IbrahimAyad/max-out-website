import { create } from 'zustand';

interface UIStore {
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  toggleCart: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isCartOpen: false,
  setIsCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
}));