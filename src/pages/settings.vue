<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/dashboard"></ion-back-button>
        </ion-buttons>
        <ion-title>Ρυθμίσεις</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">

      <!-- Interests & Bio Section -->
      <div class="section-container">
        <div class="section-header">ΕΝΔΙΑΦΕΡΟΝΤΑ & ΒΙΟΓΡΑΦΙΚΟ</div>
        <ion-item-divider></ion-item-divider>
        <ion-list lines="full">
          <ion-item button @click="$router.push('/interests')">
            <ion-icon :icon="sparklesOutline" slot="start"/>
            <ion-label class="ml-2">
              <h2>Ενδιαφέροντα</h2>
              <p>{{ interestsCount }} ενδιαφέροντα</p>
            </ion-label>
          </ion-item>
          <ion-item button @click="$router.push('/bio')">
            <ion-icon :icon="documentOutline" slot="start"/>
            <ion-label class="ml-2">
              <h2>Βιογραφικό</h2>
            </ion-label>
          </ion-item>
        </ion-list>
      </div>

      <!-- Referal -->
      <div class="section-container mt-5">
        <div class="section-header">Πρόσκληση φίλου</div>
        <ion-item-divider></ion-item-divider>
        <ion-list lines="full">
          <ion-item button @click="openReferralModal" v-if="!globalStore.user.referral_user_id">
            <ion-icon :icon="enterOutline" slot="start"/>
            <ion-label class="ml-2">
              <h2>Εισαγωγή κωδικού</h2>
            </ion-label>
          </ion-item>
          <ion-item v-else disabled>
            <ion-icon :icon="enterOutline" slot="start"/>
            <ion-label class="ml-2">
              <h2>Έχετε ήδη καταχωρήσει κωδικό πρόσκλησης</h2>
            </ion-label>
          </ion-item>
          <UseClipboard v-slot="{ copy, copied }" :source="globalStore.user?.referral_code">
            <ion-item button @click="copy(globalStore.user?.referral_code ?? '-')">
              <ion-icon :icon="copyOutline" slot="start"/>
              <ion-label class="ml-2">
                  <h2>{{ globalStore.user?.referral_code ?? '-' }}</h2>
                <p>Κωδικός πρόσκλησης</p>
              </ion-label>
            </ion-item>
          </UseClipboard>
          <ion-button @click="logout" expand="block" class="mt-5 text-white">Αποσύνδεση</ion-button>
        </ion-list>
      </div>
    </ion-content>

    <!-- Referral Code Modal -->
    <ion-modal :is-open="isReferralModalOpen" @did-dismiss="closeReferralModal">
      <ion-header>
        <ion-toolbar>
          <ion-title>Κωδικός Πρόσκλησης</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="closeReferralModal">Κλείσιμο</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <div class="mt-4">
          <ion-item>
            <ion-input
              v-model="referralCodeInput"
              placeholder="Εισάγετε τον κωδικό"
              :clearInput="true"
            ></ion-input>
          </ion-item>

          <ion-button
            expand="block"
            class="mt-6 text-white"
            @click="handleSubmitReferral"
            :disabled="!referralCodeInput || isSubmitting"
          >
            {{ isSubmitting ? 'Επεξεργασία...' : 'Υποβολή' }}
          </ion-button>

          <ion-text v-if="referralError" color="danger" class="ion-padding">
            <p class="text-sm">{{ referralError }}</p>
          </ion-text>
          <ion-text v-if="referralSuccess" color="success" class="ion-padding">
            <p class="text-sm">{{ referralSuccess }}</p>
          </ion-text>
        </div>
      </ion-content>
    </ion-modal>
  </ion-page>
</template>

<script setup>
import {
  IonPage,
  IonContent,
  IonBackButton,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonList,
  IonItemDivider,
  IonItem,
  IonIcon,
  IonLabel,
  IonModal,
  IonInput,
  IonText
} from "@ionic/vue";
import {enterOutline, copyOutline, documentOutline, sparklesOutline, personCircle} from "ionicons/icons";
import {useGlobalStore} from "@/stores/globalStore.js";
import { UseClipboard } from "@vueuse/components";
import {computed, ref} from "vue";

const globalStore = useGlobalStore()

// Interests Count
const interestsCount = computed(() => {
  return globalStore.interests.length
})

// Referral Code Modal
const isReferralModalOpen = ref(false)
const referralCodeInput = ref('')
const isSubmitting = ref(false)
const referralError = ref('')
const referralSuccess = ref('')

function logout(){
  globalStore.logout()
}

const openReferralModal = () => {
  isReferralModalOpen.value = true
  referralCodeInput.value = ''
  referralError.value = ''
  referralSuccess.value = ''
}

const closeReferralModal = () => {
  isReferralModalOpen.value = false
  referralCodeInput.value = ''
  referralError.value = ''
  referralSuccess.value = ''
}

async function handleSubmitReferral(){
  isSubmitting.value = true
  referralError.value = ''
  referralSuccess.value = ''
  try{
    referralSuccess.value = await globalStore.submitReferralCode(referralCodeInput.value)
    setTimeout(() => window.location.reload(), 500)
  } catch (error) {
    if (error.response?.data?.message) {
      referralError.value = error.response.data.message
    } else {
      referralError.value = 'Σφάλμα κατά την επαλήθευση του κωδικού. Παρακαλώ δοκιμάστε ξανά.'
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>