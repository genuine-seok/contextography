import { Font } from "../hooks/useContextAnalyze";
import { useAnalyzeStore } from "../store/useAnalyzeStore";

interface FontInfoItemProps extends Pick<Font, "fontName" | "fontKeywords"> {}

export const FontInfoItem = ({ fontName, fontKeywords }: FontInfoItemProps) => {
  const [value, textRefMap] = useAnalyzeStore((state) => [
    state.value,
    state.textRefMap,
  ]);

  return (
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
        {value}
      </p>
      <div className="border-solid border-b border-lightGray" />
    </article>
  );
};
