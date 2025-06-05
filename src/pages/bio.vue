<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button text="Πίσω" defaultHref="/dashboard"></ion-back-button>
        </ion-buttons>
        <ion-title>Βιογραφικό</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <BioTextField></BioTextField>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar} from "@ionic/vue";
import BioTextField from "@/components/bio/BioTextField.vue";

</script>