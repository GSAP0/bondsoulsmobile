<template>
  <ion-page class="welcome-page">
    <ion-content :fullscreen="true" class="ion-padding app">
      <div class="">
        <div class="">
          <div class="">
            <h1 class="text-center text-[2rem]! font-extrabold! mb-5 leading-tight! welcome-title">
              Bond Souls
            </h1>


            <!-- Card -->
            <div style="position: absolute; left: 50%; top: 40%; transform: translate(-50%, -40%); width: 80%" class="mt-10">
              <!-- Single OTP Input -->
              <div class="title text-center text-white mb-5">Επιβεβαίωση κωδικού</div>

              <ion-input
                  style="background:  var(--rowBg);border-radius: 12px;border: 1px solid var(--rowBorder)"
                  v-model="otpCode"
                  maxlength="6"
                  type="tel"
                  inputmode="numeric"
                  class="otp-single"
                  placeholder="Συμπλήρωσε τον κωδικό"
              ></ion-input>

              <div class="subtitle text-white! text-center" style="font-size: 1rem;margin-bottom: 30px;">Συμπλήρωσε τον 6ψήφιο κωδικό που λάβατε με SMS.</div>
              <div class="meta text-white">
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
                Επαναποστολή κωδικού
              </ion-button>
            </div>
          </div>
        </div>

      </div>
    </ion-content>
    <ion-footer  class="px-3 py-3">
      <ion-button expand="block" class="cta" @click="verifyOtp" :disabled="otpCode.length !== 6">
        <span class="text-white!">Συνέχεια</span>
      </ion-button>
    </ion-footer>
  </ion-page>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { IonPage, IonContent, IonInput, IonButton, IonFooter } from '@ionic/vue';
import { useRoute } from 'vue-router';
import axios from "axios";
import { Capacitor } from '@capacitor/core';
import { useFcmToken } from '@/composables/useFcmToken';

const route = useRoute();
const otpCode = ref('');
const tick = ref(59);

const displayTick = computed(() => `00:${String(tick.value).padStart(2, '0')}`);
const showResend = computed(() => tick.value === 0);

async function verifyOtp(){
  try {
    const res = await axios.post(`check_otp`, { otp: otpCode.value });
    localStorage.setItem('access_token', res.data);

    // Update axios authorization header
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data}`;

    // Fetch user data
    try {
      const userResponse = await axios.get(`/user`);
      if (userResponse.status === 200 && userResponse.data) {
        localStorage.setItem('user', JSON.stringify(userResponse.data));
      }
    } catch (userError) {
      console.error('Failed to fetch user data:', userError);
    }

    // Send FCM token to backend if on native platform and token exists
    if (Capacitor.isNativePlatform()) {
      const fcmToken = localStorage.getItem('fcm_token');
      if (fcmToken) {
        try {
          const { sendToBackend } = useFcmToken();
          await sendToBackend('/fcm-token');
          console.log('FCM token sent to backend after login');
        } catch (fcmError) {
          console.error('Failed to send FCM token after login:', fcmError);
          // Don't block user flow if FCM fails
        }
      }
    }

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

.title { font-size: 20px; font-weight: 700; }
.subtitle {  opacity: .75; margin-top: 4px; }


.otp-single {
  --padding-start: 16px;
  --inner-padding-end: 16px;
  --border-radius: 12px;
  border: 1px solid var(--bg);
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