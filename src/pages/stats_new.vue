<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { IonPage, IonContent } from '@ionic/vue';

const brand = {
  primary: '#0A84FF',
  accent: '#FF2D55',
  bgLight: '#F2F2F7',
  bgDark: '#0A0E1A',
  textLight: '#11181C',
  textDark: '#F5F7FA',
};

interface StatItem {
  label: string;
  score: number;
}

async function fetchCategory(category: string): Promise<StatItem[]> {
  const data =
    category === 'axes'
      ? [
          { label: 'Εξωστρέφεια', score: 0.05 },
          { label: 'Σταθερότητα', score: 0.3 },
          { label: 'Δεκτικότητα', score: 0.6 },
          { label: 'Συνειδητότητα', score: -0.05 },
          { label: 'Συνεργατικότητα', score: -0.3 },
          { label: 'Αυτοέλεγχος', score: -0.6 },
        ]
      : [
          { label: 'Αλτρουισμός', score: 0.25 },
          { label: 'Ειλικρίνεια', score: -0.25 },
          { label: 'Εμπιστοσύνη', score: 0.4 },
          { label: 'Οικογένεια', score: -0.4 },
          { label: 'Φροντίδα', score: 0.1 },
        ];

  await new Promise((r) => setTimeout(r, 150));
  return data;
}

const dark = ref(true);
const tab = ref('values');
const rows = ref<StatItem[]>([]);
const title = 'Το προφίλ μου';

// Helper functions for StatRow
const getTextColor = computed(() => (dark.value ? brand.textDark : brand.textLight));
const getRailColor = computed(() => (dark.value ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'));
const getMidColor = computed(() => (dark.value ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'));

const getBarStyle = (score: number) => {
  const safe = Math.max(-0.5, Math.min(0.5, score)); // clamp between -50% to +50%
  const leftColor = brand.accent;
  const rightColor = brand.primary;

  return {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    width: `${Math.abs(safe) * 100}%`,
    borderRadius: '999px',
    background:
      safe >= 0
        ? `linear-gradient(90deg, ${rightColor}, ${brand.accent})`
        : `linear-gradient(90deg, ${leftColor}, ${brand.accent})`,
    transformOrigin: safe >= 0 ? 'left' : 'right',
    transform: safe >= 0 ? 'translateX(0)' : 'translateX(-100%)',
  };
};

const loadData = async () => {
  const data = await fetchCategory(tab.value);
  rows.value = data;
};

onMounted(() => {
  loadData();
});

watch(tab, () => {
  rows.value = [];
  loadData();
});

const handleBack = () => {
  alert('back');
};
</script>

<template>
  <IonPage>
    <IonContent :fullscreen="true" :scroll-y="false">
      <div
        class="min-h-screen flex justify-center items-center p-6"
        :style="{
          background: dark ? brand.bgDark : brand.bgLight,
          color: dark ? brand.textDark : brand.textLight,
        }"
      >
        <!-- Phone mockup container -->
        <div
          class="w-[380px] h-[780px] rounded-[44px] overflow-hidden relative"
          :style="{
            boxShadow: '0 25px 60px rgba(0,0,0,.4)',
            background: dark ? '#0a0e1a' : '#fff',
          }"
        >
          <!-- Scrollable content -->
          <div class="overflow-y-auto h-full pb-10">
            <!-- Header -->
            <div class="flex items-center gap-2.5 px-4 py-3.5">
              <button
                @click="handleBack"
                class="bg-transparent border-0 text-xl"
                :style="{ color: dark ? brand.textDark : brand.textLight }"
              >
                ‹
              </button>
              <div class="font-bold text-lg">{{ title }}</div>
            </div>

            <!-- Content -->
            <div class="mx-3">
              <div
                class="rounded-3xl p-3"
                :style="{
                  background: dark ? '#0E111A' : '#FFFFFF',
                  border: dark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)',
                }"
              >
                <!-- Title -->
                <div
                  class="text-center font-bold text-base py-2 pb-3 px-2"
                  :style="{ color: dark ? brand.textDark : brand.textLight }"
                >
                  Πώς ξεχωρίζει το προφίλ σου ανάμεσα στους υπόλοιπους
                </div>

                <!-- Tab buttons -->
                <div
                  class="grid grid-cols-2 gap-2 p-2 rounded-2xl"
                  :style="{
                    background: dark ? '#0B0E16' : '#F5F6FA',
                  }"
                >
                  <button
                    @click="tab = 'axes'"
                    class="h-10 rounded-xl border-0 cursor-pointer font-bold"
                    :style="{
                      background: tab === 'axes' ? brand.accent : 'transparent',
                      color: tab === 'axes' ? '#fff' : dark ? '#c7c7cc' : '#424245',
                    }"
                  >
                    Άξονες
                  </button>
                  <button
                    @click="tab = 'values'"
                    class="h-10 rounded-xl border-0 cursor-pointer font-bold"
                    :style="{
                      background: tab === 'values' ? brand.accent : 'transparent',
                      color: tab === 'values' ? '#fff' : dark ? '#c7c7cc' : '#424245',
                    }"
                  >
                    Αξίες
                  </button>
                </div>

                <!-- Stats rows -->
                <div class="py-2 pb-4 px-2">
                  <!-- Loading state -->
                  <div v-if="rows.length === 0" class="opacity-70 text-sm p-4">
                    Φόρτωση…
                  </div>

                  <!-- StatRow items -->
                  <div
                    v-for="(row, i) in rows"
                    :key="row.label + i"
                    class="grid items-center gap-3 py-2.5"
                    style="grid-template-columns: 1fr 10px 1fr"
                  >
                    <!-- Label -->
                    <div class="text-[15px]" :style="{ color: getTextColor }">
                      {{ row.label }}
                    </div>

                    <!-- Midline -->
                    <div class="relative w-[10px] h-6">
                      <div
                        class="absolute left-1 top-0 bottom-0 w-0.5 rounded-sm"
                        :style="{ background: getMidColor }"
                      />
                    </div>

                    <!-- Rail with bar -->
                    <div
                      class="relative h-2 rounded-full overflow-hidden"
                      :style="{ background: getRailColor }"
                    >
                      <div :style="getBarStyle(row.score)" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </IonContent>
  </IonPage>
</template>
