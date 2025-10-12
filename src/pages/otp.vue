<template>
  <ion-page>
    <ion-content :fullscreen="true" class="ion-padding app">
      <div class="frame">
        <div class="scroll">
          <div class="body">
            <div class="title">Επιβεβαίωση κωδικού OTP</div>
            <div class="subtitle">Πληκτρολόγησε ή κάνε επικόλληση τον 6ψήφιο κωδικό που λάβαμε με SMS.</div>

            <!-- Card -->
            <div class="card">
              <!-- Single OTP Input -->
              <ion-input
                  v-model="otpCode"
                  maxlength="6"
                  type="tel"
                  inputmode="numeric"
                  class="otp-single"
                  placeholder="Συμπλήρωσε τον κωδικό"
              ></ion-input>

              <div class="meta">
                <span class="timer">{{ displayTick }}</span>
                <span class="hint">Δεν έλαβες κωδικό;</span>
              </div>

              <ion-button
                  v-if="showResend"
                  expand="block"
                  fill="outline"
                  class="resend"
                  @click="resendOtp"
              >
                Ξαναποστολή κωδικού
              </ion-button>
            </div>
          </div>
        </div>

        <!-- CTA -->
        <ion-button expand="block" class="cta" @click="verifyOtp" :disabled="otpCode.length !== 6">
          <span class="text-white!">Συνέχεια</span>
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { IonPage, IonContent, IonInput, IonButton } from '@ionic/vue';
import { useRoute } from 'vue-router';
import axios from "axios";

const route = useRoute();
const otpCode = ref('');
const tick = ref(59);

const displayTick = computed(() => `00:${String(tick.value).padStart(2, '0')}`);
const showResend = computed(() => tick.value === 0);

async function verifyOtp(){
  try {
    const res = await axios.post(`check_otp`, { otp: otpCode.value });
    localStorage.setItem('access_token', res.data);
    handleNext();
  } catch (e) {
    console.error(e);
  }
}

function resendOtp() {
  const data = {
    mobile: route.query.m
  }

  axios.post('generate_otp', data);
  tick.value = 59;
}

function handleNext(){
  window.location = `/dashboard`;
}

watch(tick, (value) => {
  if (value === 0) return;
  setTimeout(() => {
    tick.value--;
  }, 1000);
}, { immediate: true });
</script>

<style scoped>
.app {
  --ion-background-color: #0A0E1A;
  display: grid;
  place-items: center;
}
.frame {
  width: 100%;
  height: 100%;
  border-radius: 44px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 25px 60px rgba(0,0,0,.4);
  background: #0a0e1a;
}
.scroll {
  height: 100%;
  overflow-y: auto;
  padding-bottom: 120px;
}
.body { padding: 24px 20px; color: #F5F7FA; }
.title { font-size: 20px; font-weight: 700; }
.subtitle { font-size: 13.5px; opacity: .75; margin-top: 4px; }

.card {
  margin-top: 16px;
  background: #0E111A;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 16px;
  padding: 20px;
}

/* Single OTP Input */
.otp-single {
  --background: rgba(255,255,255,0.03);
  --color: #F5F7FA;
  --padding-start: 16px;
  --inner-padding-end: 16px;
  --border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.18);
  text-align: center;
  font-size: 24px;
  height: 56px;
  margin-bottom: 12px;
}

.meta {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-top: 6px;
}
.timer { font-weight: 700; letter-spacing: .5px; }
.hint { font-size: 12px; opacity: .7; }

.resend {
  margin-top: 14px;
  --border-color: rgba(255,255,255,0.25);
  --color: #F5F7FA;
}

/* CTA */
.cta {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 20px;
  width: 340px;
  border-radius: 9999px;
  --background: linear-gradient(90deg, #0A84FF, #FF2D55);
  --background-activated: linear-gradient(90deg, #0c6fce, #e03a5f);
  --box-shadow: 0 8px 30px rgba(0,0,0,0.6);
  font-weight: 700;
}
</style>