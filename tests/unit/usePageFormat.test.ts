import { describe, it, expect } from 'vitest'
import { extractPlainText, truncateContent, generateSlug } from '~/composables/action/usePageFormat'
import { makeTiptapDoc, makeTiptapParagraph } from '../helpers/factories'

describe('extractPlainText', () => {
  it('TipTap JSON에서 텍스트를 추출한다', () => {
    const doc = makeTiptapDoc([
      makeTiptapParagraph('첫 번째 문단'),
      makeTiptapParagraph('두 번째 문단')
    ])
    expect(extractPlainText(doc)).toBe('첫 번째 문단 두 번째 문단')
  })

  it('null이면 빈 문자열을 반환한다', () => {
    expect(extractPlainText(null)).toBe('')
  })

  it('빈 문서면 빈 문자열을 반환한다', () => {
    expect(extractPlainText({ type: 'doc', content: [] })).toBe('')
  })

  it('중첩된 노드에서도 텍스트를 추출한다', () => {
    const doc = {
      type: 'doc',
      content: [{
        type: 'bulletList',
        content: [{
          type: 'listItem',
          content: [makeTiptapParagraph('항목 1')]
        }]
      }]
    }
    expect(extractPlainText(doc)).toBe('항목 1')
  })

  it('연속 공백을 하나로 축약한다', () => {
    const doc = makeTiptapDoc([
      { type: 'paragraph', content: [{ type: 'text', text: '  공백   많은   텍스트  ' }] }
    ])
    expect(extractPlainText(doc)).toBe('공백 많은 텍스트')
  })
})

describe('truncateContent', () => {
  it('maxLength 이하면 원문을 반환한다', () => {
    expect(truncateContent('짧은 텍스트', 200)).toBe('짧은 텍스트')
  })

  it('maxLength 초과 시 잘라서 말줄임표를 붙인다', () => {
    const long = 'A'.repeat(300)
    const result = truncateContent(long, 200)
    expect(result).toHaveLength(203) // 200 + '...'
    expect(result.endsWith('...')).toBe(true)
  })

  it('기본 maxLength는 200이다', () => {
    const exactly200 = 'B'.repeat(200)
    expect(truncateContent(exactly200)).toBe(exactly200)
    expect(truncateContent(exactly200 + 'X').endsWith('...')).toBe(true)
  })

  it('빈 문자열을 처리한다', () => {
    expect(truncateContent('')).toBe('')
  })
})

describe('generateSlug', () => {
  it('한글 제목을 슬러그로 변환한다', () => {
    expect(generateSlug('한글 테스트')).toBe('한글-테스트')
  })

  it('영문 대문자를 소문자로 변환한다', () => {
    expect(generateSlug('Hello World')).toBe('hello-world')
  })

  it('특수문자를 제거한다', () => {
    expect(generateSlug('API 설계 (v2)!')).toBe('api-설계-v2')
  })

  it('연속 하이픈을 하나로 축약한다', () => {
    expect(generateSlug('a --- b')).toBe('a-b')
  })

  it('앞뒤 하이픈을 제거한다', () => {
    expect(generateSlug('-trim me-')).toBe('trim-me')
  })

  it('빈 문자열이면 untitled을 반환한다', () => {
    expect(generateSlug('')).toBe('untitled')
  })

  it('특수문자만 있으면 untitled을 반환한다', () => {
    expect(generateSlug('!@#$%')).toBe('untitled')
  })
})
