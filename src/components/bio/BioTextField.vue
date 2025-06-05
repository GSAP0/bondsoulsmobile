<template>
  <div>
    <ion-textarea v-model="globalStore.user.bio"
                 fill="outline"
                 :auto-grow="true"
                 placeholder="Enter text"
    ></ion-textarea>
  <ion-button class="mt-3" label="Αποθήκευση" @click="updateBio">Αποθήκευση</ion-button>
  </div>
</template>

<script setup>
import { IonTextarea, IonButton } from "@ionic/vue";
import {useGlobalStore} from "@/stores/globalStore.js";

const globalStore = useGlobalStore()

async function updateBio(){
  await axios.post(`user/updateBio`, {
    bio: globalStore.user.bio
  })

}
</script>