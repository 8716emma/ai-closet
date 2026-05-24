const CLOSER_DATA = {
  gender: ["여성", "남성", "젠더리스"],
  when: [
    "비 올 때", "평소에", "축제 있는 날", "면접", "놀러", "운동", "학교", "데이트", "여행", 
    "특별한 날", "한여름", "환절기", "겨울", "한파", "비·눈 올 때", "미세먼지 심할 때", "장마 때", 
    "꾸미고 놀러 갈 때", "독서실 갈 때", "핫플 갈 때", "격식 있는 모임", "집 앞 마실", "대학교", 
    "인생샷 찍으러 갈 때", "최애 생카 덕질 하러 갈 때", "오마카세/와인바 갈 때", "홈파티 갈 때", 
    "스포츠", "클럽 갈 때", "종교 관련 갈 때", "소개팅"
  ],
  where: [
    "결혼식", "면접장", "학교", "회사", "여행지", "축제장", "공원", "헬스장", "워터파크", 
    "콘서트", "사진스팟", "카페", "안", "설산", "인생 사진근", "생카", "극장", "미술관", 
    "홍대", "오마카세", "핫플카페", "거리", "편의점", "대학교", "놀이공원", "캠핑장", 
    "헌팅포차", "대기업", "스카(스터디카페)", "장례식장", "강의실", "백화점", "병원", "미용실"
  ],
  role: [
    "생파 주인공", "신랑", "신부", "하객", "면접관", "면접자", "친구", "대학생", "동창", 
    "강의사", "교사", "학생", "관람객", "손님", "사장", "연인", "소개팅러", "새내기", 
    "신입사원", "발표자", "장례식 조문객", "사진작가", "모델", "러너", "직관러", "캠핑러", 
    "동네마실러", "여행자", "안내자", "직장인", "운동러", "화가", "구경꾼", "관객", 
    "아이돌", "등산객", "상사", "종교자", "DJ"
  ],
  style: [
    "캐주얼", "꾸안꾸", "오피스", "트레이닝", "남친·여친룩", "단정해", "학생핏(교복+사복)", 
    "Y2K", "빈티지", "화려함", "오너핏", "청스타일", "수트", "캠퍼스룩", "깔끔", 
    "블랙정장", "드레스", "러블리", "MZ스타일", "선생님 스타일", "운동복", "편한 스타일", 
    "종교 스타일", "화려한 스타일", "파자마", "모나미룩", "형형색색", "무채색", "귀여운 스타일", "하이틴"
  ],
  why: [
    "친구", "회사동료", "절친", "애인", "썸", "상사", "비즈니스", "가족", "아는 사람", 
    "혼자", "모르는 사람", "중고등 동창", "오친(오늘 친해진 사람)", "크루멤버", 
    "선후배", "지인", "전 애인", "친척", "고객과 서비스 제공자", "조원", "처음 본 사이"
  ],
  body: [
    "다리가 긴 편", "다리가 짧은 편", "상체비만 체형", "하체비만 체형", "골반 넓음", 
    "일자허리 체형", "마른 체형", "통통한 체형", "운동형 탄탄 체형"
  ],
  
  // 스타일별 핀터레스트 레퍼런스 룩북 데이터베이스 (고화질 Unsplash 패션 화보 매핑)
  referenceLooks: {
    "캐주얼": { imgId: "https://i.pinimg.com/736x/87/fc/b4/87fcb4a8e26bd7d9f94eb9b2ef8eb2e6.jpg", descr: "스트릿한 무드의 오버핏 셔츠와 와이드 팬츠, 청키한 스니커즈 조합" },
    "꾸안꾸": { imgId: "https://i.pinimg.com/736x/26/5d/7c/265d7c5ba65c2b03e0591ce8e1a4de1f.jpg", descr: "군더더기 없는 미니멀한 화이트 블라우스와 블랙 슬랙스, 미니멀 토트백" },
    "오피스": { imgId: "https://i.pinimg.com/736x/55/c2/c0/55c2c0199047248b61c563065b74659b.jpg", descr: "깔끔한 블레이저 자켓, 이너 니트, 슬림핏 슬랙스와 로퍼 조합" },
    "트레이닝": { imgId: "https://i.pinimg.com/736x/67/f6/00/67f6002f2324ce622834b6b694b8e23b.jpg", descr: "스포티한 레깅스와 크롭 탑, 그리고 가벼운 바람막이 자켓 조합" },
    "남친·여친룩": { imgId: "https://i.pinimg.com/736x/91/97/35/919735d4ff3e4142db37dc9a997d9183.jpg", descr: "데이트를 위한 러블리한 가디건과 스커트, 메리제인 슈즈 조합" },
    "단정해": { imgId: "https://i.pinimg.com/736x/26/5d/7c/265d7c5ba65c2b03e0591ce8e1a4de1f.jpg", descr: "깔끔하고 단정한 미니멀 스타일의 니트와 슬랙스 조합" },
    "학생핏(교복+사복)": { imgId: "https://i.pinimg.com/736x/87/fc/b4/87fcb4a8e26bd7d9f94eb9b2ef8eb2e6.jpg", descr: "학생다운 풋풋한 맨투맨과 데님 팬츠, 캔버스화 조합" },
    "Y2K": { imgId: "https://i.pinimg.com/736x/48/84/c8/4884c83abdb6ecad3df32d716839be9b.jpg", descr: "Y2K 감성의 크롭 티셔츠, 로우라이즈 팬츠, 볼드한 벨트 조합" },
    "빈티지": { imgId: "https://i.pinimg.com/736x/f6/d8/67/f6d867cbbdc552ab86f5c88b90ed9d22.jpg", descr: "빈티지한 아메카지 스타일의 카고 팬츠와 워크 자켓 조합" },
    "화려함": { imgId: "https://i.pinimg.com/736x/87/fc/b4/87fcb4a8e26bd7d9f94eb9b2ef8eb2e6.jpg", descr: "컬러감이 돋보이는 화려한 패턴의 상의와 와이드 팬츠" },
    "오너핏": { imgId: "https://i.pinimg.com/736x/1a/0e/9d/1a0e9dc320959fc93b6e828a50de8cfb.jpg", descr: "고급스러운 수트 셋업과 레더 구두 조합" },
    "청스타일": { imgId: "https://i.pinimg.com/736x/48/84/c8/4884c83abdb6ecad3df32d716839be9b.jpg", descr: "트렌디한 데님 자켓과 데님 팬츠의 청청 코디" },
    "수트": { imgId: "https://i.pinimg.com/736x/1a/0e/9d/1a0e9dc320959fc93b6e828a50de8cfb.jpg", descr: "세련된 쓰리피스 수트와 옥스포드 슈즈 조합" },
    "캠퍼스룩": { imgId: "https://i.pinimg.com/736x/87/fc/b4/87fcb4a8e26bd7d9f94eb9b2ef8eb2e6.jpg", descr: "대학생 캠퍼스 룩의 정석, 후드티와 조거팬츠, 백팩" },
    "깔끔": { imgId: "https://i.pinimg.com/736x/26/5d/7c/265d7c5ba65c2b03e0591ce8e1a4de1f.jpg", descr: "미니멀리즘 감성의 정갈한 셔츠와 슬랙스" },
    "블랙정장": { imgId: "https://i.pinimg.com/736x/1a/0e/9d/1a0e9dc320959fc93b6e828a50de8cfb.jpg", descr: "올블랙 포멀 수트와 시크한 로퍼" },
    "드레스": { imgId: "https://i.pinimg.com/736x/91/97/35/919735d4ff3e4142db37dc9a997d9183.jpg", descr: "우아하고 페미닌한 롱 드레스와 가디건" },
    "러블리": { imgId: "https://i.pinimg.com/736x/91/97/35/919735d4ff3e4142db37dc9a997d9183.jpg", descr: "사랑스러운 무드의 블라우스와 플리츠 스커트" },
    "MZ스타일": { imgId: "https://i.pinimg.com/736x/48/84/c8/4884c83abdb6ecad3df32d716839be9b.jpg", descr: "힙하고 트렌디한 고프코어 룩, 나일론 자켓과 카고 팬츠" },
    "선생님 스타일": { imgId: "https://i.pinimg.com/736x/55/c2/c0/55c2c0199047248b61c563065b74659b.jpg", descr: "신뢰감을 주는 단정한 셔츠와 테이퍼드 슬랙스" },
    "운동복": { imgId: "https://i.pinimg.com/736x/a2/2f/1b/a22f1bc2499d0eec9f6a7cb84982bb2b.jpg", descr: "편안한 기능성 스포츠웨어와 런닝화" },
    "편한 스타일": { imgId: "https://i.pinimg.com/736x/67/f6/00/67f6002f2324ce622834b6b694b8e23b.jpg", descr: "집 앞 마실에 제격인 스웨트 셋업" },
    "종교 스타일": { imgId: "https://i.pinimg.com/736x/f6/d8/67/f6d867cbbdc552ab86f5c88b90ed9d22.jpg", descr: "노출이 없는 단정하고 포멀한 니트와 롱 스커트/슬랙스" },
    "화려한 스타일": { imgId: "https://i.pinimg.com/736x/87/fc/b4/87fcb4a8e26bd7d9f94eb9b2ef8eb2e6.jpg", descr: "시선을 사로잡는 비비드한 컬러와 화려한 패턴의 코디" },
    "파자마": { imgId: "https://i.pinimg.com/736x/67/f6/00/67f6002f2324ce622834b6b694b8e23b.jpg", descr: "부드럽고 편안한 라운지웨어 셋업" },
    "모나미룩": { imgId: "https://i.pinimg.com/736x/26/5d/7c/265d7c5ba65c2b03e0591ce8e1a4de1f.jpg", descr: "블랙 앤 화이트의 깔끔한 모나미룩" },
    "형형색색": { imgId: "https://i.pinimg.com/736x/87/fc/b4/87fcb4a8e26bd7d9f94eb9b2ef8eb2e6.jpg", descr: "컬러 블록이 돋보이는 스트릿 캐주얼" },
    "무채색": { imgId: "https://i.pinimg.com/736x/26/5d/7c/265d7c5ba65c2b03e0591ce8e1a4de1f.jpg", descr: "그레이, 블랙, 화이트로 구성된 시크한 무채색 코디" },
    "귀여운 스타일": { imgId: "https://i.pinimg.com/736x/91/97/35/919735d4ff3e4142db37dc9a997d9183.jpg", descr: "동글동글한 오버핏 맨투맨과 와이드 팬츠의 귀여운 조합" },
    "하이틴": { imgId: "https://i.pinimg.com/736x/48/84/c8/4884c83abdb6ecad3df32d716839be9b.jpg", descr: "미국 하이틴 영화 감성의 크롭 가디건과 체크 스커트" },
    "default": { imgId: "https://i.pinimg.com/736x/2c/31/58/2c3158c33e21ea5c4cf848e4740e5361.jpg", descr: "호불호 없는 깔끔한 놈코어 데일리 룩 (맨투맨과 데님 팬츠)" }
  },

  fetchRealAIRecommendation: async (promptData, apiConfig) => {
    let provider = apiConfig.provider;
    let apiKey = apiConfig.apiKey ? apiConfig.apiKey.trim() : "";
    
    if (apiKey.startsWith("gsk_")) {
      provider = "groq";
    }

    // 사용자가 고른 스타일에 매칭되는 레퍼런스 룩북 추출
    const chosenStyle = promptData.style[0] || "default";
    const refLook = CLOSER_DATA.referenceLooks[chosenStyle] || CLOSER_DATA.referenceLooks["default"];

    const promptText = `
너는 전세계 최고의 퍼스널 패션 스타일리스트야.
사용자가 다음 조건의 패션 스타일링을 원하고 있어:
- 성별: ${promptData.gender && promptData.gender.length > 0 ? promptData.gender.join(", ") : "무관"}
- 언제: ${promptData.when.join(", ") || "평소에"}
- 어디서: ${promptData.where.join(", ") || "카페"}
- 무엇을(역할): ${promptData.role.join(", ") || "하객"}
- 어떻게(스타일): ${promptData.style.join(", ") || "캐주얼"}
- 왜(대상): ${promptData.why && promptData.why.length > 0 ? promptData.why.join(", ") : "친구"}
- 신체 특징 및 비율: ${promptData.body && promptData.body.length > 0 ? promptData.body.join(", ") : "보통 체형"}
- 추가 요청사항: ${promptData.customContext || "없음"}
- 오늘 날씨: 기온 ${promptData.weather.temp}°C (${promptData.weather.condition})

[가장 중요한 핵심 지시사항!!!]
유저에게 보여줄 실제 핀터레스트 레퍼런스 화보 사진의 코디는 다음과 같아:
"${refLook.descr}"

너는 반드시 **위 레퍼런스 사진 속 코디와 최대한 똑같은 룩을 연출할 수 있도록** 실제 무신사에서 살 수 있는 의류 4가지를 찾아 추천해줘야 해.

[엄격한 금지사항]
1. 절대 일본어(히라가나, 가타카나)나 중국어(한자)를 섞어 쓰지 마라! 무조건 100% 한국어 표준어만 사용해라. (예: 合わせ면 -> 매치하면)
2. 추천 아이템에 단순히 "반팔 티셔츠"라고 적지 마라. 반드시 "아디다스 파이어버드 트랙탑" 처럼 [정확한 브랜드명 + 핵심 상품명]으로 구체적으로 적어라.
3. 상품명에 [블랙] 같은 괄호나 색상을 넣지 마라.

반드시 아래의 JSON 규격만을 출력해 (마크다운 없이 순수 JSON만):
{
  "title": "추천 룩 이름 (레퍼런스 사진 느낌을 살린 매력적인 제목)",
  "descr": "레퍼런스 사진의 코디를 똑같이 구현하기 위한 스타일링 가이드. 100% 자연스러운 한국어 표준어만 사용할 것.",
  "items": ["(예: 무신사 스탠다드 릴렉스 핏 블레이저)", "(예: 리바이스 501 오리지널 핏 청바지)", "(예: 나이키 코르테즈 화이트)", "(예: 잔스포츠 수퍼브레이크 백팩)"] 
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
