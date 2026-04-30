<template>
  <UModal :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)">
    <template #content>
      <div class="template-picker">
        <div class="template-picker__header">
          <h3 class="template-picker__title">템플릿 선택</h3>
        </div>
        <div class="template-picker__list">
          <button
            v-for="tpl in templates"
            :key="tpl.id"
            class="template-picker__item"
            :class="{ 'is-selected': selected?.id === tpl.id }"
            @click="selected = tpl"
          >
            <span class="template-picker__item-name">{{ tpl.name }}</span>
            <span v-if="tpl.description" class="template-picker__item-desc">{{ tpl.description }}</span>
          </button>
        </div>
        <div class="template-picker__actions">
          <UButton variant="ghost" color="neutral" @click="handleCancel">취소</UButton>
          <UButton color="primary" :disabled="!selected" @click="handleSelect">선택</UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { SavedTemplate } from '#shared/types/template'

defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  select: [template: SavedTemplate]
}>()

const { templates } = useTemplateStore()
const templateApi = useTemplateApi()

const selected = ref<SavedTemplate | null>(null)

watch(() => templates.value, (list) => {
  if (list.length && !selected.value) {
    selected.value = list.find(t => t.isDefault) ?? list[0]
  }
}, { immediate: true })

onMounted(async () => {
  if (!templates.value.length) {
    await templateApi.fetchTemplates()
  }
})

const handleSelect = () => {
  if (!selected.value) return
  emit('select', selected.value)
  emit('update:modelValue', false)
}

const handleCancel = () => {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.template-picker {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.template-picker__title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
}

.template-picker__list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 320px;
  overflow-y: auto;
}

.template-picker__item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-neutral-700, #404040);
  border-radius: 0.5rem;
  background: transparent;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.15s, background-color 0.15s;
}

.template-picker__item:hover {
  border-color: var(--color-neutral-500, #737373);
}

.template-picker__item.is-selected {
  border-color: var(--color-primary-400, #60a5fa);
  background-color: var(--color-primary-950, #0a1628);
}

.template-picker__item-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-neutral-100, #f5f5f5);
}

.template-picker__item-desc {
  font-size: 0.75rem;
  color: var(--color-neutral-400, #a3a3a3);
}

.template-picker__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
</style>
