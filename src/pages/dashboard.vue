<template>
  <ion-page>
    <div style="">
      <ion-icon :icon="createOutline"
                style="position: absolute;
                      right: 10px;
                      top: 10px;
                      font-size: 1.3rem;
                      color: #000000;
                      background: rgba(0, 0, 0, 0.2);
                      padding: 4px;"
      >
      </ion-icon>
    </div>
    <!-- Background Image -->
    <div class="w-full h-[300px] bg-cover bg-center"
         style="background-image: url('/assets/images/logobond.png')">
    </div>
    <div class="rounded-tr-3xl px-3 py-1 h-100" style="background-color: #E6E6E6; height:calc(100vh - 300px)">
      <!-- User Name and Age aligned left -->
      <div class="">
        <h2 class="text-xl font-bold">{{ user?.name }}</h2>
        <p class="text-gray-500">{{ userAge }} χρόνων</p>
      </div>

      <!-- Grey Background Menu Container -->
      <div class="">
        <ion-list lines="none" style="background-color: #E6E6E6">
          <ion-item button class="rounded-lg my-2" @click="router.push('statistics')">
            <ion-icon :icon="statsChart" size="small" class="mr-3"></ion-icon>
            <ion-label>Στατιστικά</ion-label>
          </ion-item>

          <ion-item button class="rounded-lg my-2" @click="router.push('questions')">
            <ion-icon :icon="statsChart" size="small" class="mr-3"></ion-icon>
            <ion-label>Ολοκλήρωση ερωτηματολογίου</ion-label>
          </ion-item>

          <ion-item button class="rounded-lg my-2 " @click="router.push('interests')">
            <ion-icon :icon="shapes" size="small" class="mr-3"></ion-icon>
            <ion-label>Ενδιαφέροντα</ion-label>
          </ion-item>

          <ion-item button class="rounded-lg my-2 " @click="router.push('bio')">
            <ion-icon :icon="documentOutline" size="small" class="mr-3"></ion-icon>
            <ion-label>Βιογραφικό</ion-label>
          </ion-item>
          <ion-item button class="rounded-lg my-2 " @click="router.push('instructions')">
            <ion-icon :icon="informationOutline" size="small" class="mr-3"></ion-icon>
            <ion-label>Οδηγίες Χρήσης</ion-label>
          </ion-item>
        </ion-list>
      </div>

      <!-- Bottom Chat Button -->
      <div class="fixed bottom-4 left-4 right-4">
        <ion-button expand="block" color="dark" shape="round" size="large" @click="openChat">
          <ion-icon :icon="chatbubblesOutline" class="mr-2" slot="start"></ion-icon>
          Άνοιξε το Chat
        </ion-button>
      </div>
    </div>
  </ion-page>
</template>

<script setup>
import {IonPage, IonList, IonItem, IonLabel, IonIcon, IonButton, useIonRouter} from '@ionic/vue';
import {
  statsChart,
  shapes,
  documentOutline,
  informationOutline,
  chatbubblesOutline,
  createOutline
} from 'ionicons/icons';
import {useGlobalStore} from '@/stores/globalStore';
import {computed, onBeforeMount} from 'vue';
import moment from 'moment';

const globalStore = useGlobalStore();
const user = computed(() => globalStore.user);
const router = useIonRouter();

const userAge = computed(() => {
  if (!user.value?.birthdate) return '-';
  const birthDate = moment(user.value.birthdate);
  const now = moment();
  return now.diff(birthDate, 'years');
});

function openChat() {
  console.log('Open chat');
}

onBeforeMount(() => {
  if (!localStorage.getItem('survey')) router.replace('/survey')
})
</script>

<style scoped>
.list-md {
  background-color: #E6E6E6;
}
</style>