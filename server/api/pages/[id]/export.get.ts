import { pageRepository } from '../../../repositories'
import { tiptapJsonToMarkdown } from '../../../utils/markdown'
import { tiptapJsonToPdf } from '../../../utils/pdf'
import { getSessionUser } from '../../../utils/session'
import { requireParam } from '../../../utils/params'

/** GET /api/pages/:id/export?format=md|pdf - 페이지를 지정된 포맷으로 내보낸다. */
export default defineEventHandler(async (event) => {
  const id = requireParam(event, 'id')

  const query = getQuery(event)
  const format = (query.format as string) || 'md'

  const page = await pageRepository.getPage(id)
  if (!page) throw createError({ statusCode: 404, message: '페이지를 찾을 수 없습니다.' })

  const user = await getSessionUser(event)
  if (!page.isPublic && !user) {
    throw createError({ statusCode: 404, message: '페이지를 찾을 수 없습니다.' })
  }

  if (format === 'md') {
    const markdown = tiptapJsonToMarkdown(page.content)
    setResponseHeader(event, 'Content-Type', 'text/markdown; charset=utf-8')
    setResponseHeader(event, 'Content-Disposition', `attachment; filename="${page.slug}.md"`)
    return `# ${page.title}\n\n${markdown}`
  }

  if (format === 'pdf') {
    const pdfBuffer = await tiptapJsonToPdf(page.content, page.title)
    setResponseHeader(event, 'Content-Type', 'application/pdf')
    setResponseHeader(event, 'Content-Disposition', `attachment; filename="${page.slug}.pdf"`)
    return pdfBuffer
  }

  throw createError({ statusCode: 400, message: '지원하지 않는 포맷입니다.' })
})
