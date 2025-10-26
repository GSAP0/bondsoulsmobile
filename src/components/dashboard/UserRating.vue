<template>
  <div>
    <div
        id="open-rating-dialog"
        style="border-radius: 99%;
        border: 1px solid black;
        width: 35px;
        height: 35px;
        text-align: center;
        padding-top: 5px;">
      {{ user.ratings_avg }}
    </div>
    <ion-modal id="rating-modal" ref="modal" trigger="open-rating-dialog">
      <div class="p-3">
        <h1>Rating</h1>
        <p>Ο μέσος όρος των αξιολογήσεων που λαμβάνετε. Περισσότερα στα tips</p>
      </div>
    </ion-modal>
  </div>
</template>


<script setup lang="ts">
import {
  IonModal,
} from '@ionic/vue';
import {useGlobal} from "@/composables/useGlobal";
import {computed} from "vue";

const globalStore = useGlobal();
const user = computed(() => globalStore.user.value);
</script>

<style>
ion-modal#rating-modal {
  --width: fit-content;
  --max-width: calc(100vw - 50px);
  --min-width: 350px;
  --height: fit-content;
  --border-radius: 6px;
  --box-shadow: 0 28px 48px rgba(0, 0, 0, 0.4);
}
</style>