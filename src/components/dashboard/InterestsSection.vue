<template>
  <div>
    <div v-if="interests.length" class="section">
      <div class="section-title">ΕΝΔΙΑΦΕΡΟΝΤΑ</div>
      <div class="card">
        <div class="pills">
          <span v-for="(t, i) in interests" :key="i" class="pill">{{ t.interest }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  interests
}

const props = defineProps<Props>()
</script>

<style scoped>
.interests-section {
  padding: 8px 16px;
}

.section-title {
  font-size: .7rem;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 8px;
  padding: 0 4px;
}

.card {
  border-radius: 24px;
  background: var(--rowBg);
  border: 1px solid var(--rowBorder);
  padding: 8px 0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, .04);
}

.pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px 16px;
}

.pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  line-height: 1;
  border: 1px solid var(--rowBorder);
}

.theme-light .pill {
  background: #E1EDFF;
  color: #11181C;
}

.theme-dark .pill {
  background: rgba(10, 132, 255, 0.22);
  color: #F5F7FA;
}
</style>