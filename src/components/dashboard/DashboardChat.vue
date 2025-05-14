<template>
  <div v-if="!state.searching" style="flex-grow: 1" class="ion-padding">
  <div>
    <div style="margin-bottom: 4rem;">
      <ion-text>Ηλικία που ψάχνω</ion-text>
      <ion-range @ionInput="handleChangeAge"
                 :value="state.age"
                 dual-knobs
                 step="1"
                 :min="lower"
                 :max="upper">
      </ion-range>
      <div style="display: flex; justify-content: space-between">
        <div>Από: {{ state.age.lower }}</div>
        <div>Έως: {{ state.age.upper }}</div>
      </div>
    </div>

    <div style="margin-bottom: 4rem;">
      <ion-text>Απόσταση από εμένα</ion-text>
      <ion-range :value="state.distance"
                 @ionInput="handleChangeDistance"
                 :min="0"
                 :max="500">
      </ion-range>
      <div style="display: flex; justify-content: space-between">
        <div></div>
        <div>{{ state.distance }}km</div>
      </div>
    </div>
    <div style="margin-bottom: 4rem;">
      <ion-text>Ηλικία που ψάχνω</ion-text>
      <ion-range @ionInput="handleChangeAge"
                 :value="state.age"
                 dual-knobs
                 step="1"
                 :min="lower"
                 :max="upper">
      </ion-range>
      <div style="display: flex; justify-content: space-between">
        <div>Από: {{ state.age.lower }}</div>
        <div>Έως: {{ state.age.upper }}</div>
      </div>
    </div>

    <div style="margin-bottom: 4rem;">
      <ion-text>Απόσταση από εμένα</ion-text>
      <ion-range :value="state.distance"
                 @ionInput="handleChangeDistance"
                 :min="0"
                 :max="500">
      </ion-range>
      <div style="display: flex; justify-content: space-between">
        <div></div>
        <div>{{ state.distance }}km</div>
      </div>
    </div>
    <ion-fab vertical="bottom" horizontal="center">
      <ion-button @click="state.searching = true">Ταίριαξέ με</ion-button>
    </ion-fab>
  </div>
  </div>
  <div v-else style="flex-grow: 1" class="ion-padding">
    <h3 class="ion-text-center">Ψάχνουμε το κατάλληλο άτομο!</h3>
    <ion-progress-bar style="margin-top:5rem;" type="indeterminate"></ion-progress-bar>
  </div>
</template>

<script setup>
import {ref} from "vue";
import { IonFab, IonProgressBar, IonText, IonLabel, IonRange, IonButton} from "@ionic/vue";

const lower = 18
const upper = 70

const state = ref({
  searching: false,
  age: {
    lower,
    upper
  },
  distance: 20,
})

function handleChangeAge({detail}) {
  state.value.age = detail.value
}

function handleChangeDistance({detail}) {
  state.value.distance = detail.value
}
</script>

<style scoped>
</style>