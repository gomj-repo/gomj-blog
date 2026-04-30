<template>
  <UModal :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)">
    <template #content>
      <div class="confirm-dialog">
        <div class="confirm-dialog__header">
          <h3 class="confirm-dialog__title">{{ title }}</h3>
        </div>
        <p class="confirm-dialog__description">{{ description }}</p>
        <div class="confirm-dialog__actions">
          <UButton variant="ghost" color="neutral" @click="handleCancel">취소</UButton>
          <UButton :color="confirmColor ?? 'error'" @click="handleConfirm">{{ confirmLabel ?? '삭제' }}</UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean
  title: string
  description: string
  confirmLabel?: string
  confirmColor?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
  cancel: []
}>()

const handleConfirm = () => {
  emit('confirm')
  emit('update:modelValue', false)
}

const handleCancel = () => {
  emit('cancel')
  emit('update:modelValue', false)
}
</script>

<style scoped>
.confirm-dialog {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.confirm-dialog__title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
}

.confirm-dialog__description {
  margin: 0;
  color: var(--color-text-secondary, #6b7280);
  font-size: 0.875rem;
}

.confirm-dialog__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
</style>
