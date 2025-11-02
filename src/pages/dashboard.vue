<template>
  <ion-page>
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-refresher slot="fixed" @ionRefresh="globalStore.handleRefresh">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <div class="scroll">
        <div class="profile-header">
          <div class="header-image" :style="`background-image: url('${userPhoto}')`">
            <ion-icon class="camera-btn" :icon="cameraOutline" @click="$router.push('/picture')"/>
          </div>
        </div>

        <div class="user-info-container">
          <div class="user-info">
            <div class="name-badges">
              <div class="top-row">
                <div class="left">
                  <h1 class="user-name">
                    {{ user?.name || 'Χρήστης' }}
                    <span class="rating-pill"><span class="star">★</span>{{ userRating }}</span>
                  </h1>
                </div>
                <div class="right">
                  <UserNotifications/>
                </div>
              </div>
              <div class="badges-row">
                <ion-chip
                    class="p-[10px]"
                    v-for="(badge, i) in displayBadges"
                    :key="i"
                    :color="badge.active ? 'primary' : 'medium'"
                    :outline="!badge.active"
                    @click="showBadgeInfo(badge)"
                >
                  <ion-icon :icon="badge.icon"/>
                  <!--                    <ion-label>{{ badge.name }}</ion-label>-->
                </ion-chip>
              </div>
            </div>
            <p class="user-location">
              <ion-icon :icon="locationOutline"/>
              {{ user?.city || 'Αθήνα' }} • {{ userAge }} χρονών
            </p>
          </div>
          <div class="tes-section">
            <div class="tes-header">
              <span class="tes-label">TES</span>
            </div>
            <div class="rail" style="background: #e9e5e5">
              <div :style="barStyle(tesPercentage)"></div>
            </div>
          </div>
        </div>

        <!-- Statistics -->
        <div class="section-container">
          <div class="section-header">ΣΤΑΤΙΣΤΙΚΑ</div>
          <ion-item button @click="$router.push('/statistics')" class="rounded-item">
            <ion-icon :icon="barChartOutline" slot="start"/>
            <ion-label>
              <h2>Το προφίλ μου</h2>
              <p>Δες το ψυχολογικό σου προφίλ</p>
            </ion-label>
          </ion-item>
        </div>

        <div class="section-container" v-if="unansweredCount > 0 ">
          <div class="section-header">ΕΡΩΤΗΜΑΤΟΛΟΓΙΟ</div>
          <ion-item button @click="$router.push('/questions')" class="rounded-item">
            <ion-icon :icon="listOutline" slot="start"/>
            <ion-label>
              <h2>Επόμενες ερωτήσεις</h2>
              <p>{{ unansweredCount }} απομένουν</p>
            </ion-label>
          </ion-item>
        </div>

        <div class="section-container">
          <div class="section-header">ΡΥΘΜΙΣΕΙΣ & ΒΟΗΘΕΙΑ</div>
          <ion-item button @click="$router.push('/settings')" class="rounded-item">
            <ion-icon :icon="settingsOutline" slot="start"/>
            <ion-label><h2>Ρυθμίσεις</h2></ion-label>
          </ion-item>
          <ion-item button @click="$router.push('/instructions')" class="rounded-item">
            <ion-icon :icon="informationCircleOutline" slot="start"/>
            <ion-label><h2>Tips</h2></ion-label>
          </ion-item>
        </div>
      </div>
      <ion-modal id="badgeInfo" :is-open="badgeInfoModal" @didDismiss="badgeInfoModal = false">
        <template v-if="activeBadgeInfo">
          <ion-header>
            <ion-toolbar class="px-3 font-bold">
              <ion-icon :icon="activeBadgeInfo.icon"></ion-icon>
              {{ activeBadgeInfo.name }}
            </ion-toolbar>
          </ion-header>
          <div class="px-3 py-5">
            <div class="rounded-item">
              <p v-html="activeBadgeInfo.description"></p>
            </div>
          </div>
        </template>
      </ion-modal>
    </ion-content>
    <ion-footer class="px-3 py-3 bg-transparent!">
      <ion-button style="" expand="block" @click="findMatch"
                  class="cta"
                  v-if="!user?.match_id">
        <ion-icon :icon="heart" class="mr-3"></ion-icon>
        Match now
      </ion-button>
      <ion-button style="" expand="block" color="secondary"
                  class="cta"
                  @click="findMatch"
                  v-else>
        <ion-icon :icon="chatbubble" class="mr-3"></ion-icon>
        Chat now
      </ion-button>
    </ion-footer>
  </ion-page>
</template>


<script setup lang="ts">
import {computed, ref} from 'vue'

import {
  useIonRouter,
  IonPage,
  IonContent,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonFooter,
  IonChip,
  IonRefresher,
  IonRefresherContent,
  onIonViewDidEnter,
  alertController,
} from '@ionic/vue'

import {
  locationOutline,
  cameraOutline,
  barChartOutline,
  listOutline,
  settingsOutline,
  informationCircleOutline,
  chatbubble,
  heart
} from 'ionicons/icons'

import {useGlobal} from '@/composables/useGlobal'
import UserNotifications from '@/components/dashboard/UserNotifications.vue'
import {useLocation} from '@/composables/useLocation.js'
import {usePushNotifications} from '@/composables/usePushNotifications.js'
import {Capacitor} from '@capacitor/core'

const router = useIonRouter()
const globalStore = useGlobal()

const {
  user,
  displayBadges,
  userAge,
  userRating,
  userPhoto,
  tesPercentage,
  questions_unanswered,
} = globalStore

const {updateLocationToBackend} = useLocation()
const {initialize: initializePushNotifications} = usePushNotifications()

const badgeInfoModal = ref(false)
const activeBadgeInfo = ref(null)

const unansweredCount = computed(() => questions_unanswered.value.length)

onIonViewDidEnter(() => {
  updateLocationToBackend().catch(error => {
    console.log('Δεν ήταν δυνατή η ενημέρωση της τοποθεσίας:', error)
  })

  if (Capacitor.isNativePlatform()) {
    initializePushNotifications().catch(error => {
      console.error('Failed to initialize push notifications:', error)
    })
  }
})

function showBadgeInfo(badge) {
  activeBadgeInfo.value = JSON.parse(JSON.stringify(badge))
  badgeInfoModal.value = true
}

function findMatch() {
  if (user.value.match_id) {
    router.push('/chat')
  } else if (user.value.active) {
    router.push('/searching')
  } else {
    router.push('/match_filters_new')
  }
}

// async function showBadgeInfo(badge) {
//   const alert = await alertController.create({
//     header: badge.name,
//     message: badge.description,
//     buttons: ['OK'],
//     cssClass: 'badge-info-alert'
//   })
//
//   await alert.present()
// }

const brand = {
  primary: '#0A84FF',
  accent: '#FF2D55',
  bgLight: '#F2F2F7',
  bgDark: '#0A0E1A',
  textLight: '#11181C',
  textDark: '#F5F7FA',
};

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

const barStyle = (score) => {
  const safe = clamp(Number(score) || 0, 50, 150); // -50%..+50%
  const widthPct = `${Math.abs(safe)}%`;
  const grad = `linear-gradient(90deg, ${brand.primary}, ${brand.accent})`
  return {
    left: '0%',
    top: 0,
    bottom: 0,
    width: widthPct,
    position: 'absolute',
    borderRadius: '999px',
    background: grad,
    transformOrigin: 'left',
    transform: 'translateX(0)',
  };
};
</script>

<style>
ion-modal#badgeInfo {
  --width: fit-content -10px;
  --min-width: 350px;
  --height: fit-content;
  --min-height: 200px;
  --border-radius: 15px;
  padding: 12px;
  --box-shadow: 0 28px 48px rgba(0, 0, 0, 0.4);
}

</style>