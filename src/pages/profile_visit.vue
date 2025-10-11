<template>
  <ion-page>
    <ion-content class="ion-padding">
      <div v-if="!data">
        <ion-spinner></ion-spinner>
      </div>
      <template v-else>
        <!-- Background Image -->
        <div class="w-full h-[300px] bg-cover bg-center"
             :style="`background-image: url('${data.image})')`">
        </div>
        <div class="rounded-tr-3xl px-3 py-1 h-100" style="">
          <!-- User Name and Age aligned left -->
          <div class="">
            <h2 class="text-xl font-bold">{{ data.user.name }}
              <UserBadges></UserBadges>
            </h2>
            <p class="text-gray-500">{{ data.user.age }} χρόνων</p>
          </div>

          <div class="flex items-center mt-2 mb-2">
            <UserRating class="mr-3"></UserRating>
            <UserElo></UserElo>
          </div>
        </div>
        <ion-button style="text: #fff" expand="full" class="rounded-3xl" @click="$router.go(-1)">Επιστροφή</ion-button>
      </template>
    </ion-content>
  </ion-page>
</template>
<script setup>
import {IonPage, IonContent, IonSpinner, useIonRouter, IonButton} from "@ionic/vue";
import UserBadges from "@/components/dashboard/UserBadges.vue";
import UserRating from "@/components/dashboard/UserRating.vue";
import UserElo from "@/components/dashboard/UserElo.vue";
import {ref} from "vue";
import {useGlobalStore} from "@/stores/globalStore.js";
import moment from "moment";

const globalStore = useGlobalStore();

const data = ref(null)

const router = useIonRouter();

function calcBirthdate(birthdate) {
  if (!birthdate) return '-';
  const birthDate = moment(birthdate);
  const now = moment();
  return now.diff(birthDate, 'years');
}

axios.get(`/user/9e648c3e-22dd-4c10-84c5-5bb39c4f29a0`)
    .then(res => {
      data.value = {
        user: res.data,
        age: calcBirthdate(res.data.birthdate),
        image: res.data.image ?? '/assets/images/logobond.png'
      }
    })
</script>