import { create } from "zustand";
import { PortfolioData } from "@portify/shared";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

interface EditorState {
  draft: PortfolioData | null;
  saveStatus: SaveStatus;
  setDraft: (data: PortfolioData) => void;
  update: (patch: Partial<PortfolioData>) => void;
  setSaveStatus: (status: SaveStatus) => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  draft: null,
  saveStatus: "idle",
  setDraft: (data) => set({ draft: data }),
  update: (patch) => {
    const current = get().draft;
    if (!current) return;
    set({ draft: { ...current, ...patch }, saveStatus: "idle" });
  },
  setSaveStatus: (status) => set({ saveStatus: status }),
}));
