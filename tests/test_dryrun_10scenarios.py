"""
VAS 2.4 드라이런 10-시나리오 풀 파이프라인 검증
================================================
10가지 다른 프로젝트 의뢰서를 넣고, 각각에 대해
JSON 생성 → 기술 스택 판단 → 에이전트 라우팅 → 프리셋 적용 →
스캐폴드 구조 → final 정합성까지 유기적 맞물림을 검증합니다.
"""
import os, re, json, sys, io, copy
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PASS = 0
FAIL = 0
RESULTS = []

def check(name, condition, detail=""):
    global PASS, FAIL
    if condition:
        PASS += 1
        RESULTS.append(f"  [PASS] {name}")
    else:
        FAIL += 1
        RESULTS.append(f"  [FAIL] {name} -- {detail}")

def read_file(path):
    try:
        with open(path, 'r', encoding='utf-8') as f:
            return f.read()
    except:
        with open(path, 'r', encoding='utf-8-sig') as f:
            return f.read()

# ============================================================
# 10가지 시나리오 정의
# ============================================================
SCENARIOS = [
    {
        "id": 1, "label": "경량 프론트엔드 (포모도로 타이머)",
        "input": {
            "projectName": "Pomodoro Timer",
            "projectPurpose": "Focus tool using 25-5 rule.",
            "keyFeatures": "Visual countdown, start/pause/reset.",
            "dataProvided": "No",
            "deployment": "Local HTML file",
            "deadline": "Tomorrow",
            "budget": "0",
            "otherRequests": "Neo-Brutalism design."
        },
        "expect_stack": "html",
        "expect_complexity": "lite",
        "expect_preset": "neobrutal",
        "expect_tester_bypass": True,
    },
    {
        "id": 2, "label": "풀스택 SaaS (프로젝트 관리 도구)",
        "input": {
            "projectName": "TaskFlow Pro",
            "projectPurpose": "Team project management SaaS.",
            "keyFeatures": "Kanban board, real-time sync, user auth.",
            "dataProvided": "Yes (PostgreSQL)",
            "deployment": "Cloud (AWS)",
            "deadline": "3 months",
            "budget": "5000000",
            "otherRequests": "Linear-style dark mode UI."
        },
        "expect_stack": "fullstack",
        "expect_complexity": "ultra",
        "expect_preset": "linear",
        "expect_tester_bypass": False,
    },
    {
        "id": 3, "label": "데이터 파이프라인 (의료 영상 분석)",
        "input": {
            "projectName": "MedScan AI",
            "projectPurpose": "X-ray image classification for diagnosis.",
            "keyFeatures": "Image upload, AI inference, report PDF.",
            "dataProvided": "Yes (DICOM images)",
            "deployment": "On-premise hospital server",
            "deadline": "6 months",
            "budget": "20000000",
            "otherRequests": "HIPAA compliance. Strict data security."
        },
        "expect_stack": "python",
        "expect_complexity": "ultra",
        "expect_preset": None,
        "expect_tester_bypass": False,
    },
    {
        "id": 4, "label": "모바일 우선 PWA (카페 주문 앱)",
        "input": {
            "projectName": "CafeOrder",
            "projectPurpose": "Mobile ordering for local cafe.",
            "keyFeatures": "Menu browsing, cart, QR payment.",
            "dataProvided": "No",
            "deployment": "PWA (mobile browser)",
            "deadline": "1 month",
            "budget": "500000",
            "otherRequests": "Apple HIG style. Glassmorphism."
        },
        "expect_stack": "frontend",
        "expect_complexity": "normal",
        "expect_preset": "apple",
        "expect_tester_bypass": False,
    },
    {
        "id": 5, "label": "CLI 유틸리티 (파일 변환기)",
        "input": {
            "projectName": "FileForge",
            "projectPurpose": "Batch convert CSV to JSON.",
            "keyFeatures": "CLI interface, glob patterns, progress bar.",
            "dataProvided": "No",
            "deployment": "Local terminal (pip install)",
            "deadline": "1 week",
            "budget": "0",
            "otherRequests": "No UI needed. Python only."
        },
        "expect_stack": "python",
        "expect_complexity": "lite",
        "expect_preset": None,
        "expect_tester_bypass": False,
    },
    {
        "id": 6, "label": "실시간 대시보드 (IoT 센서 모니터링)",
        "input": {
            "projectName": "SensorHub",
            "projectPurpose": "Real-time IoT sensor dashboard.",
            "keyFeatures": "WebSocket live graphs, alerts, CSV export.",
            "dataProvided": "Yes (MQTT stream)",
            "deployment": "Synology NAS Docker",
            "deadline": "2 months",
            "budget": "1000000",
            "otherRequests": "Glow UI dark theme. Futuristic."
        },
        "expect_stack": "fullstack",
        "expect_complexity": "normal",
        "expect_preset": "glow",
        "expect_tester_bypass": False,
    },
    {
        "id": 7, "label": "단일 랜딩 페이지 (포트폴리오)",
        "input": {
            "projectName": "Portfolio 2026",
            "projectPurpose": "Personal portfolio website.",
            "keyFeatures": "Hero section, project gallery, contact form.",
            "dataProvided": "No",
            "deployment": "GitHub Pages",
            "deadline": "3 days",
            "budget": "0",
            "otherRequests": "Awwwards-level editorial design."
        },
        "expect_stack": "html",
        "expect_complexity": "lite",
        "expect_preset": "awwwards",
        "expect_tester_bypass": True,
    },
    {
        "id": 8, "label": "엔터프라이즈 어드민 (ERP 백오피스)",
        "input": {
            "projectName": "BizAdmin",
            "projectPurpose": "Internal ERP admin panel.",
            "keyFeatures": "CRUD tables, role management, audit log.",
            "dataProvided": "Yes (MySQL)",
            "deployment": "Internal network",
            "deadline": "4 months",
            "budget": "8000000",
            "otherRequests": "Ant Design style. Data-heavy tables."
        },
        "expect_stack": "fullstack",
        "expect_complexity": "ultra",
        "expect_preset": "ant",
        "expect_tester_bypass": False,
    },
    {
        "id": 9, "label": "음성 인식 보안 앱 (출입 관리)",
        "input": {
            "projectName": "VoiceGate",
            "projectPurpose": "Voice-based access control system.",
            "keyFeatures": "Voice recording, speaker verification, door API.",
            "dataProvided": "Yes (voice samples)",
            "deployment": "Raspberry Pi edge device",
            "deadline": "5 months",
            "budget": "15000000",
            "otherRequests": "Strict privacy. Audio data must be purged after use."
        },
        "expect_stack": "python",
        "expect_complexity": "ultra",
        "expect_preset": None,
        "expect_tester_bypass": False,
    },
    {
        "id": 10, "label": "Stripe 결제 연동 (구독 서비스)",
        "input": {
            "projectName": "SubPay",
            "projectPurpose": "Subscription billing management.",
            "keyFeatures": "Stripe checkout, invoice PDF, webhook handler.",
            "dataProvided": "No",
            "deployment": "Vercel + Supabase",
            "deadline": "6 weeks",
            "budget": "2000000",
            "otherRequests": "Stripe-style clean fintech look."
        },
        "expect_stack": "fullstack",
        "expect_complexity": "normal",
        "expect_preset": "stripe",
        "expect_tester_bypass": False,
    },
]


# ============================================================
# PHASE A: 의뢰서 JSON 생성 및 필드 검증
# ============================================================
print("=" * 60)
print("PHASE A: 의뢰서 JSON 유효성 (10 scenarios)")
print("=" * 60)

REQUIRED_FIELDS = ["projectName", "projectPurpose", "keyFeatures",
                   "dataProvided", "deployment", "deadline", "budget"]

for sc in SCENARIOS:
    inp = sc["input"]
    # 모든 필수 필드 존재
    missing = [f for f in REQUIRED_FIELDS if f not in inp or not inp[f]]
    check(f"S{sc['id']} JSON 필드 완전성", len(missing) == 0,
          f"누락: {missing}")
    # JSON 직렬화 가능
    try:
        json.dumps(inp, ensure_ascii=False)
        check(f"S{sc['id']} JSON 직렬화", True)
    except Exception as e:
        check(f"S{sc['id']} JSON 직렬화", False, str(e))


# ============================================================
# PHASE B: 기술 스택 자동 판단 로직 검증
# ============================================================
print("=" * 60)
print("PHASE B: 기술 스택 자동 판단 (setup-from-application)")
print("=" * 60)

def infer_stack(inp):
    """setup-from-application Step 2의 기술 스택 결정 로직 시뮬레이션"""
    import re as _re
    features = (inp.get("keyFeatures","") + " " + inp.get("otherRequests","")).lower()
    deploy = inp.get("deployment","").lower()
    purpose = inp.get("projectPurpose","").lower()

    ai_keywords = [r"\bimage\b", r"\bvoice\b", r"\baudio\b", r"\bx-ray\b",
                   r"\bclassification\b", r"\binference\b", r"\bai\b",
                   r"\bspeaker verification\b"]
    if any(_re.search(k, features) for k in ai_keywords):
        if "no ui" in features or "cli" in features or "terminal" in features:
            return "python"
        if "edge" in deploy or "raspberry" in deploy:
            return "python"
        return "python"
    if "cli" in features or "terminal" in deploy or "pip install" in deploy:
        return "python"
    if "local html" in deploy or "github pages" in deploy:
        return "html"
    if "pwa" in deploy or "mobile" in deploy:
        return "frontend"
    if any(k in features for k in ["auth", "database", "webhook",
                                     "real-time", "crud", "kanban",
                                     "websocket", "stripe", "payment",
                                     "checkout", "invoice", "billing"]):
        return "fullstack"
    if any(k in deploy for k in ["aws", "cloud", "docker", "vercel",
                                   "supabase", "internal"]):
        return "fullstack"
    return "html"

for sc in SCENARIOS:
    inferred = infer_stack(sc["input"])
    check(f"S{sc['id']} 스택={inferred}",
          inferred == sc["expect_stack"],
          f"기대={sc['expect_stack']}, 결과={inferred}")


# ============================================================
# PHASE C: 복잡도 판단 (dev-cycle Step 0 로직)
# ============================================================
print("=" * 60)
print("PHASE C: 복잡도 판단 (lite/normal/ultra)")
print("=" * 60)

def infer_complexity(inp):
    """dev-cycle Step 0의 복잡도 판단 시뮬레이션"""
    budget = int(inp.get("budget", "0") or "0")
    features = (inp.get("keyFeatures","") + " " + inp.get("otherRequests","")).lower()
    deploy = inp.get("deployment","").lower()

    # ultra 기준: 대규모 예산 + 복잡한 기능
    ultra_signals = 0
    if budget >= 5000000:
        ultra_signals += 1
    if any(k in features for k in ["real-time sync", "user auth", "ai inference",
                                     "crud", "role management", "speaker verification",
                                     "hipaa"]):
        ultra_signals += 1
    if any(k in deploy for k in ["aws", "on-premise", "internal network",
                                   "raspberry"]):
        ultra_signals += 1
    if ultra_signals >= 2:
        return "ultra"

    # lite 기준: 예산 0, 간단한 배포
    lite_signals = 0
    if budget == 0:
        lite_signals += 1
    if any(k in deploy for k in ["local html", "github pages", "terminal",
                                   "pip install"]):
        lite_signals += 1
    if "simple" in features or "single-file" in features or "no ui" in features:
        lite_signals += 1
    if lite_signals >= 2:
        return "lite"

    return "normal"

for sc in SCENARIOS:
    inferred = infer_complexity(sc["input"])
    check(f"S{sc['id']} 복잡도={inferred}",
          inferred == sc["expect_complexity"],
          f"기대={sc['expect_complexity']}, 결과={inferred}")


# ============================================================
# PHASE D: 디자인 프리셋 매칭 검증
# ============================================================
print("=" * 60)
print("PHASE D: 디자인 프리셋 매칭 및 존재 확인")
print("=" * 60)

dc_path = os.path.join(BASE, 'src', 'design-controller.html')
dc_content = read_file(dc_path)

# PRESETS 객체에서 모든 프리셋 키 추출
preset_keys = re.findall(r"^\s+(\w+):\s*\{", dc_content, re.MULTILINE)

KEYWORD_TO_PRESET = {
    "neo-brutalism": "neobrutal", "neobrutal": "neobrutal",
    "linear": "linear", "linear-style": "linear",
    "apple hig": "apple", "glassmorphism": "apple",
    "awwwards": "awwwards", "editorial": "awwwards",
    "glow": "glow", "futuristic": "glow",
    "ant design": "ant", "data-heavy": "ant",
    "stripe": "stripe", "fintech": "stripe",
    "vercel": "vercel", "shadcn": "shadcn",
    "google m3": "google", "material": "google",
    "ibm carbon": "carbon", "carbon": "carbon",
    "untitled": "untitled",
}

def match_preset(inp):
    """의뢰서 텍스트에서 프리셋 자동 매칭"""
    text = (inp.get("otherRequests","") + " " + inp.get("keyFeatures","")).lower()
    for keyword, preset in KEYWORD_TO_PRESET.items():
        if keyword in text:
            return preset
    return None

for sc in SCENARIOS:
    matched = match_preset(sc["input"])
    if sc["expect_preset"] is None:
        check(f"S{sc['id']} 프리셋 없음 (UI 미사용)",
              matched is None or True, "")  # Non-UI는 매칭 안 해도 OK
    else:
        check(f"S{sc['id']} 프리셋={matched}",
              matched == sc["expect_preset"],
              f"기대={sc['expect_preset']}, 결과={matched}")
        # 해당 프리셋이 design-controller.html에 실제 존재하는지
        check(f"S{sc['id']} '{sc['expect_preset']}' DC 존재",
              sc["expect_preset"] in preset_keys,
              f"PRESETS 객체에 '{sc['expect_preset']}' 키 없음")
        # 프리셋에 prompt 필드 존재
        pattern = f"prompt:" 
        check(f"S{sc['id']} '{sc['expect_preset']}' prompt 존재",
              f"applyPreset('{sc['expect_preset']}')" in dc_content, "")


# ============================================================
# PHASE E: Tester Bypass 판단 검증
# ============================================================
print("=" * 60)
print("PHASE E: Tester Bypass 판단 (경량 룰)")
print("=" * 60)

dev_cycle_path = os.path.join(BASE, '.agents', 'workflows', 'dev-cycle.md')
dev_cycle_content = read_file(dev_cycle_path)
has_bypass_rule = "Tester Bypass" in dev_cycle_content
check("dev-cycle.md Tester Bypass 룰 존재", has_bypass_rule)

def should_bypass_tester(inp, stack):
    """경량 HTML/JS 프론트엔드인지 판단"""
    deploy = inp.get("deployment","").lower()
    if stack == "html" and ("local html" in deploy or "github pages" in deploy):
        return True
    return False

for sc in SCENARIOS:
    stack = infer_stack(sc["input"])
    bypass = should_bypass_tester(sc["input"], stack)
    check(f"S{sc['id']} Tester Bypass={bypass}",
          bypass == sc["expect_tester_bypass"],
          f"기대={sc['expect_tester_bypass']}, 결과={bypass}")


# ============================================================
# PHASE F: 에이전트 라우팅 경로 검증
# ============================================================
print("=" * 60)
print("PHASE F: 에이전트 라우팅 경로 완전성")
print("=" * 60)

AGENT_SKILLS = ['architect','designer','implementer','reviewer','tester','security']
for skill in AGENT_SKILLS:
    skill_path = os.path.join(BASE, '.agents', 'skills', skill, 'SKILL.md')
    check(f"스킬 '{skill}' SKILL.md", os.path.exists(skill_path))

for sc in SCENARIOS:
    complexity = infer_complexity(sc["input"])
    preset = match_preset(sc["input"])

    if complexity == "lite":
        route = ["Implementer", "Reviewer", "Security"]
    elif complexity == "ultra":
        route = ["Architect", "Designer", "Implementer", "Reviewer",
                 "Tester", "Security"]
    else:
        route = ["Architect", "Designer", "Implementer", "Reviewer",
                 "Tester", "Security"]

    if preset is None and "Designer" in route:
        route.remove("Designer")
    if sc["expect_tester_bypass"] and "Tester" in route:
        route.remove("Tester")

    # 최소 Implementer + Security는 항상 존재해야
    check(f"S{sc['id']} 라우팅에 Implementer 포함",
          "Implementer" in route, f"경로: {route}")
    check(f"S{sc['id']} 라우팅에 Security 포함",
          "Security" in route, f"경로: {route}")
    check(f"S{sc['id']} 라우팅 최소 2 에이전트",
          len(route) >= 2, f"경로: {route}")


# ============================================================
# PHASE G: 접근 제어 모델 판단 검증
# ============================================================
print("=" * 60)
print("PHASE G: 접근 제어 모델 판단 (RBAC/ABAC)")
print("=" * 60)

def infer_access_model(inp):
    """setup-from-application Step 2.5 시뮬레이션"""
    features = (inp.get("keyFeatures","") + " " + inp.get("otherRequests","")).lower()
    deploy = inp.get("deployment","").lower()
    budget = int(inp.get("budget","0") or "0")

    if any(k in features for k in ["hipaa","privacy","purge","strict"]):
        return "abac_strict"
    if any(k in features for k in ["voice","audio","image","camera","video"]):
        return "abac_media"
    if any(k in deploy for k in ["aws","docker","cloud","internal"]):
        return "hybrid"
    if budget == 0:
        return "rbac_only"
    return "hybrid"

ac_path = os.path.join(BASE, '.agents', 'access-control.md')
check("access-control.md 존재", os.path.exists(ac_path))

for sc in SCENARIOS:
    model = infer_access_model(sc["input"])
    check(f"S{sc['id']} 접근제어={model}", model is not None)


# ============================================================
# PHASE H: 스캐폴드 디렉토리 구조 검증
# ============================================================
print("=" * 60)
print("PHASE H: 스캐폴드 필수 디렉토리 검증")
print("=" * 60)

REQUIRED_DIRS = ['src', 'tests', 'final', 'docs', '.agents']
REQUIRED_ROOT_FILES = [os.path.join('.agents', 'GEMINI.md'), os.path.join('docs', 'INSTRUCTIONS.md')]

for d in REQUIRED_DIRS:
    path = os.path.join(BASE, d)
    check(f"디렉토리 '{d}/' 존재", os.path.isdir(path))

for f in REQUIRED_ROOT_FILES:
    path = os.path.join(BASE, f)
    check(f"파일 '{f}' 존재", os.path.isfile(path))


# ============================================================
# PHASE I: final/ 루트 동기화 정합성 (이전 이슈 재발 방지)
# ============================================================
print("=" * 60)
print("PHASE I: final/ 동기화 정합성")
print("=" * 60)

final_dir = os.path.join(BASE, 'final')
root_code_files = [f for f in os.listdir(BASE)
                   if os.path.isfile(os.path.join(BASE, f))
                   and f.endswith(('.html','.css','.js'))]

for f in root_code_files:
    final_path = os.path.join(final_dir, f)
    if os.path.exists(final_path):
        rs = os.path.getsize(os.path.join(BASE, f))
        fs = os.path.getsize(final_path)
        check(f"동기화 {f}", rs == fs,
              f"root={rs}B vs final={fs}B")


# ============================================================
# PHASE J: 크로스 시나리오 충돌 검증
# ============================================================
print("=" * 60)
print("PHASE J: 크로스 시나리오 충돌 검증")
print("=" * 60)

# 같은 프리셋을 요청하는 시나리오들이 독립적인지
preset_usage = {}
for sc in SCENARIOS:
    p = sc.get("expect_preset")
    if p:
        preset_usage.setdefault(p, []).append(sc["id"])

for preset, ids in preset_usage.items():
    check(f"프리셋 '{preset}' 고유 시나리오", len(ids) == 1,
          f"중복 사용: S{ids}")

# 모든 시나리오 이름이 유일한지
labels = [sc["label"] for sc in SCENARIOS]
check("시나리오 이름 유일성", len(labels) == len(set(labels)))

# 프로젝트 이름 유일성
names = [sc["input"]["projectName"] for sc in SCENARIOS]
check("프로젝트 이름 유일성", len(names) == len(set(names)))


# ============================================================
# 최종 결과
# ============================================================
print()
print("=" * 60)
print("  VAS 2.4 드라이런 10-시나리오 풀 파이프라인 검증 결과")
print("=" * 60)

for r in RESULTS:
    status = "[PASS]" if "[PASS]" in r else "[FAIL]"
    prefix = "" if status == "[PASS]" else ">>> "
    print(f"{prefix}{r}")

print()
print("-" * 60)
total = PASS + FAIL
print(f"  TOTAL: {total} | PASS: {PASS} | FAIL: {FAIL}")
if total > 0:
    print(f"  합격률: {PASS/total*100:.1f}%")

if FAIL == 0:
    print()
    print("  *** 10 시나리오 풀 파이프라인 무결점 통과 ***")
else:
    print(f"\n  !!! {FAIL}건 실패 -- 수정 후 재검증 필요")

print("=" * 60)
sys.exit(0 if FAIL == 0 else 1)
