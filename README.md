# GOMJ Wiki

Nuxt 4 기반 위키 스타일 블로그. 백엔드(Nitro) + PostgreSQL로 디렉터리·페이지를 계층적으로 관리한다.

## 주요 기능

- **Confluence 스타일 사이드바** — 폴더+페이지 혼합 트리, 계층적 하위 페이지 지원
- **인라인 WYSIWYG 편집** — TipTap 기반 리치 텍스트 에디터, 페이지 보기에서 바로 편집
- **Material Design 3** — M3 Expressive 디자인 토큰 시스템, 라이트/다크 테마
- **반응형 레이아웃** — 데스크탑: 사이드바 상시 표시, 모바일: USlideover + 자동 닫힘
- **태그 시스템** — 페이지별 태그 관리, 태그별 페이지 검색
- **전문 검색** — 페이지 제목·본문 통합 검색 (⌘K)
- **이미지 업로드** — 에디터 내 이미지 삽입 및 서버 업로드
- **인증/권한** — better-auth 기반, 관리자 전용 편집·삭제

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | Nuxt 4, Vue 3 |
| UI | Nuxt UI, Tailwind CSS 4 |
| 에디터 | TipTap (StarterKit, Image, Link, TextAlign, Underline) |
| 백엔드 | Nitro (Nuxt Server) |
| 데이터베이스 | PostgreSQL + Drizzle ORM |
| 인증 | better-auth |
| 검증 | Zod |

## 프로젝트 구조

```
app/
├── assets/css/main.css          # M3 디자인 토큰 + 글로벌 스타일
├── components/
│   ├── editor/                  # TipTap 에디터 (TipTapEditor, EditorToolbar, EditorBubbleMenu)
│   ├── page/                    # 페이지 헤더·뷰어
│   ├── sidebar/                 # 사이드바 (AppSidebar, FolderTree, TreeItem)
│   ├── search/                  # 검색 다이얼로그
│   ├── tag/                     # 태그 배지·선택기
│   └── templates/               # 레이아웃 골격 (AppHeader, AppFooter, ThemeToggle)
├── composables/
│   ├── action/                  # 순수 계산 (useSidebarTree, useFolderTree, usePageTree)
│   ├── store/                   # 상태 관리 (useAuthStore, useFolderStore, usePageStore)
│   └── sideeffect/              # API 호출 (useFolderApi, usePageApi, useTagApi)
├── layouts/default.vue          # 사이드바 + 헤더 + 콘텐츠 레이아웃
├── pages/
│   ├── index.vue                # 홈 (폴더 그리드 + 최근 페이지)
│   └── folders/                 # 폴더·페이지 보기·편집
server/
├── api/                         # REST API 라우트 (폴더·페이지·태그·검색·업로드·인증)
├── repositories/                # 저장소 패턴 (Drizzle + InMemory 구현체)
├── database/                    # 스키마 정의 + 시드
└── utils/                       # DB 클라이언트, 인증, TipTap 유틸
shared/
├── types/                       # 공유 타입 (SavedFolder, SavedPage)
└── schemas/                     # Zod 입력 스키마
```

## 설치 및 실행

```bash
pnpm install
```

### 환경 변수

`.env.example`을 참고하여 `.env` 파일을 생성한다.

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/gomj_wiki
BETTER_AUTH_SECRET=your-secret
BETTER_AUTH_URL=http://localhost:3000
USE_DATABASE_MODE=POSTGRES   # 또는 MEMORY (DB 없이 인메모리 실행)
```

### 개발 서버

```bash
pnpm dev
```

### 인메모리 모드 (DB 없이 실행)

```bash
USE_DATABASE_MODE=MEMORY pnpm dev
```

### 데이터베이스 마이그레이션

```bash
pnpm db:generate   # 마이그레이션 생성
pnpm db:migrate    # 마이그레이션 적용
pnpm db:push       # 스키마 직접 push
pnpm seed          # 초기 데이터 시딩
```

### 프로덕션 빌드

```bash
pnpm build
node .output/server/index.mjs
```
