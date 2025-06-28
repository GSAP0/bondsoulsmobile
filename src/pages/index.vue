<template>
  <ion-page>
    <ion-content class="welcome-page">
      <div class="overlay content-wrapper" style="height: 100vh">
        <div class="content">
          <div class="" style="display: flex; flex-direction: column; flex-grow: 1;justify-content: center">
            <h1 class="text-white!">Καλώς ήρθες στο <br>Bond Souls</h1>

            <br>
            <p class="font-normal!">
              Η εφαρμογή που θα σε βοηθήσει να δημιουργήσεις σταθερές και ποιοτικές σχέσεις
            </p>
          </div>
          <div>
            <p>ΣΥΝΕΧΕΙΑ ΜΕ:</p>
            <div>
              <router-link to="/verification">
                <ion-button expand="block" color="primary">
                  <span  class="text-white!">Εισαγωγή τηλεφώνου</span>
                </ion-button>
              </router-link>
            </div>
          </div>
        </div>

      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {IonPage, IonContent, IonButton} from '@ionic/vue';
</script>

<style scoped>
.welcome-page {
  --background: none;
  background: url('/assets/images/signin_photo.png') no-repeat center center;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100vh;
  width: 100vw;
  position: relative;
}

.overlay {
  background: rgba(0, 0, 0, 0.6);
}
</style>
