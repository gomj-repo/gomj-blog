/** TipTap JSON 노드 타입. */
export interface TipTapNode {
  type: string
  attrs?: Record<string, unknown>
  content?: TipTapNode[]
  text?: string
  marks?: Array<{ type: string; attrs?: Record<string, unknown> }>
}

/**
 * TipTap JSON 노드에서 순수 텍스트를 재귀적으로 추출한다.
 * 마크(볼드, 이탤릭 등)는 무시하고 텍스트만 반환한다.
 */
export function extractTextFromNode(node: TipTapNode | Record<string, unknown>): string {
  if (typeof (node as TipTapNode).text === 'string') {
    return (node as TipTapNode).text!
  }
  if (Array.isArray((node as TipTapNode).content)) {
    return ((node as TipTapNode).content as TipTapNode[])
      .map(extractTextFromNode)
      .join('')
  }
  return ''
}

/**
 * TipTap JSON 문서 전체에서 평문 텍스트를 추출한다.
 */
export function extractPlainTextFromContent(content: Record<string, unknown> | null): string {
  if (!content || !Array.isArray(content.content)) return ''
  return (content.content as TipTapNode[])
    .map(extractTextFromNode)
    .join('\n')
    .trim()
}
