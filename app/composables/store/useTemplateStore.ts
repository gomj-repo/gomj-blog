import type { SavedTemplate } from '#shared/types/template'

export const useTemplateStore = () => {
  /** 전체 템플릿 목록. */
  const templates = useState<SavedTemplate[]>('templates', () => [])

  const setTemplates = (value: SavedTemplate[]) => {
    templates.value = value
  }

  return {
    templates,
    setTemplates,
  }
}
