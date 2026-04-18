import { describe, it, expect } from 'vitest'
import { extractTextFromNode, extractPlainTextFromContent } from '#shared/utils/tiptap'
import { makeTiptapDoc, makeTiptapHeading, makeTiptapParagraph } from '../helpers/factories'

describe('extractTextFromNode', () => {
  it('텍스트 노드에서 텍스트를 반환한다', () => {
    expect(extractTextFromNode({ type: 'text', text: '안녕' })).toBe('안녕')
  })

  it('중첩된 노드에서 텍스트를 재귀 추출한다', () => {
    const node = {
      type: 'paragraph',
      content: [
        { type: 'text', text: '앞' },
        { type: 'text', text: '뒤' }
      ]
    }
    expect(extractTextFromNode(node)).toBe('앞뒤')
  })

  it('마크가 있어도 텍스트만 추출한다', () => {
    const node = {
      type: 'paragraph',
      content: [{
        type: 'text',
        text: '볼드텍스트',
        marks: [{ type: 'bold' }]
      }]
    }
    expect(extractTextFromNode(node)).toBe('볼드텍스트')
  })

  it('빈 노드는 빈 문자열을 반환한다', () => {
    expect(extractTextFromNode({ type: 'hardBreak' })).toBe('')
  })
})

describe('extractPlainTextFromContent', () => {
  it('문서에서 줄바꿈으로 구분된 텍스트를 반환한다', () => {
    const doc = makeTiptapDoc([
      makeTiptapParagraph('첫 줄'),
      makeTiptapParagraph('둘째 줄')
    ])
    expect(extractPlainTextFromContent(doc)).toBe('첫 줄\n둘째 줄')
  })

  it('헤딩과 단락을 모두 추출한다', () => {
    const doc = makeTiptapDoc([
      makeTiptapHeading(1, '제목'),
      makeTiptapParagraph('본문')
    ])
    expect(extractPlainTextFromContent(doc)).toBe('제목\n본문')
  })

  it('null이면 빈 문자열을 반환한다', () => {
    expect(extractPlainTextFromContent(null)).toBe('')
  })

  it('content가 없으면 빈 문자열을 반환한다', () => {
    expect(extractPlainTextFromContent({ type: 'doc' })).toBe('')
  })
})
