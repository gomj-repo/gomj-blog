import { z } from 'zod'

/** 태그 생성 요청 스키마. */
export const createTagSchema = z.object({
  name: z.string().min(1).max(100)
})

/** 페이지에 태그를 연결할 때 사용하는 요청 스키마. */
export const addTagToPageSchema = z.object({
  tagId: z.string().min(1)
})

export type CreateTagInput = z.infer<typeof createTagSchema>
export type AddTagToPageInput = z.infer<typeof addTagToPageSchema>
