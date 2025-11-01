<template>
  <div
    class="section mb-5"
    :class="{ locked: locked }"
    @click="locked && $emit('locked-click')"
    :role="locked ? 'button' : undefined"
    :tabindex="locked ? 0 : undefined"
    @keydown.enter="locked && $emit('locked-click')"
  >
    <div class="">
      <span class="title">{{ title }}</span>
      <ion-badge v-if="locked" class="lock-badge">
        🔒 Συνδρομή
      </ion-badge>
    </div>
    <div class="section-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonBadge } from '@ionic/vue'

defineProps<{
  title: string
  locked?: boolean
}>()

defineEmits<{
  'locked-click': []
}>()
</script>

<style scoped>
.section {
  cursor: default;
  transition: opacity 0.2s ease;
  background: var(--rowBg);
  padding: 0.5rem 1rem;
  border-radius: 12px;
  border: 1px solid var(--rowBorder)
}

.section.locked {
  opacity: 0.45;
  cursor: pointer;
}


.lock-badge {
  --background: #fff5f7;
  --color: #ff2d55;
  padding: 5px 10px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 12px 0px;
}

.section-content {
  transition: all 0.2s ease;
}

.section.locked .section-content {
  pointer-events: none;
}
</style>