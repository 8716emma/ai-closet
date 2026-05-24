/**
 * AI 기반 옷 추천 서비스 - 키워드 및 추천 처방전 데이터셋
 * (500줄 이하 유지 규칙 준수)
 */

const CLOSER_DATA = {
  // 1. 기획 조건 키워드 목록
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

  // 2. 스타일 매핑용 Unsplash 키워드
  unsplashKeywords: {
    "캐주얼": "casual-streetwear",
    "꾸안꾸": "effortless-chic-outfit",
    "오피스": "business-casual-fashion",
    "트레이닝": "athleisure-wear",
    "남친·여친룩": "romantic-date-outfit",
    "단정해": "neat-minimalist-clothing",
    "학생핏(교복+사복)": "korean-school-look",
    "Y2K": "y2k-fashion-aesthetic",
    "빈티지": "vintage-retro-outfit",
    "화려함": "glamour-high-fashion",
    "오너핏": "oversized-trendy-look",
    "청스타일": "denim-on-denim",
    "수트": "sharp-tailored-suit",
    "캠퍼스룩": "preppy-campus-outfit",
    "깔끔": "clean-look-minimalism",
    "블랙정장": "all-black-formal-suit",
    "드레스": "elegant-cocktail-dress",
    "러블리": "lovely-aesthetic-outfit",
    "MZ스타일": "gorpcore-techwear",
    "선생님 스타일": "academic-chic",
    "운동복": "fitness-sportswear",
    "편한 스타일": "cozy-loungewear",
    "종교 스타일": "modest-elegant-fashion",
    "화려한 스타일": "extravagant-fashion-week",
    "파자마": "silky-pajamas",
    "모나미룩": "black-and-white-minimal",
    "형형색색": "colorful-avant-garde",
    "무채색": "monochrome-street-style",
    "귀여운 스타일": "cute-casual-outfit",
    "하이틴": "high-school-aesthetic"
  },

  // 3. 스타일링 AI 추천 데이터 템플릿
  templates: {
    "캐주얼": {
      title: "단정하고 편안한 어반 캐주얼 셋업",
      descr: "편안하면서도 스타일을 잃지 않는 캐주얼 룩입니다. 오버핏 맨투맨이나 바스락거리는 코튼 셔츠에 와이드 데님 팬츠를 매치하고, 가벼운 캔버스화나 스니커즈를 신어 경쾌하고 생동감 있는 분위기를 연출할 수 있습니다.",
      items: ["무신사 스탠다드 릴렉스 핏 크루 넥 반팔 티셔츠 [화이트]", "토피 라이트웨이트 와이드 데님 팬츠 [로우 블랙]", "컨버스 척테일러 올스타 하이 [블랙]", "잔스포츠 하프파인트 미니 백팩 [블랙]"],
      links: "https://www.musinsa.com/search/casual-outfit"
    },
    "꾸안꾸": {
      title: "꾸민 듯 안 꾸민 듯, 프렌치 에포트리스 시크",
      descr: "지나치게 신경 쓰지 않은 듯 정돈된 멋을 풍기는 스타일링입니다. 드롭 숄더의 루즈핏 가디건이나 하프 집업 니트에 편안한 뉴트럴 톤의 세미 와이드 슬랙스를 매치해 네추럴하면서도 우아한 실루엣을 완성합니다.",
      items: ["수아레 베이직 하프 집업 니트 [오트밀]", "무신사 스탠다드 라이트웨이트 와이드 히든 밴딩 슬랙스 [라이트 그레이]", "야세 레더 스웨이드 뮬 [브라운]", "아페쎄 매그뉴 카드 홀더 [블랙]"],
      links: "https://www.musinsa.com/search/minimal-look"
    },
    "오피스": {
      title: "모던하고 정갈한 비즈니스 캐주얼 셋업",
      descr: "격식을 차리면서도 현대적인 세련됨을 갖춘 오피스 룩입니다. 어깨 라인이 잘 잡힌 브라운 톤의 싱글 테일러드 재킷에 정돈된 화이트 셔츠와 테이퍼드 슬랙스를 조합하여 프로페셔널하고 신뢰감을 주는 이미지를 연출해보세요.",
      items: ["드로우핏 릴렉스 테일러드 블레이저 [블랙]", "지오다노 테이퍼드 핏 링클프리 슬랙스 [다크 네이비]", "닥터마틴 1461 모노 3홀 스무스 [블랙]", "샘소나이트 레드 백팩 [차콜]"],
      links: "https://www.musinsa.com/search/office-look"
    },
    "트레이닝": {
      title: "활동성과 스포티 무드를 겸비한 에슬레저 룩",
      descr: "움직임이 편하고 통기성이 우수한 트렌디 에슬레저 스타일입니다. 세련된 바람막이(윈드브레이커) 재킷이나 세미 크롭 아노락에 조거 팬츠나 스포티한 쇼츠를 매치하여 야외 활동 및 편안한 데일리 스포츠 룩을 구현합니다.",
      items: ["나이키 스포츠웨어 윈드러너 후디 재킷 [블랙/화이트]", "나이키 스포츠웨어 클럽 플리스 조거 팬츠 [그레이]", "아식스 젤 카야노 14 [화이트/미드나잇]", "뉴에라 언스트럭쳐 볼캡 [네이비]"],
      links: "https://www.musinsa.com/search/athleisure"
    },
    "남친·여친룩": {
      title: "호감도를 높이는 부드럽고 사랑스러운 로맨틱 데이트 룩",
      descr: "부드럽고 포근한 첫인상을 주는 데이트 룩의 정석입니다. 화사한 파스텔 혹은 따뜻한 브라운/아이보리 계열의 케이블 꽈배기 니트에 세련된 크림진 또는 A라인 플리츠 스커트를 조합해 매력적이고 단정한 분위기를 극대화합니다.",
      items: ["마하그리드 써드 로고 크루넥 맨투맨 [네이비]", "브랜디드 1905 크림 진 [크림]", "블런드스톤 오리지널 500 첼시부츠 [스타우트 브라운]", "마뗑킴 로고 코팅 미니 토트백 [블랙]"],
      links: "https://www.musinsa.com/search/date-outfit"
    },
    "단정해": {
      title: "불필요함을 덜어낸 미니멀 스탠다드 핏",
      descr: "디테일을 최소화하여 극강의 단정함을 자아내는 룩입니다. 군더더기 없는 실루엣의 모크넥 니트나 스탠다드 셔츠에 일자 핏 데님을 깔끔하게 넣어서 입고, 브라운 계열의 미니멀 가죽 벨트와 로퍼로 앵커링을 해줍니다.",
      items: ["엘무드 프리미엄 실크 모크넥 니트 [아이보리]", "플랙 커츠 스텝 크롭 데님 팬츠 [미드 블루]", "하루타 906 페니 로퍼 [블랙]", "무신사 스탠다드 이탈리안 레더 벨트 [블랙]"],
      links: "https://www.musinsa.com/search/minimal"
    },
    "수트": {
      title: "클래식하고 품격 있는 포멀 테일러드 수트",
      descr: "중요한 비즈니스 미팅, 결혼식 하객, 혹은 발표와 같은 정식 행사에 적합한 테일러드 수트 셋업입니다. 몸에 잘 맞는 어깨핏과 라펠이 돋보이는 브라운/블랙 수트에 정갈한 옥스포드화와 가죽 소품을 매치하여 완성합니다.",
      items: ["마인드브릿지 TR 스트레치 테일러드 수트 재킷 [다크 네이비]", "마인드브릿지 TR 스트레치 슬랙스 팬츠 [다크 네이비]", "락포트 에센셜 디테일 워터프루프 플레인 토 [블랙]", "닥스 실크 100% 솔리드 넥타이 [네이비]"],
      links: "https://www.musinsa.com/search/suit"
    },
    "Y2K": {
      title: "레트로 2000년대 감성의 Y2K 스트릿 패션",
      descr: "세기말 힙한 감성을 고스란히 복각한 팝하면서도 유니크한 룩입니다. 로우라이즈 카고 팬츠나 빈티지 크롭 그래픽 티셔츠를 조합하고, 두툼한 볼드 플랫폼 슈즈와 청키한 액세서리로 키치하고 자유분방한 개성을 표출합니다.",
      items: ["디스이즈네버댓 아치 로고 티셔츠 [오트밀]", "코드그라피 파라슈트 카고 팬츠 [카키]", "살로몬 XT-6 어드밴스 [블랙]", "칼하트 WIP 에센셜 크로스백 [블랙]"],
      links: "https://search.shopping.naver.com/search/all?query=y2k"
    },
    "빈티지": {
      title: "시간이 빚어낸 듯한 레트로 아메카지 빈티지 룩",
      descr: "포근하고 깊이 있는 아날로그 감성을 전하는 스타일입니다. 워싱된 데님 재킷이나 빈티지한 패턴의 자카드 카디건에 코듀로이 팬츠를 매치하여, 멋스럽게 낡은 듯한 텍스처의 고급스러운 조합을 만듭니다.",
      items: ["브라운야드 아가일 울 카디건 [브라운]", "그라미치 코듀로이 루즈 테이퍼드 팬츠 [모카]", "팀버랜드 6인치 프리미엄 워터프루프 부츠 [위트]", "모스콧 렘토쉬 뿔테 안경 [톨토이즈]"],
      links: "https://www.musinsa.com/search/vintage"
    },
    "default": {
      title: "세련된 아이보리 & 브라운 레이어드 매칭 룩",
      descr: "선택해주신 완벽한 상황에 맞는 시그니처 아이보리 & 브라운 톤온톤 레이어드 스타일링입니다. 따뜻하고 부드러운 하프넥 니트 웨어에 단정한 와이드 치노 팬츠를 조합하여 사계절 언제나 편안하고 품격 있게 소화할 수 있습니다.",
      items: ["쿠어 울 블렌드 하프넥 니트 [모카]", "커버낫 원턱 와이드 치노 팬츠 [베이지]", "클락스 왈라비 메이플 스웨이드 [메이플]", "카시오 AQ-230 빈티지 전자시계 [실버]"],
      links: "musinsa.com"
    }
  },
  
  // 4. 로컬 폴백 매칭 이미지 데이터베이스 (Unsplash ID)
  fallbackImages: {
    "casual-streetwear": "https://i.pinimg.com/736x/87/fc/b4/87fcb4a8e26bd7d9f94eb9b2ef8eb2e6.jpg",
    "business-casual-fashion": "https://i.pinimg.com/736x/55/c2/c0/55c2c0199047248b61c563065b74659b.jpg",
    "athleisure-wear": "https://i.pinimg.com/736x/67/f6/00/67f6002f2324ce622834b6b694b8e23b.jpg",
    "fitness-sportswear": "https://i.pinimg.com/736x/a2/2f/1b/a22f1bc2499d0eec9f6a7cb84982bb2b.jpg",
    "romantic-date-outfit": "https://i.pinimg.com/736x/91/97/35/919735d4ff3e4142db37dc9a997d9183.jpg",
    "y2k-fashion-aesthetic": "https://i.pinimg.com/736x/48/84/c8/4884c83abdb6ecad3df32d716839be9b.jpg",
    "vintage-retro-outfit": "https://i.pinimg.com/736x/f6/d8/67/f6d867cbbdc552ab86f5c88b90ed9d22.jpg",
    "sharp-tailored-suit": "https://i.pinimg.com/736x/1a/0e/9d/1a0e9dc320959fc93b6e828a50de8cfb.jpg",
    "clean-look-minimalism": "https://i.pinimg.com/736x/26/5d/7c/265d7c5ba65c2b03e0591ce8e1a4de1f.jpg",
    "default": "https://i.pinimg.com/736x/2c/31/58/2c3158c33e21ea5c4cf848e4740e5361.jpg"
  },

  // 5. 실시간 AI API 비동기 Fetch 통신 엔진 (500줄 규칙 준수용 이관)
  fetchRealAIRecommendation: async (promptData, apiConfig) => {
    let provider = apiConfig.provider;
    let apiKey = apiConfig.apiKey ? apiConfig.apiKey.trim() : "";
    
    if (apiKey.startsWith("gsk_")) {
      provider = "groq";
    }

    const promptText = `
너는 전세계 최고의 퍼스널 패션 스타일리스트야.
다음 조건과 날씨에 맞춰 극적으로 세련된 패션 스타일링 처방전과 세부 아이템을 추천해 줘:
- 언제: ${promptData.when.join(", ") || "평소에"}
- 어디서: ${promptData.where.join(", ") || "카페"}
- 무엇을(역할): ${promptData.role.join(", ") || "하객"}
- 어떻게(스타일): ${promptData.style.join(", ") || "캐주얼"}
- 왜(대상): ${promptData.why.join(", ") || "친구"}
- 신체 특징 및 비율: ${promptData.body.join(", ") || "보통 체형"}
- 오늘 날씨: 기온 ${promptData.weather.temp}°C (${promptData.weather.condition})

반드시 아래의 JSON 규격(형식)만을 출력해야 해. 마크다운(\`\`\`json) 등 부가 텍스트는 절대 붙이지 말고 순수 JSON 문자열만 출력해줘:
{
  "title": "추천 룩 이름 (사용자가 입력한 상황(언제/어디서/무엇을)을 반영. 예: '최애 생카를 위한 러블리룩')",
  "descr": "상황과 신체 특징을 결합한 3~4문장의 스타일링 가이드 (100% 한국어 필수)",
  "items": ["무신사 스탠다드 릴렉스 핏 크루 넥 반팔 티셔츠 [블랙]", "토피 2WAY 스트링 와이드 데님 팬츠 [로우 블랙]", "나이키 에어포스 1 '07 화이트", "잔스포츠 하프파인트 미니 백팩"], // (매우 중요) 검색을 방해하는 [상의] 같은 접두어는 절대 쓰지 말고 오직 '정확한 상품 풀네임'만 적어라. 반드시 1번째는 상의, 2번째는 하의, 3번째는 신발, 4번째는 액세서리로 총 4개를 순서대로 정확하게 추천할 것. 무신사 입점 브랜드 위주.
  "unsplashKeyword": "영문 패션 이미지 키워드 (반드시 다음 중 하나만 정확히 선택: casual-streetwear, business-casual-fashion, athleisure-wear, fitness-sportswear, romantic-date-outfit, y2k-fashion-aesthetic, vintage-retro-outfit, sharp-tailored-suit, clean-look-minimalism, default)"
}
    `;

    try {
      let response, resultData;
      if (provider === "gemini") {
        response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }],
            generationConfig: { responseMimeType: "application/json" }
          })
        });
        const resJson = await response.json();
        resultData = JSON.parse(resJson.candidates[0].content.parts[0].text.trim());
      } else if (provider === "groq") {
        response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" },
            messages: [{ role: "user", content: promptText }]
          })
        });
        const resJson = await response.json();
        resultData = JSON.parse(resJson.choices[0].message.content.trim());
      } else {
        response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            response_format: { type: "json_object" },
            messages: [{ role: "user", content: promptText }]
          })
        });
        const resJson = await response.json();
        resultData = JSON.parse(resJson.choices[0].message.content.trim());
      }
      return resultData;
    } catch (error) {
      console.error("AI API 호출 실패:", error);
      throw error;
    }
  },
  
  // 6. 프리미엄 커스텀 토스트 알림창 기동 유틸리티 (스레드 차단 방지 및 디자인 럭셔리화)
  showToast: (message, type = "info") => {
    if (typeof document === "undefined") return;
    
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      container.style.cssText = `
        position: fixed;
        top: 24px;
        right: 24px;
        z-index: 99999;
        display: flex;
        flex-direction: column;
        gap: 12px;
        pointer-events: none;
      `;
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.style.cssText = `
      min-width: 320px;
      max-width: 450px;
      padding: 16px 20px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 0.9rem;
      color: #ffffff !important;
      box-shadow: 0 10px 30px rgba(0,0,0,0.25);
      display: flex;
      align-items: center;
      gap: 10px;
      transform: translateX(120%);
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      pointer-events: auto;
      cursor: pointer;
      border: 2px solid #000000;
    `;

    let bg = "linear-gradient(135deg, #161413 0%, #302a28 100%)";
    let icon = "🔔";
    if (type === "success") {
      bg = "linear-gradient(135deg, #1b3d17 0%, #2f6b28 100%)";
      icon = "✅";
    } else if (type === "error") {
      bg = "linear-gradient(135deg, #571313 0%, #912727 100%)";
      icon = "❌";
    } else if (type === "warning") {
      bg = "linear-gradient(135deg, #614003 0%, #a16b08 100%)";
      icon = "⚠️";
    }

    toast.style.background = bg;
    toast.innerHTML = `<span style="font-size: 1.1rem; display: flex; align-items: center; justify-content: center;">${icon}</span> <span style="color: #ffffff !important; text-shadow: 0 1px 2px rgba(0,0,0,0.35); line-height: 1.4;">${message}</span>`;
    
    container.appendChild(toast);

    // 강제 리플로우
    toast.offsetHeight;

    requestAnimationFrame(() => {
      toast.style.transform = "translateX(0)";
    });

    const dismiss = () => {
      toast.style.transform = "translateX(120%)";
      toast.style.opacity = "0";
      setTimeout(() => {
        if (toast.parentNode) toast.remove();
      }, 400);
    };

    toast.addEventListener("click", dismiss);
    setTimeout(dismiss, 4000);
  }
};

// 모듈로 공유하기 위해 글로벌 윈도우 객체 및 내보내기 지원
if (typeof window !== "undefined") {
  window.CLOSER_DATA = CLOSER_DATA;

  // 브라우저 환경에서 기본 alert를 커스텀 토스트 알림창으로 실시간 몽키 패치
  const originalAlert = window.alert;
  window.alert = (message) => {
    if (typeof document === "undefined" || !document.body) {
      if (originalAlert) originalAlert(message);
      return;
    }
    let type = "success";
    const msg = message ? message.toString() : "";
    if (msg.includes("오류") || msg.includes("실패") || msg.includes("부족")) {
      type = "error";
    } else if (msg.includes("정보") || msg.includes("동의") || msg.includes("복사") || msg.includes("기록") || msg.includes("문의") || msg.includes("로그아웃")) {
      type = "warning";
    }
    CLOSER_DATA.showToast(msg, type);
  };
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = CLOSER_DATA;
}
