<template>
  <ion-segment
      :value="modelValue"
      :disabled="disabled"
      @ionChange="handleChange"
  >
    <slot></slot>
  </ion-segment>
</template>

<script setup lang="ts">
import { IonSegment } from '@ionic/vue'

defineProps<{
  modelValue: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [string]
}>()

const handleChange = (event: CustomEvent) => {
  emit('update:modelValue', event.detail.value)
}
</script>

<style scoped>

</style>
