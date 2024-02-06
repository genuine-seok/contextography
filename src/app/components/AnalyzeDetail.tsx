import { useAnalyzeStore } from "../store/useAnalyzeStore";
import { AnalyzeResult } from "../hooks/useContextAnalyze";

interface AnalyzeDetailProps {
  text: string;
  result?: AnalyzeResult;
  onBack?: () => void;
}

export const AnalyzeDetail = ({ text, result, onBack }: AnalyzeDetailProps) => {
  const textRefMap = useAnalyzeStore((state) => state.textRefMap);

  if (!result) {
    return null;
  }
  const { abstract, keywords, suggestions } = result;

  return (
    <section className="flex justify-center gap-8 w-full pb-8">
      <section className="w-2/3 h-full">
        <article className="mb-8">
          <h2 className="text-xl font-medium text-chacol mb-1">분석 요약</h2>
          <p className="text-test mb-2">{abstract}</p>
        </article>

        <article className="mb-8">
          <h2 className="text-xl font-medium text-chacol mb-1">키워드</h2>
          <p className="text-test mb-2">{keywords.join(", ")}</p>
        </article>

        {/* REFACTOR: FontRecommend */}
        <section className="mb-8">
          <h2 className="text-xl font-medium text-chacol mb-1">추천 폰트</h2>
          {suggestions.map(({ fontName, fontKeywords }) => (
            <article key={fontName} className="py-4">
              <h3 className="font-medium text-chacol">{fontName}</h3>
              <p className="text-test text-sm">{fontKeywords.join(", ")}</p>
              <p
                className="p-6 rounded-md text-test text-lg"
                ref={(ref) => {
                  if (!ref || textRefMap.has(fontName)) {
                    return;
                  }

                  textRefMap.set(fontName, ref);
                }}
              >
                {text}
              </p>
              <div className="border-solid border-b border-lightGray" />
            </article>
          ))}
        </section>

        <button
          className="w-24 font-semibold text-sm bg-point text-white p-3 rounded-full hover:drop-shadow-md hover:opacity-70 transition-all float-right"
          onClick={() => {
            onBack?.();
          }}
        >
          돌아가기
        </button>
      </section>
    </section>
  );
};
