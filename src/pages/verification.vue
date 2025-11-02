<template>
  <ion-page class="welcome-page">
    <ion-content :fullscreen="true" class="ion-padding app">
      <div class="">
        <div class="">
          <div class="">
            <h1 class="text-center text-[2rem]! font-extrabold! mb-5 leading-tight! welcome-title">
              Bond Souls
            </h1>
            <br>
            <div class="subtitle text-white! text-center" style="font-size: 1.3em">
              Για να προχωρήσουμε, χρειαζόμαστε το τηλέφωνό σου.<br><br>
              Είναι ο τρόπος μας να διατηρούμε την κοινότητα αυθεντική.
            </div>
            <br>

            <!-- Card -->
            <div class="">
              <!-- Τηλέφωνο -->
              <ion-item lines="none" class="input-row" style="  border-radius: 12px;border: 1px solid var(--rowBorder)">
                <ion-select v-model="countryCode" interface="popover" class="cc">
                  <ion-select-option value="+30">+30</ion-select-option>
                </ion-select>
                <ion-input
                    v-model="phoneNumber"
                    type="tel"
                    placeholder="6900000000"
                    class="ml-2"
                    autofocus
                />
              </ion-item>
              <ion-note class="help">
                Θα σου σταλεί SMS με κωδικό μίας χρήσης.
              </ion-note>
              <br><br>
              <!-- Κωδικός πρόσκλησης -->
              <ion-item lines="none" class="input-row mt-3" style="  border-radius: 12px;border: 1px solid var(--rowBorder)">
                <ion-input
                    v-model="referralCode"
                    type="text"
                    placeholder="Κωδικός πρόσκλησης (προαιρετικό)"
                />
              </ion-item>
              <ion-note class="help">
                Αν έχεις κωδικό πρόσκλησης από φίλο, βάλε τον εδώ για έξτρα boost.
              </ion-note>
              <ion-toast  v-if="error.length > 0" color="danger" :is-open="true" :message="error" :duration="5000"></ion-toast>
            </div>
          </div>
        </div>

      </div>
    </ion-content>
    <ion-footer  class="px-3 py-3">
      <!-- CTA -->
      <ion-button
          :disabled="phoneNumber.length !== 10"
          expand="block"
          class="cta"
          @click="verifyPhone"
      >
        Συνέχεια
      </ion-button>
    </ion-footer>
  </ion-page>
</template>

<script setup>
import {ref} from 'vue';
import {
  IonToast,
  IonPage,
  IonContent,
  IonItem,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonNote,
  IonFooter
} from '@ionic/vue';
import {useRouter} from 'vue-router';
import axios from 'axios';

const router = useRouter();
const countryCode = ref('+30');
const phoneNumber = ref('');
const referralCode = ref('');
const error = ref('')

const verifyPhone = async () => {
  error.value = ''
  const data = {
    mobile: countryCode.value + phoneNumber.value,
    referral: referralCode.value || undefined,
  }

  try {
    const res = await axios.post('generate_otp', data);
    await router.push(`/otp?m=${data.mobile}&v=${res.data}`);
  } catch (e) {
    error.value = e.response.data.message
  }

};
</script>

<style scoped>
.input-row {
  --padding-start: 8px;
  --inner-padding-end: 8px;
  width: 100%;
  min-height: 64px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  margin-top: 4px;
}

.welcome-page {
  --background: #050729;
  background: #050729;
  backdrop-filter: invert(1);
}

.welcome-title {
  color: var(--text);
  background: linear-gradient(90deg, var(--primary), var(--accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>

