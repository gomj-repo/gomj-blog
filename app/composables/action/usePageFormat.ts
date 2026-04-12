/** TipTap JSON에서 평문 텍스트를 추출한다. 미리보기·검색에 사용. */
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

/** 텍스트를 지정 길이로 잘라 말줄임표를 붙인다. */
export function truncateContent(text: string, maxLength = 200): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '...'
}

/** 한글을 허용하는 URL-safe 슬러그를 생성한다. */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    || 'untitled'
}
