<template>
  <div>
    <ion-img src="/assets/images/introImage.png"></ion-img>
    <h1 class="text-center">Ας ξεκινήσουμε</h1>
    <p class="p-5 text-center text-xl">Δώσε μας με ειλικρίνεια μερικές απλές πληροφορίες για εσένα και </p>
    <div class="w-[100%] text-center">
    <ion-button @click="closeSurvey">
      <span class="text-white! px-6">Συνέχεια</span>
    </ion-button>
    </div>
  </div>
</template>

<script setup>
import {IonImg, IonButton}  from "@ionic/vue";

const emit = defineEmits(['close'])

function closeSurvey(){
  localStorage.setItem('questions_required', "1")
  emit('close')
}
</script>