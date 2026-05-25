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
    "캐주얼": { imgId: "src/assets/images/casual.jpg", descr: "스트릿한 무드의 오버핏 셔츠와 와이드 팬츠, 청키한 스니커즈 조합" },
    "꾸안꾸": { imgId: "src/assets/images/minimal.jpg", descr: "군더더기 없는 미니멀한 화이트 블라우스와 블랙 슬랙스, 미니멀 토트백" },
    "오피스": { imgId: "src/assets/images/minimal.jpg", descr: "깔끔한 블레이저 자켓, 이너 니트, 슬림핏 슬랙스와 로퍼 조합" },
    "트레이닝": { imgId: "src/assets/images/street.jpg", descr: "스포티한 레깅스와 크롭 탑, 그리고 가벼운 바람막이 자켓 조합" },
    "남친·여친룩": { imgId: "src/assets/images/romantic.jpg", descr: "데이트를 위한 러블리한 가디건과 스커트, 메리제인 슈즈 조합" },
    "단정해": { imgId: "src/assets/images/minimal.jpg", descr: "깔끔하고 단정한 미니멀 스타일의 니트와 슬랙스 조합" },
    "학생핏(교복+사복)": { imgId: "src/assets/images/casual.jpg", descr: "학생다운 풋풋한 맨투맨과 데님 팬츠, 캔버스화 조합" },
    "Y2K": { imgId: "src/assets/images/y2k.jpg", descr: "Y2K 감성의 크롭 티셔츠, 로우라이즈 팬츠, 볼드한 벨트 조합" },
    "빈티지": { imgId: "src/assets/images/street.jpg", descr: "빈티지한 아메카지 스타일의 카고 팬츠와 워크 자켓 조합" },
    "화려함": { imgId: "src/assets/images/y2k.jpg", descr: "컬러감이 돋보이는 화려한 패턴의 상의와 와이드 팬츠" },
    "오너핏": { imgId: "src/assets/images/minimal.jpg", descr: "고급스러운 수트 셋업과 레더 구두 조합" },
    "청스타일": { imgId: "src/assets/images/casual.jpg", descr: "트렌디한 데님 자켓과 데님 팬츠의 청청 코디" },
    "수트": { imgId: "src/assets/images/minimal.jpg", descr: "세련된 쓰리피스 수트와 옥스포드 슈즈 조합" },
    "캠퍼스룩": { imgId: "src/assets/images/casual.jpg", descr: "대학생 캠퍼스 룩의 정석, 후드티와 조거팬츠, 백팩" },
    "깔끔": { imgId: "src/assets/images/minimal.jpg", descr: "미니멀리즘 감성의 정갈한 셔츠와 슬랙스" },
    "블랙정장": { imgId: "src/assets/images/minimal.jpg", descr: "올블랙 포멀 수트와 시크한 로퍼" },
    "드레스": { imgId: "src/assets/images/romantic.jpg", descr: "우아하고 페미닌한 롱 드레스와 가디건" },
    "러블리": { imgId: "src/assets/images/romantic.jpg", descr: "사랑스러운 무드의 블라우스와 플리츠 스커트" },
    "MZ스타일": { imgId: "src/assets/images/street.jpg", descr: "힙하고 트렌디한 고프코어 룩, 나일론 자켓과 카고 팬츠" },
    "선생님 스타일": { imgId: "src/assets/images/minimal.jpg", descr: "신뢰감을 주는 단정한 셔츠와 테이퍼드 슬랙스" },
    "운동복": { imgId: "src/assets/images/street.jpg", descr: "편안한 기능성 스포츠웨어와 런닝화" },
    "편한 스타일": { imgId: "src/assets/images/casual.jpg", descr: "집 앞 마실에 제격인 스웨트 셋업" },
    "종교 스타일": { imgId: "src/assets/images/minimal.jpg", descr: "노출이 없는 단정하고 포멀한 니트와 롱 스커트/슬랙스" },
    "화려한 스타일": { imgId: "src/assets/images/y2k.jpg", descr: "시선을 사로잡는 비비드한 컬러와 화려한 패턴의 코디" },
    "파자마": { imgId: "src/assets/images/casual.jpg", descr: "부드럽고 편안한 라운지웨어 셋업" },
    "모나미룩": { imgId: "src/assets/images/minimal.jpg", descr: "블랙 앤 화이트의 깔끔한 모나미룩" },
    "형형색색": { imgId: "src/assets/images/street.jpg", descr: "컬러 블록이 돋보이는 스트릿 캐주얼" },
    "무채색": { imgId: "src/assets/images/minimal.jpg", descr: "그레이, 블랙, 화이트로 구성된 시크한 무채색 코디" },
    "귀여운 스타일": { imgId: "src/assets/images/romantic.jpg", descr: "동글동글한 오버핏 맨투맨과 와이드 팬츠의 귀여운 조합" },
    "하이틴": { imgId: "src/assets/images/y2k.jpg", descr: "미국 하이틴 영화 감성의 크롭 가디건과 체크 스커트" },
    "default": { imgId: "src/assets/images/casual.jpg", descr: "호불호 없는 깔끔한 놈코어 데일리 룩 (맨투맨과 데님 팬츠)" }
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

    let promptText = `
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
너는 현재 주어진 **'오늘 날씨(기온 및 상태)'와 '사용자 성별', '사용자 선택지'를 가장 완벽하게 반영한** 맞춤형 코디를 제안해야 해.
여름이면 반팔/반바지나 얇은 소재를, 겨울이면 패딩/코트를 최우선으로 고려해. 성별(남성/여성)이 지정되었다면 반드시 그 성별에 맞는 코디와 사진 프롬프트를 작성해!

[검색 실패 방지 및 매번 다른 코디 추천 규칙 (매우 중요!)]
- items 배열의 각 문자열은 **무조건 3단어**여야 합니다: "[브랜드] [카테고리] [색상]"
- [브랜드]: 의류, 모자, 가방은 무조건 "무신사 스탠다드"로 통일. 신발은 "뉴발란스", "컨버스", "반스", "아디다스" 중 1개.
- [카테고리]: 반드시 다음 중 하나만 사용: 반팔 티셔츠, 긴팔 티셔츠, 셔츠, 맨투맨, 후드티, 니트, 블레이저, 가죽 자켓, 코트, 패딩, 데님 팬츠, 슬랙스, 코튼 팬츠, 트레이닝 팬츠, 반바지, 스니커즈, 런닝화, 슬립온, 로퍼, 구두, 샌들, 볼캡, 비니, 백팩, 크로스백.
- [경고]: 절대로 아래 JSON 예시에 있는 옷(반팔 티셔츠 화이트, 데님 팬츠 블루 등)을 그대로 베끼지 마세요! 매번 유저의 상황에 맞춰 위 카테고리 내에서 완전히 다르고 신선한 색상과 조합(예: 카키색 셔츠, 차콜 슬랙스, 베이지 맨투맨 등)을 제안하세요. 동일한 코디 반복은 절대 금지됩니다!

[엄격한 금지사항]
1. 언어 (영어/일본어/한자 절대 금지): title, descr, items 필드는 100% 순수 한국어로만 작성하세요. 한자(예: 春, 秋 등)는 절대로 쓰지 마세요. (photoPrompt는 영어 허용)

반드시 아래의 JSON 규격만을 출력해 (마크다운 없이 순수 JSON만):
{
  "title": "추천 룩 이름 (핀터레스트 무드의 인스타그래머블하고 트렌디한 제목, 예: '성수동 카페거리 미니멀 룩', '힙한 무드의 꾸안꾸 스트릿')",
  "descr": "이 조합을 추천하는 이유를 패션 매거진 에디터처럼 트렌디하고 감성적으로 설명해주세요. (핀터레스트 감성, 톤앤매너 강조, 2~3문장)",
  "items": [
    {
      "name": "(이곳에 '[브랜드] [카테고리] [색상/디테일]' 형식으로 옷 명칭 기재, 예: 무신사 스탠다드 슬랙스 그레이)",
      "reason": "(이 아이템을 고른 이유, 추천하는 핏이나 소재 등 어떤 느낌으로 구매해야 하는지 팁을 1문장으로 작성)"
    }
  ]
}
    `;

    // 동일한 옷 추천 방지를 위한 난수 시드 주입
    promptText += `\n\n[시스템 강제 지시]: (난수 시드: ${Math.random()}) 예시에 얽매이지 말고, 매번 완전히 새로운 조합과 색상을 제안하세요!`;

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
      
      // AI 사진 생성 전면 중단 (기괴한 AI 합성 방지)
      // 무조건 안전한 로컬 레퍼런스 이미지(refLook.imgId)를 사용함.
      resultData.referenceImageId = refLook.imgId;
      
      // 한자(Hanja), 일본어(히라가나, 가타카나) 정규식 원천 차단 필터 및 AI 오타 보정
      const invalidCharsRegex = /[\u3400-\u9FBF\u3040-\u30FF]/g;
      resultData.title = (resultData.title || "").replace(invalidCharsRegex, '');
      resultData.descr = (resultData.descr || "").replace(invalidCharsRegex, '');
      resultData.description = resultData.descr; // 안전망
      
      const fixTypo = (str) => {
        let clean = str.replace(invalidCharsRegex, '');
        // 무신사 스탠다드 관련 모든 오타/변형을 완벽히 잡기 위한 전처리
        if (clean.includes('무신사') || clean.includes('스탠다드') || clean.includes('스타다드')) {
          const parts = clean.split(' ').filter(p => p.trim() !== '');
          if (parts.length >= 3) {
            // 카테고리(예: 티셔츠, 슬랙스)가 지워지지 않도록 무신사 관련 단어만 제거하고 합침
            const cleanedParts = parts.filter(p => !p.includes('무신사') && !p.includes('스탠다드') && !p.includes('스타다드') && !p.includes('터드') && !p.includes('탠다드'));
            return `무신사 스탠다드 ${cleanedParts.join(' ')}`;
          }
        }
        return clean;
      };
      
      if (resultData.items && Array.isArray(resultData.items)) {
        resultData.items = resultData.items.map(item => {
          if (typeof item === 'string') return { name: fixTypo(item), reason: "체형과 스타일에 잘 어울리는 추천 아이템입니다." };
          if (item && item.name) { 
            item.name = fixTypo(item.name); 
            if (item.reason) item.reason = item.reason.replace(invalidCharsRegex, '');
            return item; 
          }
          return item;
        });
      }
      return resultData;
} catch (error) {
      console.error("AI API Error:", error);
      return {
        title: "[오프라인 모드] 레퍼런스 데일리 룩",
        descr: "AI 연결이 지연되어 기본 레퍼런스 룩북을 보여드립니다. 사진과 비슷한 무드의 기본 아이템들입니다.",
        items: ["베이직 크루 넥 스웨트셔츠 [멜란지 그레이]", "와이드 핏 데님 팬츠 [딥 인디고]", "에어포스 1 '07 [로우 화이트]", "맨티스 26 백팩 [블랙]"],
        referenceImageId: refLook.imgId
      };
    }
  }
};
