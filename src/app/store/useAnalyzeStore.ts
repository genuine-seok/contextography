import { RefObject, useRef } from "react";
import { create } from "zustand";

interface AnalyzeState {
  value: string;
  setValue: (value: string) => void;
  textRef: HTMLElement | null;
  setTextRef: (ref: HTMLElement | null) => void;
}

export const useAnalyzeStore = create<AnalyzeState>((set) => ({
  value: "",
  setValue: (value) => set(() => ({ value })),
  textRef: null,
  setTextRef: (textRef) => set(() => ({ textRef })),
}));
