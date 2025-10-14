<!-- InfoScreen.vue -->
<template>
  <ion-page>
    <ion-content :fullscreen="true" class="app" :class="store.themeClass">
      <div class="scroll">
        <div class="body">
            <PageHeader :title="headerTitle" default-href="/dashboard" />
            <div class="subtitle">{{ headerSubtitle }}</div>

            <!-- Accordions (περιεχόμενο από backend) -->
            <ion-accordion-group class="group">
              <ion-accordion
                  v-for="sec in store.faq"
                  :key="sec.id"
                  :value="sec.id"
                  class="card"
              >
                <ion-item slot="header" lines="none" class="card-header">
                  <div class="card-title">{{ sec.title }}</div>
                </ion-item>

                <div class="card-content" slot="content" v-html="sec.description"></div>
              </ion-accordion>
            </ion-accordion-group>
          </div>
        </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonPage, IonContent, IonAccordionGroup, IonAccordion, IonItem
} from '@ionic/vue';
import { useGlobalStore } from '@/stores/globalStore.js';
import PageHeader from '@/components/PageHeader.vue';

defineProps({
  headerTitle: { type: String, default: 'Γενικές Πληροφορίες' },
  headerSubtitle: { type: String, default: 'Οδηγός πλοήγησης στην Bond Souls.' }
});

const store = useGlobalStore();
</script>