<template>
<div style="flex-grow: 1">
  <ion-text color="#fff" class="ion-text-center">
    <h3>Χρήστης: {{globalStore.user.name}}</h3>
    <h3>Απαντημένες ερωτήσεις: {{globalStore.total_answered}}/{{globalStore.questions.length}}</h3>
  </ion-text>

</div>
</template>

<script setup>

import {useGlobalStore} from "@/stores/globalStore.js";

const globalStore = useGlobalStore()
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