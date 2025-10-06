<template>
  <ion-page>
    <ion-content>
      <div style="">
        <ion-icon @click="$router.push(`/picture`)" :icon="createOutline"
                  style="position: absolute;
                      right: 25px;
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
           :style="`background-image: url('${user?.image ?? '/assets/images/logobond.png'}')`">
      </div>
      <div class="rounded-tr-3xl px-3 py-1 h-100" style="background-color: #E6E6E6; height:calc(100vh - 300px)">
        <!-- User Name and Age aligned left -->
        <div class="">
          <h2 class="text-xl font-bold flex justify-between items-center">
            <div class="">
              {{ user?.name }}
              <UserBadges></UserBadges>
            </div>
            <div>
              <ion-icon @click="() => {}" :icon="notifications"
                        style="
                      font-size: 2rem;
                      color: #000000;"
              >
              </ion-icon>
            </div>
          </h2>
          <p class="text-gray-500">{{ userAge }} χρόνων</p>
        </div>


        <div class="flex items-center mt-2 mb-2">
          <UserRating class="mr-3"></UserRating>
          <UserElo></UserElo>
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
        <div class="fixed bottom-4 left-4 right-4" v-if="!!user.match_id">
          <ion-button expand="block" color="dark" shape="round" size="large" @click="openChat">
            <ion-icon :icon="chatbubblesOutline" class="mr-2" slot="start"></ion-icon>
            Άνοιξε το Chat
          </ion-button>
        </div>
        <div class="fixed bottom-4 left-4 right-4" v-else>
          <ion-button expand="block" color="dark" shape="round" size="large" @click="$router.push(`/match_filters`)">
            <ion-icon :icon="chatbubblesOutline" class="mr-2" slot="start"></ion-icon>
            Βρες μου ταίρι
          </ion-button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {IonPage, IonList, IonItem, IonLabel, IonIcon, IonButton, useIonRouter, IonContent} from '@ionic/vue';
import {
  statsChart,
  shapes,
  documentOutline,
  informationOutline,
  chatbubblesOutline,
  createOutline,
  notifications,
} from 'ionicons/icons';
import {useGlobalStore} from '@/stores/globalStore';
import {computed, onBeforeMount} from 'vue';
import moment from 'moment';
import UserBadges from "@/components/dashboard/UserBadges.vue";
import UserRating from "@/components/dashboard/UserRating.vue";
import UserElo from "@/components/dashboard/UserElo.vue";

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
  router.push('/chat');
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