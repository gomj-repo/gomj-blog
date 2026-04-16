import { pageRepository, pageVersionRepository } from '../repositories'

/**
 * 현재 페이지 콘텐츠를 버전 히스토리에 스냅샷으로 저장한다.
 * 콘텐츠가 없으면 스냅샷을 건너뛴다.
 */
export async function snapshotCurrentVersion(pageId: string): Promise<void> {
  const existing = await pageRepository.getPage(pageId)
  if (existing && existing.content) {
    await pageVersionRepository.createVersion(pageId, existing.title, existing.content, existing.plainText)
  }
}
