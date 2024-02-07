import { Button } from "@/components";
import { FontInfoItem } from "./FontDetail";
import { AnalysisSection } from "./AnalysisSection";
import { useContextAnalyze } from "../hooks/useContextAnalyze";

interface AnalysisDetailProps {
  onBack?: () => void;
}

export const AnalysisDetail = ({ onBack }: AnalysisDetailProps) => {
  const { isLoading, data } = useContextAnalyze();

  if (isLoading || !data) {
    return <p>...분석중입니다.</p>;
  }

  const { abstract, keywords, suggestions } = data;

  return (
    <section className="flex justify-center gap-8 w-full pb-8">
      <div className="w-1/2 h-full">
        <AnalysisSection title="분석 요약">{abstract}</AnalysisSection>
        <AnalysisSection title="키워드">{keywords.join(", ")}</AnalysisSection>
        <AnalysisSection title="추천 폰트">
          {suggestions.map(({ fontName, fontKeywords }) => (
            <FontInfoItem
              key={fontName}
              fontName={fontName}
              fontKeywords={fontKeywords}
            />
          ))}
        </AnalysisSection>
        <Button
          onClick={() => {
            onBack?.();
          }}
        >
          돌아가기
        </Button>
      </div>
    </section>
  );
};
