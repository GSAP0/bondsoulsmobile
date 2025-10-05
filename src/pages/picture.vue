<template>
  <ion-page>
    <ion-content :fullscreen="true" class="app">
      <div class="top-section">
        <h1>Δημιουργία προφίλ</h1>
      </div>

      <div class="content-wrapper">
        <div class="content">

        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {IonPage, IonContent, IonButton} from '@ionic/vue';


function handleNext(){
  window.location = `/dashboard`
}


</script>

<style>

</style>