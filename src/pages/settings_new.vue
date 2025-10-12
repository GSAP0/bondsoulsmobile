<script setup lang="ts">
import { ref, onMounted } from 'vue';
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
const title = 'Ρυθμίσεις';

const userIsPaid = ref(false);
const showPaywall = ref(false);
const payItem = ref<string | null>(null);

interface SettingItem {
  key: string;
  title: string;
  requiresPaid?: boolean;
}

const settingsItems: SettingItem[] = [
  { key: 'plans', title: 'Πακέτα subscription', requiresPaid: false },
  { key: 'interests', title: 'Ενδιαφέροντα', requiresPaid: true },
  { key: 'bio', title: 'Σχετικά με εμένα', requiresPaid: true },
  { key: 'invite', title: 'Προσκάλεσε φίλους', requiresPaid: false },
  { key: 'location', title: 'Τοποθεσία', requiresPaid: true },
  { key: 'username', title: 'Επεξεργασία Username', requiresPaid: true },
];

onMounted(() => {
  console.assert(
    settingsItems.every((i) => typeof i.title === 'string' && i.title.trim().length > 0),
    'Κενός/μη έγκυρος τίτλος ρύθμισης'
  );
  const uniq = new Set(settingsItems.map((i) => i.key));
  console.assert(uniq.size === settingsItems.length, 'Duplicate keys in settingsItems');
});

const onStub = (name: string) => {
  alert(name);
};

const triggerPaywall = (itemTitle: string) => {
  payItem.value = itemTitle;
  showPaywall.value = true;
};

const handleItemClick = (item: SettingItem) => {
  if (item.requiresPaid && !userIsPaid.value) {
    triggerPaywall(item.title);
    return;
  }
  onStub(item.title);
};

const handleBack = () => {
  alert('back');
};

const closePaywall = () => {
  showPaywall.value = false;
};

const viewPlans = () => {
  showPaywall.value = false;
  onStub('Πακέτα subscription');
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
          <div class="overflow-y-auto h-full pb-6">
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

            <!-- Settings items -->
            <div class="mx-3">
              <button
                v-for="item in settingsItems"
                :key="item.key"
                type="button"
                @click="handleItemClick(item)"
                class="w-full rounded-3xl p-3.5 flex items-center justify-between mb-3 cursor-pointer text-left"
                :style="{
                  background: item.key === 'plans'
                    ? `linear-gradient(90deg, ${brand.accent} 0%, #ff6685 100%)`
                    : (dark ? '#0E111A' : '#FFFFFF'),
                  border: item.key === 'plans'
                    ? `1px solid ${brand.accent}`
                    : (dark ? '1px solid rgba(255,255,255,0.10)' : '1px solid rgba(0,0,0,0.10)'),
                  boxShadow: item.key === 'plans' ? '0 0 15px rgba(255,45,85,0.3)' : 'none',
                }"
              >
                <div
                  class="text-[15px] font-bold"
                  :style="{
                    color: item.key === 'plans' ? '#fff' : (dark ? brand.textDark : brand.textLight)
                  }"
                >
                  {{ item.title }}
                </div>
                <span
                  aria-hidden="true"
                  class="text-lg"
                  :style="{
                    opacity: item.key === 'plans' ? 1 : 0.65,
                    color: item.key === 'plans' ? '#fff' : undefined,
                  }"
                >
                  ›
                </span>
              </button>
            </div>
          </div>

          <!-- Paywall modal -->
          <div
            v-if="showPaywall"
            class="absolute inset-0 flex items-center justify-center p-4"
            style="background: rgba(0,0,0,0.45)"
          >
            <div
              class="w-80 rounded-[20px]"
              :style="{
                background: dark ? '#0E111A' : '#FFFFFF',
                border: dark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.1)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.45)',
              }"
            >
              <div class="p-[18px]">
                <div
                  class="font-extrabold text-base mb-1.5"
                  :style="{ color: dark ? brand.textDark : brand.textLight }"
                >
                  Απαραίτητη συνδρομή
                </div>
                <div class="text-sm opacity-85 leading-[1.4]">
                  Η λειτουργία «{{ payItem }}» είναι διαθέσιμη με συνδρομητικό πακέτο. Αναβάθμισε για να την ξεκλειδώσεις και να συνεχίσεις.
                </div>
              </div>
              <div
                class="flex gap-2 p-3"
                :style="{
                  borderTop: dark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
                }"
              >
                <button
                  @click="closePaywall"
                  class="flex-1 h-10 rounded-xl font-bold cursor-pointer"
                  :style="{
                    border: dark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.12)',
                    background: 'transparent',
                    color: dark ? brand.textDark : brand.textLight,
                  }"
                >
                  Άκυρο
                </button>
                <button
                  @click="viewPlans"
                  class="flex-1 h-10 rounded-xl border-0 text-white font-extrabold cursor-pointer"
                  :style="{ background: brand.accent }"
                >
                  Δες πακέτα
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </IonContent>
  </IonPage>
</template>
