<template>
  <div>
    <ion-accordion-group class="group">
      <ion-accordion
          v-for="sec in faqs"
          :key="sec.id"
          :value="sec.id"
          class="card mb-0!"
      >
        <div slot="header" class="card-header py-1!">
          <ion-label style="font-size: 1rem; font-weight: bold">{{ sec.title }}</ion-label>
<!--          <div slot="end">s </div>-->
        </div>

        <div class="card-content pb-0! pt-2! px-1!" slot="content">
          <span v-html="sec.description"></span>
          <FaqAccordion :faqs="sec.children"></FaqAccordion>
        </div>


      </ion-accordion>
    </ion-accordion-group>
  </div>
</template>
<script setup lang="ts">
import {IonAccordion, IonAccordionGroup, IonItem} from "@ionic/vue";

const props = defineProps(['faqs'])
</script>