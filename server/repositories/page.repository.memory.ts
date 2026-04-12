import { randomUUID } from 'uncrypto'
import type { IPageRepository, SavedPage } from './page.repository'
import type { CreatePageInput, UpdatePageInput } from '#shared/schemas/page.schema'
import { extractPlainText } from '../utils/tiptap'

/** 제목을 슬러그로 변환한다. 한글·영문·숫자·하이픈을 허용한다. */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s가-힣-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '')
    || randomUUID().slice(0, 8)
}

/** 인메모리 페이지 저장소. 개발·테스트 환경에서 DB 없이 동작한다. */
class InMemoryPageRepository implements IPageRepository {
  private readonly pages = new Map<string, SavedPage>()

  async createPage(input: CreatePageInput): Promise<SavedPage> {
    const now = new Date().toISOString()
    const content = (input.content as Record<string, unknown>) ?? null
    const page: SavedPage = {
      id: randomUUID(),
      folderId: input.folderId,
      parentPageId: input.parentPageId ?? null,
      title: input.title,
      slug: input.slug ?? generateSlug(input.title),
      content,
      plainText: content ? extractPlainText(content) : null,
      isPublic: input.isPublic ?? true,
      sortOrder: input.sortOrder ?? 0,
      createdAt: now,
      updatedAt: now
    }
    this.pages.set(page.id, page)
    return page
  }

  async getPage(id: string): Promise<SavedPage | null> {
    return this.pages.get(id) ?? null
  }

  async getPageBySlug(folderId: string, slug: string): Promise<SavedPage | null> {
    for (const page of this.pages.values()) {
      if (page.folderId === folderId && page.slug === slug) return page
    }
    return null
  }

  async listAllPages(): Promise<SavedPage[]> {
    return Array.from(this.pages.values()).sort((a, b) => a.sortOrder - b.sortOrder)
  }

  async listPagesByFolder(folderId: string): Promise<SavedPage[]> {
    return Array.from(this.pages.values())
      .filter(p => p.folderId === folderId)
      .sort((a, b) => a.sortOrder - b.sortOrder)
  }

  async listPublicPages(limit = 10): Promise<SavedPage[]> {
    return Array.from(this.pages.values())
      .filter(p => p.isPublic)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, limit)
  }

  async updatePage(id: string, input: Partial<UpdatePageInput>): Promise<SavedPage | null> {
    const page = this.pages.get(id)
    if (!page) return null
    const content = input.content !== undefined
      ? (input.content as Record<string, unknown> | null)
      : page.content
    const plainText = content ? extractPlainText(content) : page.plainText
    const updated: SavedPage = {
      ...page,
      ...input,
      content,
      plainText,
      updatedAt: new Date().toISOString()
    }
    this.pages.set(id, updated)
    return updated
  }

  async deletePage(id: string): Promise<boolean> {
    return this.pages.delete(id)
  }

  async reorderPages(folderId: string, orderedIds: string[]): Promise<void> {
    orderedIds.forEach((id, index) => {
      const page = this.pages.get(id)
      if (page && page.folderId === folderId) {
        this.pages.set(id, { ...page, sortOrder: index })
      }
    })
  }
}

export const pageRepository: IPageRepository = new InMemoryPageRepository()
