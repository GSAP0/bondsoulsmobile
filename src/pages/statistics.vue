<!-- MyProfileStatsScreen.vue -->
<template>
  <ion-page>
    <ion-content :fullscreen="true" class="app">
      <div class="frame" :class="themeClass">
        <div class="scroll">
          <!-- Header -->
          <div class="header">
            <button class="back" @click="$router.back()">‹</button>
            <div class="title">{{ title }}</div>
            <div></div>
          </div>

          <!-- Card -->
          <div class="card">
            <div class="card-title">Πώς ξεχωρίζει το προφίλ σου ανάμεσα στους υπόλοιπους</div>

            <!-- Tabs -->
            <div class="tabs">
              <button :class="['tab', tab==='axes' ? 'active' : '']" @click="switchTab('axes')">Άξονες</button>
              <button :class="['tab', tab==='values' ? 'active' : '']" @click="switchTab('values')">Αξίες</button>
            </div>

            <!-- Data -->
            <div class="body">
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
          </div>
          <!-- /card -->
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { IonPage, IonContent } from '@ionic/vue';
import { useGlobalStore } from '@/stores/globalStore.js';
import { storeToRefs } from 'pinia';

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
const { themeClass } = storeToRefs(store);

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
    return Object.keys(src).map((k) => ({ label: k, score: src[k] }));
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

<style scoped>
.app { display: grid; place-items: start; }
.frame {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  box-shadow: 0 25px 60px rgba(0,0,0,.4);
}
.scroll { height: 100%; overflow-y: auto; padding-bottom: 24px; }

/* Header */
.header {
  display: grid;
  grid-template-columns: 40px 1fr 40px;
  align-items: center;
  gap: 10px;
  padding: 14px 16px 6px;
}
.back { background: transparent; border: 0; font-size: 22px; cursor: pointer; color: var(--text); }
.title { font-weight: 800; font-size: 18px; color: var(--text); }

/* Card */
.card {
  margin: 0 12px;
  border-radius: 24px;
  background: var(--rowBg);
  border: 1px solid var(--rowBorder);
  padding: 12px;
}
.card-title { text-align: center; font-weight: 700; font-size: 16px; padding: 8px 8px 12px; color: var(--rowText); }

/* Tabs */
.tabs { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding: 8px; background: var(--tabsBg); border-radius: 16px; }
.tab {
  height: 40px; border-radius: 12px; border: 0; cursor: pointer;
  font-weight: 700; background: transparent; color: var(--tabText);
}
.tab.active { background: #FF2D55; color: #fff; }

/* Body & rows */
.body { padding: 8px 8px 12px; }
.loading { opacity: 0.7; font-size: 14px; padding: 12px; }


/* default: [left] [mid] [rail] [right] */
.stat-row {
  display: grid;
  grid-template-columns: 1fr 10px 1fr 1fr;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
}

/* όταν δεν υπάρχει δεξί label → δώσε το πλάτος του δεξιού κελιού στη μπάρα */
.stat-row.no-right {
  grid-template-columns: 1fr 10px 2fr; /* rail παίρνει όλο τον χώρο δεξιά */
}

.label-left  { color: var(--rowText); font-size: 14px; text-align: right; }
.label-right { color: var(--rowText); font-size: 14px; text-align: left; min-height: 1em; }

.mid { position: relative; width: 10px; height: 24px; }
.midline { position: absolute; left: 4px; top: 0; bottom: 0; width: 2px; background: var(--midline); border-radius: 1px; }

.rail { position: relative; height: 8px; border-radius: 999px; background: var(--rail); overflow: hidden; }
.rail-middle { position: absolute; left: 50%; top: 0; width: 1px; height: 100%; background: var(--midline); z-index: 1; }
.bar { /* styles via :style */ }

/* Themes */
.theme-dark {
  --bg: linear-gradient(180deg, #0A0E1A 0%, #10172A 100%);
  --text: #F5F7FA;
  --rowText: #F5F7FA;
  --muted: rgba(245,247,250,0.7);
  --rowBg: #0E111A;
  --rowBorder: rgba(255,255,255,0.10);
  --tabsBg: #0B0E16;
  --tabText: #c7c7cc;
  --rail: rgba(255,255,255,0.08);
  --midline: rgba(255,255,255,0.5);
  background: var(--bg); color: var(--text);
}
.theme-light {
  --bg: linear-gradient(180deg, #FFFFFF 0%, #F2F6FF 100%);
  --text: #11181C;
  --rowText: #11181C;
  --muted: rgba(0,0,0,0.55);
  --rowBg: #FFFFFF;
  --rowBorder: rgba(0,0,0,0.10);
  --tabsBg: #F5F6FA;
  --tabText: #424245;
  --rail: rgba(0,0,0,0.08);
  --midline: rgba(0,0,0,0.5);
  background: var(--bg); color: var(--text);
}
</style>