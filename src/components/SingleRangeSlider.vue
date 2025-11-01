<template>
  <div class="single-range-wrapper">
    <ion-range
        :min="min"
        :max="max"
        :step="step"
        :value="value"
        :disabled="disabled"
        :pin="false"
        @ionInput="handleInput"
    >
    </ion-range>
  </div>
</template>

<script setup lang="ts">
import { IonRange } from '@ionic/vue'

defineProps<{
  min: number
  max: number
  step: number
  value: number
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:value': [number]
}>()

const handleInput = (event: CustomEvent) => {
  emit('update:value', event.detail.value)
}
</script>

<style scoped>
.single-range-wrapper {
  --padding-top: 0;
  --padding-bottom: 0;
}

ion-range {
  --bar-background: #e5e5e5;
  --bar-background-active: linear-gradient(90deg, #4169E1, #FF2D55);
  --bar-height: 6px;
  --bar-border-radius: 999px;
  --knob-background: white;
  --knob-border-radius: 50%;
  --knob-box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  --knob-size: 20px;
  --pin-background: #ff2d55;
  --pin-color: white;
  padding: 14px 0 16px;
}

ion-range::part(knob) {
  border: 3px solid #ff2d55;
}
</style>
