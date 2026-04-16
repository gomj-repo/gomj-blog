import { randomUUID } from 'uncrypto'
import type { IPageVersionRepository, SavedPageVersion } from './page-version.repository'

/** 인메모리 페이지 버전 저장소. 개발·테스트 환경에서 DB 없이 동작한다. */
class InMemoryPageVersionRepository implements IPageVersionRepository {
  private readonly versions = new Map<string, SavedPageVersion>()

  async createVersion(pageId: string, title: string, content: unknown, plainText: string | null): Promise<SavedPageVersion> {
    const versionNumber = (await this.getLatestVersionNumber(pageId)) + 1
    const version: SavedPageVersion = {
      id: randomUUID(),
      pageId,
      versionNumber,
      title,
      content: (content as Record<string, unknown>) ?? null,
      plainText,
      createdAt: new Date().toISOString()
    }
    this.versions.set(version.id, version)
    return version
  }

  async listVersions(pageId: string): Promise<SavedPageVersion[]> {
    return Array.from(this.versions.values())
      .filter(v => v.pageId === pageId)
      .sort((a, b) => b.versionNumber - a.versionNumber)
  }

  async getVersion(id: string): Promise<SavedPageVersion | null> {
    return this.versions.get(id) ?? null
  }

  async getLatestVersionNumber(pageId: string): Promise<number> {
    const versions = Array.from(this.versions.values()).filter(v => v.pageId === pageId)
    if (versions.length === 0) return 0
    return Math.max(...versions.map(v => v.versionNumber))
  }
}

export const pageVersionRepository: IPageVersionRepository = new InMemoryPageVersionRepository()
