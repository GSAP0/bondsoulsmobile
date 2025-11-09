<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <PageHeader :title="title" default-href="/dashboard"/>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <ion-refresher slot="fixed" @ionRefresh="store.handleRefresh">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <div>Πώς ξεχωρίζει το προφίλ σου ανάμεσα στους υπόλοιπους</div>

      <StatisticsGraph :is-blur="!user.is_statistics_available" :user>
          Τα στατιστικά είναι διαθέσιμα αφού απαντηθούν όλες οι ερωτήσεις
      </StatisticsGraph>
      <!-- /card -->
    </ion-content>
  </ion-page>
</template>

<script setup>
import {lockClosedSharp} from "ionicons/icons";
import {IonPage, IonContent, IonHeader, IonIcon, IonRefresher, IonRefresherContent} from '@ionic/vue';
import {useGlobal} from '@/composables/useGlobal.js';
import PageHeader from '@/components/PageHeader.vue';
import StatisticsGraph from "@/components/statistics/StatisticsGraph.vue";


const title = 'Το προφίλ μου';

const store = useGlobal();
const {
  currentTheme,
  user,
  questions_unanswered
} = store
</script>