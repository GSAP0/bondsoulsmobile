<template>
  <ion-app>
    <div v-if="loaded">
      <ion-router-outlet :class="themeClass"/>
    </div>
    <div v-else class="flex items-center justify-center h-screen">
      <div class="text-center">
        <ion-img :src="logo"></ion-img>
        <ion-spinner></ion-spinner>
      </div>
    </div>
  </ion-app>
</template>

<script setup lang="ts">
import {IonApp, IonRouterOutlet, IonSpinner, IonImg} from '@ionic/vue';
import {onMounted, ref} from "vue";
import {useGlobal} from "./composables/useGlobal.js"
import { useSettings } from "./composables/useSettings"
import { useMatching } from "./composables/useMatching"
import {StatusBar} from "@capacitor/status-bar";

const globalStore = useGlobal()
const settings = useSettings()
const matching = useMatching()

const { themeClass, logo } = globalStore

const loaded = ref(false)

async function init() {
  try {
    if (globalStore.user.value) {
      await globalStore.load()
      await settings.load()
      await matching.load()

      if(globalStore.user.value){}
    }
  }catch(e){
    console.log('err')
    console.error(e)
  } finally {
    loaded.value = true
  }
}

onMounted(async () => {
  try {
    await StatusBar.hide();
  } catch (e) {
    // Δεν υπάρχει σε web, no worries
    console.log('StatusBar not available');
  }
});

init()
</script>
