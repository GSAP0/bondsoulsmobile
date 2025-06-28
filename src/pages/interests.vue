<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/dashboard"></ion-back-button>
        </ion-buttons>
        <ion-title>Ενδιαφέροντα</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <InterestChips></InterestChips>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar} from "@ionic/vue";
import InterestChips from "@/components/interests/InterestChips.vue";
import {onMounted, ref} from "vue";

</script>