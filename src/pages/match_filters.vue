<template>
  <ion-page>
    <ion-content :fullscreen="true" class="app ion-padding" style="background: none !important;">
      <div style="height: calc(100vh - 40px); overflow: hidden">
        <div class="top-section">
          <h1>Βρες μου ταίρι</h1>
        </div>
        <div class="content-wrapper">
          <div class="content">
            <div>
              <div style="width: 100%; background-color: #cbcbcb61; padding: 24px; border-radius: 2px">
                <!-- free user -->
                <div class="mb-2">
                  <p>Απόσταση (km): 1</p>
                  <ion-range min="10" max="100" step="1"></ion-range>
                </div>
                <div class="mb-2">
                  <p>Ηλικία: 18</p>
                  <ion-range min="18" max="100" step="1"></ion-range>
                </div>

                <!-- sub1 -->
                <div class="mb-2">
                  <p>Ύψος: 1</p>
                  <ion-range min="10" max="100" step="1"></ion-range>
                </div>
                <div class="mb-2">
                <p>Βάρος: 1</p>
                <ion-range min="10" max="100" step="1"></ion-range>
              </div>

                <!-- sub2 -->
                <div class="mb-2">
                  <p>Να έχει παιδιά</p>
                  <ion-toggle></ion-toggle>
                </div>
                <div class="mb-2">
                  <p>Να έχει φωτογραφία</p>
                  <ion-toggle></ion-toggle>
                </div>
              </div>
            </div>
            <ion-button style="color: #fff">
            Ταίριαξέ με
            </ion-button>
            <ion-button @click="router.push('/dashboard')" fill="clear" style="color: #fff">
              Επιστροφή
            </ion-button>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">
import {IonContent, IonPage, IonRange, IonButton, IonToggle, useIonRouter} from "@ionic/vue";

const router = useIonRouter();
</script>