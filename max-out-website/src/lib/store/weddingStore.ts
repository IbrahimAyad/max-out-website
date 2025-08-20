import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Wedding, WeddingMember, Measurements } from "@/lib/types";
import { weddingClient } from "@/lib/api/weddingClient";

interface WeddingStore {
  wedding: Wedding | null;
  currentMember: WeddingMember | null;
  isLoading: boolean;
  error: string | null;

  loadWedding: (code: string) => Promise<void>;
  setCurrentMember: (memberId: string) => void;
  updateMemberMeasurements: (measurements: Measurements) => Promise<void>;
  addMember: (member: Omit<WeddingMember, "id">) => Promise<void>;
  removeMember: (memberId: string) => Promise<void>;
  clearWedding: () => void;
}

export const useWeddingStore = create<WeddingStore>()(
  persist(
    (set, get) => ({
      wedding: null,
      currentMember: null,
      isLoading: false,
      error: null,

      loadWedding: async (code: string) => {
        set({ isLoading: true, error: null });
        try {
          const wedding = await weddingClient.getWeddingByCode(code);
          if (!wedding) {
            throw new Error("Wedding not found");
          }
          set({ wedding });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : "Failed to load wedding" });

        } finally {
          set({ isLoading: false });
        }
      },

      setCurrentMember: (memberId: string) => {
        const { wedding } = get();
        if (!wedding) return;

        const member = wedding.partyMembers.find((m) => m.id === memberId);
        set({ currentMember: member || null });
      },

      updateMemberMeasurements: async (measurements: Measurements) => {
        const { wedding, currentMember } = get();
        if (!wedding || !currentMember) {
          throw new Error("No wedding or member selected");
        }

        set({ isLoading: true, error: null });
        try {
          await weddingClient.updateMemberMeasurements(
            wedding.id,
            currentMember.id,
            measurements
          );

          // Update local state
          set((state) => ({
            wedding: state.wedding
              ? {
                  ...state.wedding,
                  partyMembers: state.wedding.partyMembers.map((m) =>
                    m.id === currentMember.id
                      ? { ...m, measurements }
                      : m
                  ),
                }
              : null,
            currentMember: { ...currentMember, measurements },
          }));
        } catch (error) {
          set({ error: "Failed to update measurements" });

          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      addMember: async (member: Omit<WeddingMember, "id">) => {
        const { wedding } = get();
        if (!wedding) throw new Error("No wedding loaded");

        set({ isLoading: true, error: null });
        try {
          const newMember = await weddingClient.addWeddingMember(wedding.id, member);

          set((state) => ({
            wedding: state.wedding
              ? {
                  ...state.wedding,
                  partyMembers: [...state.wedding.partyMembers, newMember],
                }
              : null,
          }));
        } catch (error) {
          set({ error: "Failed to add member" });

          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      removeMember: async (memberId: string) => {
        const { wedding } = get();
        if (!wedding) throw new Error("No wedding loaded");

        set({ isLoading: true, error: null });
        try {
          await weddingClient.removeWeddingMember(wedding.id, memberId);

          set((state) => ({
            wedding: state.wedding
              ? {
                  ...state.wedding,
                  partyMembers: state.wedding.partyMembers.filter(
                    (m) => m.id !== memberId
                  ),
                }
              : null,
            currentMember:
              state.currentMember?.id === memberId ? null : state.currentMember,
          }));
        } catch (error) {
          set({ error: "Failed to remove member" });

          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      clearWedding: () => {
        set({ wedding: null, currentMember: null, error: null });
      },
    }),
    {
      name: "kct-wedding-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);