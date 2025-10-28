<!-- InfoScreen.vue -->
<template>
  <ion-page>
    <ion-header>
      <PageHeader default-href="/dashboard">
        {{ headerTitle }}
        <div class="subtitle">{{ headerSubtitle }}</div>
      </PageHeader>
    </ion-header>
    <ion-content :fullscreen="true" class="app">
      <ion-refresher slot="fixed" @ionRefresh="store.handleRefresh">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      <div class="scroll">
        <div class="body">
          <!-- Accordions (περιεχόμενο από backend) -->
          <FaqAccordion :faqs="store.faq.value"></FaqAccordion>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonPage, IonContent, IonAccordionGroup, IonAccordion, IonItem, IonHeader, IonRefresherContent, IonRefresher
} from '@ionic/vue';
import {useGlobal} from '@/composables/useGlobal.js';
import PageHeader from '@/components/PageHeader.vue';
import FaqAccordion from "@/components/instructions/FaqAccordion.vue";

defineProps({
  headerTitle: {type: String, default: 'Γενικές Πληροφορίες'},
  headerSubtitle: {type: String, default: 'Οδηγός πλοήγησης στην Bond Souls.'}
});

const store = useGlobal();
</script>