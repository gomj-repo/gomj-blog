/**
 * TipTap JSON 노드를 재귀 순회하며 평문 텍스트를 추출한다.
 * 페이지 저장 시 검색 인덱싱(`plainText` 컬럼)에 사용된다.
 */
export function extractPlainText(content: Record<string, unknown> | null): string {
  if (!content) return ''

  const parts: string[] = []

  function walk(node: Record<string, unknown>) {
    if (node.type === 'text' && typeof node.text === 'string') {
      parts.push(node.text)
    }

    if (Array.isArray(node.content)) {
      for (const child of node.content) {
        if (child && typeof child === 'object') {
          walk(child as Record<string, unknown>)
        }
      }
    }
  }

  walk(content)
  return parts.join(' ').replace(/\s+/g, ' ').trim()
}
