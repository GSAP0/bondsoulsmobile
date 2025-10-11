<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <!-- Profile Header with Background Image -->
      <div class="profile-header">
        <div class="header-image" :style="{ backgroundImage: `url(${userPhoto})` }">
          <ion-button class="camera-btn" fill="solid" size="small" @click="$router.push('/picture')">
            <ion-icon :icon="cameraOutline" />
          </ion-button>
        </div>

      </div>

      <!-- User Info Section -->
      <div class="user-info-container">
        <div class="user-info">
          <div class="name-badges">
            <div class="flex justify-between">
            <h1 class="user-name">{{ user?.name || 'Χρήστης' }}</h1>
            <div class="rating-badge">{{ userRating }}</div>
            </div>
            <!-- Badges -->
            <div class="badges-row">
              <ion-chip v-for="(badge, i) in displayBadges" :key="i"
                        :color="badge.active ? 'primary' : 'medium'"
                        :outline="!badge.active">
                <ion-icon :icon="getBadgeIcon(badge.name)" />
                <ion-label>{{ badge.name }}</ion-label>
              </ion-chip>
            </div>
          </div>
          <p class="user-location">
            <ion-icon :icon="locationOutline" />
            {{ user?.city || 'Αθήνα' }} • {{ userAge }} χρονών
          </p>
        </div>

        <!-- TES Progress Bar -->
        <div class="tes-section">
          <div class="tes-header">
            <span class="tes-label">TES (Δείκτης Ψυχολογικής Συμβατότητας)</span>
            <span class="tes-value">{{ tesPercentage }}%</span>
          </div>
          <ion-progress-bar :value="tesPercentage / 100" color="primary" />
        </div>

        <!-- About Text -->
        <p class="about-text" v-if="user?.about">{{ user.about }}</p>
      </div>

      <!-- Statistics Section -->
      <div class="section-container">
        <div class="section-header">ΣΤΑΤΙΣΤΙΚΑ</div>
        <ion-card>
          <ion-list lines="full">
            <ion-item button @click="$router.push('/statistics')">
              <ion-icon :icon="barChartOutline" slot="start" />
              <ion-label>
                <h2>Προφίλ & μετρικές</h2>
                <p>Δες το ψυχολογικό σου προφίλ</p>
              </ion-label>
              <ion-icon :icon="chevronForwardOutline" slot="end" />
            </ion-item>
          </ion-list>
        </ion-card>
      </div>

      <!-- Questionnaire Section -->
      <div class="section-container">
        <div class="section-header">ΕΡΩΤΗΜΑΤΟΛΟΓΙΟ</div>
        <ion-card>
          <ion-list lines="full">
            <ion-item button @click="$router.push('/questions')">
              <ion-icon :icon="listOutline" slot="start" />
              <ion-label>
                <h2>Επόμενες ερωτήσεις</h2>
                <p>{{ unansweredCount }} απομένουν</p>
              </ion-label>
              <ion-icon :icon="chevronForwardOutline" slot="end" />
            </ion-item>
          </ion-list>
        </ion-card>
      </div>

      <!-- Settings & Help Section -->
      <div class="section-container">
        <div class="section-header">ΡΥΘΜΙΣΕΙΣ & ΒΟΗΘΕΙΑ</div>
        <ion-card>
          <ion-list lines="full">
            <ion-item button @click="$router.push('/settings')">
              <ion-icon :icon="settingsOutline" slot="start" />
              <ion-label>
                <h2>Ρυθμίσεις</h2>
              </ion-label>
              <ion-icon :icon="chevronForwardOutline" slot="end" />
            </ion-item>
            <ion-item button @click="$router.push('/instructions')">
              <ion-icon :icon="informationCircleOutline" slot="start" />
              <ion-label>
                <h2>Οδηγίες Χρήσης</h2>
              </ion-label>
              <ion-icon :icon="chevronForwardOutline" slot="end" />
            </ion-item>
          </ion-list>
        </ion-card>
      </div>
      <!-- Bottom spacing for FAB -->
      <div style="height: 100px;" />
    </ion-content>

    <!-- Floating Action Button -->
    <ion-fab vertical="bottom" horizontal="center" slot="fixed">
      <ion-fab-button color="secondary" @click="findMatch">
        <ion-icon :icon="searchOutline" />
      </ion-fab-button>
    </ion-fab>
  </ion-page>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useIonRouter } from '@ionic/vue'
import {
  IonPage,
  IonContent,
  IonButton,
  IonIcon,
  IonCard,
  IonList,
  IonItem,
  IonLabel,
  IonProgressBar,
  IonChip,
  IonFab,
  IonFabButton
} from '@ionic/vue'
import {
  locationOutline,
  cameraOutline,
  chevronForwardOutline,
  barChartOutline,
  listOutline,
  settingsOutline,
  informationCircleOutline,
  searchOutline,
  sparklesOutline,
  documentOutline,
  shieldCheckmarkOutline,
  trophyOutline,
  chatbubbleEllipsesOutline
} from 'ionicons/icons'
import { useGlobalStore } from '@/stores/globalStore'
import moment from 'moment'

const router = useIonRouter()
const globalStore = useGlobalStore()

// User Data
const user = computed(() => globalStore.user)

// User Photo
const userPhoto = computed(() => {
  return user.value?.image || 'https://i.pravatar.cc/300?img=64'
})

// User Rating (mock - adjust based on your data structure)
const userRating = computed(() => {
  return user.value?.rating || 5
})

// User Age
const userAge = computed(() => {
  if (!user.value?.birthdate) return '-'
  const birthDate = moment(user.value.birthdate)
  const now = moment()
  return now.diff(birthDate, 'years')
})

// TES Score (mock - adjust based on your data structure)
const tesPercentage = computed(() => {
  // Calculate based on answered questions
  const total = globalStore.questions.length
  const answered = globalStore.total_answered
  if (total === 0) return 0
  return Math.round((answered / total) * 100)
})

// Badges (mock - adjust based on your data structure)
const displayBadges = computed(() => {
  const badges = [
    { name: 'Active', active: globalStore.total_answered > 0 },
    { name: 'Verified', active: user.value?.verified || false },
    { name: 'Respected', active: globalStore.total_answered > 20 }
  ]
  return badges.filter(b => b.active || badges.filter(x => x.active).length < 2)
})

// Unanswered Questions Count
const unansweredCount = computed(() => {
  return globalStore.questions_unanswered.length
})

// Badge Icons
function getBadgeIcon(name: string) {
  if (name === 'Active') return sparklesOutline
  if (name === 'Verified') return shieldCheckmarkOutline
  if (name === 'Respected') return trophyOutline
  return chatbubbleEllipsesOutline
}

// Find Match Action
function findMatch() {
  if (user.value?.match_id) {
    // Open chat
    console.log('Open chat')
  } else {
    router.push('/match_filters')
  }
}
</script>

<style scoped>
/* Profile Header */
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
}

.camera-btn {
  position: absolute;
  bottom: 12px;
  right: 12px;
  --border-radius: 12px;
}

.rating-badge {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.95rem;
  background: var(--ion-color-secondary);
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 10;
}

/* User Info */
.user-info-container {
  padding: 16px 20px;
  background: var(--ion-background-color);
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

.user-name {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: var(--ion-text-color);
}

.badges-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.badges-row ion-chip {
  height: 28px;
  font-size: 0.75rem;
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

/* TES Section */
.tes-section {
  margin: 16px 0;
  padding: 16px;
  background: var(--ion-color-light);
  border-radius: 12px;
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
  color: var(--ion-color-medium);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.tes-value {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--ion-color-primary);
}

.tes-section ion-progress-bar {
  height: 8px;
  border-radius: 4px;
}

/* About Text */
.about-text {
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--ion-text-color);
  margin: 0;
  opacity: 0.9;
}

/* Sections */
.section-container {
  padding: 8px 16px;
}

.section-header {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--ion-color-medium);
  margin-bottom: 8px;
  padding: 0 4px;
}

.section-container ion-card {
  margin: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.section-container ion-list {
  padding: 0;
}

.section-container ion-item {
  --padding-start: 16px;
  --padding-end: 16px;
  --inner-padding-end: 8px;
  --min-height: 60px;
}

.section-container ion-item h2 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.section-container ion-item p {
  font-size: 0.85rem;
  margin: 0;
  color: var(--ion-color-medium);
}

.section-container ion-item ion-icon[slot="start"] {
  font-size: 1.3rem;
  margin-right: 16px;
  color: var(--ion-color-medium);
}

.section-container ion-item ion-icon[slot="end"] {
  font-size: 1.1rem;
  color: var(--ion-color-medium);
  opacity: 0.6;
}

/* FAB Button */
ion-fab-button {
  --box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  width: 64px;
  height: 64px;
}

ion-fab-button ion-icon {
  font-size: 1.8rem;
}
</style>
