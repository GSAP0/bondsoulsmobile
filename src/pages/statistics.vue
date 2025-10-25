<template>
  <ion-page>
    <ion-header>
      <PageHeader :title="title" default-href="/dashboard"/>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding" :class="themeClass">
      <div>Πώς ξεχωρίζει το προφίλ σου ανάμεσα στους υπόλοιπους</div>

      <!-- Tabs -->
      <div class="tabs">
        <button :class="['tab', tab==='axes' ? 'active' : '']" @click="switchTab('axes')">Άξονες</button>
        <button :class="['tab', tab==='values' ? 'active' : '']" @click="switchTab('values')">Αξίες</button>
      </div>

      <!-- Data -->
      <div v-if="store.questions_unanswered.length > 0" class="px-2 py-8 text-center rounded-2xl" style="
            position: absolute;
          top: 50%;
          left: 50%;
          text-shadow: 0 0 black;
          background: white;
          border: 1px solid black;
          transform: translate(-50%);
          width: 70%;
          z-index: 1;"
      >
        <ion-icon :icon="lockClosedSharp" style="font-size: 24px"></ion-icon>
        <p>Τα στατιστικά είναι διαθέσιμα αφού απαντηθούν όλες οι ερωτήσεις</p>

      </div>
      <div class="body" :style="store.questions_unanswered.length > 0 ? 'filter: blur(7px);' : ''">
        <div v-if="normalizedRows.length===0" class="loading">Φόρτωση…</div>
        <div
            v-for="(r,i) in normalizedRows"
            :key="`${r.label}-${i}`"
            class="stat-row"
            :class="{'no-right': !splitLabel(r.label).right}"
        >
          <div class="label-left">{{ splitLabel(r.label).left }}</div>
          <div class="mid">
          </div>
          <div class="rail">
            <div class="rail-middle"></div>
            <div class="bar" :style="barStyle(r.score)"></div>
          </div>
          <div class="label-right" v-if="splitLabel(r.label).right">
            {{ splitLabel(r.label).right }}
          </div>
        </div>
      </div>
      <!-- /card -->
    </ion-content>
  </ion-page>
</template>

<script setup>
import {ref, computed} from 'vue';
import {lockClosedSharp} from "ionicons/icons";
import {IonPage, IonContent, IonHeader, IonIcon} from '@ionic/vue';
import {useGlobalStore} from '@/stores/globalStore.js';
import {storeToRefs} from 'pinia';
import PageHeader from '@/components/PageHeader.vue';

const brand = {
  primary: '#0A84FF',
  accent: '#FF2D55',
  bgLight: '#F2F2F7',
  bgDark: '#0A0E1A',
  textLight: '#11181C',
  textDark: '#F5F7FA',
};

const title = 'Το προφίλ μου';

const store = useGlobalStore();
const {themeClass} = storeToRefs(store);

const tab = ref('axes');

// Παίρνουμε ωμά τα δεδομένα από το store (αντικείμενο ή array)
const rawRows = computed(() => {
  return tab.value === 'axes'
      ? store.user.weights['Άξονες']
      : store.user.weights['Αξίες'];
});

// Κανονικοποίηση σε [{ label, score }]
const normalizedRows = computed(() => {
  const src = rawRows.value;
  if (Array.isArray(src)) {
    return src.map((it) => ({
      label: it.label ?? String(it?.[0] ?? ''),
      score: typeof it.score === 'number' ? it.score : Number(it?.[1] ?? 0),
    }));
  }
  if (src && typeof src === 'object') {
    return Object.keys(src).map((k) => ({label: k, score: src[k]}));
  }
  return [];
});

const switchTab = (name) => {
  if (tab.value !== name) tab.value = name;
};

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

const barStyle = (score) => {
  const safe = clamp(Number(score) || 0, -0.5, 0.5); // -50%..+50%
  const isPos = safe >= 0;
  const widthPct = `${Math.abs(safe) * 100}%`;
  const grad = isPos
      ? `linear-gradient(90deg, ${brand.primary}, ${brand.accent})`
      : `linear-gradient(90deg, ${brand.accent}, ${brand.accent})`;
  return {
    left: '50%',
    top: 0,
    bottom: 0,
    width: widthPct,
    position: 'absolute',
    borderRadius: '999px',
    background: grad,
    transformOrigin: isPos ? 'left' : 'right',
    transform: isPos ? 'translateX(0)' : 'translateX(-100%)',
  };
};

// split label γύρω από " - "
const splitLabel = (text) => {
  const s = String(text ?? '');
  const parts = s.split(' - ');
  return {
    left: parts[0] || '',
    right: parts.length > 1 ? parts[1] : null,
  };
};
</script>