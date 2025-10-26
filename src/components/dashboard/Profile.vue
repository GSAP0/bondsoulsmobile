<template>
<div style="flex-grow: 1">
  <ion-text color="#fff" class="ion-text-center">
    <h3>Χρήστης: {{globalStore.user.value.name}}</h3>
    <h3>Απαντημένες ερωτήσεις: {{globalStore.total_answered.value}}/{{globalStore.questions.value.length}}</h3>
  </ion-text>

</div>
</template>

<script setup>

import {useGlobal} from "@/composables/useGlobal.js";

const globalStore = useGlobal()
</script>

<style scoped>
/* This style is for demonstration purposes only. */
/* It's not required for the tabs to function. */
.content-1 {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100vw;
}
</style>