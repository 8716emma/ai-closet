const CLOSER_DATA = {
  gender: ["여성", "남성", "젠더리스"],
  when: ["출근할 때", "데이트할 때", "여행갈 때", "운동할 때", "파티/모임", "평소에(데일리)"],
  where: ["회사/오피스", "카페/맛집", "야외/공원", "헬스장/러닝트랙", "클럽/라운지", "학교/캠퍼스"],
  role: ["전문적인 직장인", "러블리한 연인", "힙한 트렌드세터", "편안한 동네친구", "눈길을 끄는 주인공", "단정한 학생"],
  style: ["미니멀/깔끔", "캐주얼/스트릿", "러블리/로맨틱", "스포티/애슬레저", "빈티지/레트로", "Y2K/힙합", "포멀/수트"],
  why: ["신뢰감을 주려고", "매력을 어필하려고", "활동하기 편하려고", "사진을 잘 찍히려고", "트렌디해보이려고", "무난하고 튀지 않게"],
  body: ["상체 발달형", "하체 발달형", "마른 체형", "근육질 체형", "키가 작은 체형", "키가 큰 체형"],
  
  // 스타일별 핀터레스트 레퍼런스 룩북 데이터베이스 (고화질 Unsplash 패션 화보 매핑)
  referenceLooks: {
    "캐주얼/스트릿": { imgId: "1509631179647-0177331693ae", descr: "스트릿한 무드의 오버핏 후드티와 조거 팬츠, 그리고 청키한 스니커즈 조합" },
    "포멀/수트": { imgId: "1487222477894-8943e31ef7b2", descr: "깔끔한 네이비 블레이저 자켓, 이너 니트, 슬림핏 슬랙스와 로퍼 조합" },
    "스포티/애슬레저": { imgId: "1479064555552-3ef4979f8908", descr: "스포티한 레깅스와 크롭 탑, 그리고 가벼운 바람막이 자켓 조합" },
    "운동할 때": { imgId: "1518611012118-696072aa579a", descr: "기능성 트레이닝 상하의와 런닝화" },
    "러블리/로맨틱": { imgId: "1539109136881-3be0616acf4b", descr: "데이트를 위한 러블리한 원피스와 가디건, 메리제인 슈즈 조합" },
    "Y2K/힙합": { imgId: "1529139574466-a303027c1d8b", descr: "Y2K 감성의 로우라이즈 데님 팬츠, 크롭 티셔츠, 그리고 볼드한 벨트 조합" },
    "빈티지/레트로": { imgId: "1508214751196-bcfd4ca60f91", descr: "빈티지한 아메카지 스타일의 카고 팬츠와 워크 자켓, 캔버스화 조합" },
    "미니멀/깔끔": { imgId: "1515886657613-9f3515b0c78f", descr: "군더더기 없는 미니멀한 블랙 앤 화이트 셔츠와 슬랙스, 미니멀 토트백" },
    "default": { imgId: "1483985988355-763728e1935b", descr: "호불호 없는 깔끔한 놈코어 데일리 룩 (맨투맨과 데님 팬츠)" }
  },

  fetchRealAIRecommendation: async (promptData, apiConfig) => {
    let provider = apiConfig.provider;
    let apiKey = apiConfig.apiKey ? apiConfig.apiKey.trim() : "";
    if (apiKey.startsWith("gsk_")) provider = "groq";

    // 사용자가 고른 스타일에 매칭되는 레퍼런스 룩북 추출
    const chosenStyle = promptData.style[0] || "default";
    const refLook = CLOSER_DATA.referenceLooks[chosenStyle] || CLOSER_DATA.referenceLooks["default"];

    const promptText = `
너는 전세계 최고의 퍼스널 패션 스타일리스트야.
사용자가 다음 조건의 패션 스타일링을 원하고 있어:
- 성별: ${promptData.gender.length > 0 ? promptData.gender.join(", ") : "무관"}
- 언제: ${promptData.when.join(", ") || "평소에"}
- 어디서: ${promptData.where.join(", ") || "카페"}
- 무엇을(역할): ${promptData.role.join(", ") || "하객"}
- 어떻게(스타일): ${promptData.style.join(", ") || "캐주얼"}
- 오늘 날씨: 기온 ${promptData.weather.temp}°C (${promptData.weather.condition})

[가장 중요한 핵심 지시사항!!!]
유저에게 보여줄 핀터레스트 레퍼런스 룩북 사진의 코디는 다음과 같아:
"${refLook.descr}"

너는 반드시 **위 레퍼런스 사진 속 코디와 최대한 똑같은 룩을 연출할 수 있도록** 무신사에서 살 수 있는 실제 의류 4가지를 찾아 추천해줘야 해.
예시 데이터를 절대 베끼지 말고, 매번 새롭고 다양한 브랜드(토피, 무신사 스탠다드, 나이키 등)로 창의적으로 검색해라.
무신사 검색이 잘 되도록 상품명에 [블랙] 같은 괄호나 색상을 절대 넣지 말고 '브랜드명 + 기본 상품명'만 적어라.

반드시 아래의 JSON 규격만을 출력해 (마크다운 없이 순수 JSON만):
{
  "title": "추천 룩 이름 (레퍼런스 사진 느낌을 살린 매력적인 제목)",
  "descr": "레퍼런스 사진과 유저의 신체 특징을 고려하여 이 옷들을 어떻게 입어야 하는지 설명하는 3~4문장의 가이드 (중국어, 일본어 절대 금지! 100% 자연스러운 한국어 표준어만 작성할 것)",
  "items": ["무신사 스탠다드 반팔 티셔츠", "토피 데님 팬츠", "나이키 에어포스 1 화이트", "잔스포츠 미니 백팩"] 
}
    `;

    try {
      let response, resultData;
      if (provider === "gemini") {
        response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }], generationConfig: { responseMimeType: "application/json" } })
        });
        const resJson = await response.json();
        resultData = JSON.parse(resJson.candidates[0].content.parts[0].text.trim());
      } else if (provider === "groq") {
        response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
          body: JSON.stringify({ model: "llama-3.3-70b-versatile", response_format: { type: "json_object" }, messages: [{ role: "user", content: promptText }] })
        });
        const resJson = await response.json();
        resultData = JSON.parse(resJson.choices[0].message.content.trim());
      } else {
        response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
          body: JSON.stringify({ model: "gpt-4o-mini", response_format: { type: "json_object" }, messages: [{ role: "user", content: promptText }] })
        });
        const resJson = await response.json();
        resultData = JSON.parse(resJson.choices[0].message.content.trim());
      }
      
      // 결과 데이터에 우리가 선택했던 핀터레스트 레퍼런스 이미지 ID를 강제로 꽂아넣음
      resultData.referenceImageId = refLook.imgId;
      return resultData;
    } catch (error) {
      console.error("AI API Error:", error);
      return {
        title: "[오프라인 모드] 레퍼런스 데일리 룩",
        descr: "AI 연결이 지연되어 기본 레퍼런스 룩북을 보여드립니다. 사진과 비슷한 무드의 기본 아이템들입니다.",
        items: ["무신사 스탠다드 맨투맨", "토피 와이드 데님 팬츠", "나이키 에어포스 1", "아크테릭스 백팩"],
        referenceImageId: refLook.imgId
      };
    }
  }
};
