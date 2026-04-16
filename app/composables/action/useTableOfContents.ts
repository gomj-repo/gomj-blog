export interface TocItem {
  id: string
  text: string
  level: number
  children: TocItem[]
}

/**
 * TipTap 노드에서 순수 텍스트를 추출한다.
 */
export function extractTextFromNode(node: Record<string, unknown>): string {
  if (typeof node.text === 'string') {
    return node.text
  }
  if (Array.isArray(node.content)) {
    return (node.content as Record<string, unknown>[])
      .map(extractTextFromNode)
      .join('')
  }
  return ''
}

/**
 * TipTap JSON 콘텐츠에서 제목(H1~H3)을 추출하여 중첩 목차 구조를 생성한다.
 */
export function extractTableOfContents(
  content: Record<string, unknown> | null
): TocItem[] {
  if (!content || !Array.isArray(content.content)) {
    return []
  }

  const flat: TocItem[] = []
  let index = 0

  for (const node of content.content as Record<string, unknown>[]) {
    if (node.type !== 'heading') continue
    const attrs = node.attrs as Record<string, unknown> | undefined
    const level = typeof attrs?.level === 'number' ? attrs.level : 0
    if (level < 1 || level > 3) continue

    flat.push({
      id: `heading-${index++}`,
      text: extractTextFromNode(node),
      level,
      children: []
    })
  }

  const root: TocItem[] = []
  let lastH1: TocItem | null = null
  let lastH2: TocItem | null = null

  for (const item of flat) {
    if (item.level === 1) {
      root.push(item)
      lastH1 = item
      lastH2 = null
    } else if (item.level === 2) {
      if (lastH1) {
        lastH1.children.push(item)
      } else {
        root.push(item)
      }
      lastH2 = item
    } else {
      if (lastH2) {
        lastH2.children.push(item)
      } else if (lastH1) {
        lastH1.children.push(item)
      } else {
        root.push(item)
      }
    }
  }

  return root
}
