<!-- InfoScreen.vue -->
<template>
  <ion-page>
    <ion-header>
      <PageHeader default-href="/dashboard">
        {{ headerTitle }}
        <div class="subtitle">{{ headerSubtitle }}</div>
      </PageHeader>

    </ion-header>
    <ion-content :fullscreen="true" class="app" :class="store.themeClass">
      <div class="scroll">
        <div class="body">
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
  IonPage, IonContent, IonAccordionGroup, IonAccordion, IonItem, IonHeader
} from '@ionic/vue';
import {useGlobal} from '@/composables/useGlobal.js';
import PageHeader from '@/components/PageHeader.vue';

defineProps({
  headerTitle: {type: String, default: 'Γενικές Πληροφορίες'},
  headerSubtitle: {type: String, default: 'Οδηγός πλοήγησης στην Bond Souls.'}
});

const store = useGlobal();
</script>