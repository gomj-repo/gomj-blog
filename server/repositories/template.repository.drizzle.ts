import { randomUUID } from 'node:crypto'
import { eq, asc } from 'drizzle-orm'
import type { CreateTemplateInput, UpdateTemplateInput } from '#shared/schemas/template.schema'
import type { SavedTemplate } from '#shared/types/template'
import type { ITemplateRepository } from './template.repository'
import { getRequiredDb } from '../utils/db'
import { pageTemplates } from '../database/schema/page_templates'


/** Drizzle 행을 `SavedTemplate` 타입으로 변환한다. */
const toSavedTemplate = (row: typeof pageTemplates.$inferSelect): SavedTemplate => ({
  id: row.id,
  name: row.name,
  description: row.description,
  content: row.content as Record<string, unknown> | null,
  isDefault: row.isDefault,
  createdAt: row.createdAt.toISOString(),
  updatedAt: row.updatedAt.toISOString()
})

/** Postgres 기반 템플릿 저장소 구현체. */
class DrizzleTemplateRepository implements ITemplateRepository {
  async createTemplate(input: CreateTemplateInput): Promise<SavedTemplate> {
    const id = randomUUID()
    const [row] = await getRequiredDb()
      .insert(pageTemplates)
      .values({
        id,
        name: input.name,
        description: input.description ?? null,
        content: input.content ?? null,
        isDefault: input.isDefault ?? false
      })
      .returning()

    if (!row) throw new Error('Failed to create template')
    return toSavedTemplate(row)
  }

  async getTemplate(id: string): Promise<SavedTemplate | null> {
    const [row] = await getRequiredDb()
      .select()
      .from(pageTemplates)
      .where(eq(pageTemplates.id, id))
      .limit(1)

    return row ? toSavedTemplate(row) : null
  }

  async listTemplates(): Promise<SavedTemplate[]> {
    const rows = await getRequiredDb()
      .select()
      .from(pageTemplates)
      .orderBy(asc(pageTemplates.name))

    return rows.map(toSavedTemplate)
  }

  async updateTemplate(id: string, input: Partial<UpdateTemplateInput>): Promise<SavedTemplate | null> {
    const values: Partial<typeof pageTemplates.$inferInsert> = {}
    if (input.name !== undefined) values.name = input.name
    if (input.description !== undefined) values.description = input.description
    if (input.content !== undefined) values.content = input.content
    if (input.isDefault !== undefined) values.isDefault = input.isDefault

    const [row] = await getRequiredDb()
      .update(pageTemplates)
      .set(values)
      .where(eq(pageTemplates.id, id))
      .returning()

    return row ? toSavedTemplate(row) : null
  }

  async deleteTemplate(id: string): Promise<boolean> {
    const result = await getRequiredDb()
      .delete(pageTemplates)
      .where(eq(pageTemplates.id, id))
      .returning()

    return result.length > 0
  }
}

export const templateRepository: ITemplateRepository = new DrizzleTemplateRepository()
