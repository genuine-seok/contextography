"use client";

import { useRef, useState } from "react";
import { Noto_Sans_KR } from "next/font/google";
import { useContextAnalyze } from "./hooks/useFontRecommend";

const noto = Noto_Sans_KR({
  display: "block",
  variable: "--font-noto",
  preload: false,
});

// const MESSAGE_1 =
//   "모든 사람은 의견의 자유와 표현의 자유에 대한 권리를 가진다. 이러한 권리는 간섭없이 의견을 가질 자유와 국경에 관계없이 어떠한 매체를 통해서도 정보와 사상을 추구하고, 얻으며, 전달하는 자유를 포함한다. 모든 사람은 사회의 일원으로서 사회보장을 받을 권리를 가지며, 국가적 노력과 국제적 협력을 통하여, 그리고 각 국가의 조직과 자원에 따라서 자신의 존엄과 인격의 자유로운 발전에 불가결한 경제적, 사회적 및 문화적 권리들을 실현할 권리를 가진다. 모든 사람은  노동시간의 합리적 제한과 정기적인 유급휴가를 포함하여 휴식과 여가의 권리를 가진다. 모든 사람은 이 선언에 규정된 권리와 자유가 완전히 실현될 수 있도록 사회적, 국제적 질서에 대한 권리를 가진다";

// const MESSAGE_2 =
//   "숲 속에 두 갈래 길이 있었다. 나는 사람들이 덜 간 길을 택했다. 그리고 그것으로 모든 것이 달라졌다.";

// const MESSAGE_3 =
//   "... 그리고 내가 눈으로 그에게 물었다 내게 다시 그래요를 요구하겠느냐고 그러자 그는 내게 물었다 내가 그래요라고 말하겠는가 하고 그래요 나의 야산의 꽃이여 그리고 나는 처음으로 그의 목을 팔로 껴안고 그를 나에게 끌어당겼다 향기를 풍기는 나의 젖가슴을 그가 느낄 수 있도록 말이다 그래요 그러자 그의 심장은 미친 듯이 뛰었다 그래서 나는 그래요 하고 말했다 그렇게 하겠어요 그래요.";

const Home = () => {
  const mainRef = useRef<HTMLParagraphElement>(null);
  const [step, setStep] = useState(1);
  const [value, setValue] = useState("");
  const {
    isLoading,
    data: analyze,
    context,
    setContext,
  } = useContextAnalyze(mainRef);

  // TEST: 모든 제안에 대해 동적 렌더링 구현하기

  return (
    // TODO: layout으로 공통 ui 추출하기
    <main
      className={`relative min-h-screen flex items-center overflow-auto bg-lightGray ${noto.variable}`}
    >
      <div className="flex flex-col items-center gap-8 w-full h-full">
        <h2 className="w-full flex flex-col items-center text-4xl text-chacol whitespace-nowrap">
          <span className="font-bold">contextyler</span>
        </h2>
        <p className="text text-center text-test whitespace-pre-wrap">
          {`글의 문맥을 분석해 글의 성격과 어울리는 폰트 스타일을 추천합니다`}
        </p>

        {/* TODO: step에 따라 동적으로 하위 요소 렌더링하는 함수로 분리 */}

        {step === 1 && (
          <>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setContext(value);
                setStep(2);
              }}
            >
              <div className="flex flex-col items-center gap-5">
                {isLoading ? (
                  <p>...분석중입니다</p>
                ) : (
                  <textarea
                    className="bg-lightGray border-solid border border-chacol rounded-xl placeholder:text-gray p-4 drop-shadow-sm"
                    id="context"
                    name="context"
                    cols={60}
                    rows={8}
                    placeholder="분석할 텍스트를 입력해주세요."
                    value={value}
                    onChange={(e) => {
                      setValue(e.target.value);
                    }}
                  ></textarea>
                )}
                <button
                  className="w-24 font-semibold text-sm bg-point text-white p-3 rounded-full hover:drop-shadow-md hover:opacity-70 transition-all"
                  type="submit"
                >
                  분석하기
                </button>
              </div>
            </form>
          </>
        )}

        {step === 2 && !!analyze && (
          <>
            {isLoading ? (
              <p>...분석중입니다.</p>
            ) : (
              <div className="w-1/2">
                <p
                  className="text-xl p-12 px-20 rounded bg-white text-test"
                  ref={mainRef}
                >
                  {context}
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
                    setStep(1);
                  }}
                >
                  돌아가기
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default Home;
