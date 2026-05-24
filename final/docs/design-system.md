# 디자인 시스템 (Design System)

이 문서는 VAS 2.4 에이전트 팀이 UI/UX를 개발할 때 참조하는 **단일 진실 공급원(Single Source of Truth)**입니다.
과거의 고정된(하드코딩된) 다크모드 룰은 폐기되었으며, 모든 시각적 토큰(Token)과 무드는 **VAS 디자인 시스템 코어**를 기반으로 유동적으로 적용됩니다.

---

## 🎨 1. 디자인 토큰 추출 원칙 (Vibecoding Core)

Implementer 및 Designer 에이전트는 코딩을 시작하기 전, 무조건 **`design-controller.html` (또는 `Run-VAS-System.bat`)에서 생성된 12대 글로벌 프리셋 중 하나를 기준**으로 삼아야 합니다.

- **12대 프리셋 목록:** Apple HIG, Google M3, IBM Carbon, Ant Design, Vercel, Linear, Stripe, Neo-Brutalism, Awwwards, Untitled UI, shadcn/ui, Glow UI.
- 사용자(팀 리드)가 특정 프리셋의 **[AI 에이전트 시스템 프롬프트]**를 제공하면, 해당 프롬프트에 명시된 Color, Radius, Shadow, Font 규칙을 100% 우선하여 적용합니다.
- 임의의 보라색/형광색 템플릿(Slop) 그라디언트나 촌스러운 중앙 정렬은 원천 차단됩니다.

## 🔤 2. 공통 타이포그래피 (Typography Tokens)

프리셋 프롬프트에서 별도의 폰트를 지정하지 않은 경우, 아래 기본 룰을 따릅니다.

- **기본 한글 폰트:** `Pretendard` 강제 (Noto Sans, 맑은 고딕 절대 금지)
- **숫자 및 코드 폰트:** `Geist Mono` 또는 `JetBrains Mono` 혼용 권장
- **헤드라인 규칙:** 거대하게 키우지 말고 `tracking-tighter` (자간 좁게), `leading-none` (행간 좁게) 적용.
- **이모지 규칙:** 시스템 이모지 대신 Phosphor/Radix 등 고품질 웹 아이콘 사용 원칙.

## 🪄 3. 공통 애니메이션 및 모션 (Motion Specs)

프리셋 프롬프트에서 모션 속도(Speed)를 지정받으면 해당 속도를 기준 삼아 애니메이션을 구성합니다. 무거운 외부 라이브러리(Framer Motion 등) 없이 순수 Vanilla CSS와 JS만으로 구현합니다.

- **타이밍 함수 (Timing Function):** 
  - 기본 모션: `cubic-bezier(0.16, 1, 0.3, 1)` 적용 (스프링처럼 쫀득한 움직임)
- **택타일 피드백 (Tactile Feedback):**
  - 모든 버튼/인터랙티브 요소는 `:active` 상태에서 `transform: scale(0.98);` 로 살짝 눌리는 물리적 피드백 제공.

## 📐 4. 레이아웃과 형태 (Layout & Shapes)

- **비대칭성 (Asymmetry):** 뻔한 3단 횡렬 배치, 무조건적인 텍스트 가운데 정렬 금지.
- **음수 공간 (Negative Space):** 빽빽한 컨테이너(Card) 남용 금지. 선(Divider)과 여백만으로 데이터를 그룹화하여 공기처럼 가벼운 레이아웃 지향.
- **Radius 및 Border:** 프리셋에서 주어진 토큰(예: IBM Carbon의 경우 0px, Google M3의 경우 16px)을 완벽하게 따라야 합니다.
