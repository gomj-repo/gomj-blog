# CLAUDE.md

## 프로젝트 개요

이 저장소는 Nuxt 4 기반 위키 스타일 블로그다.
백엔드 서버(Nitro)와 PostgreSQL을 통해 디렉터리·페이지를 계층적으로 관리한다.
Confluence처럼 폴더(디렉터리)와 마크다운 페이지를 트리 구조로 구성하며,
관리자가 동적으로 콘텐츠를 생성·편집·삭제할 수 있다.

## 패키지 구조

### Front-end

- `app/` : 프론트엔드 루트
- `app/assets/css/` : 전역 CSS, 디자인 토큰
- `app/assets/images/` : 이미지 자산
- `app/assets/icons/` : 아이콘 자산
- `app/components/` : 페이지 단위 UI 컴포넌트
- `app/components/<page>/` : 페이지별 독립 컴포넌트 패키지 (향후 마이그레이션 예정, 현재는 플랫 구조 `app/components/atoms/` 등 사용)
- `app/components/<page>/atoms/` : 최소 단위 입력 컴포넌트
- `app/components/<page>/molecules/` : atomic design 기준의 중간 단위 컴포넌트
- `app/components/<page>/organizations/` : 조직 단위 컴포넌트
- `app/components/<page>/templates/` : 페이지 조합 단위 컴포넌트
- `app/composables/` : 상태 관리, 독립 유틸, 부수효과 처리
- `app/composables/action/` : 독립적인 유틸리티 기능 패키지
- `app/composables/sideeffect/` : 외부 API 통신 등 부수 효과를 이해하기 쉽고 테스트 가능하게 관리하는 패키지
- `app/composables/store/` : 데이터 상태를 관리하는 패키지
- `app/layouts/` : 공통 레이아웃
- `app/middleware/` : 라우트 미들웨어
- `app/pages/` : 실제 라우트 페이지

### Back-end

- `server/` : 백엔드 루트
- `server/api/` : API 엔드포인트
- `server/api/auth/` : better-auth 핸들러
- `server/api/folders/` : 폴더 CRUD API (index.get/post, [id].get/patch/delete, reorder.patch)
- `server/api/pages/` : 페이지 CRUD API + 태그 연결 (index.get/post, [id].get/patch/delete, recent.get, reorder.patch, [id]/tags/)
- `server/api/tags/` : 태그 관리 API (index.get/post, [id].delete, [id]/pages.get)
- `server/api/search/` : 검색 API
- `server/api/uploads/` : 파일 업로드 API
- `server/routes/` : Nitro route 핸들러
- `server/database/` : DB 연결, 스키마, 시드
- `server/repositories/` : 데이터 접근 계층 (folder/page/tag/search + interface + drizzle/memory impl)
- `server/utils/` : 인증, DB, 세션, 에디터 공통 유틸

### Shared

- `shared/` : 프론트엔드와 백엔드 공용 코드
- `shared/types/` : 도메인 타입 정의 (folder, page, search, tag, user)
- `shared/schemas/` : 스키마 정의, 타입 및 클래스의 기준 (folder.schema, page.schema, tag.schema)
- `shared/data/` : 샘플 데이터, 목업 데이터, 개발용 fixtures (향후 사용 예정)

### 기타

- `lib/` : 외부 라이브러리 저장소, 일반적인 기능 수정 범위에서는 우선순위가 낮다 (향후 사용 예정)
- `public/` : 정적 자산

## 명령어

- `npm run dev` — 개발 서버
- `npm run build` — 프로덕션 빌드
- `npm run generate` — 정적 사이트 생성
- `npm run preview` — 빌드 미리보기

## 작업 원칙

- 화면 조합은 `app/pages/`에서 최소한으로 유지한다.
- 재사용 가능한 UI는 `app/components/`에 둔다.
- 상태와 사이드 이펙트는 `app/composables/`로 이동한다.
- `app/composables/` 내부에서는 책임을 `action`, `sideeffect`, `store`로 분리한다.
- 외부 API 접근은 가능하면 `server/routes/` 또는 `server/api/`를 경유한다.
- 프론트엔드와 백엔드가 함께 쓰는 정의는 `shared/`에 둔다.
- 도메인 타입과 입력 검증 스키마의 기준은 `shared/types/`, `shared/schemas/`에 둔다.
- 외부 라이브러리인 `lib/`는 직접 수정하기보다 래핑과 조합으로 대응한다.
- 문서를 수정할 때는 실제 디렉터리 구조와 서비스 목적이 일치해야 한다.
- 디자인 토큰은 `primitive -> semantic -> feature CSS` 순서로 계층을 유지한다 (향후 마이그레이션 예정, 현재는 `variables.css` 단일 파일 사용).
- primitive token은 값 자체만 두고, semantic token은 역할 이름으로 재매핑한다.
- feature CSS(`components/**`, `pages/**`)에는 토큰 정의보다 실제 UI 규칙을 우선 둔다.

## 에이전트 작업 규칙

- `TODO:` 또는 `TODO 0.` 주석을 발견하면 설명으로 남기지 말고 해당 기능 구현을 우선 검토한다.
- `TODO`, `TODO-`, `TODO1` 등 다른 표기는 자동 구현 대상으로 간주하지 않는다.
- 사용자가 `@`로 첨부하지 않은 파일을 읽어야 하면 먼저 파일 경로와 읽는 이유를 짧게 설명하고 권한을 요청한다.
- 한 번 권한을 받은 범위 안에서만 추가 파일을 읽고, 범위를 벗어나면 다시 요청한다.
- 토큰 사용량을 줄이기 위해 필요한 파일과 직접 연관된 파일만 읽고, 광범위한 검색과 긴 출력은 피한다.
- 요약이 가능하면 원문 인용보다 요약을 우선하고, 진행 보고도 짧게 유지한다.
- 사용자가 이미 설명한 내용을 다시 요약하거나 반복하지 않는다.
- 이미 읽은 파일은 같은 대화 안에서 다시 읽지 않는다.
- 독립적인 도구 호출은 동시에 실행하고, 불필요한 호출을 최소화한다.
- 요청받은 범위만 수정한다. "전체에서 찾아줘" 식의 광범위한 탐색보다 "X 파일의 Y 함수"처럼 명확한 범위에 집중한다.

## 컨텍스트 관리

- 새로운 작업으로 전환할 때는 이전 컨텍스트를 수동으로 정리한다.
- 대화가 길어지면 컨텍스트 사용량을 확인하고, 60% 도달 시점에 `/compact`를 실행한다.
- 20줄 이상의 불필요한 출력이 예상되는 작업은 서브 에이전트로 처리한다.

## 토큰 절약 명령

- `/project:lean` : 최소 파일만 읽고, 짧은 진행 보고와 짧은 최종 답변으로 작업하도록 유도하는 프로젝트 전용 명령
- `/project:lean` 사용 시에는 필요한 파일 목록을 먼저 좁히고, 구현에 직접 필요한 구간만 읽는다.

## 3-에이전트 팀 워크플로우

모든 비trivial 작업은 아래 구조로 진행한다.

| 역할 | 모델 | 책임 |
|------|------|------|
| **설계 (Architect)** | Claude Opus 4.6 | 시스템 분석, 구현 계획, 브리프 작성 |
| **코딩 (Builder)** | Claude Sonnet 4.5 | 브리프 기반 코드 구현 |
| **테스트 (Tester)** | Claude Sonnet 4.5 | ��질 검증, 빌드 테스트 |

작업 순서: Architect → Builder → Tester → Architect(최종 확인)

- Architect는 전체 구조를 파악하고 무엇을, 어느 파일에, 어떤 순서로 수정할지 브리프를 작성한다. 실제 코드 수정은 하지 않는다.
- Builder는 브리프에 명시된 파일과 범위만 수정한다. 브리프에 없는 기능은 추가하지 않는다.
- Tester는 변경된 코드의 품질과 브리프 준수 여부를 검증하고, 문제 발생 시 구체적인 수정 사항을 Builder에게 반환한다.

## Front-end 아키텍처

### 페이지와 레이아웃

- `app/pages/`는 화면 조합과 초기 진입만 담당한다.
- 에디터가 필요한 페이지에서는 TipTap 컴포넌트를 조합하고, 에디터 설정은 `server/utils/tiptap.ts`에서 관리한다.
- 인증이 필요한 라우트는 `app/middleware/auth.ts`를 통해 제어한다.

### CSS 토큰과 스타일 경계

- raw value token은 `app/assets/css/base/primitive.css`에 둔다 (향후 마이그레이션 예정, 현재는 `variables.css` 사용).
- semantic token은 `app/assets/css/base/semantic.css`에 두고, primitive token을 역할 이름으로 매핑한다 (향후 마이그레이션 예정).
- 전역 CSS 엔트리는 `app/assets/css/base/main.css`이며, `primitive.css`, `semantic.css`, `components/common.css` 순서의 import를 기준으로 본다.
- `app/assets/css/components/**`는 컴포넌트 단위 스타일만 둔다.
- `app/assets/css/pages/**`는 페이지 조합 스타일만 둔다.
- 숫자/색상/px 값을 컴포넌트 CSS에 직접 반복 선언하기보다 semantic token을 먼저 추가할 수 있는지 검토한다.
- 동일한 버튼, 카드, 입력, 라벨 골격이 반���되면 공용 CSS 블록으로 통합하고, 개별 컴포넌트는 modifier 또는 CSS 변수 override 중심으로 유지한다.
- 상태 표현은 `.active`, `.collapse` 같은 의미가 좁거나 값 중심인 이름보다 `.is-active`, `.is-collapsed` 같은 상태 이름과 semantic token 조합을 우선한다.
- 경로 정리나 UI 변경 후 더 이상 쓰지 않는 class, CSS variable override, 구분선 pseudo-element 같은 잔재는 바로 제거한다.

### 상태와 데이터 흐름

- 페이지는 서버 응답을 받아 `store`에 반영하고, 화면 동작은 composable을 조합해 수행한다.
- 폴더 트리 탐색, 페이지 포맷팅, 사이드바 트리 구성 같은 순수 계산은 `action`으로 분리한다.
- `useState` 기반 공유 상태는 `store` 책임으로 간주한다.

## Back-end 아키텍처

### API와 Route 경계

- `server/api/`는 애플리케이션 기능 엔드포인트를 둔다.
  - `server/api/folders/` : 폴더 CRUD (생성, 조회, 수정, 삭제, 정렬)
  - `server/api/pages/` : 페이지 CRUD + 최근 페이지 + 태그 연결
  - `server/api/tags/` : 태그 관리 (생성, 삭제, 태그별 페이지 조회)
  - `server/api/search/` : 전문 검색
  - `server/api/uploads/` : 파일 업로드
  - `server/api/auth/` : better-auth 인증 핸들러
- `server/routes/`는 프록시, 정적 경로형 핸들러, 외부 서비스 중계 같은 Nitro route 경계를 둔다.
- 프론트엔드에서 직접 외부 서비스에 붙기보다 서버 경유 경계를 먼저 검토한다.

### Repository 패턴

- 데이터 접근은 `server/repositories/`에서 관리한다.
- `folder.repository.ts`는 인터페이스(계약)를 정의하고, `folder.repository.drizzle.ts`는 PostgreSQL 구현체, `folder.repository.memory.ts`는 인메모리 구현체를 제공한다.
- `page.repository.ts`, `tag.repository.ts`, `search.repository.ts`도 동일한 구조를 따른다.
- DB 연동 구현체가 추가되어도 인터페��스를 교체 없이 바꿀 수 있도록 의존성 역전 원��을 따른다.

### 인증과 DB 경계

- better-auth 설정과 핸들러 소유권은 `server/utils/auth.ts`, `server/api/auth/[...all].ts`에 둔다.
- DB 연결과 ORM 초기화는 `server/utils/db.ts`에 둔다.
- Drizzle 테이블 정의는 `server/database/schema/`에 두고 (folders, pages, tags, users), 진입점은 `server/database/schema/index.ts`로 통합한다.
- 시드 데이터는 `server/database/seed.ts`에서 관리한다.
- 세션 관리는 `server/utils/session.ts`에서 처리한다.

### TipTap 에디터 경계

- TipTap 에디터 서버측 유틸리티는 `server/utils/tiptap.ts`에 둔다.
- 에디터 확장(이���지, 링크, 텍���트 정렬, 밑줄 등)은 프론트엔드 컴포넌트에서 구성한다.
- 에디터 콘텐츠의 HTML 변환과 서버측 처리는 `server/utils/tiptap.ts`에서 관리한다.

## Shared 아키텍처

- `shared/types/`는 프론트엔드와 백엔드가 공유하는 도메인 타입의 기준이다 (folder, page, search, tag, user).
- `shared/schemas/`는 Zod 같은 런타임 검증 스키마의 기준이다 (folder.schema, page.schema, tag.schema).
- `shared/data/`는 샘플 데이터, 목업 데이터, 개발용 fixtures를 둔다 (향후 사용 예정).
- 프론트엔드와 백엔드에서 공통 도메인 정의가 필요하면 로컬 정의를 복제하지 말고 `shared/`로 올린다.

## 외부 라이브러리 원칙

- `lib/`의 라이브러리는 정적 자산으로 취급하고 직접 수정하지 않는다 (향��� 사용 예정).
- 브라우저 전용 외부 스크립트는 런타임 로딩과 래핑을 통해 사용한다.
- 외부 라이브러리 자체보다 이를 감싸는 프로젝트 코드의 경계를 우선 설계한다.

## Composables 분리 원칙

`app/composables/`는 역할별로 분리한다. 하나의 composable이 여러 책임을 동시에 가지지 않도록 우선 구조를 나눈 뒤 구현한다.

### `app/composables/` 구현 위임 규칙

- `app/composables/`에서 캡슐화와 추상화를 기본 원칙으로 유지한다.
- 사용자가 추상 클래스나 추상 함수를 만들면 구현체는 `*Impl` 이름으로 분리해 추가한다.
- 구현체 파일과 클래스, 함수의 상세 구현은 `*Impl` 쪽에 위임한다.
- 사용자가 지정한 파라미터와 반환값은 계약으로 취급하고 임의로 바꾸지 않는다.
- 파라미터나 반환값 계약을 조정해야 하면 먼저 이유를 설명하고 사용자 권한을 요청한다.
- `*Impl` 하위 코드는 에이전트가 책임지고 완성한다.

### `action`

- 독립적인 유틸리티 기능을 구현한다.
- 외부 API 호출, 전역 상태 저장, 브라우저 IO에 직접 의존하지 않는다.
- 입력과 출력이 분명해야 하며 재사용과 조합이 쉬워야 한다.
- 가능하면 작은 단위 함���로 쪼개고 테스트가 쉬운 형태를 유지한다.
- 예: 폴더 트리 탐색, 사이드바 트리 구성, 페이지 포맷팅, 브레드크럼 생성, SEO 메타 생성

### `sideeffect`

- 외부 API 통신, 브라우저 기능 접근, 타이머, 로깅 등 부수 효과를 관리한다.
- 부��� 효과의 시작점과 종료 조건이 코드에서 분명히 드러나야 한다.
- 테스트 가능성을 위해 의존성 주입, 래핑, 인터페이스 분리를 우선 고려한다.
- 상태를 직접 소유하기보다 `store`와 연결하거나 호출 결과를 반환하는 방식으로 구성한다.
- 예: 폴더 API 호출(useFolderApi), 페이지 API 호출(usePageApi), 태그 API 호출(useTagApi), 검색 API 호출(useSearchApi), 인증 API 호출(useAuthApi)

### `store`

- 화면과 기능에서 공유하는 데이터 상태를 관리한다.
- 읽기, 쓰기, 파생 상태를 한 곳에서 이해할 수 있게 유지한다.
- 가능한 한 상태 전이 규칙을 명시적으로 드러낸다.
- 외부 통신 자체는 `sideeffect`에 두고, `store`는 상태 반영과 구독 가능한 데이터 제공에 집중한다.
- 예: 폴더 상태(useFolderStore), 페이지 상태(usePageStore), 태그 상태(useTagStore), 검색 상태(useSearchStore), 인증 상태(useAuthStore), 테마 상태(useThemeStore)

## Composables 점검 항목

- 유틸성 로직이 `store`나 `sideeffect`에 불필요하게 섞여 있지 않은지 확인한다.
- 외부 통신 코드가 `action`에 들어가지 않았는지 확인한다.
- 상태 변경 책임이 `sideeffect`에 과도하게 들어가지 않았는지 확인한다.
- 하나의 composable이 `action`, `sideeffect`, `store`의 책임을 동시에 수행하지 않는지 확인한다.
- 에디터 관련 로직이 적절한 계층에 배치되어 있는지 확인한다.
- 인증 관련 API 호출이 `sideeffect`에, 인증 상태가 `store`에 분리되어 있는지 확인한다.

## 빠른 판단표

| 변경 대상 | 위치 |
|-----------|------|
| 화면 조합 변경 | `app/pages/` 또는 `app/components/<page>/templates/` |
| 재사용 UI 추가 | `app/components/<page>/molecules/`, `app/components/<page>/templates/` |
| 외부 CSS 수정 | `app/assets/css/components/**`, `app/assets/css/pages/**` |
| 토큰 수정 | `app/assets/css/base/primitive.css`, `app/assets/css/base/semantic.css` |
| 순수 계산 로직 | `app/composables/action/` |
| 외부 API, 브라우저 API | `app/composables/sideeffect/` |
| 공유 상태 | `app/composables/store/` |
| 공통 타입, 스키마, fixture | `shared/**` |
| API, 인증, DB | `server/**` |

## 현재 .claude Skill

### 프로젝트 구조 스킬
- `project-architecture` : 블로그 프로젝트의 패키지 구조와 작업 규칙을 따르기 위한 프로젝트 전용 스킬
- `project-composables` : `app/composables/action`, `app/composables/sideeffect`, `app/composables/store`의 책임 분리를 따르기 위한 프로젝트 전용 스킬
- `project-components` : `app/components/<page>/molecules/`와 `app/components/<page>/templates/` 계층 기준으로 Toss Flat+Compound 원칙에 따라 UI 컴포넌트를 설계하고 구현하기 위한 프로젝트 전용 스킬

### 범용 패턴 스킬
- `create-api-service` : 외부 API 연동 시 원본 Response Class + 추상화 Local Response 분리, `service.requestBy{기준}()` 네이밍 규칙을 따르기 위한 스킬
- `create-unified-api-response` : 한 기능에서 2개 이상 API 사용 시 공통 Local Response를 정의하고, 호출부 외 모든 후속 로직을 통일하는 스킬
- `create-popup-modal` : 팝업/모달 컴포넌트 생성 스킬
- `create-type-role` : 타입 역할 생성 스킬

## 현재 .claude Command

- `lean` : 토큰 사용량을 최소화하기 위해 읽기 범위, 출력 길이, 보고 방식을 압축하는 프로젝트 전용 명령
