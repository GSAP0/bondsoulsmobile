<template>
  <ion-page>
    <ion-content class="ion-padding">
      <PageHeader title="Ενδιαφέροντα" default-href="/dashboard" />
      <InterestChips></InterestChips>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {IonContent, IonPage} from "@ionic/vue";
import InterestChips from "@/components/interests/InterestChips.vue";
import PageHeader from '@/components/PageHeader.vue';
import {onMounted, ref} from "vue";

</script>