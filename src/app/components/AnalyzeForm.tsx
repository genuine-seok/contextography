import { Dispatch, FormEventHandler, SetStateAction } from "react";

interface AnalyzeFormProps {
  value?: string;
  setValue?: Dispatch<SetStateAction<string>>;
  onSubmit?: FormEventHandler<HTMLFormElement>;
}

export const AnalyzeForm = ({
  value,
  setValue,
  onSubmit,
}: AnalyzeFormProps) => (
  <form
    className="h-full w-full"
    onSubmit={async (e) => {
      e.preventDefault();
      onSubmit?.(e);
    }}
  >
    <div className="h-full flex flex-col items-center gap-5">
      <textarea
        className="h-full bg-lightGray border-solid border border-chacol rounded-xl placeholder:text-gray p-4 drop-shadow-sm"
        id="context"
        name="context"
        cols={60}
        placeholder="분석할 텍스트를 입력해주세요."
        value={value}
        onChange={(e) => {
          setValue?.(e.target.value);
        }}
      />
      <button
        className="w-24 font-semibold text-sm bg-point text-white p-3 rounded-full hover:drop-shadow-md hover:opacity-70 transition-all"
        type="submit"
      >
        분석하기
      </button>
    </div>
  </form>
);
