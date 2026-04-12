import { z } from 'zod'

/** 폴더 생성 요청 스키마. */
export const createFolderSchema = z.object({
  parentId: z.string().nullable().optional(),
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  sortOrder: z.number().int().default(0)
})

/** 폴더 수정 요청 스키마. 모든 필드가 선택적이다. */
export const updateFolderSchema = z.object({
  parentId: z.string().nullable().optional(),
  name: z.string().min(1).max(255).optional(),
  slug: z.string().min(1).max(255).optional(),
  sortOrder: z.number().int().optional()
})

export type CreateFolderInput = z.infer<typeof createFolderSchema>
export type UpdateFolderInput = z.infer<typeof updateFolderSchema>
