<script setup lang="ts">
import { ref, computed } from 'vue';
import { IonPage, IonContent } from '@ionic/vue';

const brand = {
  primary: '#0A84FF',
  accent: '#FF2D55',
  bgLight: '#F2F2F7',
  bgDark: '#0A0E1A',
  textLight: '#11181C',
  textDark: '#F5F7FA',
};

const dark = ref(true);
const title = 'Φίλτρα αναζήτησης';

// Filter state
const ageMin = ref(25);
const ageMax = ref(35);
const distance = ref(50);
const showOnlyWithPhoto = ref(true);
const showOnlyVerified = ref(false);

interface GenderOption {
  key: string;
  label: string;
  selected: boolean;
}

const genderOptions = ref<GenderOption[]>([
  { key: 'men', label: 'Άνδρες', selected: true },
  { key: 'women', label: 'Γυναίκες', selected: false },
  { key: 'all', label: 'Όλοι', selected: false },
]);

const selectedGender = computed(() => {
  const selected = genderOptions.value.find(g => g.selected);
  return selected?.label || 'Όλοι';
});

const toggleGender = (key: string) => {
  genderOptions.value.forEach(g => {
    g.selected = g.key === key;
  });
};

const handleBack = () => {
  alert('back');
};

const handleApplyFilters = () => {
  const filters = {
    ageMin: ageMin.value,
    ageMax: ageMax.value,
    distance: distance.value,
    gender: genderOptions.value.find(g => g.selected)?.key,
    onlyWithPhoto: showOnlyWithPhoto.value,
    onlyVerified: showOnlyVerified.value,
  };
  console.log('Applying filters:', filters);
  alert('Φίλτρα εφαρμόστηκαν!');
};

const handleReset = () => {
  ageMin.value = 18;
  ageMax.value = 50;
  distance.value = 50;
  showOnlyWithPhoto.value = false;
  showOnlyVerified.value = false;
  genderOptions.value.forEach(g => {
    g.selected = g.key === 'all';
  });
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
          <div class="overflow-y-auto h-full pb-24">
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
            <div class="mx-3 space-y-3">
              <!-- Age Range -->
              <div
                class="rounded-3xl p-4"
                :style="{
                  background: dark ? '#0E111A' : '#FFFFFF',
                  border: dark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)',
                }"
              >
                <div class="text-xs opacity-60 mb-3">ΗΛΙΚΙΑ</div>
                <div class="flex justify-between items-center mb-3">
                  <div class="text-[15px] font-semibold">
                    {{ ageMin }} - {{ ageMax }} χρονών
                  </div>
                </div>

                <!-- Age Min Slider -->
                <div class="mb-3">
                  <label class="text-sm opacity-75 block mb-2">Από</label>
                  <div class="relative">
                    <input
                      type="range"
                      v-model.number="ageMin"
                      min="18"
                      max="80"
                      class="w-full h-2 rounded-full appearance-none cursor-pointer"
                      :style="{
                        background: `linear-gradient(to right, ${brand.accent} 0%, ${brand.accent} ${((ageMin - 18) / 62) * 100}%, ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'} ${((ageMin - 18) / 62) * 100}%, ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'} 100%)`,
                      }"
                    />
                  </div>
                </div>

                <!-- Age Max Slider -->
                <div>
                  <label class="text-sm opacity-75 block mb-2">Έως</label>
                  <div class="relative">
                    <input
                      type="range"
                      v-model.number="ageMax"
                      min="18"
                      max="80"
                      class="w-full h-2 rounded-full appearance-none cursor-pointer"
                      :style="{
                        background: `linear-gradient(to right, ${brand.primary} 0%, ${brand.primary} ${((ageMax - 18) / 62) * 100}%, ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'} ${((ageMax - 18) / 62) * 100}%, ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'} 100%)`,
                      }"
                    />
                  </div>
                </div>
              </div>

              <!-- Distance -->
              <div
                class="rounded-3xl p-4"
                :style="{
                  background: dark ? '#0E111A' : '#FFFFFF',
                  border: dark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)',
                }"
              >
                <div class="text-xs opacity-60 mb-3">ΑΠΟΣΤΑΣΗ</div>
                <div class="flex justify-between items-center mb-3">
                  <div class="text-[15px] font-semibold">
                    Μέχρι {{ distance }} χλμ
                  </div>
                </div>

                <div class="relative">
                  <input
                    type="range"
                    v-model.number="distance"
                    min="1"
                    max="200"
                    class="w-full h-2 rounded-full appearance-none cursor-pointer"
                    :style="{
                      background: `linear-gradient(to right, ${brand.primary} 0%, ${brand.primary} ${(distance / 200) * 100}%, ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'} ${(distance / 200) * 100}%, ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'} 100%)`,
                    }"
                  />
                </div>
              </div>

              <!-- Gender -->
              <div
                class="rounded-3xl p-4"
                :style="{
                  background: dark ? '#0E111A' : '#FFFFFF',
                  border: dark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)',
                }"
              >
                <div class="text-xs opacity-60 mb-3">ΦΥΛΟ</div>
                <div class="flex gap-2">
                  <button
                    v-for="option in genderOptions"
                    :key="option.key"
                    @click="toggleGender(option.key)"
                    class="flex-1 h-10 rounded-xl border-0 cursor-pointer font-semibold text-sm"
                    :style="{
                      background: option.selected ? brand.accent : (dark ? '#0B0E16' : '#F5F6FA'),
                      color: option.selected ? '#fff' : (dark ? '#c7c7cc' : '#424245'),
                    }"
                  >
                    {{ option.label }}
                  </button>
                </div>
              </div>

              <!-- Additional Filters -->
              <div
                class="rounded-3xl p-4"
                :style="{
                  background: dark ? '#0E111A' : '#FFFFFF',
                  border: dark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)',
                }"
              >
                <div class="text-xs opacity-60 mb-3">ΕΠΙΠΛΕΟΝ ΦΙΛΤΡΑ</div>

                <!-- Show only with photo -->
                <div class="flex items-center justify-between py-2">
                  <div class="text-[15px]">Μόνο με φωτογραφία</div>
                  <button
                    @click="showOnlyWithPhoto = !showOnlyWithPhoto"
                    class="relative w-12 h-7 rounded-full transition-colors border-0 cursor-pointer"
                    :style="{
                      background: showOnlyWithPhoto ? brand.accent : (dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'),
                    }"
                  >
                    <div
                      class="absolute top-1 w-5 h-5 bg-white rounded-full transition-transform"
                      :style="{
                        transform: showOnlyWithPhoto ? 'translateX(22px)' : 'translateX(2px)',
                      }"
                    />
                  </button>
                </div>

                <!-- Show only verified -->
                <div class="flex items-center justify-between py-2">
                  <div class="text-[15px]">Μόνο επαληθευμένους</div>
                  <button
                    @click="showOnlyVerified = !showOnlyVerified"
                    class="relative w-12 h-7 rounded-full transition-colors border-0 cursor-pointer"
                    :style="{
                      background: showOnlyVerified ? brand.accent : (dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'),
                    }"
                  >
                    <div
                      class="absolute top-1 w-5 h-5 bg-white rounded-full transition-transform"
                      :style="{
                        transform: showOnlyVerified ? 'translateX(22px)' : 'translateX(2px)',
                      }"
                    />
                  </button>
                </div>
              </div>

              <!-- Reset Button -->
              <button
                @click="handleReset"
                class="w-full h-12 rounded-2xl font-semibold text-[15px] cursor-pointer"
                :style="{
                  border: dark ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(0,0,0,0.15)',
                  background: 'transparent',
                  color: dark ? brand.textDark : brand.textLight,
                }"
              >
                Επαναφορά φίλτρων
              </button>
            </div>
          </div>

          <!-- Apply Button (fixed at bottom) -->
          <div
            class="absolute bottom-0 left-0 right-0 p-5"
            :style="{
              background: `linear-gradient(to top, ${dark ? '#0a0e1a' : '#fff'} 70%, transparent)`,
            }"
          >
            <button
              @click="handleApplyFilters"
              class="w-full h-12 rounded-full border-0 text-white font-bold text-base cursor-pointer"
              :style="{
                background: brand.accent,
                boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
              }"
            >
              Εφαρμογή φίλτρων
            </button>
          </div>
        </div>
      </div>
    </IonContent>
  </IonPage>
</template>

<style scoped>
/* Custom slider styling */
input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

input[type="range"]::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

input[type="range"]:focus {
  outline: none;
}
</style>