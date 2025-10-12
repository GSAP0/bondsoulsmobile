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
    <ion-content :fullscreen="true" class="ion-padding app">
      <div class="frame" :class="themeClass">
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
                      class="badge-chip"
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

const {themeClass} = storeToRefs(globalStore)


const user = computed(() => {
  if (globalStore.user.uuid === globalStore.user.match.user1.uuid) return globalStore.user.match.user2
  return globalStore.user.match.user1
})

const userPhoto = computed(() => user.value?.image || 'https://i.pravatar.cc/300?img=64')
const userRating = computed(() => user.value?.rating || 5)


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

<style scoped>
.app {
  display: grid;
  place-items: start;
}

.frame {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}

.scroll {
  height: 100%;
  overflow-y: auto;
  padding-bottom: 24px;
}


/* Header image */

.profile-header {
  position: relative;
  width: 100%;
  height: 280px;
}

.header-image {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  position: relative;
  border-radius: 15px;
}

.camera-btn {
  font-size: 1rem !important;
  position: absolute;
  top: 12px;
  right: 12px;
  color: #000;
  background: #c7c7c750;
  border-radius: 27%;
  padding: 7px;
}


/* User info */

.user-info-container {
  padding: 8px 16px;
}

.user-info {
  margin-bottom: 16px;
}

.name-badges {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 8px;
}

.top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.right {
  display: flex;
  align-items: center;
}

.user-name {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: var(--ion-text-color);
  display: flex;
  align-items: center;
  gap: 8px;
}

.rating-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 999px;
  border: 1.5px solid #FF2D55;
  color: #FF2D55;
  background: var(--pillBg, #0A0E1A);
  font-size: 0.9rem;
  font-weight: 800;
  line-height: 1;
}

.rating-pill .star {
  margin-right: 2px;
}


.badges-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.badge-chip {
  height: 28px;
  font-size: 0.75rem;
  --background: rgba(255, 255, 255, 0.06);
  --color: var(--ion-text-color);
  --border-radius: 999px;
  border: 1px solid var(--rowBorder);
}


.user-location {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.95rem;
  color: var(--ion-color-medium);
  margin: 0;
}

.user-location ion-icon {
  font-size: 1rem;
}


/* TES */

.tes-section {
  margin: 8px 0;
  padding: 16px;
  background: var(--rowBg);
  border: 1px solid var(--rowBorder);
  border-radius: 16px;
}

.tes-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.tes-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: .5px;
}

.rail {
  position: relative;
  height: 8px;
  border-radius: 999px;
  background: var(--rail);
  overflow: hidden;
}


/* Sections */

.section-container {
  padding: 8px 16px;
}

.section-header {
  font-size: .7rem;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 8px;
  padding: 0 4px;
}

.list {
  padding: 8px;
}

.rounded-item {
  --background: var(--rowBg);
  --border-radius: 16px;
  border-radius: 16px;
  border: 1px solid var(--rowBorder);
  margin: 6px 0;
  overflow: hidden;
}

ion-item {
  --padding-start: 16px;
  --padding-end: 16px;
  --inner-padding-end: 8px;
  --min-height: 60px;
  --inner-border-width: 0px;
}

ion-item h2 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 4px;
  color: var(--rowText);
}

ion-item p {
  font-size: .85rem;
  margin: 0;
  color: var(--muted);
}

ion-item ion-icon[slot="start"] {
  font-size: 1.3rem;
  margin-right: 16px;
  color: var(--muted);
}

ion-item ion-icon[slot="end"] {
  font-size: 1.1rem;
  color: var(--muted);
  opacity: .6;
}


/* CTA */

.cta {
  position: sticky;
  bottom: 10px;
  left: 5px;
  right: 5px;
  z-index: 10;
  padding: 0 5px;
}

ion-button {
  --border-radius: 20px;
  --background: linear-gradient(90deg, var(--primary), var(--accent));
}


/* Themes */

.theme-dark {

  --bg: linear-gradient(180deg, #0A0E1A 0%, #10172A 100%);

  --text: #F5F7FA;
  --rowText: #F5F7FA;
  --muted: rgba(245, 247, 250, 0.7);

  --rowBg: #0F1424;
  --rowBorder: rgba(255, 255, 255, 0.10);
  --pillBg: #0A0E1A;

  --rail: rgba(255, 255, 255, 0.08);

  --primary: #0A84FF;
  --accent: #FF2D55;

  background: var(--bg);
  color: var(--text);

}

.theme-light {

  --bg: linear-gradient(180deg, #FFFFFF 0%, #F2F6FF 100%);

  --text: #11181C;
  --rowText: #11181C;
  --muted: rgba(0, 0, 0, 0.55);

  --rowBg: #FFFFFF;
  --rowBorder: rgba(0, 0, 0, 0.10);
  --pillBg: #FFFFFF;

  --rail: #E9E5E5;

  --primary: #0A84FF;
  --accent: #FF2D55;

  background: var(--bg);
  color: var(--text);

}

</style>