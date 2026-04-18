import type { SavedTemplate } from '#shared/types/template'
import { useTemplateStore } from '~/composables/store/useTemplateStore'

export const useTemplateApi = () => {
  const store = useTemplateStore()

  /** 전체 템플릿 목록을 가져와 스토어에 반영한다. */
  const fetchTemplates = async () => {
    const data = await $fetch<SavedTemplate[]>('/api/templates')
    store.setTemplates(data)
    return data
  }

  return {
    fetchTemplates,
  }
}
