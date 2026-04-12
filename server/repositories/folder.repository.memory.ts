import { randomUUID } from 'uncrypto'
import type { IFolderRepository, SavedFolder } from './folder.repository'
import type { CreateFolderInput, UpdateFolderInput } from '#shared/schemas/folder.schema'

/** 인메모리 폴더 저장소. 개발·테스트 환경에서 DB 없이 동작한다. */
class InMemoryFolderRepository implements IFolderRepository {
  private readonly folders = new Map<string, SavedFolder>()

  async createFolder(input: CreateFolderInput): Promise<SavedFolder> {
    const now = new Date().toISOString()
    const folder: SavedFolder = {
      id: randomUUID(),
      parentId: input.parentId ?? null,
      name: input.name,
      slug: input.slug ?? input.name.toLowerCase().replace(/\s+/g, '-'),
      sortOrder: input.sortOrder ?? 0,
      createdAt: now,
      updatedAt: now
    }
    this.folders.set(folder.id, folder)
    return folder
  }

  async getFolder(id: string): Promise<SavedFolder | null> {
    return this.folders.get(id) ?? null
  }

  async getFolderBySlug(parentId: string | null, slug: string): Promise<SavedFolder | null> {
    for (const folder of this.folders.values()) {
      if (folder.parentId === parentId && folder.slug === slug) return folder
    }
    return null
  }

  async listFolders(): Promise<SavedFolder[]> {
    return Array.from(this.folders.values()).sort((a, b) => a.sortOrder - b.sortOrder)
  }

  async listChildFolders(parentId: string | null): Promise<SavedFolder[]> {
    return Array.from(this.folders.values())
      .filter(f => f.parentId === parentId)
      .sort((a, b) => a.sortOrder - b.sortOrder)
  }

  async updateFolder(id: string, input: Partial<UpdateFolderInput>): Promise<SavedFolder | null> {
    const folder = this.folders.get(id)
    if (!folder) return null
    const updated: SavedFolder = {
      ...folder,
      ...input,
      updatedAt: new Date().toISOString()
    }
    this.folders.set(id, updated)
    return updated
  }

  /** 하위 폴더를 재귀적으로 삭제한 뒤 자신을 삭제한다. */
  async deleteFolder(id: string): Promise<boolean> {
    if (!this.folders.has(id)) return false
    const children = Array.from(this.folders.values()).filter(f => f.parentId === id)
    for (const child of children) {
      await this.deleteFolder(child.id)
    }
    this.folders.delete(id)
    return true
  }

  async reorderFolders(parentId: string | null, orderedIds: string[]): Promise<void> {
    orderedIds.forEach((id, index) => {
      const folder = this.folders.get(id)
      if (folder && folder.parentId === parentId) {
        this.folders.set(id, { ...folder, sortOrder: index })
      }
    })
  }
}

export const folderRepository: IFolderRepository = new InMemoryFolderRepository()
