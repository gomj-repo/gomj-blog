# gomj-blog

## 프로젝트 개요

이 저장소는 Nuxt 4 + Nuxt Content v3 기반 개인 포트폴리오/기술 블로그다.
Markdown 콘텐츠를 게시판(컬렉션)별로 분류하고, 정적 사이트로 생성한다.
서버 백엔드 없이 프론트엔드 + 콘텐츠 구조로만 동작한다.

## 패키지 구조

### Front-end

- `app/` : 프론트엔드 루트
- `app/assets/css/` : 전역 CSS, 디자인 토큰
- `app/components/` : UI 컴포넌트
- `app/components/atoms/` : 최소 단위 UI (BaseBadge, BaseCard, BaseList). 외부 상태·composable 의존 금지
- `app/components/molecules/` : atoms 조합 + DOM 접근 허용 (ArticleCard, ArticleMeta, TableOfContents 등)
- `app/components/templates/` : 페이지 레이아웃 골격 (AppHeader, AppSidebar, AppFooter, SearchDialog)
- `app/composables/` : 상태 관리, 유틸, 부수효과 처리
- `app/layouts/` : 공통 레이아웃
- `app/pages/` : 실제 라우트 페이지

### Content

- `content/` : Markdown 콘텐츠 (Nuxt Content v3)
- `content/projects/` : 프로젝트 게시판
- `content/til/` : TIL(Today I Learned) 게시판
- `content/notes/` : 노트 게시판
- `content/resume/` : 이력서

### 기타

- `content.config.ts` : 컬렉션 정의 및 스키마
- `public/` : 정적 에셋

## 명령어

- `npm run dev` — 개발 서버
- `npm run build` — 프로덕션 빌드
- `npm run generate` — 정적 사이트 생성
- `npm run preview` — 빌드 미리보기

## 작업 원칙

- 화면 조합은 `app/pages/`에서 최소한으로 유지한다.
- 재사용 가능한 UI는 `app/components/`에 둔다.
- 상태와 사이드 이펙트는 `app/composables/`로 이동한다.
- 디자인 토큰은 `variables.css`에서 관리하고, 컴포넌트 CSS에 직접 하드코딩하지 않는다.
- 문서를 수정할 때는 실제 디렉터리 구조와 서비스 목적이 일치해야 한다.

## CSS 토큰 계층

`variables.css`에서 토큰을 정의하고, 컴포넌트 CSS에서 참조한다.

| 계층 | 역할 | 예시 |
|------|------|------|
| Color | 색상 값 (light/dark) | `--color-bg`, `--color-text`, `--color-primary` |
| Typography | 글꼴, 크기, 행간 | `--font-size-base`, `--line-height-normal` |
| Spacing | 여백 | `--space-sm`, `--space-md` |
| Layout | 레이아웃 수치 | `--sidebar-width`, `--header-height` |
| Border/Shadow | 테두리, 그림자 | `--radius-md`, `--shadow-sm` |
| Transition | 전환 속도 | `--transition-fast`, `--transition-normal` |

- 숫자/색상/px 값을 컴포넌트 CSS에 직접 반복 선언하기보다 토큰을 먼저 추가할 수 있는지 검토한다.
- 동일한 버튼, 카드, 입력 골격이 반복되면 공용 CSS 블록으로 통합한다.
- 상태 표현은 `.is-active`, `.is-collapsed` 같은 의미 중심 이름을 사용한다.

## 컴포넌트 설계 원칙

### 계층 구조

| 계층 | 위치 | 역할 |
|------|------|------|
| atoms | `app/components/atoms/` | 최소 단위 UI. props+slot+emit만. 외부 상태·composable 의존 금지 |
| molecules | `app/components/molecules/` | atoms 조합. DOM 접근, 간단한 composable 사용 허용 |
| templates | `app/components/templates/` | 페이지 레이아웃 골격. slot 구조 정의, composable 사용 허용 |

### Flat + Compound 원칙

| 방식 | 사용 시점 | 패턴 |
|------|-----------|------|
| **Flat** | 단순 사용 | props만으로 기본 동작 |
| **Compound** | 커스텀 필요 | slot + sub-component 조합 |

- **slot 우선** — 내용은 slot, 데이터는 props, 인터랙션은 emit
- **토큰 우선** — 색상·글꼴·크기 하드코딩 금지, 토큰 없으면 추가 먼저 검토
- atoms 컴포넌트가 composable·전역 상태에 의존하지 않는지 확인

## Composables 분리 원칙

`app/composables/`는 역할별로 분리한다. 하나의 composable이 여러 책임을 동시에 가지지 않도록 한다.

| 코드 성격 | 예시 |
|-----------|------|
| 순수 계산·변환 | useReadingTime, useTags |
| 상태 관리 | useDarkMode, useNavigation, useBoardMeta |
| 외부 의존·DOM | useSearch (검색 UI 상태) |

- 순수 계산 함수는 외부 환경(API·DOM·전역 상태)에 직접 의존하지 않는다.
- 하나의 composable이 계산 + 상태 + DOM 접근을 동시에 수행하면 분리를 검토한다.

## 에이전트 작업 규칙

- `TODO:` 또는 `TODO 0.` 주석을 발견하면 설명으로 남기지 말고 해당 기능 구현을 우선 검토한다.
- `TODO`, `TODO-`, `TODO1` 등 다른 표기는 자동 구현 대상으로 간주하지 않는다.
- 토큰 사용량을 줄이기 위해 필요한 파일과 직접 연관된 파일만 읽고, 광범위한 검색과 긴 출력은 피한다.
- 사용자가 이미 설명한 내용을 다시 요약하거나 반복하지 않는다.
- 이미 읽은 파일은 같은 대화 안에서 다시 읽지 않는다.
- 독립적인 도구 호출은 동시에 실행하고, 불필요한 호출을 최소화한다.
- 요청받은 범위만 수정한다.

## 컨텍스트 관리

- 새로운 작업으로 전환할 때는 이전 컨텍스트를 수동으로 정리한다.
- 대화가 길어지면 컨텍스트 사용량을 확인하고, 60% 도달 시점에 `/compact`를 실행한다.
- 20줄 이상의 불필요한 출력이 예상되는 작업은 서브 에이전트로 처리한다.

## 3-에이전트 팀 워크플로우

모든 비trivial 작업은 아래 구조로 진행한다.

| 역할 | 모델 | 책임 |
|------|------|------|
| **설계 (Architect)** | Claude Opus 4.6 | 시스템 분석, 구현 계획, 브리프 작성 |
| **코딩 (Builder)** | Claude Sonnet 4.5 | 브리프 기반 코드 구현 |
| **테스트 (Tester)** | Claude Sonnet 4.5 | 품질 검증, 빌드 테스트 |

작업 순서: Architect → Builder → Tester → Architect(최종 확인)

- Architect는 전체 구조를 파악하고 무엇을, 어느 파일에, 어떤 순서로 수정할지 브리프를 작성한다. 실제 코드 수정은 하지 않는다.
- Builder는 브리프에 명시된 파일과 범위만 수정한다. 브리프에 없는 기능은 추가하지 않는다.
- Tester는 변경된 코드의 품질과 브리프 준수 여부를 검증하고, 문제 발생 시 구체적인 수정 사항을 Builder에게 반환한다.

## 빠른 판단표

| 변경 대상 | 위치 |
|-----------|------|
| 화면 조합 변경 | `app/pages/` |
| 재사용 기본 UI | `app/components/atoms/` |
| 글 관련·조합 UI | `app/components/molecules/` |
| 레이아웃 골격 | `app/components/templates/` |
| 토큰 수정 | `app/assets/css/variables.css` |
| 글로벌 스타일 | `app/assets/css/base.css` |
| 레이아웃 CSS | `app/assets/css/layout.css` |
| 컴포넌트 CSS | `app/assets/css/components.css` |
| 순수 계산 로직 | `app/composables/` |
| 콘텐츠 추가 | `content/{board}/` |
| 컬렉션 정의 | `content.config.ts` |

## 현재 .claude Skill

- `blog-architecture` : 블로그 프로젝트의 패키지 구조와 작업 규칙을 따르기 위한 프로젝트 전용 스킬
- `blog-components` : `app/components/base/`, `content/`, `layout/` 계층 기준으로 Flat+Compound 원칙에 따라 UI 컴포넌트를 설계하고 구현하기 위한 프로젝트 전용 스킬

## 현재 .claude Command

- `lean` : 토큰 사용량을 최소화하기 위해 읽기 범위, 출력 길이, 보고 방식을 압축하는 프로젝트 전용 명령
