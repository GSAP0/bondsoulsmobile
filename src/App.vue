<template>
  <ion-app>
    <div v-if="loaded">
      <ion-router-outlet :class="themeClass"/>
    </div>
    <div v-else class="flex items-center justify-center h-screen">
      <div class="text-center">
        <ion-img :src="globalStore.logo"></ion-img>
        <ion-spinner></ion-spinner>
      </div>
    </div>
  </ion-app>
</template>

<script setup lang="ts">
import {IonApp, IonRouterOutlet, IonSpinner, IonImg} from '@ionic/vue';
import {ref} from "vue";
import {useGlobalStore} from "./stores/globalStore.js"
import {storeToRefs} from "pinia";

const globalStore = useGlobalStore()
const { themeClass } = storeToRefs(globalStore)

const loaded = ref(false)

async function init() {
  try {
    if (globalStore.user) {
      await globalStore.load()
    }
  }catch(e){
    console.log('err')
    console.error(e)
  } finally {
    loaded.value = true
  }
}

init()
</script>
