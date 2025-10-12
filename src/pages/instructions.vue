<!-- InfoScreen.vue -->
<template>
  <ion-page>
    <ion-content :fullscreen="true" class="app">
      <div class="frame" :class="store.themeClass">
        <div class="scroll">
          <div class="body">
            <!-- Header + Back -->
            <div class="flex">
              <div class="back-wrapper">
                <ion-button fill="clear" class="back-btn" @click="goBack">
                  <ion-icon :icon="chevronBack" class="back-icon" />
                </ion-button>
              </div>
              <div>
                <div class="title">{{ headerTitle }}</div>
                <div class="subtitle">{{ headerSubtitle }}</div>
              </div>
            </div>

            <!-- Accordions (περιεχόμενο από backend) -->
            <ion-accordion-group class="group">
              <ion-accordion
                  v-for="sec in store.faq"
                  :key="sec.id"
                  :value="sec.id"
                  class="card"
              >
                <ion-item slot="header" lines="none" class="card-header">
                  <div class="card-title">{{ sec.title }}</div>
                </ion-item>

                <div class="card-content" slot="content" v-html="sec.description"></div>
              </ion-accordion>
            </ion-accordion-group>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonPage, IonContent, IonAccordionGroup, IonAccordion, IonItem, IonButton, IonIcon
} from '@ionic/vue';
import { chevronBack } from 'ionicons/icons';
import { useRouter } from 'vue-router';
import { useGlobalStore } from '@/stores/globalStore.js';

defineProps({
  headerTitle: { type: String, default: 'Γενικές Πληροφορίες' },
  headerSubtitle: { type: String, default: 'Οδηγός πλοήγησης στην Bond Souls.' }
});

const store = useGlobalStore();

const router = useRouter();
const goBack = () => router.back();
</script>

<style scoped>
/* === Base layout === */
.app { display: grid; place-items: center; }
.frame {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  box-shadow: 0 25px 60px rgba(0,0,0,.4);
}

.scroll { height: 100%; overflow-y: auto; padding: 20px 0 24px 0; }

.body { padding: 0 20px; color: var(--text); }

.title {
  font-size: 20px; font-weight: 700;
  background: linear-gradient(90deg, #0A84FF, #FF2D55);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}

.subtitle { font-size: 13.5px; color: var(--muted); margin-top: 4px; margin-bottom: 12px; }

/* Back button */
.back-wrapper { padding: 0 8px; margin-bottom: 4px; }

.back-btn {
  --ripple-color: transparent;
  --padding-start: 0; --padding-end: 0;
  min-width: 36px; min-height: 36px;
  border: 1px solid var(--btnBorder);
  border-radius: 50%;
  backdrop-filter: blur(4px);
  background: var(--btnBg);
  color: var(--text);
}

.back-icon { color: var(--text); font-size: 22px; line-height: 1; }

/* Accordions */
.group { display: grid; gap: 12px; margin-top: 12px; }

.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
  backdrop-filter: blur(6px);
  transition: border-color .25s ease, background .25s ease;
}
.card:hover { border-color: var(--borderHover); }

.card-header { --background: transparent; --color: var(--text); padding: 14px 16px; }
.card-title { font-size: 15px; font-weight: 600; color: var(--text); }

.card-content {
  padding: 14px 16px 16px 16px;
  font-size: 14px; line-height: 1.55;
  color: var(--textSoft);
  background: var(--cardInner);
  border-top: 1px solid var(--innerBorder);
}

/* Open state (πιο ανοιχτό) */
ion-accordion[aria-expanded="true"] .card {
  background: var(--cardOpen);
  border-color: var(--borderOpen);
}
ion-accordion[aria-expanded="true"] .card-content {
  background: var(--cardInnerOpen);
  border-top: 1px solid var(--innerBorderOpen);
}

/* Neutralize default ion-item borders */
ion-item::part(native){ border:none !important; --inner-border-width:0; --border-width:0; }

/* Utility */
.flex { display: flex; align-items: flex-start; gap: 6px; }

/* === THEME TOKENS === */
/* DARK */
.theme-dark {
  --bg: linear-gradient(180deg, #0A0E1A 0%, #10172A 100%);
  --text: #F5F7FA;
  --textSoft: #E8ECF2;
  --muted: rgba(245,247,250,0.7);

  --card: rgba(14,17,26,0.85);
  --cardInner: rgba(14,17,26,0.40);
  --border: rgba(255,255,255,0.12);
  --innerBorder: rgba(255,255,255,0.08);
  --borderHover: rgba(10,132,255,0.40);

  --cardOpen: rgba(35,45,70,0.95);
  --cardInnerOpen: rgba(35,45,70,0.90);
  --borderOpen: rgba(10,132,255,0.50);
  --innerBorderOpen: rgba(10,132,255,0.35);

  --btnBg: rgba(255,255,255,0.04);
  --btnBorder: rgba(255,255,255,0.25);
  background: var(--bg);
}

/* LIGHT */
.theme-light {
  --bg: linear-gradient(180deg, #FFFFFF 0%, #F2F6FF 100%);
  --text: #11181C;
  --textSoft: #2B3540;
  --muted: rgba(0,0,0,0.55);

  --card: rgba(255,255,255,0.90);
  --cardInner: rgba(255,255,255,0.65);
  --border: rgba(0,0,0,0.10);
  --innerBorder: rgba(0,0,0,0.06);
  --borderHover: rgba(10,132,255,0.45);

  --cardOpen: rgba(245,249,255,0.95);
  --cardInnerOpen: rgba(240,246,255,0.92);
  --borderOpen: rgba(10,132,255,0.55);
  --innerBorderOpen: rgba(10,132,255,0.35);

  --btnBg: rgba(10,14,26,0.03);
  --btnBorder: rgba(0,0,0,0.18);
  background: var(--bg);
}

/* Apply theme bg on frame */
.theme-dark, .theme-light { background: var(--bg); }
</style>