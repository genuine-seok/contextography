import { FormEventHandler, useEffect } from "react";
import { useAnalyzeStore } from "../store/useAnalyzeStore";
import { Button } from "@/components";
import { useShallow } from "zustand/react/shallow";

interface AnalysisFormProps {
  onSubmit?: FormEventHandler<HTMLFormElement>;
}

export const AnalysisForm = ({ onSubmit }: AnalysisFormProps) => {
  const [value, setValue, setMessage] = useAnalyzeStore(
    useShallow((state) => [state.value, state.setValue, state.setMessage])
  );

  return (
    <section className="w-full h-full pb-8">
      <form
        className="h-full w-full"
        onSubmit={async (e) => {
          e.preventDefault();
          setMessage(value);
          onSubmit?.(e);
        }}
      >
        <div className="h-full flex flex-col items-center gap-5">
          <textarea
            className="h-full border-solid border border-chacol rounded-xl placeholder:text-gray p-4 drop-shadow-sm"
            id="context"
            name="context"
            cols={60}
            placeholder="분석할 텍스트를 입력해주세요."
            value={value}
            onChange={(e) => {
              setValue?.(e.target.value);
            }}
          />
          <Button type="submit">분석하기</Button>
        </div>
      </form>
    </section>
  );
};
