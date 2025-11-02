<template>
  <ion-page class="welcome-page">
    <ion-content :fullscreen="true" class="ion-padding app">
      <div class="">
        <h1 class="text-center text-[2rem]! font-extrabold! mb-5 leading-tight! welcome-title">
          Bond Souls
        </h1>

        <div class="text-center flex justify-center mt-10">
          <ion-img src="https://operator.bondsouls.com/questionIcon.png" style="width: min(150px, 99vw);"></ion-img>
        </div>
        <div class="stack" style="position: absolute;top: 50%; left:50%; transform: translate(-50%,-50%);">
          <div class="flex flex-col justify-center items-center text-center min-h-[60vh] p-5">
            <div class="">
              <p class="text-base text-white" style="font-size: 1.3rem">
                <br>
                Έχεις νιώσει ότι οι περισσότερες γνωριμίες δεν οδηγούν πουθενά;<br><br>
                <span style="font-size: 1.8rem">Σε νιώθουμε..</span><br><br>
                Η Bond Souls δεν ψάχνει το τέλειο προφίλ. Ψάχνει τον κατάλληλο άνθρωπο για εσένα.
                Συνδέουμε βάσει χαρακτήρα, αξιών και ουσίας
              </p>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
    <ion-footer class="px-10 pt-3 pb-5 mb-5 bg-transparent!">
      <ion-button expand="block" class="cta" @click="$router.push('/welcome3')">
        Πώς γίνεται αυτό;
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
