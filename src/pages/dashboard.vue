<template>
  <ion-page>
    <ion-content :fullscreen="true" class="ion-padding app" :class="themeClass">
      <div class="scroll">
          <div class="profile-header">
            <div class="header-image" :style="{ backgroundImage: `url(${userPhoto})` }">
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
                  >
                    <ion-icon :icon="getBadgeIcon(badge.name)"/>
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
              <ion-icon :icon="chevronForwardOutline" slot="end"/>
            </ion-item>
          </div>

          <div class="section-container">
            <div class="section-header">ΕΡΩΤΗΜΑΤΟΛΟΓΙΟ</div>
            <ion-item button @click="$router.push('/questions')" class="rounded-item">
              <ion-icon :icon="listOutline" slot="start"/>
              <ion-label>
                <h2>Επόμενες ερωτήσεις</h2>
                <p>{{ unansweredCount }} απομένουν</p>
              </ion-label>
              <ion-icon :icon="chevronForwardOutline" slot="end"/>
            </ion-item>
          </div>

          <div class="section-container">
            <div class="section-header">ΡΥΘΜΙΣΕΙΣ & ΒΟΗΘΕΙΑ</div>
            <ion-item button @click="$router.push('/settings')" class="rounded-item">
              <ion-icon :icon="settingsOutline" slot="start"/>
              <ion-label><h2>Ρυθμίσεις</h2></ion-label>
              <ion-icon :icon="chevronForwardOutline" slot="end"/>
            </ion-item>
            <ion-item button @click="$router.push('/instructions')" class="rounded-item">
              <ion-icon :icon="informationCircleOutline" slot="start"/>
              <ion-label><h2>Tips</h2></ion-label>
              <ion-icon :icon="chevronForwardOutline" slot="end"/>
            </ion-item>
            <div style="height: 60px;"></div>
          </div>
          <div style="position:absolute; bottom: 10px; left: 5px; width:calc(100% - 10px); z-index: 10">
            <ion-button style="border-radius: 20px;" size="large" expand="block" color="secondary" @click="findMatch"
                        class=""
                        v-if="!globalStore.user.match_id">
              <ion-icon :icon="heart" class="mr-3"></ion-icon>
              Match now
            </ion-button>
            <ion-button style="border-radius: 20px;" size="large" expand="block" color="secondary" @click="findMatch"
                        v-else>
              <ion-icon :icon="chatbubble" class="mr-3"></ion-icon>
              Chat now
            </ion-button>
          </div>
        </div>
    </ion-content>
  </ion-page>
</template>


<script setup lang="ts">
import {computed} from 'vue'

import {
  useIonRouter,
  IonPage,
  IonContent,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonChip,
} from '@ionic/vue'

import {
  locationOutline,
  cameraOutline,
  chevronForwardOutline,
  barChartOutline,
  listOutline,
  settingsOutline,
  informationCircleOutline,
  chatbubble,
  sparklesOutline,
  shieldCheckmarkOutline,
  trophyOutline,
  chatbubbleEllipsesOutline,
  heart
} from 'ionicons/icons'

import {useGlobalStore} from '@/stores/globalStore'
import {storeToRefs} from 'pinia'
import moment from 'moment'
import UserNotifications from '@/components/dashboard/UserNotifications.vue'

const router = useIonRouter()
const globalStore = useGlobalStore()
const {themeClass, currentTheme} = storeToRefs(globalStore)

const user = computed(() => globalStore.user)
const userPhoto = computed(() => user.value.image || (currentTheme.value === 'dark' ? '/assets/images/logobondWhite.png' : '/assets/images/logobond.png'))
const userRating = computed(() => user.value.rating || 5)

const userAge = computed(() => {
  if (!user.value?.birthdate) return '-'
  const birthDate = moment(user.value.birthdate)
  return moment().diff(birthDate, 'years')
})

const tesPercentage = computed(() => {
  const total = globalStore.questions.length
  const answered = globalStore.total_answered
  if (total === 0) return 0

  return Math.round((answered / total) * 100)
})

const displayBadges = computed(() => {
  const badges = [
    {name: 'Active', active: globalStore.total_answered > 0},
    {name: 'Verified', active: user.value?.verified || false},
    {name: 'Respected', active: globalStore.total_answered > 20},
  ]
  const activeCount = badges.filter(b => b.active).length
  return badges.filter(b => b.active || activeCount < 2)
})

const unansweredCount = computed(() => globalStore.questions_unanswered.length)

function getBadgeIcon(name: string) {
  if (name === 'Active') return sparklesOutline
  if (name === 'Verified') return shieldCheckmarkOutline
  if (name === 'Respected') return trophyOutline
  return chatbubbleEllipsesOutline
}


function findMatch() {
  if (user.value?.match_id) {
    router.push('/chat')
  } else {
    router.push('/match_filters')
  }
}

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