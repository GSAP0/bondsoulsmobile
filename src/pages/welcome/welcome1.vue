<template>
  <ion-page class="welcome-page">
    <ion-content :fullscreen="true" class="ion-padding app">
      <div class="">
        <h1 class="text-center text-[2rem]! font-extrabold! mb-5 leading-tight! welcome-title">
          Καλώς ήρθατε στο<br>Bond Souls
        </h1>

        <div class="text-center flex justify-center mt-10">
          <ion-img src="https://operator.bondsouls.com/questionIcon.png" style="width: min(10em, 99vw);"></ion-img>
        </div>
        <div class="stack" style="position: absolute;top: 50%; left:50%; transform: translate(-50%,-50%);">
          <div class="flex flex-col justify-center items-center text-center min-h-[60vh] p-5">
            <div class="">
              <p class="text-base text-white" style="font-size: 1.5em">
                Η εφαρμογή που θα σε βοηθήσει να δημιουργήσεις σταθερές και ποιοτικές σχέσεις
              </p>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
    <ion-footer class="px-10 pt-3 pb-5 mb-5 bg-transparent!">
      <ion-button expand="block" class="cta" @click="$router.push('/welcome2')">
        Συνέχεια
      </ion-button>
    </ion-footer>
  </ion-page>
</template>

<script setup>
import {IonPage, IonContent, IonButton, IonFooter, IonImg} from '@ionic/vue';
</script>

<style scoped>
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
