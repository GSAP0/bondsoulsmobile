<template>
  <div class="double-range-wrapper">
    <ion-range
        :min="min"
        :max="max"
        :step="step"
        :value="rangeValue"
        :disabled="disabled"
        :dual-knobs="true"
        :pin="false"
        @ionInput="handleInput"
    >
    </ion-range>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IonRange } from '@ionic/vue'

const props = defineProps<{
  min: number
  max: number
  step: number
  value: [number, number]
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:value': [[number, number]]
}>()

const rangeValue = computed(() => ({
  lower: props.value[0],
  upper: props.value[1]
}))

const handleInput = (event: CustomEvent) => {
  const { lower, upper } = event.detail.value
  emit('update:value', [lower, upper])
}
</script>

<style scoped>
.double-range-wrapper {
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
}

ion-range::part(knob) {
  border: 3px solid #ff2d55;
}
</style>
