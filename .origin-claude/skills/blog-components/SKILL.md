---
name: blog-components
description: This skill should be used when the user asks to "컴포넌트 구조를 정리", "UI 컴포넌트를 추가", "Flat+Compound 원칙에 맞게 구현", "atoms/molecules/templates 계층을 설계"해야 할 때. 실제 컴포넌트 경로와 CSS 경계를 함께 정리한다.
---

# Blog Components

> CSS 토큰 계층·composable 분리·패키지 구조는 `CLAUDE.md`를 기준으로 한다. 이 스킬은 **컴포넌트 설계와 CSS 경계 규칙**만 둔다.

## Flat + Compound 원칙

| 방식 | 사용 시점 | 패턴 |
|------|-----------|------|
| **Flat** | 단순 사용 | props만으로 기본 동작 |
| **Compound** | 커스텀 필요 | slot + sub-component 조합 |

Flat API 내부에서 Compound를 렌더한다. 확장 지점(slot)은 설계 시 미리 명시한다.

## 계층 구조

| 계층 | 위치 | 역할 | 현재 컴포넌트 |
|------|------|------|--------------|
| atoms | `app/components/atoms/` | 최소 단위 UI. props+slot+emit만. 외부 상태·composable 의존 금지 | BaseBadge, BaseCard, BaseList |
| molecules | `app/components/molecules/` | atoms 조합. DOM 접근, 간단한 composable 사용 허용 | ArticleCard, ArticleList, ArticleMeta, ProsePre, ReadingProgress, TableOfContents, BackToTop, DarkModeToggle, AppBreadcrumb |
| templates | `app/components/templates/` | 페이지 레이아웃 골격. slot 구조 정의, composable 사용 허용 | AppHeader, AppSidebar, AppFooter, SearchDialog |

## Nuxt 자동 인식 설정

`nuxt.config.ts`에서 `components.pathPrefix: false`를 설정하여 디렉터리 이름이 컴포넌트 이름에 접두사로 붙지 않도록 한다. 즉, `atoms/BaseBadge.vue`는 `<BaseBadge>`로 사용한다.

## 레이아웃 슬롯 구조

```
default.vue
├── AppSidebar (좌측 네비게이션)
├── AppHeader (@toggle-sidebar)
├── <slot /> (페이지 콘텐츠)
├── AppFooter
├── BackToTop
└── SearchDialog
```

## CSS 경계

| 역할 | 위치 |
|------|------|
| 디자인 토큰 (light/dark) | `variables.css` |
| 리셋 + 전역 기본 | `base.css` |
| 레이아웃 규칙 | `layout.css` |
| 컴포넌트 스타일 | `components.css` |

## 컴포넌트 설계 원칙

- **slot 우선** — 내용은 slot, 데이터는 props, 인터랙션은 emit
- **토큰 우선** — 색상·글꼴·크기 하드코딩 금지, 토큰 없으면 `variables.css`에 추가 먼저 검토
- **상태 클래스** — `.is-active`, `.is-open` 등 의미 중심 이름 사용
- **atoms 순수성** — atoms는 composable, 전역 상태, DOM API에 의존하지 않는다
- **molecules 조합** — atoms를 조합하고, 필요 시 DOM 접근·간단한 composable 허용
- **templates 위임** — slot으로 내용을 위임하고, 레이아웃 골격만 정의

## 새 컴포넌트 추가 절차

1. **계층 결정** → atoms(순수 UI) / molecules(조합·DOM) / templates(레이아웃)
2. **Flat/Compound 결정** → props만으로 충분한가, slot이 필요한가
3. **props → slot → emit 설계** → 데이터, 내용, 인터랙션 분리
4. **CSS 작성** → `components.css`에 추가, 토큰 참조
5. **dark mode 확인** → 색상 토큰이 dark mode에서도 동작하는지 확인

## 점검 항목

- atoms 컴포넌트가 composable·전역 상태에 의존하지 않는가
- molecules 컴포넌트가 props로 데이터를 받는가
- templates 컴포넌트가 slot으로 내용을 위임하는가
- CSS가 디자인 토큰을 우선 참조하는가
- 중복 UI 골격이 atoms 컴포넌트로 통합 가능한가
- dark mode에서 색상이 올바르게 표시되는가
