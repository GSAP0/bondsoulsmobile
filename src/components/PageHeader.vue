<template>
  <div class="header pt-4">
    <button class="back" v-if="hasBack" @click="handleBack" :disabled>‹</button>
    <div v-else></div>
    <div class="title">
      <slot>{{ title }}</slot>
    </div>
    <div></div>
  </div>
</template>

<script setup>
import {useIonRouter} from "@ionic/vue";

const props = defineProps({
  disabled: {
    type: Boolean,
    required: false,
    default: false
  },
  title: {
    type: String,
    required: false
  },
  defaultHref: {
    type: String,
    default: '/'
  },
  hasBack: {
    type: Boolean,
    default: true
  }
});

const router = useIonRouter();

const handleBack = () => {
  if (router.canGoBack()) {
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
