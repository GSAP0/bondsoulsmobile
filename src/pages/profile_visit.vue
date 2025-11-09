<template>
  <ion-page>
    <ion-header>
      <PageHeader default-href="/chat">
        Προφίλ χρήστη
      </PageHeader>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <ion-refresher slot="fixed" @ionRefresh="globalStore.handleRefresh">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <div class="">
        <div class="profile-header" :style="`filter:blur(${calcBlur()}px`">
          <div class="header-image" :style="`background-image: url('${user.match.user_info.image}')`">
          </div>
        </div>

        <div class="user-info-container">
          <div class="user-info">
            <div class="name-badges">
              <div class="top-row">
                <div class="left">
                  <h1 class="user-name">
                    {{ user.match.user_info.name || 'Χρήστης' }}
                    <span class="rating-pill"><span class="star">★</span>{{ user.match.user_info.ratings_avg }}</span>
                  </h1>
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
                  <ion-icon :icon="badge.icon"/>
                </ion-chip>
              </div>
            </div>
            <p class="user-location">
              <ion-icon :icon="locationOutline"/>
              {{ user.match.user_info.city || 'Αθήνα' }} • {{ user.match.user_info.name }} χρονών
            </p>
          </div>
          <div class="tes-section">
            <div class="tes-header">
              <span class="tes-label">TES</span>
            </div>
            <div class="rail" style="background: #e9e5e5">
              <div :style="barStyle(user.match.user_info.elo)"></div>
            </div>
          </div>
        </div>

        <!-- Statistics -->
        <div class="section-container">
          <div class="section-header">ΣΤΑΤΙΣΤΙΚΑ</div>
          <StatisticsGraph :user="user.match.user_info" :is-blur="!user.match.user_info.is_statistics_available">
            Ο Χρήστης δεν έχει απαντήσει όλες τις ερωτήσεις
          </StatisticsGraph>
        </div>
      </div>
    </ion-content>
  </ion-page>


</template>

<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonChip,
  IonRefresher,
  IonRefresherContent, IonHeader,
} from '@ionic/vue'

import {
  locationOutline,
  barChartOutline,
} from 'ionicons/icons'

import moment from 'moment'

import {useGlobal} from '@/composables/useGlobal'
import {useSettings} from '@/composables/useSettings'
import StatisticsGraph from "@/components/statistics/StatisticsGraph.vue";
import PageHeader from "@/components/PageHeader.vue";

const settings = useSettings()
const globalStore = useGlobal()
const { user } = globalStore

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

function calcBlur(){
  const dt = globalStore.user.value.match.first_message_date
  if(!dt) {
    console.log('No messages here...')
    return 10_000
  }

  const { days, blurMultiplier, multiplierEffect} = settings.settings.match_state

  const s = moment(dt);
  const e = moment(dt).add('hours', parseFloat(days));
  const multiplier = 1 + globalStore.user.value.match.words_count / parseFloat(multiplierEffect);

  const now = moment();
  const D0 = Math.max(1, e.diff(s));
  const R  = Math.max(0, e.diff(now)) / multiplier;

  const ratio = Math.min(1, Math.max(0, R / D0));
  const blur  = parseFloat(blurMultiplier) * ratio;

  console.log(
      multiplier,
      blur,
      ratio,
      s.format('DD/MM/YYYY HH:mm:ss'),
      moment().format('DD/MM/YYYY HH:mm:ss'))

  return blur
}
</script>