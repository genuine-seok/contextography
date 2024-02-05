import { useAnalyzeStore } from "../store/useAnalyzeStore";
import { AnalyzeResult } from "../hooks/useContextAnalyze";

interface AnalyzeDetailProps {
  text: string;
  result: AnalyzeResult;
  onBack?: () => void;
}

export const AnalyzeDetail = ({
  text,
  result: { abstract, keywords, suggestions },
  onBack,
}: AnalyzeDetailProps) => {
  const textRefMap = useAnalyzeStore((state) => state.textRefMap);

  return (
    <section className="w-1/2">
      <p>분석 요약: {abstract}</p>
      <p>
        키워드:
        {keywords.map((keyword) => (
          <span key={keyword}>{keyword}</span>
        ))}
      </p>

      {/* REFACTOR: FontRecommend */}
      {suggestions.map(({ fontName, fontKeywords }) => (
        <>
          <p
            className="text-xl p-12 px-20 rounded bg-white text-test"
            ref={(ref) => {
              if (!ref || textRefMap.has(fontName)) {
                return;
              }

              textRefMap.set(fontName, ref);
              // setTextRef(ref);
            }}
          >
            {text}
          </p>
          <p>폰트: {fontName}</p>
          <p>폰트 키워드: {fontKeywords}</p>
        </>
      ))}

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
