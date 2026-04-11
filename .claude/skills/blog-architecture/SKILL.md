---
name: blog-architecture
description: This skill should be used when the user asks to "블로그 구조를 정리", "프로젝트 아키텍처에 맞게 수정", "페이지와 컴포넌트 규칙에 맞춰 작업", "CLAUDE 문서를 프로젝트 구조에 맞게 갱신"해야 할 때. 구조 경계와 디렉터리 책임을 빠르게 판별하는 기준으로 쓴다.
---

# Blog Architecture

> 작업 원칙·패키지 구조·CSS 토큰 규칙은 `CLAUDE.md`를 기준으로 한다. 이 스킬은 **판단이 모호할 때의 추가 기준**만 둔다.

## 디렉터리 빠른 판단표

| 변경 대상 | 위치 |
|-----------|------|
| 화면 조합 | `app/pages/` |
| 최소 단위 UI (atoms) | `app/components/atoms/` |
| 조합 UI (molecules) | `app/components/molecules/` |
| 레이아웃 골격 (templates) | `app/components/templates/` |
| 디자인 토큰 | `app/assets/css/variables.css` |
| 글로벌 스타일 | `app/assets/css/base.css` |
| 레이아웃 CSS | `app/assets/css/layout.css` |
| 컴포넌트 CSS | `app/assets/css/components.css` |
| 순수 계산·상태 | `app/composables/` |
| 콘텐츠 | `content/{board}/` |
| 컬렉션 스키마 | `content.config.ts` |

## 페이지와 라우팅

| 페이지 | 경로 | 역할 |
|--------|------|------|
| 홈 | `/` | Hero + 최근 게시물 섹션 |
| 게시판 목록 | `/[board]` | 게시판별 글 목록 |
| 글 상세 | `/[board]/[...slug]` | 글 읽기 + TOC + 이전/다음 |
| 태그 전체 | `/tags` | 전체 태그 |
| 태그별 | `/tags/[tag]` | 태그 필터링 |

## 콘텐츠 경계

- 컬렉션 정의는 `content.config.ts`에서 관리
- 현재 컬렉션: `projects`, `til`, `notes`, `resume`
- 공통 스키마: `title`, `description`, `date`, `tags`, `draft`
- 새 게시판 추가 시: `content.config.ts`에 컬렉션 추가 + `content/{name}/` 디렉터리 생성 + `useNavigation`에 보드 등록

## CSS 토큰 경계

| 역할 | 위치 |
|------|------|
| 디자인 토큰 (light/dark) | `variables.css` |
| 리셋 + 전역 기본 | `base.css` |
| 레이아웃 규칙 | `layout.css` |
| 컴포넌트 스타일 | `components.css` |

- 토큰 추가가 필요하면 `variables.css`의 `:root` 또는 `[data-theme="dark"]`에 추가
- 숫자/색상을 컴포넌트에 직접 반복하기보다 토큰을 먼저 검토
- dark mode 지원: 모든 색상 토큰은 `[data-theme="dark"]`에도 대응값 필요

## Composables 경계

| Composable | 역할 | 성격 |
|-----------|------|------|
| `useNavigation` | 게시판 목록 정의 | 상태/설정 |
| `useBoardMeta` | 게시판 메타 조회 | 파생 상태 |
| `useDarkMode` | 다크 모드 토글 | 상태 + DOM |
| `useReadingTime` | 읽기 시간 계산 | 순수 계산 |
| `useSearch` | 검색 기능 | 상태 + UI |
| `useTags` | 태그 수집/정렬 | 순수 계산 |

새 composable 추가 시 순수 계산 / 상태 관리 / DOM 접근 중 하나의 책임만 갖도록 설계한다.

## 점검 항목

- `app/pages/`가 화면 조합만 수행하는가
- atoms 컴포넌트가 composable·전역 상태에 의존하지 않는가
- CSS가 디자인 토큰을 우선 참조하는가
- 새 게시판 추가 시 `content.config.ts` + `useNavigation` 모두 갱신했는가
- 문서가 현재 구조와 일치하는가
