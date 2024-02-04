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

export const useFontRecommend = (targetRef: RefObject<HTMLElement>) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [font, setFont] = useState<ContextAnalyze | undefined>();

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
        setFont(data);
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
    const fontOption = font?.suggestions[0];
    if (!fontOption) {
      return;
    }

    applyFontStyle(fontOption, targetRef);
  }, [font, targetRef]);

  return { isLoading, data: font, context: message, setContext: setMessage };
};
