import { z } from 'zod'

/** 버전 복원 요청 스키마. */
export const restoreVersionSchema = z.object({
  versionId: z.string().min(1)
})

export type RestoreVersionInput = z.infer<typeof restoreVersionSchema>
