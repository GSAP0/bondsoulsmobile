<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <PageHeader>Γίνεται αναζήτηση</PageHeader>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <p>Γίνεται ήδη αναζήτηση ταίρι</p>
      <ion-button @click="cancel" expand="block" class="rounded-2xl">Ακύρωση</ion-button>
    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">
import {IonPage, IonHeader, IonToolbar, IonContent, IonButton, useIonRouter} from "@ionic/vue";
import PageHeader from "@/components/PageHeader.vue";
import {useGlobal} from "@/composables/useGlobal";

const router = useIonRouter()
const globalStore = useGlobal()

async function cancel(){
  await window.axios.post(`/user/unmatch_me`)
  await globalStore.loadUser()
  router.replace('/match_filters_new')
}
</script>