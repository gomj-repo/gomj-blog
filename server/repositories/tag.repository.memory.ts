import { randomUUID } from 'uncrypto'
import type { ITagRepository, SavedTag } from './tag.repository'
import type { SavedPage } from '#shared/types/page'
import type { CreateTagInput } from '#shared/schemas/tag.schema'
import { pageRepository } from './page.repository.memory'

/** 페이지-태그 연결을 나타내는 중간 엔트리. */
interface PageTagEntry {
  pageId: string
  tagId: string
}

/** 인메모리 태그 저장소. 배열 기반 중간 테이블(`pageTags`)로 다대다 관계를 관리한다. */
class InMemoryTagRepository implements ITagRepository {
  private readonly tags = new Map<string, SavedTag>()
  private readonly pageTags: PageTagEntry[] = []

  async createTag(input: CreateTagInput): Promise<SavedTag> {
    const tag: SavedTag = {
      id: randomUUID(),
      name: input.name,
      createdAt: new Date().toISOString()
    }
    this.tags.set(tag.id, tag)
    return tag
  }

  async getTag(id: string): Promise<SavedTag | null> {
    return this.tags.get(id) ?? null
  }

  async getTagByName(name: string): Promise<SavedTag | null> {
    for (const tag of this.tags.values()) {
      if (tag.name === name) return tag
    }
    return null
  }

  async listTags(): Promise<SavedTag[]> {
    return Array.from(this.tags.values()).sort((a, b) => a.name.localeCompare(b.name))
  }

  async deleteTag(id: string): Promise<boolean> {
    if (!this.tags.has(id)) return false
    this.tags.delete(id)
    // 연결된 페이지-태그 관계도 함께 제거한다
    for (let i = this.pageTags.length - 1; i >= 0; i--) {
      if (this.pageTags[i].tagId === id) this.pageTags.splice(i, 1)
    }
    return true
  }

  async addTagToPage(pageId: string, tagId: string): Promise<void> {
    const exists = this.pageTags.some(pt => pt.pageId === pageId && pt.tagId === tagId)
    if (!exists) {
      this.pageTags.push({ pageId, tagId })
    }
  }

  async removeTagFromPage(pageId: string, tagId: string): Promise<boolean> {
    const index = this.pageTags.findIndex(pt => pt.pageId === pageId && pt.tagId === tagId)
    if (index === -1) return false
    this.pageTags.splice(index, 1)
    return true
  }

  async getTagsByPage(pageId: string): Promise<SavedTag[]> {
    const tagIds = this.pageTags.filter(pt => pt.pageId === pageId).map(pt => pt.tagId)
    return tagIds.map(id => this.tags.get(id)).filter((t): t is SavedTag => t !== undefined)
  }

  async getPagesByTag(tagId: string): Promise<SavedPage[]> {
    const pageIds = this.pageTags.filter(pt => pt.tagId === tagId).map(pt => pt.pageId)
    const pages: SavedPage[] = []
    for (const pageId of pageIds) {
      const page = await pageRepository.getPage(pageId)
      if (page) pages.push(page)
    }
    return pages
  }
}

export const tagRepository: ITagRepository = new InMemoryTagRepository()
