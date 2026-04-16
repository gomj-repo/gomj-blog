import { extractTextFromNode } from '#shared/utils/tiptap'
import type { TipTapNode } from '#shared/utils/tiptap'

/**
 * TipTap JSON 노드를 재귀 순회하며 평문 텍스트를 추출한다.
 * 페이지 저장 시 검색 인덱싱(`plainText` 컬럼)에 사용된다.
 */
export function extractPlainText(content: Record<string, unknown> | null): string {
  if (!content || !Array.isArray(content.content)) return ''
  return (content.content as TipTapNode[])
    .map(extractTextFromNode)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}
