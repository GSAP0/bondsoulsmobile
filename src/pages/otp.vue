<template>
  <ion-page>
    <ion-content :fullscreen="true" class="app">
      <!-- Top Section with Rounded Background -->
      <div class="top-section">
        <h1>Επιβεβαίωση κωδικού OTP</h1>
      </div>

      <div class="content-wrapper">
        <div class="content">
          <!-- OTP Input Fields -->
          <div>
            <div class="otp-container ion-margin-bottom">
              <input
                  v-for="(digit, index) in otpDigits"
                  :key="index"
                  v-model="otpDigits[index]"
                  maxlength="1"
                  type="number"
                  class="otp-input"
                  @input="moveToNext(index, $event)"
                  @keydown="handleKeydown(index, $event)"
                  ref="otpFields"
              />
            </div>
            00:{{ tick }}
          </div>
<!--          <router-link to="/questions/gender">-->
            <ion-button expand="block" @click="verifyOtp" :disabled="isEverythingFilled">
               <span  class="text-white!">Συνέχεια</span>
            </ion-button>
<!--          </router-link>-->
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {computed, nextTick, ref, watch} from 'vue';
import {IonPage, IonContent, IonItem, IonInput, IonSelect, IonSelectOption, IonButton} from '@ionic/vue';
import {useRouter} from 'vue-router';
import axios from "axios";

const router = useRouter();
const otpDigits = ref(["", "", "", "", "", ""]);
const otpFields = ref([]);
const tick = ref(59)

const isEverythingFilled = computed(() => otpDigits.value.filter(x => parseInt(x) >= 0).length !== 6)

const moveToNext = (index, event) => {
  if (event.inputType === "insertText" && index < otpDigits.value.length - 1) {
    nextTick(() => {
      otpFields.value[index + 1]?.focus();
    });
  }
};

const handleKeydown = (index, event) => {
  if (event.key === "Backspace" && !otpDigits.value[index] && index > 0) {
    nextTick(() => {
      otpFields.value[index - 1]?.focus();
    });
  }
};

async function verifyOtp(){
  const otpstring = otpDigits.value.join("")
  try{
    let res
    res = await axios.post(`check_otp`, {otp: otpstring})
    localStorage.setItem('access_token', res.data)

    handleNext()
  }catch(e){}
}

function handleNext(){
  window.location = `/dashboard`
}

watch(tick, function (value) {
  if (value === 0) return

  setTimeout(() => {
    tick.value--;
  }, 1000);
}, {
  immediate: true
})

</script>

<style>
/* OTP Input */
.otp-container {
  flex-direction: row !important;
  display: flex;
  justify-content: center;
  margin-top: 5vh;
}

.otp-input {
  width: 45px;
  height: 50px;
  margin: 0 5px;
  font-size: 24px;
  text-align: center;
  border: 2px solid white;
  border-radius: 8px;
  background: transparent;
  color: white;
  outline: none;
}

.otp-input:focus {
  border-color: #ff3db5;
}
</style>