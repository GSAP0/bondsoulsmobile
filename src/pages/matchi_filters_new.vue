<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <PageHeader :disabled="loading" title="Ταίριαξέ με…"/>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <div v-if="loading" class="text-center">
        <ion-spinner></ion-spinner>
      </div>
      <template v-else>
        <div></div>
        <!-- Intro text -->
        <div class="mb-5">
          <p class="">
            Πώς ξεχωρίζει το προφίλ σου ανάμεσα στους υπόλοιπους
          </p>
        </div>

        <!-- Age range (index 0) -->
        <FilterSection
            title="Ηλικία του ατόμου που ψάχνω"
            :locked="isLocked('age')"
            @locked-click="showLockedToast"
        >
          <div class="range-labels">
            <span>Από {{ age[0] }}</span>
            <span>Έως {{ age[1] }}</span>
          </div>
          <DoubleRangeSlider
              :min="18"
              :max="80"
              :step="1"
              :value="age"
              :disabled="isLocked('age')"
              @update:value="age = $event"
          />
        </FilterSection>

        <!-- Distance (index 1) -->
        <FilterSection
            title="Μέγιστη απόσταση από μένα"
            :locked="isLocked('distance')"
            @locked-click="showLockedToast"
        >
          <div class="range-labels">
            <span></span>
            <span>{{ distance }} Km</span>
          </div>
          <SingleRangeSlider
              :min="1"
              :max="200"
              :step="1"
              :value="distance"
              :disabled="isLocked('distance')"
              @update:value="distance = $event"
          />
        </FilterSection>

        <!-- Height (index 2) -->
        <FilterSection
            title="Επιθυμητό ύψος του ατόμου που ψάχνω"
            :locked="isLocked('height')"
            @locked-click="showLockedToast"
        >
          <div class="range-labels">
            <span>Από {{ height[0] }} cm</span>
            <span>Έως {{ height[1] }} cm</span>
          </div>
          <DoubleRangeSlider
              :min="130"
              :max="220"
              :step="1"
              :value="height"
              :disabled="isLocked('height')"
              @update:value="height = $event"
          />
        </FilterSection>

        <!-- Weight -->
        <FilterSection
            title="Επιθυμητό βάρος του ατόμου που ψάχνω"
            :locked="isLocked('weight')"
            @locked-click="showLockedToast"
        >
          <div class="range-labels">
            <span>Από {{ weight[0] }} kg</span>
            <span>Έως {{ weight[1] }} kg</span>
          </div>
          <DoubleRangeSlider
              :min="40"
              :max="300"
              :step="5"
              :value="weight"
              :disabled="isLocked('weight')"
              @update:value="weight = $event"
          />
        </FilterSection>

        <!-- Has kids (index 3) -->
        <FilterSection
            title="Θέλετε το άτομο που ψάχνετε να έχει παιδιά;"
            :locked="isLocked('hasKids')"
            @locked-click="showLockedToast"
        >
          <FilterPillGroup
              class="my-3 py-2 px-1"
              v-model="hasKids"
              :disabled="isLocked('hasKids')"
          >
            <FilterPill text="Ναι" value="yes" :disabled="isLocked('hasKids')"/>
            <FilterPill text="Όχι" value="no" :disabled="isLocked('hasKids')"/>
            <FilterPill text="Αδιάφορο" value="any" :disabled="isLocked('hasKids')"/>
          </FilterPillGroup>
        </FilterSection>

        <!-- Has photo (index 4) -->
        <FilterSection
            title="Θέλετε το άτομο που ψάχνετε να έχει βάλει φωτό;"
            :locked="isLocked('hasPhoto')"
            @locked-click="showLockedToast"
        >
          <FilterPillGroup
              v-model="hasPhoto"
              :disabled="isLocked('hasPhoto')"
          >
            <FilterPill text="Ναι" value="yes" :disabled="isLocked('hasPhoto')"/>
            <FilterPill text="Όχι" value="no" :disabled="isLocked('hasPhoto')"/>
            <FilterPill text="Αδιάφορο" value="any" :disabled="isLocked('hasPhoto')"/>
          </FilterPillGroup>
        </FilterSection>

        <div style="height: 120px"></div>
      </template>
    </ion-content>

    <!-- CTA Bottom -->
    <ion-footer class="px-3 py-3 bg-transparent!" v-if="!loading">
      <ion-button
          expand="block"
          class=""
          @click="handleSearch"
      >
        <ion-icon slot="start" :icon="peopleOutline"></ion-icon>
        Ταίριαξέ με
      </ion-button>
    </ion-footer>

    <!-- Toast -->
    <ion-toast
        :is-open="showToast"
        :message="toastMsg"
        :duration="3000"
        position="bottom"
        @did-dismiss="showToast = false"
    ></ion-toast>
  </ion-page>
</template>

<script setup lang="ts">
import {ref, computed} from 'vue'
import {
  IonPage,
  IonContent,
  IonIcon,
  IonButton,
  IonToast,
  IonFooter,
  IonToolbar,
  IonHeader, IonSpinner, useIonRouter,
} from '@ionic/vue'
import {peopleOutline} from 'ionicons/icons'
import {useGlobal} from '@/composables/useGlobal'
import PageHeader from '@/components/PageHeader.vue'
import FilterSection from '@/components/FilterSection.vue'
import FilterPill from '@/components/FilterPill.vue'
import FilterPillGroup from '@/components/FilterPillGroup.vue'
import DoubleRangeSlider from '@/components/DoubleRangeSlider.vue'
import SingleRangeSlider from '@/components/SingleRangeSlider.vue'


const globalStore = useGlobal()
const {user} = globalStore

const router = useIonRouter()

if(user.value.active) router.replace('/searching')

const loading = ref(false)

// Determine tier from user subscriptions
const tier = computed<'free' | 'sub1' | 'sub2'>(() => {
  if (!user.value?.subscriptions || user.value.subscriptions.length === 0) {
    return 'free'
  }

  const activeSubscription = user.value.subscriptions.find((sub: any) => sub.active === true)

  if (!activeSubscription) {
    return 'free'
  }

  return activeSubscription.type as 'sub1' | 'sub2'
})

const age = ref([26, 59])
const distance = ref(50)
const height = ref([143, 217])
const weight = ref([50, 120])
const hasKids = ref<'yes' | 'no' | 'any'>('any')
const hasPhoto = ref<'yes' | 'no' | 'any'>('any')

const showToast = ref(false)
const toastMsg = ref('')

const isLocked = computed(() => (index: string): boolean => {
  const currentTier = tier.value
  const arr = []

  // Free users: only age (0) and distance (1) are unlocked
  if (currentTier === 'free') {
    arr.push('distance', 'age')
  }

  // Sub1 users: age (0), distance (1), height (2), kids (3) are unlocked
  if (currentTier === 'sub1') {
    arr.push('distance', 'age', 'height', 'weight')
  }

  if(currentTier === 'sub2'){
    arr.push('distance', 'age', 'height', 'weight', 'hasKids', 'hasPhoto')
  }

  return !arr.includes(index)
})

const showLockedToast = () => {
  toastMsg.value = '🔒 Κλειδωμένο φίλτρο — διαθέσιμο μόνο με συνδρομή'
  showToast.value = true
}

const handleSearch = async () => {
  const filters = {
    weight: weight.value,
    age: age.value,
    distance: distance.value,
    height: height.value,
    hasKids: hasKids.value,
    hasPhoto: hasPhoto.value,
  }

  loading.value = true

  try {
    await window.axios.post(`/user/match_me`, filters)
    await globalStore.loadUser()

    router.replace('/searching')
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }

}
</script>

<style scoped>
.range-labels {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #999;
  margin-bottom: 8px;
  font-weight: 400;
}

.cta-toolbar {
  --background: transparent;
  --padding-start: 16px;
  --padding-end: 16px;
  --padding-top: 12px;
  --padding-bottom: 12px;
}

.cta-button {
  --background: #ff2d55;
  --background-hover: #e62850;
  --background-activated: #cc2347;
  --border-radius: 27px;
  --box-shadow: 0 4px 16px rgba(255, 45, 85, 0.25);
  --color: #fff;
  --padding-start: 24px;
  --padding-end: 24px;
  font-weight: 700;
  font-size: 16px;
  height: 54px;
  margin: 0;
}

.cta-button ion-icon {
  font-size: 20px;
  margin-right: 4px;
}
</style>
