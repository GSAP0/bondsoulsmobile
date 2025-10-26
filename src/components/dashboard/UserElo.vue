<template>
  <div>
    <div class="flex" id="open-elo-dialog">
      <div class="mr-3">TES</div>
      <div :style="`width: ${width}px`"
           style="border: 1px solid black; height: 25px; border-radius: 12px; overflow: hidden">
        <div :style="`width:${value}px`"
             style="height: 23px;border-bottom-left-radius: 12px; border-top-left-radius: 12px; background: rgb(0,0,0)"></div>
      </div>
    </div>
    <ion-modal id="elo-modal" ref="modal" trigger="open-elo-dialog">
      <div class="p-3">
        <h1>TES</h1>
        <p>Το σκορ που μετράει τη δραστηριότητά σας και την ποιότητα επικοινωνίας με άλλους. Περισσότερα στα tips</p>
      </div>
    </ion-modal>
  </div>
</template>

<script setup>
import {computed} from "vue";
import {useGlobal} from "@/composables/useGlobal.js";
import {IonModal} from "@ionic/vue";

const min = 70
const max = 130
const multiplier = 3.5
const width = (max - min) * multiplier
const globalStore = useGlobal();
const user = computed(() => globalStore.user.value);
const value = computed(() => {
  const elo = parseFloat(user.value.elo) * 100
  const clampedElo = Math.min(Math.max(elo, min), max)
  return (clampedElo - min) * multiplier
})
</script>

<style>
ion-modal#elo-modal {
  --width: fit-content;
  --max-width: calc(100vw - 50px);
  --min-width: 350px;
  --height: fit-content;
  --border-radius: 6px;
  --box-shadow: 0 28px 48px rgba(0, 0, 0, 0.4);
}
</style>