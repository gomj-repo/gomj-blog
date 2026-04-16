import { templateRepository } from '../../repositories'

/** GET /api/templates - 전체 템플릿 목록을 반환한다. */
export default defineEventHandler(async () => {
  return templateRepository.listTemplates()
})
