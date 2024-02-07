import { useCallback, useEffect } from "react";
import { useAnalyzeStore } from "../store/useAnalyzeStore";
import { useShallow } from "zustand/react/shallow";

export interface Font {
  fontKeywords: string[];
  fontName: string;
  fontUrl: string;
  fontSize: string;
  fontWeight: string;
}

interface FontOption extends Omit<Font, "fontKeywords"> {}

export interface AnalyzeResult {
  abstract: string;
  keywords: string[];
  suggestions: Font[];
}

const applyFontStyle = async (
  { fontName, fontUrl, fontSize, fontWeight }: FontOption,
  targetRef?: HTMLElement | null
) => {
  const newFontFace = new FontFace(`${fontName}`, `url(${fontUrl})`);
  document.fonts.add(newFontFace);
  await newFontFace.load();

  if (targetRef) {
    targetRef.style.fontFamily = `${fontName}`;
    targetRef.style.fontSize = `${fontSize}`;
    targetRef.style.fontWeight = `${fontWeight}`;
  }
};

export const useContextAnalyze = () => {
  const [
    message,
    setMessage,
    isLoading,
    setIsLoading,
    value,
    data,
    setData,
    textRefMap,
  ] = useAnalyzeStore(
    useShallow((state) => [
      state.message,
      state.setMessage,
      state.isLoading,
      state.setIsLoading,
      state.value,
      state.data,
      state.setData,
      state.textRefMap,
    ])
  );

  const mutateContextAnalyze = useCallback(() => {
    setMessage(value);
  }, [setMessage, value]);

  useEffect(() => {
    const fetchFontUrlBy = async (message: string) => {
      if (!message) {
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch("api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }),
        });
        const { data } = await response.json();
        setData(data);
        // FIX: 간혹 분석 자체가 실패하는 경우가 발생하는데, 에러 확인하기.
      } catch (error) {
        throw new Error("fetch font error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFontUrlBy(message);
  }, [message, setData, setIsLoading]);

  useEffect(() => {
    data?.suggestions.forEach((fontOption) => {
      const targetRef = textRefMap.get(fontOption.fontName);

      if (targetRef) {
        applyFontStyle(fontOption, targetRef);
      }
    });
  }, [data, textRefMap]);

  return {
    isLoading,
    data,
    mutate: mutateContextAnalyze,
    targetText: message,
    setTargetText: setMessage,
  };
};
