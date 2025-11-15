<template>
  <div>
    <!-- Tabs -->
    <div class="tabs">
      <button :class="['tab', tab==='axes' ? 'active' : '']" @click="switchTab('axes')">Άξονες</button>
      <button :class="['tab', tab==='values' ? 'active' : '']" @click="switchTab('values')">Αξίες</button>
    </div>

    <div style="position: relative;left:0; top:0">
      <div v-if="isBlur"
           class="px-2 py-8 text-center rounded-2xl" :style="`
            position: absolute;
          top: 50%;
          left: 50%;
          text-shadow: 0 0 black;
          background: ${currentTheme === 'dark' ? '#0A0E1A' : 'white'};
          border: 1px solid ${currentTheme === 'dark' ? '#0A0EFF' : 'black'};
          transform: translate(-50%, -50%);
          width: 70%;
          z-index: 1;`"
      >
        <ion-icon :icon="lockClosedSharp" style="font-size: 24px"></ion-icon>
        <slot name="default"></slot>
      </div>
    </div>

    <div class="body" :style="isBlur ? 'filter: blur(7px);' : ''">
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
          <div class="bar" :style="barStyle(r.score, r)"></div>
        </div>
        <div class="label-right" v-if="splitLabel(r.label).right">
          {{ splitLabel(r.label).right }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import {computed, ref} from "vue";
import {lockClosedSharp} from "ionicons/icons";
import {IonIcon} from "@ionic/vue";
import {useGlobal} from "@/composables/useGlobal.js";

const props = defineProps({
  user: {
    type: Object,
    required: true
  },
  isBlur: {
    type: Boolean,
    default: true,
  },
})

const tab = ref('axes');

const {
  currentTheme
} = useGlobal()

// Κανονικοποίηση σε [{ label, score }]
const normalizedRows = computed(() => {
  const src = rawRows.value;
  return Object.keys(src).map((k) => ({label: k, score: src[k]}));
})

const switchTab = (name) => {
  if (tab.value !== name) tab.value = name;
}

// Παίρνουμε ωμά τα δεδομένα από το store (αντικείμενο ή array)
const rawRows = computed(() => {
  return tab.value === 'axes'
      ? props.user.weightsStatistics['Άξονες']
      : props.user.weightsStatistics['Αξίες'];
})

const brand = {
  primary: '#0A84FF',
  accent: '#FF2D55',
  bgLight: '#F2F2F7',
  bgDark: '#0A0E1A',
  textLight: '#11181C',
  textDark: '#F5F7FA',
}

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

const barStyle = (score, r) => {
  console.log(score, r.label)
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