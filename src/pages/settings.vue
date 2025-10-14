<!-- SettingsScreen.vue -->
<template>
  <ion-page>
    <ion-content :fullscreen="true" class="ion-padding ">
      <div class="" :class="store.themeClass">
        <div class="">
          <div class="">
            <div class="">
              <PageHeader :title="title" default-href="/dashboard" />

              <!-- Settings List (με theme ως γραμμή) -->
              <div class="list">
                <!-- Plans highlight -->
                <button
                    v-for="item in listWithTheme"
                    :key="item.key"
                    type="button"
                    @click="onRowClick(item)"
                    class="row"
                    :class="{
                    plans: item.key === 'plans',
                    locked: item.requiresPaid && !userIsPaid,
                    control: item.key === 'theme'
                  }"
                    :aria-disabled="item.key === 'theme' ? 'true' : undefined"
                >
                  <div class="row-title">{{ item.title }}</div>

                  <!-- Right side: είτε arrow είτε toggle είτε lock -->
                  <div class="row-right">
                    <template v-if="item.key === 'theme'">
                      <ion-toggle
                          :checked="store.currentTheme === 'dark'"
                          @ionChange="toggleTheme"
                          class="toggle"
                      />
                    </template>

                    <template v-else>
                      <span v-if="item.requiresPaid && !userIsPaid" class="lock" aria-hidden="true">🔒</span>
                      <span v-else class="row-arrow">›</span>
                    </template>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Paywall -->
        <div v-if="showPaywall" class="overlay">
          <div class="sheet" :class="store.currentTheme">
            <div class="sheet-body">
              <div class="sheet-title">Απαραίτητη συνδρομή</div>
              <div class="sheet-text">
                Η λειτουργία «{{ payItem }}» είναι διαθέσιμη με συνδρομητικό πακέτο.
                Αναβάθμισε για να τη ξεκλειδώσεις και να συνεχίσεις.
              </div>
            </div>
            <div class="sheet-actions" :class="store.currentTheme">
              <button class="btn-outline" @click="showPaywall = false">Άκυρο</button>
              <button class="btn-accent" @click="goPlans">Δες πακέτα</button>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, computed } from 'vue';
import { IonPage, IonContent, IonToggle } from '@ionic/vue';
import {useGlobalStore} from "@/stores/globalStore.js";
import PageHeader from '@/components/PageHeader.vue';

const title = 'Ρυθμίσεις';
const userIsPaid = false;

const store = useGlobalStore()

const toggleTheme = (ev) => {
  store.currentTheme = !!ev.detail.checked ? 'dark' : 'light';
};

const showPaywall = ref(false);
const payItem = ref(null);

const settingsItems = [
  { key: 'plans', title: 'Πακέτα subscription' },
  { key: 'invite', title: 'Προσκάλεσε φίλους' },
  { key: 'interests', title: 'Ενδιαφέροντα', requiresPaid: true },
  { key: 'bio', title: 'Σχετικά με εμένα', requiresPaid: true },
  { key: 'location', title: 'Τοποθεσία', requiresPaid: true },
  { key: 'username', title: 'Επεξεργασία Username', requiresPaid: true },
];

// Προσθήκη theme ως κανονική γραμμή στη λίστα (μετά τα plans)
const listWithTheme = computed(() => {
  const arr = [...settingsItems];
  const themeRow = { key: 'theme', title: 'Dark mode' };
  // βάλε στη 2η θέση αν υπάρχει plans πρώτο
  const plansIdx = arr.findIndex(i => i.key === 'invite');
  if (plansIdx >= 0) arr.splice(plansIdx + 1, 0, themeRow);
  else arr.unshift(themeRow);
  return arr;
});

const onStub = (name) => alert(name);
const triggerPaywall = (title) => { payItem.value = title; showPaywall.value = true; };

const onRowClick = (item) => {
  if (item.key === 'theme') return; // δεν είναι clickable
  if (item.requiresPaid && !userIsPaid) { triggerPaywall(item.title); return; }
  if (item.key === 'plans') { onStub('Πακέτα subscription'); return; }
  onStub(item.title);
};

const goPlans = () => { showPaywall.value = false; onStub('Πακέτα subscription'); };
</script>

<style scoped>

.row {
  width: 100%;
  border-radius: 24px;
  padding: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  cursor: pointer;
  text-align: left;
  background: var(--rowBg);
  border: 1px solid var(--rowBorder);
  transition: border-color .2s ease, transform .05s ease, opacity .2s ease;
}
.row.control { cursor: default; } /* theme line */
.row:active { transform: translateY(1px); }
.row-title { font-size: 15px; font-weight: 700; color: var(--rowText); }
.row-right { display: flex; align-items: center; gap: 8px; }
.row-arrow { font-size: 18px; opacity: .65; color: var(--rowIcon); }
.toggle-label { font-size: 12px; color: var(--muted); }
.toggle { --handle-background: var(--text); }

/* Locked state */
.row.locked {
  opacity: 0.5;
  filter: grayscale(15%);
  position: relative;
}
.row.locked .row-title { pointer-events: none; }
.lock { font-size: 16px; opacity: 0.9; }

/* Plans highlight */
.row.plans {
  background: linear-gradient(90deg, #FF2D55 0%, #ff6685 100%);
  border: 1px solid #FF2D55;
  box-shadow: 0 0 15px rgba(255,45,85,0.30);
}
.row.plans .row-title,
.row.plans .row-arrow { color: #fff; opacity: 1; }

/* Paywall */
.overlay {
  position: absolute; inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex; align-items: center; justify-content: center;
  padding: 16px;
}
.sheet {
  width: 320px; border-radius: 20px; overflow: hidden;
  box-shadow: 0 20px 40px rgba(0,0,0,0.45);
  border: 1px solid var(--sheetBorder);
  background: var(--sheetBg);
}
.sheet.dark { --sheetBg:#0E111A; --sheetBorder:rgba(255,255,255,0.12); }
.sheet.light { --sheetBg:#FFFFFF; --sheetBorder:rgba(0,0,0,0.10); }
.sheet-body { padding: 18px; }
.sheet-title { font-weight: 800; font-size: 16px; margin-bottom: 6px; color: var(--text); }
.sheet-text { font-size: 14px; opacity: .85; line-height: 1.4; color: var(--textSoft); }
.sheet-actions { display: flex; gap: 8px; padding: 12px; border-top: 1px solid var(--sheetBorderTop); }
.sheet-actions.dark { --sheetBorderTop: rgba(255,255,255,0.08); }
.sheet-actions.light { --sheetBorderTop: rgba(0,0,0,0.08); }
.btn-outline {
  flex: 1; height: 40px; border-radius: 12px;
  border: 1px solid var(--sheetBorderTop); background: transparent;
  color: var(--text); font-weight: 700; cursor: pointer;
}
.btn-accent {
  flex: 1; height: 40px; border-radius: 12px; border: 0;
  background: #FF2D55; color: #fff; font-weight: 800; cursor: pointer;
}

/* Themes */
.theme-dark {
  --bg: linear-gradient(180deg, #0A0E1A 0%, #10172A 100%);
  --text: #F5F7FA;
  --textSoft: #E8ECF2;
  --muted: rgba(245,247,250,0.7);

  --rowBg: #0E111A;
  --rowBorder: rgba(255,255,255,0.10);
  --rowText: #F5F7FA;
  --rowIcon: #F5F7FA;

  background: var(--bg);
  color: var(--text);
}
.theme-light {
  --bg: linear-gradient(180deg, #FFFFFF 0%, #F2F6FF 100%);
  --text: #11181C;
  --textSoft: #2B3540;
  --muted: rgba(0,0,0,0.55);

  --rowBg: #FFFFFF;
  --rowBorder: rgba(0,0,0,0.10);
  --rowText: #11181C;
  --rowIcon: #11181C;

  background: var(--bg);
  color: var(--text);
}

/* Apply theme background */
.theme-dark, .theme-light { background: var(--bg); }
</style>