import { describe, it, expect } from 'vitest'
import { createFolderSchema, updateFolderSchema } from '#shared/schemas/folder.schema'
import { createPageSchema, updatePageSchema } from '#shared/schemas/page.schema'
import { createTagSchema, addTagToPageSchema } from '#shared/schemas/tag.schema'

describe('folder.schema', () => {
  describe('createFolderSchema', () => {
    it('유효한 입력을 통과시킨다', () => {
      const result = createFolderSchema.safeParse({ name: '개발', slug: 'dev' })
      expect(result.success).toBe(true)
    })

    it('name이 빈 문자열이면 거부한다', () => {
      const result = createFolderSchema.safeParse({ name: '', slug: 'dev' })
      expect(result.success).toBe(false)
    })

    it('slug가 빈 문자열이면 거부한다', () => {
      const result = createFolderSchema.safeParse({ name: '개발', slug: '' })
      expect(result.success).toBe(false)
    })

    it('parentId는 nullable이다', () => {
      const result = createFolderSchema.safeParse({ name: '하위', slug: 'sub', parentId: null })
      expect(result.success).toBe(true)
    })

    it('sortOrder 기본값은 0이다', () => {
      const result = createFolderSchema.parse({ name: '개발', slug: 'dev' })
      expect(result.sortOrder).toBe(0)
    })

    it('name이 255자를 초과하면 거부한다', () => {
      const result = createFolderSchema.safeParse({ name: 'A'.repeat(256), slug: 'dev' })
      expect(result.success).toBe(false)
    })
  })

  describe('updateFolderSchema', () => {
    it('모든 필드가 선택적이다', () => {
      const result = updateFolderSchema.safeParse({})
      expect(result.success).toBe(true)
    })

    it('name만 수정할 수 있다', () => {
      const result = updateFolderSchema.safeParse({ name: '변경' })
      expect(result.success).toBe(true)
    })
  })
})

describe('page.schema', () => {
  const validPage = { folderId: 'f1', title: '새 페이지', slug: 'new-page' }

  describe('createPageSchema', () => {
    it('유효한 입력을 통과시킨다', () => {
      expect(createPageSchema.safeParse(validPage).success).toBe(true)
    })

    it('folderId가 없으면 거부한다', () => {
      expect(createPageSchema.safeParse({ title: '제목', slug: 's' }).success).toBe(false)
    })

    it('title이 빈 문자열이면 거부한다', () => {
      expect(createPageSchema.safeParse({ ...validPage, title: '' }).success).toBe(false)
    })

    it('status 기본값은 draft이다', () => {
      const result = createPageSchema.parse(validPage)
      expect(result.status).toBe('draft')
    })

    it('유효하지 않은 status를 거부한다', () => {
      expect(createPageSchema.safeParse({ ...validPage, status: 'invalid' }).success).toBe(false)
    })

    it('title이 500자를 초과하면 거부한다', () => {
      expect(createPageSchema.safeParse({ ...validPage, title: 'T'.repeat(501) }).success).toBe(false)
    })

    it('content는 nullable이다', () => {
      expect(createPageSchema.safeParse({ ...validPage, content: null }).success).toBe(true)
    })
  })

  describe('updatePageSchema', () => {
    it('모든 필드가 선택적이다', () => {
      expect(updatePageSchema.safeParse({}).success).toBe(true)
    })

    it('status를 published로 변경할 수 있다', () => {
      const result = updatePageSchema.safeParse({ status: 'published' })
      expect(result.success).toBe(true)
    })
  })
})

describe('tag.schema', () => {
  describe('createTagSchema', () => {
    it('유효한 입력을 통과시킨다', () => {
      expect(createTagSchema.safeParse({ name: 'TypeScript' }).success).toBe(true)
    })

    it('name이 빈 문자열이면 거부한다', () => {
      expect(createTagSchema.safeParse({ name: '' }).success).toBe(false)
    })

    it('name이 100자를 초과하면 거부한다', () => {
      expect(createTagSchema.safeParse({ name: 'T'.repeat(101) }).success).toBe(false)
    })
  })

  describe('addTagToPageSchema', () => {
    it('유효한 tagId를 통과시킨다', () => {
      expect(addTagToPageSchema.safeParse({ tagId: 'tag-1' }).success).toBe(true)
    })

    it('tagId가 빈 문자열이면 거부한다', () => {
      expect(addTagToPageSchema.safeParse({ tagId: '' }).success).toBe(false)
    })
  })
})
