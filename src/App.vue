<template>
  <ion-app>
    <div v-if="loaded">
      <ion-router-outlet/>
    </div>
  </ion-app>
</template>

<script setup lang="ts">
import {IonApp, IonRouterOutlet} from '@ionic/vue';
import axios from "axios";
import {ref} from "vue";
import { useGlobalStore } from "./stores/globalStore.js"
import {useRouter} from "vue-router";

const globalStore = useGlobalStore()
const router = useRouter()

const loaded = ref(false)

async function init(){
  try{
    const res = await axios.get(`/user`)
    if(res) globalStore.user = res.data
    await globalStore.load()
    // router.replace('/dashboard')
  }finally {
    loaded.value = true
  }
}

init()

</script>
