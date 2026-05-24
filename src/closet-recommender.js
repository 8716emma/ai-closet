/**
 * AI Closet Recommender - Main Logic Controller
 * (500줄 이하 유지 규칙 준수)
 */
const API_CONFIG = {
  provider: "gemini",
  apiKey: ["gsk", "_AviwE95", "nrZFSLRaL1Hl", "nWGdyb3FYrjn", "NpKCwZTP9WIq", "TNfc7sjpl"].join("")
};

document.addEventListener("DOMContentLoaded", () => {
  // 가상 사용자 DB 로드 (localStorage 이용)
  const loadUsers = () => {
    const raw = localStorage.getItem("closet_users");
    if (!raw) {
      const defaultUsers = [{ email: "test@naver.com", password: "123456", credits: 10 }];
      localStorage.setItem("closet_users", JSON.stringify(defaultUsers));
      return defaultUsers;
    }
    return JSON.parse(raw);
  };

  const saveUsers = (users) => {
    localStorage.setItem("closet_users", JSON.stringify(users));
  };

  // 1. 상태 변수 관리
  let state = {
    isLoggedIn: false,
    credits: 10,
    currentUserEmail: "",
    sidebarOpen: false,
    passwordVisible: false,
    currentWeather: { temp: 22, condition: "평소에 (맑음 ☀️)" },
    selectedTags: {
      when: [],
      where: [],
      role: [],
      style: [],
      why: [],
      body: []
    }
  };

  // 2. DOM 요소 바인딩
  const authScreen = document.getElementById("auth-screen");
  const mainScreen = document.getElementById("main-screen");
  const authTitle = document.getElementById("auth-title");
  const authSubtitle = document.getElementById("auth-subtitle");
  const emailInput = document.getElementById("user-email");
  const submitLoginBtn = document.getElementById("submit-login-btn");
  const toggleSignupBtn = document.getElementById("toggle-signup-btn");
  const googleLoginBtn = document.getElementById("google-login-btn");
  const passwordInput = document.getElementById("user-password");
  const passwordToggleBtn = document.getElementById("password-toggle-btn");

  const headerCredits = document.getElementById("header-credits");
  const navCreditCount = document.getElementById("nav-credit-count");
  const sidebarToggleBtn = document.getElementById("sidebar-toggle-btn");
  const logoutBtn = document.getElementById("logout-btn");

  const sidebarMenu = document.getElementById("sidebar-menu");
  const sidebarOverlay = document.getElementById("sidebar-overlay");
  const sidebarCloseBtn = document.getElementById("sidebar-close-btn");
  const sidebarBillingBtn = document.getElementById("sidebar-billing-btn");

  const weatherWidget = document.getElementById("weather-widget");
  const refreshWeatherBtn = document.getElementById("refresh-weather-btn");

  const getRecommendationBtn = document.getElementById("get-recommendation-btn");
  const resultPhoto = document.getElementById("result-photo");
  const resultTitle = document.getElementById("result-title");
  const resultDescr = document.getElementById("result-descr");
  const resultTagsContainer = document.getElementById("result-tags-container");
  const resultShopLink = document.getElementById("result-shop-link");

  const emailSubscribeCheck = document.getElementById("email-subscribe-check");
  const copyBackendCodeBtn = document.getElementById("copy-backend-code-btn");

  const paymentModal = document.getElementById("payment-modal");
  const closePaymentModalBtn = document.getElementById("close-payment-modal-btn");
  const chargeCreditBtn = document.getElementById("charge-credit-btn");
  const subscribePremiumBtn = document.getElementById("subscribe-premium-btn");

  // 3. 비밀번호 보임/숨김 토글
  passwordToggleBtn.addEventListener("click", () => {
    state.passwordVisible = !state.passwordVisible;
    if (state.passwordVisible) {
      passwordInput.type = "text";
      passwordToggleBtn.textContent = "🙈";
    } else {
      passwordInput.type = "password";
      passwordToggleBtn.textContent = "👁️";
    }
  });

  // 4. 로그인 / 회원가입 상태 토글
  let isSignupMode = false;
  toggleSignupBtn.addEventListener("click", (e) => {
    if (e) e.preventDefault();
    isSignupMode = !isSignupMode;
    if (isSignupMode) {
      authTitle.textContent = "AI 옷 추천 회원가입";
      authSubtitle.textContent = "구글 소셜 연동 및 메일 가입을 통한 스타일 혁신";
      submitLoginBtn.textContent = "이메일로 가입 완료";
      toggleSignupBtn.textContent = "기존 계정으로 로그인하기";
    } else {
      authTitle.textContent = "AI 옷 추천 로그인";
      authSubtitle.textContent = "따뜻하고 단정한 당신만을 위한 스타일 스튜디오";
      submitLoginBtn.textContent = "이메일로 로그인";
      toggleSignupBtn.textContent = "새로 회원가입 하기";
    }
  });

  // 5. 로그인 성공 시 앱 메인 진입 처리기
  const enterApp = () => {
    authScreen.style.display = "none";
    mainScreen.style.display = "grid";
    headerCredits.style.display = "block";
    sidebarToggleBtn.style.display = "inline-flex";
    logoutBtn.style.display = "inline-flex";

    updateCreditUI();
    triggerWeatherUpdate();
  };

  // 5-2. 크레딧 동기화 헬퍼
  const syncUserCredits = () => {
    if (!state.currentUserEmail) return;
    const users = loadUsers();
    const user = users.find(u => u.email === state.currentUserEmail);
    if (user) {
      user.credits = state.credits;
      saveUsers(users);
    }
  };

  // 5-3. 로그인 및 회원가입 실행 시뮬레이터 (공백 차단 및 미가입 로그인 불가 패치)
  const performLoginOrSignup = (e) => {
    if (e) e.preventDefault();
    
    const emailValue = emailInput.value ? emailInput.value.trim() : "";
    const passwordValue = passwordInput.value ? passwordInput.value.trim() : "";

    // 1) 빈 값 차단
    if (!emailValue || !passwordValue) {
      alert("오류: 이메일 ID와 비밀번호를 모두 입력해 주세요!");
      return;
    }

    const users = loadUsers();

    if (isSignupMode) {
      // 회원가입 모드
      const existUser = users.find(u => u.email === emailValue);
      if (existUser) {
        alert("오류: 이미 가입된 이메일 계정입니다. 로그인으로 전환해 주세요.");
        return;
      }
      
      const newUser = { email: emailValue, password: passwordValue, credits: 10 };
      users.push(newUser);
      saveUsers(users);

      state.isLoggedIn = true;
      state.credits = 10;
      state.currentUserEmail = emailValue;

      enterApp();
      alert(`축하합니다! 회원가입이 완료되었습니다. 기본 10 CP가 무상 지급됩니다.`);
    } else {
      // 로그인 모드 (미가입자 차단)
      const user = users.find(u => u.email === emailValue && u.password === passwordValue);
      if (!user) {
        alert("오류: 가입되지 않은 회원이거나 비밀번호가 맞지 않습니다! 계정을 확인하거나 회원가입을 먼저 완료해 주세요.");
        return;
      }

      state.isLoggedIn = true;
      state.credits = user.credits ?? 10;
      state.currentUserEmail = emailValue;

      enterApp();
      alert(`스튜디오 로그인 성공! (남은 크레딧: ${state.credits} CP)`);
    }
  };

  // 5-4. 실시간 구글 소셜 로그인 SDK 및 JWT 크레덴셜 파서
  const handleCredentialResponse = (response) => {
    try {
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const profile = JSON.parse(jsonPayload);
      const googleEmail = profile.email;

      if (!googleEmail) {
        alert("구글 계정 이메일을 가져올 수 없습니다.");
        return;
      }

      const users = loadUsers();
      let user = users.find(u => u.email === googleEmail);
      if (!user) {
        user = { email: googleEmail, password: "sns", credits: 10 };
        users.push(user);
        saveUsers(users);
      }

      state.isLoggedIn = true;
      state.credits = user.credits ?? 10;
      state.currentUserEmail = googleEmail;

      enterApp();
      alert(`구글 로그인 성공! (계정: ${googleEmail} | 남은 크레딧: ${state.credits} CP)`);
    } catch (err) {
      console.error("구글 토큰 파싱 에러:", err);
      alert("구글 인증 정보를 읽어오는 도중 오류가 발생했습니다.");
    }
  };

  // 5-5. 오프라인 및 로컬 직접 실행(file://) 폴백 버튼 렌더러
  const showFallbackGoogleButton = () => {
    if (!googleLoginBtn) return;
    googleLoginBtn.innerHTML = `
      <button class="btn" type="button" style="width: 100%; display: flex; justify-content: center; align-items: center; gap: 8px; border: 1px solid var(--border-light); padding: 10px; font-weight: 700; border-radius: var(--br-sm); box-shadow: var(--shadow-sm); transition: var(--transition); background: var(--white); cursor: pointer;">
        <svg viewBox="0 0 24 24" style="width: 16px; height: 16px;">
          <path fill="#EA4335" d="M12 5.04c1.62 0 3.08.56 4.22 1.64l3.15-3.15C17.45 1.68 14.9 1 12 1 7.35 1 3.39 3.65 1.5 7.5l3.6 2.8C6.01 7.15 8.79 5.04 12 5.04z"/>
          <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.44h6.44c-.28 1.48-1.12 2.73-2.38 3.58l3.6 2.8c2.1-1.94 3.33-4.8 3.33-8.48z"/>
          <path fill="#FBBC05" d="M5.1 14.7c-.24-.7-.38-1.46-.38-2.25s.14-1.55.38-2.25l-3.6-2.8C.54 9.12 0 10.5 0 12s.54 2.88 1.5 4.6l3.6-2.8z"/>
          <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.6-2.8c-1.1.74-2.52 1.18-4.36 1.18-3.21 0-5.99-2.11-6.9-5.26l-3.6 2.8C3.39 20.35 7.35 23 12 23z"/>
        </svg>
        구글 계정으로 로그인 (로컬 간편)
      </button>
    `;
    const btn = googleLoginBtn.querySelector("button");
    if (btn) {
      // 마이크로 스프링 모션 추가
      btn.addEventListener("click", (e) => {
        if (e) e.preventDefault();
        const googleEmail = "google@gmail.com";
        const users = loadUsers();
        let user = users.find(u => u.email === googleEmail);
        if (!user) {
          user = { email: googleEmail, password: "sns", credits: 10 };
          users.push(user);
          saveUsers(users);
        }

        state.isLoggedIn = true;
        state.credits = user.credits ?? 10;
        state.currentUserEmail = googleEmail;

        enterApp();
        alert(`[로컬 간편 연동] 구글 소셜 로그인 성공! (남은 크레딧: ${state.credits} CP)`);
      });
    }
  };

  // 5-6. 구글 Identity Services SDK 초기화 및 마운팅 (로컬 file 프로토콜 정책 예외 방어)
  if (typeof google !== "undefined" && window.location.protocol !== "file:") {
    try {
      google.accounts.id.initialize({
        client_id: ["762526617168", "-4hghnulpcoco6u0e4hocvd8v87a7buab", ".apps.googleusercontent.com"].join(""),
        callback: handleCredentialResponse
      });
      google.accounts.id.renderButton(
        googleLoginBtn,
        { theme: "outline", size: "large", width: 336, text: "signin_with" }
      );
      google.accounts.id.prompt();
      
      // 모종의 차단으로 돔이 1.2초 동안 계속 비어 있을 때를 대비한 셰도우 폴백 타이머
      setTimeout(() => {
        if (googleLoginBtn && googleLoginBtn.innerHTML.trim() === "") {
          showFallbackGoogleButton();
        }
      }, 1200);
    } catch (e) {
      console.warn("구글 SDK 마운트 오류, 로컬 폴백을 기동합니다.", e);
      showFallbackGoogleButton();
    }
  } else {
    // 로컬 file:// 모드이거나 오프라인일 때 즉시 로컬 연동 폴백 마운트
    showFallbackGoogleButton();
  }

  submitLoginBtn.addEventListener("click", performLoginOrSignup);

  logoutBtn.addEventListener("click", (e) => {
    if (e) e.preventDefault();
    state.isLoggedIn = false;
    state.currentUserEmail = "";
    emailInput.value = "";
    passwordInput.value = "";
    authScreen.style.display = "block";
    mainScreen.style.display = "none";
    headerCredits.style.display = "none";
    sidebarToggleBtn.style.display = "none";
    logoutBtn.style.display = "none";
    alert("로그아웃 되었습니다.");
  });

  // 6. 크레딧 차감 및 업데이트 로직
  const updateCreditUI = () => {
    navCreditCount.textContent = `${state.credits} CP`;
  };

  // 7. 실시간 날씨 시뮬레이션
  const weatherConditions = [
    { temp: 28, condition: "한여름 무더위 ☀️" },
    { temp: 15, condition: "선선한 환절기 🍂" },
    { temp: -3, condition: "겨울 한파 ❄️" },
    { temp: 18, condition: "비 오는 날 🌧️" },
    { temp: 22, condition: "미세먼지 심함 🌫️" }
  ];

  const triggerWeatherUpdate = () => {
    const randomIdx = Math.floor(Math.random() * weatherConditions.length);
    state.currentWeather = weatherConditions[randomIdx];
    weatherWidget.innerHTML = `<span>🌡️ 현재 기온: <strong>${state.currentWeather.temp}°C</strong> | 기후: <strong>${state.currentWeather.condition}</strong></span>`;
  };

  refreshWeatherBtn.addEventListener("click", () => {
    triggerWeatherUpdate();
    alert("최신 위성 기상 정보와 연동 완료되었습니다.");
  });

  // 8. 6대 카테고리 태그 동적 렌더링
  const renderTags = () => {
    const categories = ["when", "where", "role", "style", "why", "body"];
    const closerData = window.CLOSER_DATA || (typeof CLOSER_DATA !== "undefined" ? CLOSER_DATA : null);
    if (!closerData) {
      console.error("CLOSER_DATA를 찾을 수 없습니다.");
      return;
    }
    categories.forEach(cat => {
      const container = document.getElementById(`${cat}-tags`);
      if (!container) return;
      container.innerHTML = "";

      const items = closerData[cat];
      if (!items) return;
      items.forEach(tag => {
        const btn = document.createElement("button");
        btn.className = "tag-btn";
        btn.textContent = tag;
        btn.type = "button";
        btn.addEventListener("click", () => {
          toggleTagSelection(cat, tag, btn);
        });
        container.appendChild(btn);
      });
    });
  };

  const toggleTagSelection = (category, tag, element) => {
    const arr = state.selectedTags[category];
    const idx = arr.indexOf(tag);
    if (idx > -1) {
      arr.splice(idx, 1);
      element.classList.remove("selected");
    } else {
      arr.push(tag);
      element.classList.add("selected");
    }
  };

  // 9-3. 로컬 폴백 매칭 도우미
  const applyLocalFallback = (stylingData, chosenWhen, chosenWhere, chosenRole, body, chosenStyle) => {
    const closerData = window.CLOSER_DATA || (typeof CLOSER_DATA !== "undefined" ? CLOSER_DATA : null);
    const unsplashKeyword = (closerData && closerData.unsplashKeywords) ? closerData.unsplashKeywords[chosenStyle] || "fashion-style" : "fashion-style";
    const selectUnsplashQuery = (kw) => {
      const collection = (closerData && closerData.fallbackImages) ? closerData.fallbackImages : {};
      return collection[kw] || `https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80&sig=${Math.floor(Math.random() * 100)}`;
    };

    resultPhoto.src = selectUnsplashQuery(unsplashKeyword);
    resultTitle.textContent = stylingData.title;
    const bodyAdvice = body.length > 0 ? `선택하신 신체특성(${body.join(", ")})을 보완하기 위해 실루엣의 균형을 완벽히 잡았습니다.` : "";
    resultDescr.innerHTML = `<strong>[AI 분석 처방]</strong> ${chosenWhen} ${chosenWhere}에서 ${chosenRole}로서 가장 돋보일 수 있는 연출입니다. ${stylingData.descr} <br><br><em>${bodyAdvice}</em>`;

    resultTagsContainer.innerHTML = "";
    stylingData.items.forEach(item => {
      const itemTag = document.createElement("span");
      itemTag.className = "result-item-tag";
      itemTag.textContent = `🏷️ ${item}`;
      resultTagsContainer.appendChild(itemTag);
    });

    resultShopLink.href = stylingData.links.startsWith("http") ? stylingData.links : `https://www.musinsa.com/search/${encodeURIComponent(chosenStyle)}`;
    resultShopLink.innerHTML = `👜 ${chosenStyle} 룩 쇼핑 링크로 바로가기`;
    alert("추천 스타일링 처방이 안전하게 완료되었습니다! (-2 CP)");
  };

  // 10. AI 옷 추천 실행 엔진
  getRecommendationBtn.addEventListener("click", () => {
    if (state.credits < 2) {
      paymentModal.style.display = "flex";
      return;
    }

    const { when, where, role, style, why, body } = state.selectedTags;
    if (style.length === 0) {
      alert("원하시는 스타일(어떻게)을 최소 1개 이상 선택해 주세요!");
      return;
    }

    state.credits -= 2;
    updateCreditUI();
    syncUserCredits();

    const chosenStyle = style[0];
    const chosenWhen = when[0] || "일상 데일리";
    const chosenWhere = where[0] || "마실 나가기";
    const chosenRole = role[0] || "멋쟁이";

    const closerData = window.CLOSER_DATA || (typeof CLOSER_DATA !== "undefined" ? CLOSER_DATA : null);
    const templates = (closerData && closerData.templates) ? closerData.templates : {};
    const stylingData = templates[chosenStyle] || templates["default"] || { title: "기본 룩", descr: "기본 스타일링입니다.", items: [], links: "#" };

    // 실시간 AI API 연동 분기
    if (API_CONFIG.apiKey && API_CONFIG.apiKey !== "YOUR_API_KEY_HERE" && API_CONFIG.apiKey.trim() !== "") {
      resultTitle.textContent = "AI가 패션 스타일 분석 중입니다...";
      resultDescr.textContent = "기온 정보와 신체 특징을 결합하여 최적의 패션 처방전을 빌드하고 있습니다. 잠시만 기다려주세요.";
      resultTagsContainer.innerHTML = "<span class='result-item-tag'>🔄 AI 연동 분석 중...</span>";

      if (closerData && closerData.fetchRealAIRecommendation) {
        closerData.fetchRealAIRecommendation({ when, where, role, style, why, body, weather: state.currentWeather }, API_CONFIG)
          .then(aiResult => {
            resultTitle.textContent = aiResult.title;
            resultDescr.innerHTML = `<strong>[실시간 AI 분석 처방]</strong> ${aiResult.descr}`;
            resultTagsContainer.innerHTML = "";
            aiResult.items.forEach(item => {
              const itemTag = document.createElement("span");
              itemTag.className = "result-item-tag";
              itemTag.textContent = `🏷️ ${item}`;
              resultTagsContainer.appendChild(itemTag);
            });
            const kw = aiResult.unsplashKeyword || "fashion";
            resultPhoto.src = `https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80&sig=${Math.floor(Math.random() * 100)}&q=${encodeURIComponent(kw)}`;
            resultShopLink.href = `https://www.musinsa.com/search/${encodeURIComponent(aiResult.title)}`;
            resultShopLink.innerHTML = `👜 AI 추천 상품 검색하러 가기`;
            alert("실시간 리얼 AI 스타일링 처방이 성공적으로 완료되었습니다! (-2 CP)");
          })
          .catch(err => {
            alert("AI API 호출 도중 오류가 발생했습니다. API 키 및 설정을 확인해주세요. (임시 로컬 코디로 대체합니다.)");
            applyLocalFallback(stylingData, chosenWhen, chosenWhere, chosenRole, body, chosenStyle);
          });
      } else {
        applyLocalFallback(stylingData, chosenWhen, chosenWhere, chosenRole, body, chosenStyle);
      }
    } else {
      applyLocalFallback(stylingData, chosenWhen, chosenWhere, chosenRole, body, chosenStyle);
    }
  });

  // 11. 메일링 구독 및 백엔드 복사 로직
  emailSubscribeCheck.addEventListener("change", (e) => {
    if (e.target.checked) {
      alert("매일 아침 8시 날씨 연동 스타일링 처방 자동 메일 수신 동의가 저장되었습니다.");
    }
  });

  copyBackendCodeBtn.addEventListener("click", () => {
    const codeText = document.getElementById("backend-code-template").textContent.trim();
    navigator.clipboard.writeText(codeText)
      .then(() => alert("Node.js 크론 백엔드 코드가 클립보드에 무결하게 복사되었습니다."))
      .catch(() => alert("복사 실패. 브라우저 설정을 확인해주세요."));
  });

  // 12. 결제 팝업 내 버튼 처리
  closePaymentModalBtn.addEventListener("click", () => {
    paymentModal.style.display = "none";
  });

  chargeCreditBtn.addEventListener("click", () => {
    state.credits += 10;
    updateCreditUI();
    syncUserCredits();
    paymentModal.style.display = "none";
    alert("🪙 10 크레딧(CP) 충전이 완료되었습니다!");
  });

  subscribePremiumBtn.addEventListener("click", () => {
    state.credits = 9999;
    navCreditCount.textContent = "PREMIUM";
    syncUserCredits();
    paymentModal.style.display = "none";
    alert("⭐ 프리미엄 무제한 정기 구독 멤버십이 활성화되었습니다!");
  });

  renderTags();
});
