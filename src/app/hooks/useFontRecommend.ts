import { RefObject, useEffect, useState } from "react";

interface Font {
  fontKeywords: string[];
  fontName: string;
  fontUrl: string;
  fontSize: string;
  fontWeight: string;
}

interface FontOption extends Omit<Font, "fontKeywords"> {}

interface ContextAnalyze {
  abstract: string;
  keywords: string[];
  suggestions: Font[];
}

const applyFontStyle = async (
  { fontName, fontUrl, fontSize, fontWeight }: FontOption,
  targetRef: RefObject<HTMLElement>
) => {
  const newFontFace = new FontFace(`${fontName}`, `url(${fontUrl})`);
  document.fonts.add(newFontFace);
  await newFontFace.load();

  if (targetRef.current) {
    targetRef.current.style.fontFamily = `${fontName}`;
    targetRef.current.style.fontSize = `${fontSize}`;
    targetRef.current.style.fontWeight = `${fontWeight}`;
  }
};

export const useContextAnalyze = (targetRef: RefObject<HTMLElement>) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [analyze, setAnalyze] = useState<ContextAnalyze | undefined>();

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
        setAnalyze(data);
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
    // TODO: 모든 suggestions에 대해 매핑
    const fontOption = analyze?.suggestions[0];
    if (!fontOption) {
      return;
    }

    applyFontStyle(fontOption, targetRef);
  }, [analyze, targetRef]);

  return { isLoading, data: analyze, context: message, setContext: setMessage };
};
