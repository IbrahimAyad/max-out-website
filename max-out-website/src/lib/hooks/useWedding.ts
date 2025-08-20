import { useEffect, useCallback } from "react";
import { useWeddingStore } from "@/lib/store/weddingStore";
import { Measurements } from "@/lib/types";

export function useWedding() {
  const {
    wedding,
    currentMember,
    isLoading,
    error,
    loadWedding,
    setCurrentMember,
    updateMemberMeasurements,
    addMember,
    removeMember,
    clearWedding,
  } = useWeddingStore();

  const handleLoadWedding = useCallback(
    async (code: string) => {
      try {
        await loadWedding(code);
      } catch (error) {

        throw error;
      }
    },
    [loadWedding]
  );

  const handleSelectMember = useCallback(
    (memberId: string) => {
      setCurrentMember(memberId);
    },
    [setCurrentMember]
  );

  const handleUpdateMeasurements = useCallback(
    async (measurements: Measurements) => {
      if (!currentMember) {
        throw new Error("No member selected");
      }

      try {
        await updateMemberMeasurements(measurements);
      } catch (error) {

        throw error;
      }
    },
    [currentMember, updateMemberMeasurements]
  );

  return {
    wedding,
    currentMember,
    isLoading,
    error,
    loadWedding: handleLoadWedding,
    selectMember: handleSelectMember,
    updateMeasurements: handleUpdateMeasurements,
    addMember,
    removeMember,
    clearWedding,
  };
}

export function useWeddingMember(memberId: string) {
  const { wedding, setCurrentMember } = useWeddingStore();

  const member = wedding?.partyMembers.find((m) => m.id === memberId);

  useEffect(() => {
    if (member) {
      setCurrentMember(memberId);
    }
  }, [memberId, member]);

  const hasCompleteMeasurements = member?.measurements && 
    member.measurements.chest > 0 &&
    member.measurements.waist > 0 &&
    member.measurements.inseam > 0;

  return {
    member,
    hasCompleteMeasurements,
    isGroom: member?.role === "groom",
    isBestMan: member?.role === "best_man",
  };
}