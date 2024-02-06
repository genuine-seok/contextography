import {
  Children,
  ReactElement,
  ReactNode,
  isValidElement,
  useEffect,
  useMemo,
  useState,
} from "react";

type NonEmptyArray<T> = [T, ...T[]];

interface StepProps<Steps extends NonEmptyArray<string>> {
  name: Steps[number];
  onEnter?: () => void;
  children: ReactNode;
}

const Step = <Steps extends NonEmptyArray<string>>({
  onEnter,
  children,
}: StepProps<Steps>) => {
  useEffect(() => {
    onEnter?.();
  }, [onEnter]);

  return <>{children}</>;
};

interface FlowProps<Steps extends NonEmptyArray<string>> {
  steps: Steps;
  step: Steps[number];
  children: Array<ReactElement<StepProps<Steps>>>;
}

const Flow = <Steps extends NonEmptyArray<string>>({
  steps,
  step,
  children,
}: FlowProps<Steps>) => {
  const validChildren = Children.toArray(children)
    .filter(isValidElement)
    .filter((i) =>
      steps.includes((i.props as Partial<StepProps<Steps>>).name ?? "")
    ) as Array<ReactElement<StepProps<Steps>>>;

  const targetStep = validChildren.find((child) => child.props.name === step);

  if (!targetStep) {
    throw new Error(`${step} 스텝 컴포넌트를 찾지 못했습니다.`);
  }

  return <>{targetStep}</>;
};

type RouteFlowProps<Steps extends NonEmptyArray<string>> = Omit<
  FlowProps<Steps>,
  "steps" | "step"
>;

export const useFlow = <Steps extends NonEmptyArray<string>>(steps: Steps) => {
  const [step, setStep] = useState<Steps[number]>(steps[0]);

  const FlowComponent = useMemo(
    () =>
      Object.assign(
        function RouteFlow(props: RouteFlowProps<Steps>) {
          return <Flow<Steps> steps={steps} step={step} {...props} />;
        },
        {
          Step,
        }
      ),
    [step, steps]
  );

  return Object.assign([FlowComponent, setStep] as const);
};
