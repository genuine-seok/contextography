import { create } from "zustand";

interface AnalyzeState {
  value: string;
  setValue: (value: string) => void;
  textRefMap: Map<string, HTMLElement>;
}

export const useAnalyzeStore = create<AnalyzeState>((set) => ({
  value: "",
  setValue: (value) => set(() => ({ value })),
  textRefMap: new Map(),
}));
