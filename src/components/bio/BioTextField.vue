<template>
  <div>
    <ion-textarea v-model="globalStore.user.bio"
                 fill="solid"
                 :auto-grow="true"
                 placeholder="Enter text"
    ></ion-textarea>

  </div>
</template>

<script setup>
import { IonTextarea } from "@ionic/vue";
import {useGlobalStore} from "@/stores/globalStore.js";

const globalStore = useGlobalStore()
</script>