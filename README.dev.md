# 개발 환경 시작 가이드

## 사전 요구사항

- **Node.js** 18 이상
- **pnpm** 10.28+ (`corepack enable` 로 활성화)
- (선택) **PostgreSQL** — DB 모드로 실행할 경우에만 필요

## 1. 의존성 설치

```bash
pnpm install
```

## 2. 환경 변수 설정

`.env.example`을 복사하여 `.env` 파일을 생성한다.

```bash
cp .env.example .env
```

### 인메모리 모드 (DB 없이 바로 시작)

`.env` 수정 없이 그대로 사용하면 된다. 기본값이 `MEMORY` 모드다.

```env
USE_DATABASE_MODE=MEMORY
```

### Postgres 모드 (Supabase 등 외부 DB 연결)

```env
USE_DATABASE_MODE=POSTGRES
DATABASE_URL=postgresql://postgres.[PROJECT-ID]:[PASSWORD]@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres
BETTER_AUTH_SECRET=임의의-시크릿-문자열
BETTER_AUTH_URL=http://localhost:3000
```

| 변수 | 설명 |
|------|------|
| `USE_DATABASE_MODE` | `MEMORY` (인메모리) 또는 `POSTGRES` (DB 연결) |
| `DATABASE_URL` | PostgreSQL 연결 문자열 (Supabase Pooler 권장) |
| `BETTER_AUTH_SECRET` | 세션 서명용 비밀 키. 임의 문자열 사용 |
| `BETTER_AUTH_URL` | 앱의 공개 URL. 로컬은 `http://localhost:3000` |

## 3. 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 `http://localhost:3000` 으로 접속한다.

## 4. 데이터베이스 설정 (Postgres 모드만 해당)

```bash
pnpm db:push       # 스키마를 DB에 직접 반영
pnpm seed          # 초기 샘플 데이터 삽입
```

마이그레이션 파일이 필요한 경우:

```bash
pnpm db:generate   # 마이그레이션 SQL 생성
pnpm db:migrate    # 마이그레이션 적용
```

## 5. 빌드 및 프리뷰

```bash
pnpm build         # 프로덕션 빌드
pnpm preview       # 빌드 결과 미리보기
```

## 주요 스크립트 요약

| 명령어 | 설명 |
|--------|------|
| `pnpm dev` | 개발 서버 (HMR) |
| `pnpm build` | 프로덕션 빌드 |
| `pnpm preview` | 빌드 미리보기 |
| `pnpm generate` | 정적 사이트 생성 |
| `pnpm db:push` | 스키마 → DB 직접 반영 |
| `pnpm db:generate` | 마이그레이션 파일 생성 |
| `pnpm db:migrate` | 마이그레이션 적용 |
| `pnpm seed` | 초기 데이터 시딩 |
