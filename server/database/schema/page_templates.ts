import { pgTable, text, varchar, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core'

/** 페이지 템플릿 테이블. 새 페이지 생성 시 기본 콘텐츠 구조를 제공한다. */
export const pageTemplates = pgTable('page_templates', {
  /** 템플릿 고유 ID (UUID) */
  id: text('id').primaryKey(),
  /** 템플릿 이름 */
  name: varchar('name', { length: 255 }).notNull(),
  /** 템플릿 설명 */
  description: text('description'),
  /** TipTap JSON 형식의 기본 본문 */
  content: jsonb('content'),
  /** 기본 템플릿 여부. `true`이면 페이지 생성 시 자동 적용된다. */
  isDefault: boolean('is_default').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date())
})
