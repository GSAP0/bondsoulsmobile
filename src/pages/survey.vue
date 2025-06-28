<template>
  <ion-page>
    <ion-content>
      <div style="background-color: #241332; height:100vh">
        <div class="px-[25%] py-5">
          <ion-img src="/assets/images/logoBondWhite.png"></ion-img>
        </div>
        <div class="bg-white m-3 p-3 pb-10"
             style="border-top-right-radius: 60px;border-bottom-left-radius: 60px;">
          <swiper-container :pagination="true" >
            <swiper-slide style="height:70vh">
              <div class="flex flex-1 flex-col justify-center h-[100%]">
                <div class="text-xl font-bold text-center mb-5">
                  {{ data.title }}
                </div>
                <div class="text-center text-md font-bold">
                  <span v-html="data.desc"></span>
                </div>
              </div>
            </swiper-slide>
            <swiper-slide style="height:70vh">
              <div class="flex flex-1 flex-col justify-center h-[100%]">
                <div class="text-xl font-bold text-center mb-5">
                  {{ data2.title }}
                </div>
                <div class="text-center text-md font-bold">
                  <span v-html="data2.desc"></span>
                </div>
                <ion-button @click="closeSurvey" class="pt-4 text-white!">Συνέχεια</ion-button>
              </div>
            </swiper-slide>
          </swiper-container>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">
import 'swiper/css';
import '@ionic/vue/css/ionic-swiper.css';
import {IonContent, IonPage, IonImg, IonButton, useIonRouter} from "@ionic/vue";

const router = useIonRouter()

const data = {
  title: 'Ανακάλυψε τη Δική Σου Μοναδική Σύνδεση',
  desc: `Έχεις αναρωτηθεί ποτέ γιατί είναι τόσο δύσκολο να βρεις πραγματική σύνδεση μέσα από τις γνωριμίες;<br><br>
        Στο BondSouls, ακούμε τις σκέψεις σου και αντιλαμβανόμαστε αυτές τις προκλήσεις.<br><br>
        Κάθε προφίλ είναι μοναδικό, σαν εσένα, σχεδιασμένο με στόχο να αντανακλά την προσωπικότητά σου, τις αξίες και τις επιθυμίες σου.<br><br>
        Κάθε πρόταση γνωριμίας που θα σου παρουσιάζεται θα είναι ειδικά επιλεγμένη για να ταιριάζει αρμονικά με την προσωπική σου ιδιοσυγκρασία!`
}

const data2 = {
  title: 'Τελικά',
  desc: `Με δύο λόγια το BondSouls φροντίζει να σε φέρει σε επικοινωνία με το ιδανικό ταίρι για εσένα`
}

function closeSurvey(){
  localStorage.setItem('survey', "1")
  router.replace('/dashboard')
}
</script>