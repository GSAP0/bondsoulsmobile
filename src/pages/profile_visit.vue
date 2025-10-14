<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/chat"></ion-back-button>
        </ion-buttons>
        <ion-title>
          {{user.name}} προφίλ
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding app" :class="themeClass">
      <div class="scroll">
          <div class="profile-header">
            <div class="header-image" :style="{ backgroundImage: `url(${userPhoto})` }">
            </div>
          </div>
          <div class="user-info-container">
            <div class="user-info">
              <div class="name-badges">
                <div class="top-row">
                  <div class="left">
                    <h1 class="user-name">
                      {{ user.name }}
                      <span class="rating-pill"><span class="star">★</span>{{ userRating }}</span>
                    </h1>
                  </div>
                </div>
                <div class="badges-row">
                  <ion-chip
                      class="p-[10px] badge-chip"
                      v-for="(badge, i) in displayBadges"
                      :key="i"
                      :color="badge.active ? 'primary' : 'medium'"
                      :outline="!badge.active"
                  >
                    <ion-icon :icon="getBadgeIcon(badge.name)"/>
                  </ion-chip>
                </div>
              </div>
              <p class="user-location">
                <ion-icon :icon="locationOutline"/>
                {{ user?.city || 'Αθήνα' }} • {{ userAge }} χρονών
              </p>
            </div>

            <!-- TES -->
            <div class="tes-section">
              <div class="tes-header">
                <span class="tes-label">TES</span>
              </div>
              <div class="rail">
                <div :style="barStyle(tesPercentage)"></div>
              </div>
            </div>
          </div>

          <!-- Μεχρι 150 χαρακτηρες -->
          <div class="px-3">
            <div>{{ user.bio }}</div>
          </div>
          <InterestsSection :interests="user.interests"></InterestsSection>

          <!-- InterestsSection.vue -->
          <template>
            <div v-if="user.interests.length" class="section">
              <div class="section-title">ΕΝΔΙΑΦΕΡΟΝΤΑ</div>
              <div class="card">
                <div class="pills">
                  <span v-for="(t, i) in user.interests" :key="i" class="pill">{{ t.interest }}</span>
                </div>
              </div>
            </div>
          </template>

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
  IonIcon,
  IonChip,
  IonButtons,
  IonTitle,
  IonBackButton,
  IonHeader, IonToolbar
} from '@ionic/vue'

import {
  locationOutline,
  sparklesOutline, shieldCheckmarkOutline,
  trophyOutline, chatbubbleEllipsesOutline,
} from 'ionicons/icons'

import {useGlobalStore} from '@/stores/globalStore'

import {storeToRefs} from 'pinia'

import moment from 'moment'
import InterestsSection from "@/components/dashboard/InterestsSection.vue";

const router = useIonRouter()
const globalStore = useGlobalStore()
const {themeClass, currentTheme} = storeToRefs(globalStore)

const user = computed(() => {
  if (globalStore.user.uuid === globalStore.user.match.user1.uuid) return globalStore.user.match.user2
  return globalStore.user.match.user1
})

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

const brand = {
  primary: '#0A84FF',
  accent: '#FF2D55',
  bgLight: '#F2F2F7',
  bgDark: '#0A0E1A',
  textLight: '#11181C',
  textDark: '#F5F7FA'
}

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v))

const barStyle = (score: number) => {

  const safe = clamp(Number(score) || 0, 0, 100)

  const grad = `linear-gradient(90deg, ${brand.primary}, ${brand.accent})`

  return {
    left: '0%',
    top: 0,
    bottom: 0,
    width: safe + '%',
    position: 'absolute',
    borderRadius: '999px',
    background: grad
  }
}

</script>