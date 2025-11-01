<template>
  <ion-page>
    <ion-content :fullscreen="true" class="ion-padding app">
      <div class="">
        <div class="">
          <div class="">
            <div class="title text-center ">Επιβεβαίωση τηλεφώνου</div>
            <div class="subtitle">
              Συμπλήρωσε τον αριθμό σου. Αν έχεις κωδικό πρόσκλησης, βάλε τον από κάτω.
            </div>

            <!-- Card -->
            <div class="">
              <!-- Τηλέφωνο -->
              <ion-item lines="none" class="input-row">
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
                Θα σου σταλεί SMS με κωδικό μίας χρήσης. Δεν κάνουμε spam.
              </ion-note>

              <!-- Κωδικός πρόσκλησης -->
              <ion-item lines="none" class="input-row mt-3">
                <ion-input
                    v-model="referralCode"
                    type="text"
                    placeholder="Κωδικός πρόσκλησης (προαιρετικό)"
                />
              </ion-item>
              <ion-note class="help">
                Αν έχεις κωδικό από φίλο, βάλε τον εδώ για έξτρα boost.
              </ion-note>
              <ion-toast  v-if="error.length > 0" color="danger" :is-open="true" :message="error" :duration="5000"></ion-toast>
            </div>
          </div>
        </div>

      </div>
    </ion-content>
    <ion-footer>
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
import {IonToast, IonPage, IonContent, IonItem, IonInput, IonSelect, IonSelectOption, IonButton, IonNote} from '@ionic/vue';
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
.title {
  font-size: 22px;
  font-weight: 700;
}

.subtitle {
  font-size: 13.5px;
  opacity: .75;
  margin-top: 4px;
  margin-bottom: 20px;
}

.input-row {
  --padding-start: 8px;
  --inner-padding-end: 8px;
  width: 100%;
  min-height: 64px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  margin-top: 4px;
}

.help {
  display: block;
  margin: 6px 6px 2px;
  font-size: 12px;
}
</style>

