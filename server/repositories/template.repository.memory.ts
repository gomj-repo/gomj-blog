import { randomUUID } from 'uncrypto'
import type { ITemplateRepository, SavedTemplate } from './template.repository'
import type { CreateTemplateInput, UpdateTemplateInput } from '#shared/schemas/template.schema'

/** 인메모리 템플릿 저장소. 개발·테스트 환경에서 DB 없이 동작한다. */
class InMemoryTemplateRepository implements ITemplateRepository {
  private readonly templates = new Map<string, SavedTemplate>()

  async createTemplate(input: CreateTemplateInput): Promise<SavedTemplate> {
    const now = new Date().toISOString()
    const template: SavedTemplate = {
      id: randomUUID(),
      name: input.name,
      description: input.description ?? null,
      content: (input.content as Record<string, unknown>) ?? null,
      isDefault: input.isDefault ?? false,
      createdAt: now,
      updatedAt: now
    }
    this.templates.set(template.id, template)
    return template
  }

  async getTemplate(id: string): Promise<SavedTemplate | null> {
    return this.templates.get(id) ?? null
  }

  async listTemplates(): Promise<SavedTemplate[]> {
    return Array.from(this.templates.values()).sort((a, b) => a.name.localeCompare(b.name))
  }

  async updateTemplate(id: string, input: Partial<UpdateTemplateInput>): Promise<SavedTemplate | null> {
    const template = this.templates.get(id)
    if (!template) return null
    const updated: SavedTemplate = {
      ...template,
      ...input,
      content: input.content !== undefined
        ? (input.content as Record<string, unknown> | null)
        : template.content,
      updatedAt: new Date().toISOString()
    }
    this.templates.set(id, updated)
    return updated
  }

  async deleteTemplate(id: string): Promise<boolean> {
    return this.templates.delete(id)
  }
}

export const templateRepository: ITemplateRepository = new InMemoryTemplateRepository()
