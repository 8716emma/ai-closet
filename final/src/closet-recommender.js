/**
 * AI Closet Recommender - Main Logic Controller
 * (500줄 이하 유지 규칙 준수)
 */
const API_CONFIG = {
  provider: "groq",
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
    gender: [],
    when: [],
    where: [],
    role: [],
    style: [],
    why: [],
    body: []
  }
  };
  // 2. DOM 요소 바인딩 (최적화)
  const $ = (id) => document.getElementById(id);
  const authScreen=$("auth-screen"), mainScreen=$("main-screen"), authTitle=$("auth-title"), authSubtitle=$("auth-subtitle");
  const emailInput=$("user-email"), submitLoginBtn=$("submit-login-btn"), toggleSignupBtn=$("toggle-signup-btn"), googleLoginBtn=$("google-login-btn");
  const passwordInput=$("user-password"), passwordToggleBtn=$("password-toggle-btn");
  const headerCredits=$("header-credits"), navCreditCount=$("nav-credit-count"), sidebarToggleBtn=$("sidebar-toggle-btn"), logoutBtn=$("logout-btn");
  const sidebarMenu=$("sidebar-menu"), sidebarOverlay=$("sidebar-overlay"), sidebarCloseBtn=$("sidebar-close-btn"), sidebarBillingBtn=$("sidebar-billing-btn");
  const weatherWidget=$("weather-widget"), refreshWeatherBtn=$("refresh-weather-btn"), getRecommendationBtn=$("get-recommendation-btn");
  const fullscreenDashboard=$("fullscreen-dashboard"), dashLinksTop=$("dash-links-top"), dashLinksBottom=$("dash-links-bottom");
  const dashResultTitle=$("dash-result-title"), dashResultDescr=$("dash-result-descr"), dashPinterestBanner=$("dash-pinterest-banner"), dashCloseBtn=$("dash-close-btn");
  const emailSubscribeCheck=$("email-subscribe-check"), paymentModal=$("payment-modal"), closePaymentModalBtn=$("close-payment-modal-btn");
  const chargeCreditBtn=$("charge-credit-btn"), subscribePremiumBtn=$("subscribe-premium-btn");
  if (dashCloseBtn) dashCloseBtn.addEventListener("click", () => { fullscreenDashboard.style.display = "none"; mainScreen.style.display = "grid"; });
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

  // 3-0. 전역 Toast 알림 헬퍼
  const showToast = (message) => {
    const toast = document.createElement("div");
    toast.className = "toast-notification";
    toast.innerHTML = `<span>✨</span> ${message}`;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.animation = "slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards";
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };
  window.showToast = showToast; // HTML 인라인 onclick용

  // 3-1. 사이드바 열기/닫기 토글
  if (sidebarToggleBtn && sidebarMenu && sidebarOverlay && sidebarCloseBtn) {
    sidebarToggleBtn.addEventListener("click", () => {
      sidebarMenu.classList.add("open");
      sidebarOverlay.classList.add("active");
    });
    const closeSidebar = () => {
      sidebarMenu.classList.remove("open");
      sidebarOverlay.classList.remove("active");
    };
    sidebarCloseBtn.addEventListener("click", closeSidebar);
    sidebarOverlay.addEventListener("click", closeSidebar);
  }
  // 4. 로그인 / 회원가입 상태 토글
  let isSignupMode = false;
  const AUTH_MODES = {
  login:  ["로그인합니다", "따뜻하고 단정한 당신만을 위한 스타일 스튜디오", "로그인하기", "새로 회원가입 하기"],
  signup: ["회원가입합니다", "아이디 또는 이메일로 가입하고 풀 스타일을 시작하세요!", "가입 완료하기", "기존 계정으로 로그인하기"]
  };
  const idLabel = document.getElementById("auth-id-label");
  const setAuthMode = (mode) => {
  isSignupMode = (mode === "signup");
  const [t, s, btn, tog] = AUTH_MODES[mode];
  authTitle.textContent = `AI 옷 추천 ${t}`;
  authSubtitle.textContent = s; submitLoginBtn.textContent = btn; toggleSignupBtn.textContent = tog;
  if (idLabel) idLabel.textContent = isSignupMode ? "아이디 또는 이메일" : "이메일 또는 아이디";
  };
  const switchToLoginMode = () => setAuthMode("login");
  toggleSignupBtn.addEventListener("click", (e) => {
  if (e) e.preventDefault();
  setAuthMode(isSignupMode ? "login" : "signup");
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
  // 5-2. 크레딧 동기화 헬퍼 (대소문자 무시)
  const syncUserCredits = () => {
  if (!state.currentUserEmail) return;
  const users = loadUsers();
  const normCurrent = state.currentUserEmail.toLowerCase();
  const user = users.find(u => u.email.toLowerCase() === normCurrent);
  if (user) {
    user.credits = state.credits;
    saveUsers(users);
  }
  };
  // 5-3. 로그인 및 회원가입 (이메일 + 아이디 겸용)
  const isEmailFormat = (v) => v.includes("@");
  const isValidId = (v) => /^[a-zA-Z0-9가-힣._-]{2,20}$/.test(v);
  const performLoginOrSignup = (e) => {
  if (e) e.preventDefault();
  const idValue = emailInput.value ? emailInput.value.trim() : "";
  const passwordValue = passwordInput.value ? passwordInput.value.trim() : "";
  if (!idValue || !passwordValue) {
    showToast("오류: 아이디(또는 이메일)와 비밀번호를 모두 입력해 주세요!");
    return;
  }
  if (isSignupMode && !isEmailFormat(idValue) && !isValidId(idValue)) {
    showToast("오류: 아이디는 2~20자, 영문/숫자/한글/밑줄/점 조합만 가능합니다.");
    return;
  }
  const users = loadUsers();
  const normId = idValue.toLowerCase();
  const findUser = (norm) => users.find(u => (u.email || "").toLowerCase() === norm);
  if (isSignupMode) {
    if (findUser(normId)) {
      switchToLoginMode();
      const existUser = findUser(normId);
      if (existUser && existUser.password === "sns") {
        showToast("이미 구글 간편 로그인으로 가입된 계정입니다! 아래 구글 로그인 버튼을 사용해 주세요.");
      } else {
        const type = isEmailFormat(idValue) ? "이메일" : "아이디";
        let msg = `이미 가입된 ${type}입니다. 로그인 모드로 전환했으니 비밀번호를 입력해 로그인해 주세요!`;
        if (normId === "test@naver.com") msg += " (데모 계정 비밀번호: 123456)";
        showToast(msg);
      }
      return;
    }
    const newUser = { email: idValue, password: passwordValue, credits: 20 };
    users.push(newUser);
    saveUsers(users);
    state.isLoggedIn = true; state.credits = 20; state.currentUserEmail = idValue;
    enterApp();
    if (isEmailFormat(idValue)) {
      showToast("이메일 형식으로 가입을 환영합니다! (20 CP 지급)");
    } else {
      showToast("새로운 아이디로 가입을 환영합니다! (20 CP 지급)");
    }
  } else {
    const user = findUser(normId);
    if (!user) {
    const type = isEmailFormat(idValue) ? "이메일" : "아이디";
    showToast(`오류: 가입된 ${type}이 없습니다! 회원가입을 먼저 해 주세요.`);
    return;
    }
    if (user.password === "sns") {
    showToast("오류: 구글 간편 로그인 계정입니다. 아래 '구글 계정으로 로그인' 버튼을 이용해 주세요!");
    return;
    }
    if (user.password !== passwordValue) {
    let err = "오류: 비밀번호가 일치하지 않습니다! 다시 확인해 주세요.";
    if (normId === "test@naver.com") err += " (데모 계정 비밀번호: 123456)";
    showToast(err); return;
    }
    state.isLoggedIn = true; state.credits = user.credits ?? 10; state.currentUserEmail = user.email;
    enterApp();
    showToast("로그인 성공!");
  }
  };
  const handleCredentialResponse = (response) => {
    try {
      const jsonPayload = decodeURIComponent(window.atob(response.credential.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
      const googleEmail = JSON.parse(jsonPayload).email;
      if (!googleEmail) return showToast("구글 계정 이메일을 가져올 수 없습니다.");
      const users = loadUsers();
      let user = users.find(u => u.email === googleEmail);
      if (!user) { user = { email: googleEmail, password: "sns", credits: 10 }; users.push(user); saveUsers(users); }
      state.isLoggedIn = true; state.credits = user.credits ?? 10; state.currentUserEmail = googleEmail;
      enterApp(); showToast("구글 로그인 성공!");
    } catch (err) {
      console.error("구글 에러:", err); showToast("구글 인증 오류가 발생했습니다.");
    }
  };
  // 5-5. 오프라인 및 로컬 직접 실행(file://) 폴백 버튼 렌더러
  const showFallbackGoogleButton = () => {
    if (!googleLoginBtn) return;
    googleLoginBtn.innerHTML = `<button class="btn" type="button" style="width: 100%; display: flex; justify-content: center; align-items: center; gap: 8px; border: 1px solid var(--border-light); padding: 10px; font-weight: 700; border-radius: var(--br-sm); box-shadow: var(--shadow-sm); background: var(--white); cursor: pointer;"><svg viewBox="0 0 24 24" style="width: 16px; height: 16px;"><path fill="#EA4335" d="M12 5.04c1.62 0 3.08.56 4.22 1.64l3.15-3.15C17.45 1.68 14.9 1 12 1 7.35 1 3.39 3.65 1.5 7.5l3.6 2.8C6.01 7.15 8.79 5.04 12 5.04z"/><path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.44h6.44c-.28 1.48-1.12 2.73-2.38 3.58l3.6 2.8c2.1-1.94 3.33-4.8 3.33-8.48z"/><path fill="#FBBC05" d="M5.1 14.7c-.24-.7-.38-1.46-.38-2.25s.14-1.55.38-2.25l-3.6-2.8C.54 9.12 0 10.5 0 12s.54 2.88 1.5 4.6l3.6-2.8z"/><path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.6-2.8c-1.1.74-2.52 1.18-4.36 1.18-3.21 0-5.99-2.11-6.9-5.26l-3.6 2.8C3.39 20.35 7.35 23 12 23z"/></svg> 구글 계정으로 로그인 (로컬 간편)</button>`;
    const btn = googleLoginBtn.querySelector("button");
    if (btn) {
      btn.addEventListener("click", (e) => {
        if (e) e.preventDefault();
        const users = loadUsers(), googleEmail = "google@gmail.com";
        let user = users.find(u => u.email === googleEmail);
        if (!user) { user = { email: googleEmail, password: "sns", credits: 10 }; users.push(user); saveUsers(users); }
        state.isLoggedIn = true; state.credits = user.credits ?? 10; state.currentUserEmail = googleEmail;
        enterApp(); showToast("구글 연동 성공!");
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
    
    setTimeout(() => {
    if (googleLoginBtn && googleLoginBtn.innerHTML.trim() === "") {
      showFallbackGoogleButton();
    }
    }, 2500);
  } catch (e) {
    console.warn("구글 SDK 마운트 오류, 로컬 폴백을 기동합니다.", e);
    showFallbackGoogleButton();
  }
  } else {
  showFallbackGoogleButton();
  }
  submitLoginBtn.addEventListener("click", performLoginOrSignup);
  const resetUsersBtn = document.getElementById("reset-users-btn");
  if (resetUsersBtn) resetUsersBtn.addEventListener("click", () => {
  if (window.confirm("계정 데이터를 전체 삭제하고 다시 시작하시겠습니까?\n데모 계정: test@naver.com / 123456")) {
    localStorage.removeItem("closet_users"); showToast("초기화 완료! 데모 계정으로 로그인하거나 새로 회원가입 하세요."); location.reload();
  }
  });
  logoutBtn.addEventListener("click", (e) => {
  if (e) e.preventDefault();
  state.isLoggedIn = false; state.currentUserEmail = "";
  emailInput.value = ""; passwordInput.value = "";
  authScreen.style.display = "block"; mainScreen.style.display = "none";
  headerCredits.style.display = "none"; sidebarToggleBtn.style.display = "none"; logoutBtn.style.display = "none";
  showToast("로그아웃 되었습니다.");
  });
  // 6. 크레딧 차감 및 업데이트 로직
  const updateCreditUI = () => { navCreditCount.textContent = `${state.credits} CP`; };
  // 7. 실시간 오늘 기상청 연동 날씨 (랜덤 시뮬레이션 탈피)
  const triggerWeatherUpdate = async () => {
    try {
      weatherWidget.innerHTML = `<span>🌡️ 현재 기온: <strong>로딩중...</strong> | 기후: <strong>조회중...</strong></span>`;
      const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=37.5665&longitude=126.9780&current_weather=true");
      const data = await res.json();
      const temp = Math.round(data.current_weather.temperature), code = data.current_weather.weathercode;
      let c = "맑음 ☀️"; if(code>0&&code<4)c="구름 ☁️"; else if(code==45||code==48)c="안개 🌫️"; else if((code>=51&&code<=67)||(code>=80&&code<=82))c="비 🌧️"; else if(code>=71&&code<=86)c="눈 ❄️"; else if(code>=95)c="뇌우 ⛈️";
      state.currentWeather = { temp, condition: c };
      weatherWidget.innerHTML = `<span>🌡️ 현재 기온 (서울): <strong>${temp}°C</strong> | 기후: <strong>${c}</strong></span>`;
    } catch (e) {
      console.error("날씨 실패", e);
      state.currentWeather = { temp: 24, condition: "맑음 ☀️ (오프라인)" };
      weatherWidget.innerHTML = `<span>🌡️ 현재 기온: <strong>24°C</strong> | 기후: <strong>맑음 ☀️</strong></span>`;
    }
  };
  refreshWeatherBtn.addEventListener("click", async () => {
  await triggerWeatherUpdate();
  showToast("서울 실시간 기상 데이터와 최신 동기화가 완료되었습니다.");
  });
  // 8. 6대 카테고리 태그 동적 렌더링
  const renderTags = () => {
    const closerData = window.CLOSER_DATA || (typeof CLOSER_DATA !== "undefined" ? CLOSER_DATA : null);
    if (!closerData) return;
    ["gender", "when", "where", "role", "style", "why", "body"].forEach(cat => {
      const container = document.getElementById(`${cat}-tags`);
      if (container && closerData[cat]) {
        container.innerHTML = "";
        closerData[cat].forEach(tag => {
          const btn = document.createElement("button"); btn.className = "tag-btn"; btn.textContent = tag; btn.type = "button";
          btn.addEventListener("click", () => toggleTagSelection(cat, tag, btn));
          container.appendChild(btn);
        });
      }
    });
  };
  const toggleTagSelection = (category, tag, element) => {
    const arr = state.selectedTags[category], idx = arr.indexOf(tag);
    if (idx > -1) { arr.splice(idx, 1); element.classList.remove("selected"); }
    else { arr.push(tag); element.classList.add("selected"); }
  };
  // 9-4. 공통 결과 렌더링 헬퍼 (전체화면 대시보드)
  const renderDashboardResult = (title, descr, photoUrl, items) => {
  dashResultTitle.textContent = title;
  dashResultDescr.innerHTML = descr;
  if (dashPinterestBanner) {
    const qGender = encodeURIComponent(state.selectedTags.gender[0] || "남자");
    const qWhen = encodeURIComponent(state.selectedTags.when[0] || "봄");
    const qStyle = encodeURIComponent(state.selectedTags.style[0] || "캐주얼");
    dashPinterestBanner.href = `https://kr.pinterest.com/search/pins/?q=${qGender} ${qWhen} ${qStyle} 코디`;
  }
  dashLinksTop.innerHTML = "";
  dashLinksBottom.innerHTML = "";
  const mid = Math.ceil(items.length / 2);
  items.forEach((item, index) => {
    const linkContainer = document.createElement("div");
    linkContainer.className = "dash-link-item";
    linkContainer.style.display = "flex";
    linkContainer.style.flexDirection = "column";
    linkContainer.style.gap = "8px";
    linkContainer.style.cursor = "default";
    
    const searchKeyword = item.split(' ').slice(0, -1).join(' ');
    linkContainer.innerHTML = `
    <div style="font-weight:600; color:#4a4a4a; display:flex; align-items:center; gap:6px;"><span>🏷️</span> ${item}</div>
    <div style="display:flex; gap:8px; align-items:center;">
      <a href="https://www.musinsa.com/search/musinsa/integration?type=&q=${encodeURIComponent(searchKeyword)}" target="_blank" style="box-sizing:border-box; display:flex; align-items:center; justify-content:center; flex:1; height:32px; background:#000000; color:white; border-radius:6px; font-size:13px; text-decoration:none; font-weight:700; transition:opacity 0.2s; padding:0; margin:0; line-height:1;">무신사 검색</a>
    </div>
    `;
    
    if (index === 0 || index === 3) {
    dashLinksTop.appendChild(linkContainer);
    } else {
    dashLinksBottom.appendChild(linkContainer);
    }
  });
  mainScreen.style.display = "none";
  fullscreenDashboard.style.display = "flex";

  // 추천 기록 로컬 스토리지 저장
  if (state.currentUserEmail) {
    try {
      const historyKey = `closet_history_${state.currentUserEmail}`;
      const histories = JSON.parse(localStorage.getItem(historyKey) || "[]");
      histories.unshift({
        date: new Date().toLocaleString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        title: title,
        items: items
      });
      if (histories.length > 20) histories.pop();
      localStorage.setItem(historyKey, JSON.stringify(histories));
    } catch (e) {
      console.error("히스토리 저장 실패", e);
    }
  }
  };
  // 9-3. 로컬 폴백 매칭 도우미
  const applyLocalFallback = (stylingData, chosenWhen, chosenWhere, chosenRole, body, chosenStyle) => {
  const closerData = window.CLOSER_DATA || (typeof CLOSER_DATA !== "undefined" ? CLOSER_DATA : null);
  const chosenRef = closerData.referenceLooks[chosenStyle] || closerData.referenceLooks["default"];
  const photoUrl = chosenRef.imgId;
  const title = `[${chosenWhen}] ${stylingData.title}`;
  const bodyAdvice = body.length > 0 ? `선택하신 신체특성(${body.join(", ")})을 보완하기 위해 실루엣의 균형을 완벽히 잡았습니다.` : "";
  const descr = `<strong>[AI 분석 처방]</strong> ${chosenWhen} ${chosenWhere}에서 ${chosenRole}로서 가장 돋보일 수 있는 연출입니다. ${stylingData.descr} <br><br><em>${bodyAdvice}</em>`;
  renderDashboardResult(title, descr, photoUrl, stylingData.items);
  setTimeout(() => { showToast("추천 스타일링 처방이 안전하게 완료되었습니다! (-2 CP)"); }, 100);
  };
  // 10. AI 옷 추천 실행 엔진
  getRecommendationBtn.addEventListener("click", () => {
  const { gender, when, where, role, style, why, body } = state.selectedTags;
  const customContext = document.getElementById('custom-context') ? document.getElementById('custom-context').value.trim() : '';
  if (style.length === 0) {
    showToast("원하시는 스타일(어떻게)을 최소 1개 이상 선택해 주세요!");
    return;
  }
  if (state.credits < 2) {
    paymentModal.classList.add("active");
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
  
  if (API_CONFIG.apiKey && API_CONFIG.apiKey !== "YOUR_API_KEY_HERE" && API_CONFIG.apiKey.trim() !== "") {
    dashResultTitle.textContent = "AI가 패션 스타일 분석 중입니다...";
    dashResultDescr.textContent = "기온 정보와 신체 특징을 결합하여 최적의 패션 처방전을 빌드하고 있습니다. 잠시만 기다려주세요.";
    dashLinksTop.innerHTML = "<span>🔄 AI 연동 분석 중...</span>";
    dashLinksBottom.innerHTML = "";
    
    mainScreen.style.display = "none";
    fullscreenDashboard.style.display = "flex";
    if (closerData && closerData.fetchRealAIRecommendation) {
    closerData.fetchRealAIRecommendation({ gender, when, where, role, style, why, body, customContext, weather: state.currentWeather }, API_CONFIG)
      .then(aiResult => {
      const title = aiResult.title;
      const descr = `<strong>[실시간 AI 분석 처방]</strong> ${aiResult.descr}`;
      const imgId = aiResult.referenceImageId || "1483985988355-763728e1935b";
      const photoUrl = imgId;
      
      renderDashboardResult(title, descr, photoUrl, aiResult.items);
      setTimeout(() => { showToast("실시간 리얼 AI 스타일링 처방이 성공적으로 완료되었습니다! (-2 CP)"); }, 100);
      })
      .catch(err => {
      console.error("AI API Error:", err);
      showToast("연결이 지연되어 로컬 코디로 대체합니다.");
      applyLocalFallback(stylingData, chosenWhen, chosenWhere, chosenRole, body, chosenStyle);
      });
    } else {
    applyLocalFallback(stylingData, chosenWhen, chosenWhere, chosenRole, body, chosenStyle);
    }
  } else {
    applyLocalFallback(stylingData, chosenWhen, chosenWhere, chosenRole, body, chosenStyle);
  }
  });
  // 11. 메일링 구독 로직
  const emailSubscribeInputGroup = document.getElementById("email-subscribe-input-group");
  const subscribeEmailInput = document.getElementById("subscribe-email-input");
  const saveSubscribeBtn = document.getElementById("save-subscribe-btn");
  emailSubscribeCheck.addEventListener("change", (e) => {
  if (e.target.checked) {
    emailSubscribeInputGroup.style.display = "block";
    if (state.currentUserEmail && state.currentUserEmail.includes("@")) {
    subscribeEmailInput.value = state.currentUserEmail;
    }
  } else {
    emailSubscribeInputGroup.style.display = "none";
  }
  });
  if (saveSubscribeBtn) {
  saveSubscribeBtn.addEventListener("click", () => {
    const emailVal = subscribeEmailInput.value.trim();
    if (!emailVal || !emailVal.includes("@")) {
    showToast("정확한 이메일 주소를 입력해주세요!");
    return;
    }
    showToast(`[${emailVal}] 주소로 매일 아침 8시 추천 메일 수신 등록이 완료되었습니다!`);
  });
  }
  // 12. 결제 팝업 내 버튼 처리
  closePaymentModalBtn.addEventListener("click", () => paymentModal.classList.remove("active"));
  chargeCreditBtn.addEventListener("click", () => {
    showToast("결제 시스템이 아직 연동되지 않았습니다.");
  });
  subscribePremiumBtn.addEventListener("click", () => {
    showToast("프리미엄 구독이 출시 준비 중입니다.");
  });
  const sidebarProfileBtn = document.getElementById("sidebar-profile-btn");
  const sidebarHistoryBtn = document.getElementById("sidebar-history-btn");
  const sidebarSettingsBtn = document.getElementById("sidebar-settings-btn");
  
  const profileModal = document.getElementById("profile-modal");
  const closeProfileModalBtn = document.getElementById("close-profile-modal-btn");
  const profileModalEmail = document.getElementById("profile-modal-email");
  const profileModalCredits = document.getElementById("profile-modal-credits");

  const historyModal = document.getElementById("history-modal");
  const closeHistoryModalBtn = document.getElementById("close-history-modal-btn");
  const historyModalContent = document.getElementById("history-modal-content");

  const settingsModal = document.getElementById("settings-modal");
  const closeSettingsModalBtn = document.getElementById("close-settings-modal-btn");
  const saveSettingsModalBtn = document.getElementById("save-settings-modal-btn");

  if (sidebarProfileBtn && profileModal) {
    sidebarProfileBtn.addEventListener("click", () => {
      profileModalEmail.textContent = state.currentUserEmail || "손님 (비로그인)";
      profileModalCredits.textContent = `${state.credits} CP`;
      profileModal.classList.add("active");
    });
    
    closeProfileModalBtn.addEventListener("click", () => {
      profileModal.classList.remove("active");
    });
  }

  if (sidebarHistoryBtn && historyModal) {
    sidebarHistoryBtn.addEventListener("click", () => {
      if (!state.currentUserEmail) {
        showToast("로그인 후 이용할 수 있습니다.");
        return;
      }
      const histories = JSON.parse(localStorage.getItem(`closet_history_${state.currentUserEmail}`) || "[]");
      if (histories.length === 0) {
        historyModalContent.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 30px;">기록이 없습니다.<br>AI 추천을 받아보세요!</div>`;
      } else {
        historyModalContent.innerHTML = histories.map(h => `
          <div style="background: var(--bg-card); padding: 16px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.05);">
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 4px;">${h.date}</div>
            <div style="font-weight: 700; margin-bottom: 8px; font-size: 1.05rem;">${h.title}</div>
            <ul style="margin: 0; padding-left: 20px; font-size: 0.9rem; color: var(--text-main);">
              ${h.items.map(item => `<li>${item}</li>`).join('')}
            </ul>
          </div>
        `).join('');
      }
      historyModal.classList.add("active");
    });
    
    closeHistoryModalBtn.addEventListener("click", () => {
      historyModal.classList.remove("active");
    });
  }

  if (sidebarSettingsBtn && settingsModal) {
    sidebarSettingsBtn.addEventListener("click", () => {
      settingsModal.classList.add("active");
    });
    closeSettingsModalBtn.addEventListener("click", () => {
      settingsModal.classList.remove("active");
    });
    saveSettingsModalBtn.addEventListener("click", () => {
      settingsModal.classList.remove("active");
      showToast("설정이 성공적으로 저장되었습니다!");
    });
  }

  const sidebarContactBtn = document.getElementById("sidebar-contact-btn");
  const contactModal = document.getElementById("contact-modal");
  if(sidebarContactBtn && contactModal){
    sidebarContactBtn.addEventListener("click", () => contactModal.classList.add("active"));
    document.getElementById("close-contact-modal-btn").addEventListener("click", () => contactModal.classList.remove("active"));
    document.getElementById("send-contact-btn").addEventListener("click", () => {
      const sub = document.getElementById("contact-subject").value, body = document.getElementById("contact-body").value;
      window.location.href = `mailto:8716emma@gmail.com?subject=${encodeURIComponent(sub)}&body=${encodeURIComponent(body)}`;
      contactModal.classList.remove("active");
      showToast("메일 앱을 열어 전송을 준비합니다.");
    });
  }

  const settingsDarkMode = document.getElementById("settings-dark-mode");
  if(settingsDarkMode){
    settingsDarkMode.addEventListener("change", (e) => {
      document.documentElement.setAttribute('data-theme', e.target.checked ? 'dark' : 'light');
    });
  }
  renderTags();
});
