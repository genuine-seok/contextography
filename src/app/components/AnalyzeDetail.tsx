import { useRef } from "react";
import { ContextAnalyze } from "../hooks/useFontRecommend";

interface AnalyzeDetailProps {
  text: string;
  analyze: ContextAnalyze;
  onBack?: () => void;
}

export const AnalyzeDetail = ({
  text,
  analyze,
  onBack,
}: AnalyzeDetailProps) => {
  const mainRef = useRef<HTMLParagraphElement>(null);

  return (
    <section className="w-1/2">
      <p
        className="text-xl p-12 px-20 rounded bg-white text-test"
        ref={mainRef}
      >
        {text}
      </p>
      <p>분석 요약: {analyze.abstract}</p>
      <p>
        키워드:
        {analyze.keywords.map((keyword) => (
          <span key={keyword}>{keyword}</span>
        ))}
      </p>
      <p>폰트: {analyze.suggestions[0].fontName}</p>
      <p>폰트 키워드: {analyze.suggestions[0].fontKeywords}</p>
      <button
        className="w-24 font-semibold text-sm bg-point text-white p-3 rounded-full hover:drop-shadow-md hover:opacity-70 transition-all"
        onClick={() => {
          onBack?.();
        }}
      >
        돌아가기
      </button>
    </section>
  );
};
