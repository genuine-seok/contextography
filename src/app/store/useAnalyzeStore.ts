import { create } from "zustand";
import { AnalyzeResult } from "../hooks/useContextAnalyze";

interface AnalyzeState {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  value: string;
  setValue: (value: string) => void;
  message: string;
  setMessage: (message: string) => void;
  data: AnalyzeResult | undefined;
  setData: (data: AnalyzeResult) => void;
  textRefMap: Map<string, HTMLElement>;
}

export const useAnalyzeStore = create<AnalyzeState>((set) => ({
  isLoading: false,
  setIsLoading: (isLoading) => set(() => ({ isLoading })),
  value: "",
  setValue: (value) => set(() => ({ value })),
  message: "",
  setMessage: (message) => set(() => ({ message })),
  data: undefined,
  setData: (data) => set(() => ({ data })),
  textRefMap: new Map(),
}));
