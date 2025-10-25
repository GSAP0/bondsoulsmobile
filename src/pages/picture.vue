<template>
  <ion-page>
    <ion-content :fullscreen="true" class="app ion-padding" style="background: none !important;">
      <PageHeader v-if="!optional">
        Φωτογραφία χρήστη
      </PageHeader>

      <div style="height: calc(100vh - 100px); overflow: hidden">
        <div style="display: none">
          <input
              :key="renkey"
              type="file"
              accept="image/*"
              @change="selectFile($event)"
              ref="fileInput"
          />
        </div>
        <div class="content-wrapper">
          <div class="content">
            <div class="flex justify-center items-center">
              <div style="height: 320px;
                      width: 320px;
                      z-index: 10;
                      background-color: #8A56AC20;
                      border-radius: 120px;
                      align-items: center;
                      justify-content: center;
                      "
                   class="flex justify-center items-center">
                <div style="height: 280px;
                      width: 280px;
                      z-index: 20;
                      background-color: #8A56AC50;
                      border-radius: 120px;
                      align-items: center;
                      justify-content: center;
                      "
                     class="flex justify-center items-center">
                  <div style="height: 240px;
                      width: 240px;
                      z-index: 30;
                      background-color: #8A56AC90;
                      border-radius: 120px;
                      align-items: center;
                      justify-content: center;
                      "
                       class="flex justify-center items-center">
                    <div v-if="loading">
                      <ion-spinner></ion-spinner>
                    </div>
                    <div v-else>
                      <ion-img style="width: 150px; height: 150px" :src="image" v-if="image"/>
                      <IonIcon v-else style="width: 150px; height: 150px" :icon="camera"></IonIcon>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="optional" class="text-4xl mb-4 mt-5 text-center" style="color: #ad98cf;">Ένα βήμα έμεινε ακόμα</div>
            <div class="text-lg mb-10 mt-5 text-center">Ανέβασε μια προσωπική φωτογραφία σου Θυμήσου ότι όπως και
              εσύ, το ταίρι σου θα επιθυμούσε να δει τον πραγματικό σου
              εαυτό.
            </div>
          </div>
        </div>
        <div class="flex flex-col px-5" v-if="!image">
          <ion-button class="mb-3" @click="fileInput?.click()">Προσθήκη φωτογραφίας</ion-button>
          <ion-button v-if="optional" @click="finish" fill="clear">Όχι τώρα, ίσως αργότερα</ion-button>

        </div>
        <div class="flex flex-col px-5" v-else>
          <ion-button @click="savePhoto" style="" class="mb-3">Ολοκλήρωση</ion-button>
          <ion-button v-if="!optional" @click="deletePhoto" color="danger" fill="clear">Αφαίρεση φωτογραφίας</ion-button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {IonPage, IonContent, IonIcon, IonButton, IonImg, useIonRouter, IonSpinner} from '@ionic/vue';
import {camera} from "ionicons/icons";
import {ref, useTemplateRef} from "vue";
import {useRoute} from "vue-router";
import PageHeader from "@/components/PageHeader.vue";
import {useGlobalStore} from "@/stores/globalStore.js";

const router = useIonRouter()

const route = useRoute()
const globalStore = useGlobalStore()
const optional = route.query.hasOwnProperty('optional')

const renkey = ref(0)
const image = ref(JSON.parse(JSON.stringify(globalStore.user.image)))
const loading = ref(false)
const fileInput = useTemplateRef("fileInput")

const selectFile = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  // Example: Upload or preview the image
  uploadImage(file);
};
const uploadImage = async (file) => {
  loading.value = true
  renkey.value++
  const formData = new FormData();
  formData.append("photo", file);
  try {
    const response = await axios.post("/profile/upload-photo", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    image.value = response.data.url
  } catch (error) {
    console.error("Error uploading image:", error);
  } finally {
    loading.value = false
  }
};

async function savePhoto(shouldFinish = true) {
  loading.value = true
  await axios.post("/profile/save-photo", {
    photo: image.value
  })

  if(shouldFinish) {
    finish()
  }

  loading.value = false
}


function finish() {
  globalStore.loadUser()
  router.replace('/dashboard')
}

function deletePhoto(){
  image.value = null
  savePhoto(false)
}

</script>

<style>

</style>