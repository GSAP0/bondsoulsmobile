<template>
<div style="flex-grow: 1">
  <ion-text color="#fff" class="ion-text-center">
    <h3>User: Test</h3>
  </ion-text>

  <ion-list>
    <ion-item>
      <ion-label>Στατιστικά</ion-label>
    </ion-item>
    <ion-item @click="$router.push(`/questions`)">
      <ion-label>Ολοκλήρωση ερωτηματαολογίου</ion-label>
    </ion-item>
    <ion-item>
      <ion-label>Ενδιαφέροντα</ion-label>
    </ion-item>
    <ion-item>
      <ion-label>Βιογραφικό</ion-label>
    </ion-item>
    <ion-item>
      <ion-label>Οδηγίες χρήσης</ion-label>
    </ion-item>
    <ion-item @click="handleLogout">
      <ion-label>Έξοδος</ion-label>
    </ion-item>
  </ion-list>
</div>
</template>

<script setup>
import {useGlobal} from "@/composables/useGlobal";
function handleLogout(){

}
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