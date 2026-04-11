# Portfolio Blog - Specification

## Overview
Confluence 스타일 UI를 가진 개발자 포트폴리오 웹사이트. Markdown 기반 게시판을 항목별로 자유롭게 관리.

## Current State (완료)
- Nuxt 4 + Nuxt Content v3 구조 완성
- 12 Vue 컴포넌트 (layout/content/base 3-layer)
- 2 composables (useNavigation, useBoardMeta)
- 4 콘텐츠 콜렉션, 4 샘플 마크다운
- 모바일 반응형 Confluence 스타일 CSS
- 빌드 성공 확인

## Production Features (추가 필요)

### 1. Dark Mode (다크 모드)
- 헤더에 토글 버튼
- CSS custom properties 기반 다크 테마
- localStorage 저장 + prefers-color-scheme 존중
- useDarkMode composable

### 2. Tag System (태그 시스템)
- `/tags` 페이지: 전체 태그 목록 (클라우드 형태)
- `/tags/[tag]` 페이지: 태그별 글 필터링
- ArticleCard/ArticleMeta에서 태그 클릭 시 이동

### 3. Table of Contents (목차)
- 게시글 상세 페이지에 자동 생성 TOC
- 데스크톱: 우측 사이드바 sticky
- 모바일: 접이식

### 4. Reading Time (읽기 시간)
- 게시글 카드 + 상세 페이지에 표시
- 한국어 기준 분당 500자 계산

### 5. Search (검색)
- 클라이언트 사이드 검색
- 사이드바 또는 헤더에 검색 입력
- 전체 콜렉션 대상

### 6. Error Page (에러 페이지)
- 커스텀 404 페이지
- 홈으로 돌아가기 네비게이션

### 7. Footer (푸터)
- 저작권, GitHub 링크
- "Built with Nuxt" 표시

### 8. SEO
- Open Graph / Twitter Card 메타 태그
- robots.txt

## Tech Stack
- Nuxt 4 + Nuxt Content v3
- Pure CSS (CSS Custom Properties for theming)
- TypeScript

## Out of Scope
- 인증, 댓글, 분석
- CMS 연동
- i18n (한국어 전용)
- RSS (추후 추가 가능)
