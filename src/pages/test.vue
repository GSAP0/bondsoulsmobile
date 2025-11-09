<template>
  <IonPage>
    <IonHeader translucent>
      <IonToolbar color="dark">
        <IonTitle>Blur Reveal</IonTitle>
      </IonToolbar>
    </IonHeader>
    <ion-content class="ion-padding">
      <div :style="`filter: blur(${calcBlur()}px)`">
      <ion-img src="https://media.istockphoto.com/id/462861845/photo/woman-in-the-grass.jpg?s=170667a&w=0&k=20&c=CBx6Z6Dxm4lq3qTzxt1fGNPsYnCIcxja1r5T2mu65qM="></ion-img>
      </div>
    </ion-content>
  </IonPage>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import moment from "moment";
import {useGlobal} from "@/composables/useGlobal";

const global = useGlobal()
const { user } = global

function calcBlur(){
  //user.value
  console.log('user', )
  const s = moment('2025-11-09 13:02');
  const e = moment('2025-11-09 14:02');
  const multiplier = 1;
  const blurMultiplier = 100

  const now = moment();
  const D0 = Math.max(1, e.diff(s));
  const R  = Math.max(0, e.diff(now)) / multiplier;

  const ratio = Math.min(1, Math.max(0, R / D0));
  const blur  = blurMultiplier * ratio;

  return blur
}
</script>