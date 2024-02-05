"use client";

import { useState } from "react";
import { useContextAnalyze } from "./hooks/useContextAnalyze";
import { AnalyzeDetail, AnalyzeForm } from "./components";
import { useAnalyzeStore } from "./store/useAnalyzeStore";

// const MESSAGE_1 =
//   "모든 사람은 의견의 자유와 표현의 자유에 대한 권리를 가진다. 이러한 권리는 간섭없이 의견을 가질 자유와 국경에 관계없이 어떠한 매체를 통해서도 정보와 사상을 추구하고, 얻으며, 전달하는 자유를 포함한다. 모든 사람은 사회의 일원으로서 사회보장을 받을 권리를 가지며, 국가적 노력과 국제적 협력을 통하여, 그리고 각 국가의 조직과 자원에 따라서 자신의 존엄과 인격의 자유로운 발전에 불가결한 경제적, 사회적 및 문화적 권리들을 실현할 권리를 가진다. 모든 사람은  노동시간의 합리적 제한과 정기적인 유급휴가를 포함하여 휴식과 여가의 권리를 가진다. 모든 사람은 이 선언에 규정된 권리와 자유가 완전히 실현될 수 있도록 사회적, 국제적 질서에 대한 권리를 가진다";

// const MESSAGE_2 =
//   "숲 속에 두 갈래 길이 있었다. 나는 사람들이 덜 간 길을 택했다. 그리고 그것으로 모든 것이 달라졌다.";

// const MESSAGE_3 =
//   "... 그리고 내가 눈으로 그에게 물었다 내게 다시 그래요를 요구하겠느냐고 그러자 그는 내게 물었다 내가 그래요라고 말하겠는가 하고 그래요 나의 야산의 꽃이여 그리고 나는 처음으로 그의 목을 팔로 껴안고 그를 나에게 끌어당겼다 향기를 풍기는 나의 젖가슴을 그가 느낄 수 있도록 말이다 그래요 그러자 그의 심장은 미친 듯이 뛰었다 그래서 나는 그래요 하고 말했다 그렇게 하겠어요 그래요.";

const Home = () => {
  // REFACTOR: useStep
  const [step, setStep] = useState(1);
  const [value, textRef] = useAnalyzeStore((state) => [
    state.value,
    state.textRef,
  ]);
  const {
    isLoading,
    data: result,
    targetText,
    setTargetText,
  } = useContextAnalyze(textRef);

  if (isLoading) {
    return <p>...분석중입니다.</p>;
  }

  // TEST: 모든 제안에 대해 동적 렌더링 구현하기
  return (
    <section className="flex justify-center gap-8 h-full w-full p-5">
      {/* TODO: step에 따라 동적으로 하위 요소 렌더링하는 함수로 분리 */}
      {step === 1 && (
        <AnalyzeForm
          onSubmit={() => {
            setTargetText(value);
            setStep(2);
          }}
        />
      )}

      {step === 2 && !!result && (
        <AnalyzeDetail
          text={targetText}
          result={result}
          onBack={() => {
            setStep(1);
          }}
        />
      )}
    </section>
  );
};

export default Home;
