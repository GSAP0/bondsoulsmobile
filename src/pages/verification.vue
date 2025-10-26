<template>
  <ion-page>
    <ion-content :fullscreen="true" class="ion-padding app">
      <div class="">
        <div class="">
          <div class="">
            <div class="title">Επιβεβαίωση τηλεφώνου</div>
            <div class="subtitle">
              Συμπλήρωσε τον αριθμό σου. Αν έχεις κωδικό πρόσκλησης, βάλε τον από κάτω.
            </div>

            <!-- Card -->
            <div class="card">
              <!-- Τηλέφωνο -->
              <ion-item lines="none" class="input-row">
                <ion-select v-model="countryCode" interface="popover" class="cc">
                  <ion-select-option value="+30">+30</ion-select-option>
                </ion-select>
                <ion-input
                    v-model="phoneNumber"
                    type="tel"
                    placeholder="6900000000"
                    class="phone"
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

.app {
  --ion-background-color: #0A0E1A;
  display: grid;
  place-items: center;
}

.frame {
  width: 100%;
  height: 780px;
  border-radius: 44px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 25px 60px rgba(0, 0, 0, .4);
  background: #0a0e1a;
}

.scroll {
  height: 100%;
  overflow-y: auto;
  padding-bottom: 120px;
}

.body {
  padding: 32px 20px;
  color: #F5F7FA;
}

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

.card {
  background: #0E111A;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 16px;
}

.input-row {
  --background: transparent;
  --color: #F5F7FA;
  --padding-start: 8px;
  --inner-padding-end: 8px;
  width: 100%;
  min-height: 64px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  margin-top: 4px;
}

.mt-3 {
  margin-top: 14px;
}

.cc {
  min-width: 92px;
}

.phone {
  margin-left: 8px;
}

.help {
  display: block;
  margin: 6px 6px 2px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
}

.cta {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 20px;
  width: 340px;
  border-radius: 9999px;
  --background: linear-gradient(90deg, #0A84FF, #FF2D55);
  --background-activated: linear-gradient(90deg, #0c6fce, #e03a5f);
  --box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6);
  font-weight: 700;
}
</style>

