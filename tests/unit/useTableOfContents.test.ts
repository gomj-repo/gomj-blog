import { describe, it, expect } from 'vitest'
import { extractTableOfContents } from '~/composables/action/useTableOfContents'
import { makeTiptapDoc, makeTiptapHeading, makeTiptapParagraph } from '../helpers/factories'

describe('extractTableOfContents', () => {
  it('H1~H3 제목을 추출한다', () => {
    const doc = makeTiptapDoc([
      makeTiptapHeading(1, '대제목'),
      makeTiptapParagraph('본문'),
      makeTiptapHeading(2, '소제목')
    ])
    const toc = extractTableOfContents(doc)
    expect(toc).toHaveLength(1)
    expect(toc[0].text).toBe('대제목')
    expect(toc[0].children).toHaveLength(1)
    expect(toc[0].children[0].text).toBe('소제목')
  })

  it('H2를 H1의 하위에 중첩한다', () => {
    const doc = makeTiptapDoc([
      makeTiptapHeading(1, 'A'),
      makeTiptapHeading(2, 'A-1'),
      makeTiptapHeading(2, 'A-2'),
      makeTiptapHeading(1, 'B'),
      makeTiptapHeading(2, 'B-1')
    ])
    const toc = extractTableOfContents(doc)
    expect(toc).toHaveLength(2)
    expect(toc[0].children).toHaveLength(2)
    expect(toc[1].children).toHaveLength(1)
  })

  it('H3를 H2의 하위에 중첩한다', () => {
    const doc = makeTiptapDoc([
      makeTiptapHeading(1, 'A'),
      makeTiptapHeading(2, 'B'),
      makeTiptapHeading(3, 'C')
    ])
    const toc = extractTableOfContents(doc)
    expect(toc[0].children[0].children[0].text).toBe('C')
  })

  it('H1 없이 H2만 있으면 H2를 루트로 배치한다', () => {
    const doc = makeTiptapDoc([
      makeTiptapHeading(2, '소제목만')
    ])
    const toc = extractTableOfContents(doc)
    expect(toc).toHaveLength(1)
    expect(toc[0].text).toBe('소제목만')
  })

  it('H4 이상은 무시한다', () => {
    const doc = makeTiptapDoc([
      makeTiptapHeading(4, '무시됨'),
      makeTiptapHeading(1, '포함됨')
    ])
    const toc = extractTableOfContents(doc)
    expect(toc).toHaveLength(1)
    expect(toc[0].text).toBe('포함됨')
  })

  it('null이면 빈 배열을 반환한다', () => {
    expect(extractTableOfContents(null)).toEqual([])
  })

  it('제목이 없는 문서면 빈 배열을 반환한다', () => {
    const doc = makeTiptapDoc([makeTiptapParagraph('본문만')])
    expect(extractTableOfContents(doc)).toEqual([])
  })

  it('각 항목에 고유 ID가 할당된다', () => {
    const doc = makeTiptapDoc([
      makeTiptapHeading(1, 'A'),
      makeTiptapHeading(1, 'B')
    ])
    const toc = extractTableOfContents(doc)
    expect(toc[0].id).not.toBe(toc[1].id)
  })
})
