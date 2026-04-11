# Autopilot Implementation Plan - gomj-blog Production Features

## Batch 1 (parallel): Foundation
- Task 1.1: Footer (Simple) — AppFooter.vue + default.vue + CSS
- Task 1.2: Error Page (Simple) — app/error.vue + CSS
- Task 1.3: Reading Time Composable (Simple) — useReadingTime.ts
- Task 1.4: Dark Mode (Medium) — useDarkMode.ts + DarkModeToggle.vue + variables.css dark theme

## Batch 2 (parallel): Content Features
- Task 2.1: Tag System (Medium) — /tags, /tags/[tag], useTags.ts, clickable tags in ArticleMeta
- Task 2.2: Table of Contents (Medium) — TableOfContents.vue, sticky sidebar on article pages
- Task 2.3: Reading Time Integration (Simple) — wire useReadingTime into ArticleMeta/cards/pages

## Batch 3 (parallel): Cross-cutting
- Task 3.1: Search (Complex) — SearchDialog.vue, useSearch.ts, Cmd+K shortcut
- Task 3.2: SEO (Medium) — useSeoMeta on all pages, OG/Twitter cards, robots.txt

## Execution Strategy
- Phase 1 tasks: all 4 in parallel (no file conflicts)
- Phase 2 tasks: 2.1 + 2.2 parallel, then 2.3
- Phase 3 tasks: 3.1 + 3.2 parallel
- Final: build verify + mobile test
