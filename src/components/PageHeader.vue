<template>
  <div class="header">
    <button class="back" @click="handleBack">‹</button>
    <div class="title">{{ title }}</div>
    <div></div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  defaultHref: {
    type: String,
    default: '/'
  }
});

const router = useRouter();

const handleBack = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.replace(props.defaultHref);
  }
};
</script>

<style scoped>
.header {
  display: grid;
  grid-template-columns: 40px 1fr 40px;
  align-items: center;
  gap: 10px;
  padding: 14px 16px 6px;
}

.back {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: var(--text);
  font-size: 32px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.title {
  color: var(--text);
  font-size: 18px;
  font-weight: 600;
  text-align: center;
}
</style>
