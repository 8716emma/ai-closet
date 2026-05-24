# 📦 VAS 2.4 — AI 에이전트 팀 구성 템플릿 (Vibecoding Agent System)

이 폴더는 **새 프로젝트를 시작할 때 AI 에이전트 팀을 바로 셋팅**할 수 있도록 만든 템플릿 패키지입니다.
이 README 하나만 읽으면 VAS 2.4의 전체 구조와 사용법을 이해할 수 있습니다.

> 🎉 **처음 오셨나요?** 
> 폴더에 있는 **`Run-VAS-System.bat`** 파일을 더블클릭하세요! 
> 코드를 한 줄도 몰라도 12대 글로벌 디자인 프리셋을 골라 AI에게 명령할 수 있는 **[시각적 디자인 컨트롤러]**가 브라우저에 바로 열립니다.

> **v2.4** — 6개 에이전트 (Architect, **Designer**, Implementer, Reviewer, Tester, Security)
> Claude Design 연동, Figma MCP, 에이전트 간 유기적 상호 검증 체계

---

## 🧠 핵심 개념: 에이전트 팀이란?

VAS는 **하나의 AI를 6개의 전문 역할(에이전트)**로 나누어 협업시키는 시스템입니다.
각 에이전트는 고유한 **역할, 권한, 도구**를 가지며, 정해진 순서대로 작업을 인계합니다.

```
  Architect(설계) → Designer(디자인) → Implementer(구현)
                                            ↓
        Security(보안) ← Tester(테스트) ← Reviewer(리뷰)
                 ↓
           final/ 최종 산출물
```

---

## 🎭 에이전트 6인 역할 요약

| # | 에이전트 | 역할 | 쓰기 권한 | 특수 권한 | context |
|---|----------|------|-----------|-----------|---------|
| 1 | **Architect** | 전체 구조 설계, 파일/모듈 인터페이스 정의 | ❌ (읽기 전용) | 브라우저(리서치) | default |
| 2 | **Designer** | 디자인 시스템 구축, UI 프로토타입, Figma 연동 | `src/assets/`, `.temp data/` | 브라우저(리서치/Figma), generate_image | default |
| 3 | **Implementer** | 설계+디자인 기반 코드 작성 | `src/`, `.temp data/` | 터미널(빌드/실행) | default |
| 4 | **Reviewer** | 코드 품질·성능·접근 제어·디자인 명세 일치 검토 | ❌ (코멘트만) | 터미널(린트) | fork |
| 5 | **Tester** | 테스트 코드 작성 및 실행 | `tests/`, `.temp data/` | 터미널(테스트) | fork |
| 6 | **Security** | 보안 검토, final/ 배포, docs/log.md 기록 | `final/`, `docs/log.md` | 터미널(보안 스캔) | fork |

> - **context: default** = 메인 대화에서 실행
> - **context: fork** = 격리된 서브에이전트에서 실행, 결과만 반환
> - 모든 에이전트는 전체 파일 **읽기** 가능
> - 상세 권한: `.agents/access-control.md` | 각 에이전트의 `SKILL.md` 참조

---

## 🚀 시작 순서 (3단계)

### 1단계 — 고객 의뢰서 받기
고객에게 의뢰서 양식을 전달합니다. (PDF, 이미지, 텍스트 모두 가능)

### 2단계 — 에이전트 팀 자동 셋팅
받은 의뢰서를 대화창에 올리고 아래 메시지를 입력합니다:
```
/setup-from-application
```
AI가 의뢰서를 분석하여 **에이전트 팀 설정 파일 10개 + 프로젝트 스캐폴딩**을 자동으로 생성합니다:
- `GEMINI.md` — 매 턴마다 로드되는 핵심 컨텍스트 (1,500토큰 이하 유지)
- `INSTRUCTIONS.md` — 심화 레퍼런스 (코딩 컨벤션, 폴더 규칙, 소유권 등)
- `.agents/access-control.md` — RBAC+ABAC 접근 제어 정책
- `.agents/advisor-strategy.md` — Claude Advisor(Opus) 호출 전략
- 6개 `SKILL.md` (architect, designer, implementer, reviewer, tester, security)

### 3단계 — 개발 시작
기능 구현이 필요할 때마다 아래 명령어를 씁니다:
```
/dev-cycle     ← 정식 개발 (설계 → 디자인 → 구현 → 리뷰 → 테스트 → 보안)
/ultra-plan    ← 복잡한 설계 (3+1 병렬 탐색-비평 → 최적안 도출 → 개발)
/hotfix        ← 긴급 버그 수정 (설계·디자인 생략, 구현 → 리뷰 → 테스트)
/dep-update    ← 의존성 업데이트 (라이브러리 버전 변경 전용 경량 흐름)
```

---

## 🔄 핵심 워크플로우: /dev-cycle

정식 개발의 **전체 흐름**입니다. 모든 에이전트가 순서대로 참여합니다.

### Step 흐름

| Step | 에이전트 | 하는 일 | 생략 조건 |
|------|----------|---------|-----------|
| **0** | Architect | 복잡도 판단 (경량/일반/울트라) | — |
| **1** | Architect | 전체 구조 설계, 인터페이스 정의 | 경량 모드 시 생략 |
| **1.5** | **Designer** | 디자인 토큰·컴포넌트 명세·에셋 생성 | UI 변경 없으면 생략 |
| **2** | Implementer | 설계+디자인 기반 코드 구현 | — |
| **3** | Reviewer | 코드 품질·접근 제어·디자인 명세 일치 검토 | 경량 모드 시 간소화 |
| **4** | Tester | 테스트 작성 및 실행 | 테스트 무관 시 생략 가능 |
| **5** | Security | 보안 검토 → final/ 배포 | 경량 모드 시 이동만 |
| **6** | Security | docs/log.md 연대기 및 교훈 기록 | — |

### 경량 모드 (Lite) 진입 조건
- 변경 파일 1~2개, 변경 줄 수 30줄 미만
- 기존 인터페이스 변경 없음
- 사용자가 "간단히", "빠르게", "살짝" 등 표현 사용
- **경량 흐름:** Architect 생략 → Designer 생략 → Implementer → Reviewer(간소) → Security(이동만)

---

## 🔄 에이전트 간 유기적 상호 검증

에이전트들은 단순히 순서대로 넘기는 것이 아니라, **서로의 결과물을 교차 검증**합니다.

### 검증 포인트 & 피드백 루프

```
Architect ←──── 설계 정합성 피드백 ────── Designer
    │                                        │
    │    Step 1 ↔ 1.5 반복 (최대 2회)         │
    ▼                                        ▼
Designer ────── 디자인 이슈 피드백 ──────▶ Implementer
                                            │
         Step 1.5 ↔ 2 반복 (최대 2회)        │
                                            ▼
Designer ◀──── 디자인 명세 문제 ────── Reviewer
                                            │
         코드 문제 → Implementer 반려         │
         Step 2 ↔ 3 반복 (최대 3회)          │
                                            ▼
                                         Tester → Security → final/
```

| 검증 항목 | 역행 경로 | 반복 제한 |
|----------|----------|----------|
| Designer ↔ Architect 설계 정합성 | Step 1 ↔ 1.5 | 최대 2회 |
| Implementer → Designer 디자인 이슈 | Step 1.5 ↔ 2 | 최대 2회 |
| Reviewer → Implementer 코드 반려 | Step 2 ↔ 3 | 최대 3회 |
| Reviewer → Designer 디자인 반려 | Step 3 → 1.5 | 최대 2회 |
| Tester/Security → Implementer 반려 | Step 2 ↔ 4/5 | 최대 3회 |

> 반복 제한 초과 시 → **사용자에게 에스컬레이션** (사람이 판단)

---

## 📝 인계 포맷

에이전트 간 작업 전달 시 반드시 사용하는 포맷입니다.

### 정방향 인계 (다음 에이전트에게)
```
[인계] [현재 에이전트] → [다음 에이전트]
- 완료: [한 줄 요약]
- 변경/생성 파일: [파일 목록]
- [Advisor 참조] [사용 시 질문/답변 요약 / 미사용 시 생략]
- 특이사항: [주의사항 / 없으면 '없음']
```

### 코드 반려 (코드 문제 → Implementer에게)
```
[반려] [현재 에이전트] → Implementer
- 반려 사유: [구체적 문제]
- 문제 위치: [파일명:줄번호]
- 기대 수정 방향: [가이드]
- 반복 횟수: [N]회차 / 최대 [M]회
```

### 디자인 반려 (디자인 명세 문제 → Designer에게)
```
[디자인 반려] [현재 에이전트] → Designer
- 반려 사유: [디자인 명세의 문제 — 구현 불가, 성능, 접근성 등]
- 문제 항목: [토큰/컴포넌트명/에셋명]
- 기대 수정 방향: [가이드]
- 반복 횟수: [N]회차 / 최대 2회
```

---

## 🔐 접근 제어 요약 (RBAC + ABAC)

### RBAC — 역할별 정적 권한

| 에이전트 | 읽기 | 쓰기 | 터미널 | 브라우저 | `final/` |
|----------|:----:|:----:|:------:|:--------:|:--------:|
| Architect | ✅ | ❌ | ❌ | ✅ 리서치 | ❌ |
| Designer | ✅ | `src/assets/` `.temp data/` | ❌ | ✅ 리서치/Figma | ❌ |
| Implementer | ✅ | `src/` `.temp data/` | ✅ 빌드 | ❌ | ❌ |
| Reviewer | ✅ | ❌ | ✅ 린트 | ❌ | ❌ |
| Tester | ✅ | `tests/` `.temp data/` | ✅ 테스트 | ❌ | ❌ |
| Security | ✅ | `final/` `docs/log.md` | ✅ 스캔 | ❌ | ✅ |

### ABAC — 주요 동적 정책

| 정책명 | 효과 | 설명 |
|--------|------|------|
| `hotfix_escalation` | P0 시 Implementer 권한 상승 | final/ 직접 쓰기 가능 |
| `sensitive_data_guard` | Designer/Implementer/Tester 차단 | credentials, .env, secrets 등 보호 |
| `review_before_final` | Step 5 이전 final/ 쓰기 차단 | 리뷰·테스트 미완료 시 배포 방지 |
| `large_file_alert` | 400줄 초과 시 Reviewer 승인 필요 | 코드 품질 유지 |
| `prod_config_lock` | Security 외 프로덕션 설정 수정 차단 | 운영 환경 보호 |

> 상세: `.agents/access-control.md` 참조

---

## 📁 폴더 구조

```
📁 프로젝트 루트/
├── GEMINI.md                  ← 매 턴 로드 (핵심 규칙 요약, 1,500토큰 이하)
├── INSTRUCTIONS.md            ← 상세 레퍼런스 (코딩 컨벤션, 폴더 규칙, 소유권)
├── README.md                  ← 이 파일 (전체 시스템 가이드)
├── docs/log.md                ← 연대기 및 교훈 통합 (Security가 자동 기록)
├── MIGRATION.md               ← 템플릿 버전 업그레이드 가이드
│
├── .agents/
│   ├── access-control.md      ← RBAC+ABAC 접근 제어 정책 정의
│   ├── advisor-strategy.md    ← Claude Advisor(Opus) 호출 전략
│   ├── mcp_config_template.json ← MCP 외부 도구 연동 (Figma MCP 포함)
│   │
│   ├── skills/                ← 스킬 2.0 표준 구조 (6개 에이전트)
│   │   ├── architect/SKILL.md       ← 설계 (context: default)
│   │   ├── designer/SKILL.md        ← 디자인 (context: default, Claude Design)
│   │   ├── implementer/SKILL.md     ← 구현 (context: default)
│   │   ├── reviewer/SKILL.md        ← 리뷰 (context: fork)
│   │   ├── tester/SKILL.md          ← 테스트 (context: fork)
│   │   └── security/SKILL.md        ← 보안 (context: fork)
│   │
│   ├── workflows/             ← 슬래시 커맨드 워크플로우
│   │   ├── dev-cycle.md       ← /dev-cycle (설계→디자인→구현→리뷰→테스트→보안)
│   │   ├── ultra-plan.md      ← /ultra-plan (3+1 병렬 탐색-비평)
│   │   ├── hotfix.md          ← /hotfix (P0~P2 긴급 수정)
│   │   ├── dep-update.md      ← /dep-update (의존성 전용)
│   │   └── setup-from-application.md ← /setup-from-application
│   │
│   ├── hooks/                 ← Git 훅 템플릿 (.sh + .ps1)
│   └── ci/                    ← CI/CD 파이프라인 템플릿
│
├── src/                       ← 소스 코드 (Implementer 작업 공간)
│   └── assets/                ← 디자인 에셋 (Designer 작업 공간)
├── tests/                     ← 테스트 코드 (Tester, src/ 미러링)
├── .temp data/                ← 임시 파일 (작업 중 자유롭게 사용)
└── final/                     ← 최종 산출물 (검증 완료 파일만, Security만 쓰기)
```

---

## 📖 파일별 역할 상세

### 항상 읽어야 하는 파일
| 파일 | 로드 타이밍 | 내용 |
|------|------------|------|
| `GEMINI.md` | **매 턴 자동 로드** | 프로젝트 요약, 핵심 규칙, RBAC 요약, 인계 포맷, 현재 진행 상태 |
| `INSTRUCTIONS.md` | 심화 정보 필요 시 | 코딩 컨벤션, 폴더 규칙, 라이프사이클, 코드 소유권 매핑 |

### 워크플로우 실행 시 읽는 파일
| 파일 | 읽는 시점 |
|------|----------|
| `.agents/workflows/dev-cycle.md` | `/dev-cycle` 실행 시 |
| `.agents/workflows/ultra-plan.md` | `/ultra-plan` 실행 시 |
| `.agents/workflows/hotfix.md` | `/hotfix` 실행 시 |
| `.agents/workflows/dep-update.md` | `/dep-update` 실행 시 |
| 본인의 `SKILL.md` | 자기 차례(Step)가 왔을 때 |
| `.agents/access-control.md` | 권한 확인이 필요할 때 |

### 기록용 파일
| 파일 | 담당 | 시점 |
|------|------|------|
| `docs/log.md` | Security | dev-cycle/hotfix 완료 후 변경 이력 및 교훈 기록 |

---

## 🎨 Designer 에이전트 상세

v2.3에서 추가된 **Claude Design 전담 에이전트**입니다.

### 하는 일
1. Architect 설계안을 기반으로 **디자인 시스템** 구축 (토큰, 색상, 폰트, 간격)
2. Architect 설계와의 **정합성을 교차 검증** (불일치 시 Architect에게 피드백)
3. **UI 컴포넌트 구조와 상태**를 명세 (hover, active, disabled 등)
4. **프로토타입 생성**하여 사용자에게 확인 받기
5. 시각 에셋(아이콘, 이미지) → `src/assets/`에 저장
6. Implementer에게 디자인 토큰 + 컴포넌트 명세 + 에셋 인계

### 안 하는 일
- ❌ 비즈니스 로직 코드 작성 (함수, 클래스)
- ❌ 터미널 명령 실행
- ❌ `src/core/`, `src/ui/`, `tests/`, `final/` 수정

### Figma 연동 3가지 방법
- **Figma 커넥터:** Claude 설정에서 Figma 계정 연결 → 파일 읽기/편집
- **Figma MCP:** `mcp_config_template.json` 설정 → 양방향 동기화
- **html.to.design:** Claude Artifact(HTML) → Figma 레이어 변환

> 상세: `.agents/skills/designer/SKILL.md`, `references/README.md` 참조

---

## ⚠️ 절대 규칙 (모든 에이전트 필수 준수)

| # | 규칙 | 상세 |
|---|------|------|
| 1 | **파일 500줄 이하** | 초과 시 즉시 분리. Reviewer가 검증함 |
| 2 | **임시 파일 → `.temp data/`** | 최종 파일은 `final/`만 사용 |
| 3 | **`final/` → Security만 쓰기** | ABAC `review_before_final`로 자동 차단 |
| 4 | **새 라이브러리 → 사용자 확인** | 임의 설치 절대 금지, 버전 명시 |
| 5 | **인계 포맷 사용** | `[인계] A → B` 형식 필수 |
| 6 | **RBAC+ABAC 준수** | 매 작업 전 권한 자가 진단 |
| 7 | **주석 언어: 한국어** | 모든 주석과 독스트링 한국어 작성 |
| 8 | **Advisor 세션당 3회** | 아키텍처·성능·보안 판단에만 사용 |

---

## 🆕 v2.3 주요 변경 사항

| 기능 | 설명 |
|------|------|
| **Designer 에이전트** | Claude Design 기반 디자인 시스템, UI 프로토타입, Figma 연동 전담 |
| **유기적 상호 검증** | Designer↔Architect 정합성, Implementer→Designer 피드백, Reviewer 디자인 검토 |
| **디자인 반려 포맷** | `[디자인 반려] → Designer` 역행 인계 포맷 신규 |
| **dev-cycle Step 1.5** | Architect 후 Designer 단계 삽입 (UI 변경 없으면 자동 생략) |
| **Figma MCP** | mcp_config_template.json에 Figma 양방향 동기화 설정 |
| **Reviewer 디자인 검토** | 코드가 디자인 토큰·컴포넌트 명세와 일치하는지 확인 |
| **Implementer 디자인 준수** | 작업 완료 기준에 디자인 명세 준수 체크 추가 |
| **LESSONS.md #디자인 태그** | 디자인 관련 교훈 분류 태그 추가 |
| **ABAC 보완** | sensitive_data_guard에 designer 추가, prod_config_lock에 designer 추가 |

> 이전 버전 이력: `docs/log.md` | 마이그레이션: `MIGRATION.md` 참조

---

## 📋 빠른 참조 — "이 상황에서 어떤 파일을 읽어야 하나?"

| 상황 | 읽을 파일 |
|------|----------|
| 새 프로젝트 시작 | 이 README → `/setup-from-application` 실행 |
| 기능 구현 요청 | `dev-cycle.md` → 본인 SKILL.md |
| 긴급 버그 수정 | `hotfix.md` |
| 내 권한이 뭔지 모르겠을 때 | 본인 `SKILL.md` → `access-control.md` |
| 디자인이 필요한 프로젝트 | `designer/SKILL.md` → `references/README.md` |
| 복잡한 설계 판단 | `ultra-plan.md` → `advisor-strategy.md` |
| 코드 반려당했을 때 | `dev-cycle.md`의 반려 인계 포맷 |
| 라이브러리 업데이트 | `dep-update.md` |
| 템플릿 버전 올릴 때 | `MIGRATION.md` |
| 과거 실수 확인 | `docs/log.md` |
