<template>
  <ion-app>
    <div v-if="loaded">
      <ion-router-outlet/>
    </div>
  </ion-app>
</template>

<script setup lang="ts">
import {IonApp, IonRouterOutlet} from '@ionic/vue';
import {ref} from "vue";
import {useGlobalStore} from "./stores/globalStore.js"

const globalStore = useGlobalStore()

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
