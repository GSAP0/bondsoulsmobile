<template>
  <ion-segment-button
      :value="value"
      :disabled="disabled"
  >
    <ion-label>{{ text }}</ion-label>
  </ion-segment-button>
</template>

<script setup lang="ts">
import { IonSegmentButton, IonLabel } from '@ionic/vue'

defineProps<{
  text: string
  value: string
  disabled?: boolean
}>()
</script>

<style scoped>
ion-segment-button {
  --indicator-color: var(--accent);
  --color: var(--text);
  --color-checked: var(--pillBg);
  --background: #f0f0f0;
  --background-checked: #ffebf0;
  --min-height: 16px;
  text-transform: none;
  font-weight: 500;
  font-size: 15px;
}

</style>
