<template>
  <div class="inline">
    <ion-icon :style="computeStyle(user.badges.photo_upload)" :icon="camera"></ion-icon>
    <ion-icon :style="computeStyle(user.badges.questions_answered)" :icon="checkmarkDoneCircle"></ion-icon>
    <ion-icon :style="computeStyle(user.badges.subscribed)" :icon="medal"></ion-icon>
  </div>
</template>

<script setup>
import {IonIcon} from "@ionic/vue";
import {
  checkmarkDoneCircle,
  medal,
  camera
} from 'ionicons/icons';
import {useGlobal} from "@/composables/useGlobal";
import {computed} from "vue";

const badgeSuccessColor = 'rgb(40 142 247)'

const globalStore = useGlobal();
const user = computed(() => globalStore.user.value);

function computeStyle(_var){
  if(!_var) return ``

  return `color: ${badgeSuccessColor}`
}
</script>