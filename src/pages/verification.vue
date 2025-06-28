<template>
  <ion-page>
    <ion-content :fullscreen="true" class="app">
      <!-- Top Section with Rounded Background -->
      <div class="top-section">
        <h1>Επιβεβαίωση τηλεφώνου</h1>
      </div>

      <div class="content-wrapper">
        <div class="content">
          <div>
            <ion-item class="w-[100%] h-[70px]">
              <ion-select v-model="countryCode" interface="popover" class="ion-margin-end">
                <ion-select-option value="+30">+30</ion-select-option>
              </ion-select>
              <ion-input
                  class="h-[70px]"
                  autofocus
                  v-model="phoneNumber"
                  type="tel"
                  placeholder="6900000000"
              ></ion-input>
            </ion-item>
          </div>
            <ion-button :disabled="phoneNumber.length !== 10" expand="block" @click="verifyPhone">
              <span  class="text-white!">Συνέχεια</span>
            </ion-button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {ref} from 'vue';
import {IonPage, IonContent, IonItem, IonInput, IonSelect, IonSelectOption, IonButton} from '@ionic/vue';
import {useRouter} from 'vue-router';
import { CapacitorHttp } from '@capacitor/core';

const router = useRouter();
const countryCode = ref('+30');
const phoneNumber = ref('');

const verifyPhone = async () => {
  const data = {
    mobile: countryCode.value + phoneNumber.value
  }

  try {
    const res = await axios.post('generate_otp', data)
    await router.push(`/otp?v=${res.data}`); // Adjust to the actual OTP verification page
  }catch(e){}

  // console.log(`Verifying phone: ${countryCode.value} ${phoneNumber.value}`);

};
</script>