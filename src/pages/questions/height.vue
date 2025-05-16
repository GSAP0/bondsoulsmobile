<template>
  <ion-page>
    <ion-content :fullscreen="true" class="app">
      <!-- Top Section with Rounded Background -->
      <div class="top-section">
        <h1>Επέλεξε το φύλο σου</h1>
      </div>

      <div class="content-wrapper">
        <div class="content">
          <div>
            <div style="flex-grow: 1;width: 100%;">
              <div style="background: white; color: black; padding: 0.5rem 1rem; display: block">
                <ion-input color="primary" label-placement="floating" autofocus type="text" inputmode="numeric"
                           label="Το ύψος σου σε εκατοστά"></ion-input>
              </div>
            </div>
          </div>
          <div style="display: flex; align-items: center">
            <router-link to="/questions/gender">
              <ion-icon fill="solid" size="large" :icon="chevronBackSharp"></ion-icon>
            </router-link>
            <ion-progress-bar :value="0.1"></ion-progress-bar>
            <router-link to="/dashboard">
              <ion-icon size="large" :icon="chevronForwardSharp"></ion-icon>
            </router-link>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {ref} from 'vue';
import {IonPage, IonContent, IonItem, IonIcon} from '@ionic/vue';
import {chevronBackSharp, chevronForwardSharp} from "ionicons/icons";

const selected = ref(null)

const options = [
  {
    value: 'male',
    name: 'Άνδρας',
  },
  {
    value: 'female',
    name: 'Γυναίκα',
  },
  {
    value: 'other',
    name: 'Άλλο',
  }
]

function handleChange(event) {
  selected.value = event.detail.value
}

function compareWith(o1, o2) {
  return o1.value === o2.value;
}
</script>