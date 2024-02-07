import { ReactNode } from "react";

interface AnalysisSectionProps {
  title: string;
  children: ReactNode;
}

export const AnalysisSection = ({ title, children }: AnalysisSectionProps) => {
  return (
    <article className="mb-8">
      <h2 className="text-xl font-medium text-chacol mb-1">{title}</h2>
      <p className="text-test mb-2">{children}</p>
    </article>
  );
};
