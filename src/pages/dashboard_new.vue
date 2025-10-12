<script setup lang="ts">
import {ref, computed} from 'vue';
import {IonPage, IonContent} from '@ionic/vue';

const brand = {
  primary: '#0A84FF',
  accent: '#FF2D55',
  bgLight: '#F2F2F7',
  bgDark: '#0A0E1A',
  textLight: '#11181C',
  textDark: '#F5F7FA',
};

const sizes = {
  cardWidth: 380,
  cardHeight: 780,
  cardRadius: 44,
  badgeSize: 32,
  headerImageHeight: 236,
  ratingBadgeSize: 44,
};

interface Badge {
  name: string;
  active: boolean;
}

const dark = ref(true);

const profile = ref({
  photo: 'https://i.pravatar.cc/300?img=64',
  nickname: 'EDuS2613',
  age: 35,
  city: 'Αθήνα',
  rating: 5,
  tes: 0.82,
  about: 'Λογιστική αλήθεια, ψυχολογική περιέργεια. Κουβέντα με νόημα, όχι θόρυβο.',
  nextQuestions: 6,
  badges: [
    {name: 'Φωτογραφία', active: true},
    {name: 'Υποστηρικτής', active: true},
    {name: 'Ερωτήσεις', active: false},
  ],
});

const tesPct = computed(() =>
    Math.round(Math.max(0, Math.min(1, profile.value.tes)) * 100)
);

const getBadgeIcon = (badgeName: string) => {
  if (badgeName === 'Φωτογραφία') {
    return `<svg width="16" height="16" fill="currentColor" stroke="none" viewBox="0 0 24 24">
      <path d="M4 7h3l2-3h6l2 3h3a1 1 0 011 1v11a1 1 0 01-1 1H4a1 1 0 01-1-1V8a1 1 0 011-1z" />
      <circle cx="12" cy="13" r="3" />
    </svg>`;
  }
  if (badgeName === 'Υποστηρικτής') {
    return `<svg width="16" height="16" fill="currentColor" stroke="none" viewBox="0 0 24 24">
      <path d="M12 2l3 7h7l-5.5 4.5L18 22l-6-3.5L6 22l1.5-8.5L2 9h7l3-7z" />
    </svg>`;
  }
  if (badgeName === 'Ερωτήσεις') {
    return `<svg width="16" height="16" fill="currentColor" stroke="none" viewBox="0 0 24 24">
      <path d="M12 18h.01M12 14a4 4 0 10-4-4 4 4 0 004 4z" />
      <path d="M2 12a10 10 0 1120 0 10 10 0 01-20 0z" />
    </svg>`;
  }
  return '';
};

const onInviteClick = () => alert('Invite flow ανοίγει εδώ (mock)');
const onFindMatch = () => alert('Αναζήτηση ταιριάσματος (mock)');
</script>

<template>
  <IonPage>
    <IonContent :fullscreen="true" :scroll-y="false" class="--ion-padding">
      <div
          class=""
          :style="{
          background: dark ? brand.bgDark : brand.bgLight,
          color: dark ? brand.textDark : brand.textLight,
        }"
      >

        <!-- Scrollable content -->
        <div class="pb-[120px]">
          <!-- Header with photo -->
          <div class="relative">
            <img
                :src="profile.photo"
                alt="Profile"
                class="w-full object-cover"
                :style="{ height: `${sizes.headerImageHeight}px` }"
            />
            <!-- Rating badge -->
            <div
                class="flex items-center justify-center font-extrabold text-sm absolute"
                :style="{
                  width: `${sizes.ratingBadgeSize}px`,
                  height: `${sizes.ratingBadgeSize}px`,
                  borderRadius: `${sizes.ratingBadgeSize / 2}px`,
                  border: '1.5px solid #FF2D55',
                  background: dark ? '#0A0E1A' : '#fff',
                  color: '#FF2D55',
                  right: '16px',
                  top: '280px',
                }"
            >
              <span aria-hidden="true" class="mr-0.5">★</span>
              <span>{{ profile.rating }}</span>
            </div>
          </div>

          <!-- User info section -->
          <div class="px-5 py-4">
            <!-- Name -->
            <div class="text-xl font-bold">{{ profile.nickname }}</div>

            <!-- Location & Age -->
            <div class="text-sm opacity-80 mt-1">
              📍 {{ profile.city }} • {{ profile.age }} χρονών
            </div>

            <!-- Badges -->
            <div class="flex gap-2.5 mt-2.5">
              <div
                  v-for="(badge, i) in profile.badges"
                  :key="i"
                  class="inline-flex items-center justify-center rounded-full"
                  :style="{
                    width: `${sizes.badgeSize}px`,
                    height: `${sizes.badgeSize}px`,
                    border: `1.5px solid ${badge.active ? 'rgba(255,45,85,0.9)' : 'rgba(255,255,255,0.25)'}`,
                    background: badge.active ? 'rgba(255,45,85,0.25)' : 'transparent',
                    color: badge.active ? '#FF2D55' : '#666',
                  }"
                  v-html="getBadgeIcon(badge.name)"
              />
            </div>

            <!-- TES Bar -->
            <div class="mt-3.5">
              <div class="flex justify-between text-xs opacity-85 mb-1.5">
                <span>TES</span>
              </div>
              <div
                  class="h-2 w-full rounded-lg"
                  style="background: rgba(10,132,255,0.15)"
              >
                <div
                    class="h-2 rounded-lg"
                    :style="{
                      width: `${tesPct}%`,
                      background: `linear-gradient(90deg, ${brand.primary}, ${brand.accent})`,
                    }"
                />
              </div>
            </div>

            <!-- Bio -->
            <div class="mt-3.5 text-[15.5px] opacity-92">
              {{ profile.about }}
            </div>

            <!-- Invite Banner -->
            <div
                class="mt-5 rounded-2xl p-4 flex justify-between items-center"
                style="background: #11141F; border: 1px solid rgba(255,255,255,0.1)"
            >
              <div class="text-sm leading-[1.4]">
                <div class="font-semibold text-white">
                  Κέρδισε boost προσκαλώντας φίλους
                </div>
                <div class="opacity-70 text-[13px]">
                  Πρόσκληση = αύξηση ορατότητας
                </div>
              </div>
              <button
                  @click="onInviteClick"
                  class="rounded-[20px] px-3.5 py-2 text-sm font-semibold cursor-pointer border-0"
                  :style="{ background: brand.accent, color: 'white' }"
                  aria-label="Πρόσκληση φίλων"
              >
                Πρόσκληση
              </button>
            </div>

            <!-- Menu Sections -->
            <div class="mt-6">
              <!-- Statistics Section -->
              <div class="mb-3">
                <div class="text-xs opacity-60 mb-1.5">ΣΤΑΤΙΣΤΙΚΑ</div>
                <div
                    class="rounded-2xl p-3.5 flex justify-between items-center"
                    style="background: #0E111A; border: 1px solid rgba(255,255,255,0.1)"
                >
                  <div>
                    <div class="text-[15px] font-semibold">Το προφίλ μου</div>
                    <div class="text-[13px] opacity-70">
                      Δες το ψυχολογικό σου προφίλ
                    </div>
                  </div>
                  <div class="opacity-60">›</div>
                </div>
              </div>

              <!-- Questionnaire Section -->
              <div class="mb-3">
                <div class="text-xs opacity-60 mb-1.5">ΕΡΩΤΗΜΑΤΟΛΟΓΙΟ</div>
                <div
                    class="rounded-2xl p-3.5 flex justify-between items-center"
                    style="background: #0E111A; border: 1px solid rgba(255,255,255,0.1)"
                >
                  <div>
                    <div class="text-[15px] font-semibold">Επόμενες ερωτήσεις</div>
                    <div class="text-[13px] opacity-70">
                      {{ profile.nextQuestions }} απομένουν
                    </div>
                  </div>
                  <div class="opacity-60">›</div>
                </div>
              </div>

              <!-- Settings Section -->
              <div class="mb-3">
                <div class="text-xs opacity-60 mb-1.5">ΡΥΘΜΙΣΕΙΣ & ΒΟΗΘΕΙΑ</div>
                <div
                    class="rounded-2xl p-3.5 flex justify-between items-center"
                    style="background: #0E111A; border: 1px solid rgba(255,255,255,0.1)"
                >
                  <div>
                    <div class="text-[15px] font-semibold">Ρυθμίσεις</div>
                  </div>
                  <div class="opacity-60">›</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- CTA Bottom Button -->
        <button
            @click="onFindMatch"
            class="absolute rounded-full overflow-hidden text-center text-white font-semibold text-base cursor-pointer border-0"
            :style="{
              left: '50%',
              transform: 'translateX(-50%)',
              bottom: '20px',
              width: `${sizes.cardWidth - 40}px`,
              border: '1px solid rgba(255,255,255,0.15)',
              background: brand.accent,
              boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
              padding: '12px 0',
            }"
            aria-label="Βρες ταίριασμα"
        >
          🔍 Βρες Ταίριασμα
        </button>
      </div>
    </IonContent>
  </IonPage>
</template>
