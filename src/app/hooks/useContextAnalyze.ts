import { useEffect, useState } from "react";
import { useAnalyzeStore } from "../store/useAnalyzeStore";

interface Font {
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
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<AnalyzeResult | undefined>();
  const textRefMap = useAnalyzeStore((state) => state.textRefMap);

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
        setResult(data);
        // FIX: 간혹 분석 자체가 실패하는 경우가 발생하는데, 에러 확인하기.
      } catch (error) {
        throw new Error("fetch font error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFontUrlBy(message);
  }, [message]);

  useEffect(() => {
    result?.suggestions.forEach((fontOption) => {
      const targetRef = textRefMap.get(fontOption.fontName);

      if (targetRef) {
        applyFontStyle(fontOption, targetRef);
      }
    });
  }, [result, textRefMap]);

  return {
    isLoading,
    data: result,
    targetText: message,
    setTargetText: setMessage,
  };
};
