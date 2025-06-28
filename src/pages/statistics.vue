<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/dashboard"></ion-back-button>
        </ion-buttons>
        <ion-title>Στατιστικά</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <h5 class="mt-0!">Το σκορ σου σε σχέση με το μέσο όρο</h5>
      <ion-buttons width="100%">
        <ion-button class="flex-grow"
                    @click="activeTab='aksones'"
                    :fill="getFill('aksones')">
          Άξονες
        </ion-button>
        <ion-button class="flex-grow"
                    @click="activeTab='aksies'"
                    :fill="getFill('aksies')">
          Αξίες
        </ion-button>
      </ion-buttons>
      <div v-if="user && user.graph">
        <Graph :items="user.graph['Άξονες']" v-if="activeTab === 'aksones'"></Graph>
        <Graph :items="user.graph['Αξίες']" v-if="activeTab === 'aksies'"></Graph>
      </div>

    </ion-content>
  </ion-page>
</template>

<script setup>
import {IonPage, IonToolbar, IonButtons, IonBackButton, IonContent, IonHeader, IonTitle, IonButton} from "@ionic/vue";
import {useGlobalStore} from "@/stores/globalStore.js";
import { ref} from "vue";
import Graph from "@/components/statistics/Graph.vue";
import {storeToRefs} from "pinia";

const globalStore = useGlobalStore();
const { user } = storeToRefs(globalStore)
const activeTab = ref("aksones")

function getFill(type){
  if(activeTab.value === type) return 'solid'
  return 'none'
}
</script>