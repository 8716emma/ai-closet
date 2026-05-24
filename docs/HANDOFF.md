# 에이전트 인계 문서 (HANDOFF)

> **다음 에이전트는 이 문서를 최우선으로 읽고 이전 작업 맥락을 파악하세요.**
> **그 다음 반드시 `docs/index.md` → `docs/log.md` 순서로 읽으세요.**

---

## 1. 이전 세션 요약 (2026-05-19 16:17)

- **완료된 작업:**
  1. `vas-migration-archive.py` 신규 생성: 원본 프로젝트를 스캔→`.temp data/`에 `_backup.zip` 압축→`final/`에 배치→원본 삭제(선택).
  2. `migration-cycle.md`에 **Step -1 (프로젝트 인제스트)** 추가: 사용자가 원본 경로만 알려주면 자동 아카이빙.
  3. `MIGRATION.md` 퀵가이드 업데이트: 자동 아카이빙 흐름 반영, 수동 방식도 병행 지원 명시.
  4. `test_migration_10scenarios.py` Phase B-2 추가: 아카이버 스크립트 존재·충돌방지·플래그·프롬프트·정책 검증 (10건).
  5. `test_integrity_10loop.py` 동기화 확장: `.py`/`.md` 파일도 루트↔final 바이트 동기화 검증 대상에 포함.
  6. 전체 `final/` 동기화 및 무결점 테스트 통과 확인.

---

## 2. 현재 파일 상태

| 파일 | 상태 |
|------|------|
| `vas-migration-archive.py` | ✅ 신규 — 스캔·ZIP·배치·삭제(선택) 자동화 |
| `.agents/workflows/migration-cycle.md` | ✅ Step -1 추가, 퀵가이드 방법 A/B 업데이트 |
| `MIGRATION.md` | ✅ 퀵가이드 자동 아카이빙 흐름 반영 |
| `tests/test_migration_10scenarios.py` | ✅ Phase B-2 (아카이버 검증 10건) 추가 |
| `tests/test_integrity_10loop.py` | ✅ .py/.md 동기화 검증 확장 |
| `final/` | ✅ 루트와 완전 동기화 |

---

## 3. 보관 정책

| 저장소 | 정책 |
|--------|------|
| `.vas_backups/` (마이크로 체크포인트) | 최근 10개 |
| `.temp data/` (마이그레이션 백업) | 최근 1개만 (`*_backup.zip`) |

---

## 4. 다음 에이전트 진행 방향 (Next Steps)

- **실전 마이그레이션 테스트:** 실제 프로젝트 폴더를 `vas-migration-archive.py`로 아카이빙→`/migration-cycle` 전체 실행.
- 플랫폼 실전 투입 준비 완료. 실제 의뢰서를 넣고 `/dev-cycle`로 첫 실전 프로젝트 가동 가능.

---

## 5. 절대 금지 규칙

- **PowerShell로 한국어 파일 절대 수정 금지** → Python 스크립트만 사용
- **이모지 출력 시 `sys.stdout` UTF-8 래퍼 필수** → cp949 터미널 크래시 방지
- **`"invoice"` 속 `"voice"` 같은 서브스트링 false positive 주의** → AI 키워드 매칭은 `\b` 단어 경계 정규식 사용

---

*작성일자: 2026-05-19 16:17*
