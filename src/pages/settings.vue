<!-- SettingsScreen.vue -->
<template>
  <ion-page>
    <ion-header>
      <PageHeader :title="title" default-href="/dashboard" />
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding" :class="store.themeClass">

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
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, computed } from 'vue';
import { IonPage, IonContent, IonToggle , IonHeader} from '@ionic/vue';
import {useGlobal} from "@/composables/useGlobal.js";
import PageHeader from '@/components/PageHeader.vue';

const title = 'Ρυθμίσεις';
const userIsPaid = false;

const store = useGlobal()

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