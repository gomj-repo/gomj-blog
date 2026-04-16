import { pageRepository } from '../../../repositories'
import { tiptapJsonToMarkdown } from '../../../utils/markdown'

/** GET /api/pages/:id/export?format=md - 페이지를 지정된 포맷으로 내보낸다. */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: '페이지 ID가 필요합니다.' })

  const query = getQuery(event)
  const format = (query.format as string) || 'md'

  const page = await pageRepository.getPage(id)
  if (!page) throw createError({ statusCode: 404, message: '페이지를 찾을 수 없습니다.' })

  if (format === 'md') {
    const markdown = tiptapJsonToMarkdown(page.content)
    setResponseHeader(event, 'Content-Type', 'text/markdown; charset=utf-8')
    setResponseHeader(event, 'Content-Disposition', `attachment; filename="${page.slug}.md"`)
    return `# ${page.title}\n\n${markdown}`
  }

  throw createError({ statusCode: 400, message: '지원하지 않는 포맷입니다.' })
})
