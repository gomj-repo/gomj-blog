import { z } from 'zod'

/** 북마크 생성 요청 스키마. */
export const createBookmarkSchema = z.object({
  pageId: z.string().min(1)
})

export type CreateBookmarkInput = z.infer<typeof createBookmarkSchema>
