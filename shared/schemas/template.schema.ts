import { z } from 'zod'

/** 템플릿 생성 요청 스키마. */
export const createTemplateSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().nullable().optional(),
  content: z.record(z.string(), z.any()).nullable().optional(),
  isDefault: z.boolean().default(false)
})

/** 템플릿 수정 요청 스키마. 모든 필드가 선택적이다. */
export const updateTemplateSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().nullable().optional(),
  content: z.record(z.string(), z.any()).nullable().optional(),
  isDefault: z.boolean().optional()
})

export type CreateTemplateInput = z.infer<typeof createTemplateSchema>
export type UpdateTemplateInput = z.infer<typeof updateTemplateSchema>
