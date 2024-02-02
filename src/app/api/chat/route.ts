import OpenAI from "openai";

import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

interface StyleSuggestion {
  backgroundColor: string;
  fontColor: string;
  fontKeywords: string[];
  fontName: string;
  fontUrl: string;
}

interface StyleAnalyze {
  abstract: string;
  keywords: string[];
  suggestions: StyleSuggestion[];
}

const renderSystemSetupContent = () => {
  const systemSetupContent = `
    앞으로 내가 전달하는 텍스트 데이터를 분석해서, 
    텍스트의 성격을 키워드로 추출하고 그에 어울리는 폰트 타입의 이름과 
    폰트 파일의 url 주소, 배경색, 폰트색의 조합들을 두 가지 이상 추천해줘. 
    단, 한글을 지원하는 폰트 중에서만 추천해줘야 해.
    그리고 답변은 아래에 예시로 제공되는 json 포맷을 참조해서 답변해줘.

    <참조 포맷>
    {
    abstract: "해당 텍스트는 인권과 자유에 대한 내용으로 구성되어 있습니다. (...분석한 내용에 대한 자세한 설명)",
    keywords: ["신뢰성","안정성"],
    suggestions: [
      {
        fontKeywords: ['고요','세련'],
        fontName: "Lora",
        fontSize: 1.25rem,
        fontWeight: 600,
        fontUrl: "https://fonts.googleapis.com/css2?family=Lora:wght@400;700&display=swap",
      }
    ],
    }
    `;

  return systemSetupContent;
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const POST = async (req: NextRequest) => {
  const { message } = await req.json();
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "OpenAI api key not found" },
      { status: 401 }
    );
  }

  const setupContent = renderSystemSetupContent();
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: setupContent },
      { role: "user", content: message },
    ],
    temperature: 0.7,
  });
  const [choice] = completion.choices;
  // REFACTOR: 가드 연산자 개선 가능 여부 확인
  const analyze = choice.message.content
    ? (JSON.parse(choice.message.content) as StyleAnalyze)
    : null;

  if (!analyze) {
    return NextResponse.json(
      { error: "분석에 실패했습니다." },
      { status: 400 } // TODO: 적절한 상태 코드 제공
    );
  }

  const cssUrls = analyze.suggestions.map((item) => item.fontUrl);

  const fetchCssFontText = async (url: string) => {
    const response = await fetch(url);
    const text = await response.text();
    return text;
  };

  const fetchFunctions = cssUrls.map((url) => () => fetchCssFontText(url));
  const cssFontTexts = await Promise.all(fetchFunctions.map((fn) => fn()));
  // REFACTOR: procedure 함수
  const fontStaticUrls = cssFontTexts.map((text) => {
    const fontUrlMatch = text.match(/url\(['"]?(https:\/\/[^'"]+\.ttf)['"]?\)/);
    const fontFileUrl = fontUrlMatch && fontUrlMatch[1];
    return fontFileUrl;
  });
  // REFACTOR: 선언적으로 수정
  const newSuggestions = analyze.suggestions.map((item, index) => ({
    ...item,
    fontUrl: fontStaticUrls[index] ?? "",
  }));
  const data = { ...analyze, suggestions: newSuggestions };

  return NextResponse.json(
    { data },
    { status: 200, statusText: "ok", url: req.url }
  );
};
