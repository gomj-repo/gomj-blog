/**
 * TipTap JSON 콘텐츠를 Markdown 문자열로 변환한다.
 */
export function tiptapJsonToMarkdown(content: Record<string, unknown> | null): string {
  if (!content || !Array.isArray(content.content)) return ''
  return convertNodes(content.content as TipTapNode[]).trim()
}

interface TipTapNode {
  type: string
  attrs?: Record<string, unknown>
  content?: TipTapNode[]
  text?: string
  marks?: Array<{ type: string; attrs?: Record<string, unknown> }>
}

function convertNodes(nodes: TipTapNode[]): string {
  return nodes.map(node => convertNode(node)).join('')
}

function convertNode(node: TipTapNode): string {
  switch (node.type) {
    case 'heading': {
      const level = (node.attrs?.level as number) || 1
      const prefix = '#'.repeat(level)
      return `${prefix} ${extractInlineText(node.content)}\n\n`
    }
    case 'paragraph':
      return `${extractInlineText(node.content)}\n\n`
    case 'bulletList':
      return convertListItems(node.content, '- ') + '\n'
    case 'orderedList':
      return convertOrderedListItems(node.content) + '\n'
    case 'listItem':
      return extractInlineText(node.content)
    case 'codeBlock': {
      const lang = (node.attrs?.language as string) || ''
      return `\`\`\`${lang}\n${extractPlainText(node.content)}\`\`\`\n\n`
    }
    case 'blockquote':
      return node.content
        ? node.content.map(child => `> ${convertNode(child).trim()}`).join('\n') + '\n\n'
        : ''
    case 'horizontalRule':
      return '---\n\n'
    case 'image': {
      const src = node.attrs?.src as string || ''
      const alt = node.attrs?.alt as string || ''
      return `![${alt}](${src})\n\n`
    }
    case 'text':
      return applyMarks(node.text || '', node.marks)
    default:
      return node.content ? convertNodes(node.content) : ''
  }
}

function convertListItems(items: TipTapNode[] | undefined, prefix: string): string {
  if (!items) return ''
  return items.map(item => {
    const text = item.content ? item.content.map(child => {
      if (child.type === 'paragraph') return extractInlineText(child.content)
      return convertNode(child)
    }).join('') : ''
    return `${prefix}${text}\n`
  }).join('')
}

function convertOrderedListItems(items: TipTapNode[] | undefined): string {
  if (!items) return ''
  return items.map((item, i) => {
    const text = item.content ? item.content.map(child => {
      if (child.type === 'paragraph') return extractInlineText(child.content)
      return convertNode(child)
    }).join('') : ''
    return `${i + 1}. ${text}\n`
  }).join('')
}

function extractInlineText(nodes: TipTapNode[] | undefined): string {
  if (!nodes) return ''
  return nodes.map(node => {
    if (node.type === 'text') return applyMarks(node.text || '', node.marks)
    if (node.type === 'hardBreak') return '\n'
    if (node.content) return extractInlineText(node.content)
    return ''
  }).join('')
}

function extractPlainText(nodes: TipTapNode[] | undefined): string {
  if (!nodes) return ''
  return nodes.map(node => {
    if (node.text) return node.text
    if (node.content) return extractPlainText(node.content)
    return ''
  }).join('')
}

function applyMarks(text: string, marks?: TipTapNode['marks']): string {
  if (!marks || marks.length === 0) return text
  let result = text
  for (const mark of marks) {
    switch (mark.type) {
      case 'bold':
        result = `**${result}**`
        break
      case 'italic':
        result = `*${result}*`
        break
      case 'code':
        result = `\`${result}\``
        break
      case 'link': {
        const href = mark.attrs?.href as string || ''
        result = `[${result}](${href})`
        break
      }
      case 'underline':
        result = `<u>${result}</u>`
        break
    }
  }
  return result
}
