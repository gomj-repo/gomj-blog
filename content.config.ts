import { defineContentConfig, defineCollection, z } from '@nuxt/content'

const articleSchema = {
  title: z.string(),
  description: z.string().optional(),
  date: z.string().optional(),
  tags: z.array(z.string()).optional(),
  draft: z.boolean().optional(),
}

export default defineContentConfig({
  collections: {
    projects: defineCollection({
      type: 'page',
      source: 'projects/**',
      schema: z.object(articleSchema),
    }),
    til: defineCollection({
      type: 'page',
      source: 'til/**',
      schema: z.object(articleSchema),
    }),
    notes: defineCollection({
      type: 'page',
      source: 'notes/**',
      schema: z.object(articleSchema),
    }),
    resume: defineCollection({
      type: 'page',
      source: 'resume/**',
      schema: z.object(articleSchema),
    }),
  },
})
