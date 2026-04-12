import { z } from 'zod'

/** 페이지 생성 요청 스키마. */
export const createPageSchema = z.object({
  folderId: z.string().min(1),
  parentPageId: z.string().nullable().default(null),
  title: z.string().min(1).max(500),
  slug: z.string().min(1).max(500),
  content: z.record(z.string(), z.any()).nullable().optional(),
  plainText: z.string().nullable().optional(),
  isPublic: z.boolean().default(true),
  sortOrder: z.number().int().default(0)
})

/** 페이지 수정 요청 스키마. 모든 필드가 선택적이다. */
export const updatePageSchema = z.object({
  folderId: z.string().min(1).optional(),
  parentPageId: z.string().nullable().optional(),
  title: z.string().min(1).max(500).optional(),
  slug: z.string().min(1).max(500).optional(),
  content: z.record(z.string(), z.any()).nullable().optional(),
  plainText: z.string().nullable().optional(),
  isPublic: z.boolean().optional(),
  sortOrder: z.number().int().optional()
})

export type CreatePageInput = z.infer<typeof createPageSchema>
export type UpdatePageInput = z.infer<typeof updatePageSchema>
