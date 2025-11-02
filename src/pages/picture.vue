<template>
  <ion-page>
    <ion-header v-if="!optional">
      <ion-toolbar>
        <PageHeader>
          Φωτογραφία χρήστη
        </PageHeader>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="app ion-padding">
      <div style="">
        <div class="content-wrapper">
          <div class="content">
            <div class="flex justify-center items-center">
              <div style="height: 20em;
                      width: 20em;
                      z-index: 10;
                      background-color: #8A56AC20;
                      border-radius: 120px;
                      align-items: center;
                      justify-content: center;
                      "
                   class="flex justify-center items-center">
                <div style="height: 18em;
                      width: 18em;
                      z-index: 20;
                      background-color: #8A56AC50;
                      border-radius: 120px;
                      align-items: center;
                      justify-content: center;
                      "
                     class="flex justify-center items-center">
                  <div style="height: 16em;
                      width: 16em;
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
                      <ion-img style="" :src="image" v-if="image"/>
                      <IonIcon v-else style="width: 10em; height: 10em" :icon="camera"></IonIcon>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="optional" class="mb-4 mt-5 text-center" style="font-size: 1.65em">Ένα βήμα έμεινε ακόμα
            </div>
            <div class="mb-10 mt-5 text-center" style="font-size: 1.35em">Ανέβασε μια προσωπική φωτογραφία σου. <br>
              Θυμήσου ότι όπως και εσύ, το ταίρι σου θα επιθυμούσε να δει τον πραγματικό σου
              εαυτό.
            </div>
          </div>
        </div>
        <div class="flex flex-col px-5" v-if="!image">
          <ion-button class="mb-3 cta" @click="takePicture">Λήψη φωτογραφίας</ion-button>
          <ion-button class="mb-3 ctb text-white" @click="selectFromGallery" fill="outline">Επιλογή από συλλογή
          </ion-button>
          <ion-button v-if="optional" @click="finish" fill="clear">Όχι τώρα, ίσως αργότερα</ion-button>

        </div>
        <div class="flex flex-col px-5" v-else>
          <ion-button @click="savePhoto" style="" class="mb-3">Ολοκλήρωση</ion-button>
          <ion-button v-if="!optional" @click="deletePhoto" color="danger" fill="clear">Αφαίρεση φωτογραφίας
          </ion-button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonPage,
  IonContent,
  IonIcon,
  IonButton,
  IonImg,
  useIonRouter,
  IonSpinner,
  IonToolbar,
  IonButtons, IonTitle, IonBackButton, IonHeader
} from '@ionic/vue';
import {camera} from "ionicons/icons";
import {nextTick, ref} from "vue";
import {useRoute} from "vue-router";
import PageHeader from "@/components/PageHeader.vue";
import {useGlobal} from "@/composables/useGlobal.js";
import {Camera, CameraResultType, CameraSource} from '@capacitor/camera';
import {useTest} from "@/composables/test.js";

const router = useIonRouter()

const route = useRoute()
const globalStore = useGlobal()
const optional = route.query.hasOwnProperty('optional')

const image = ref(JSON.parse(JSON.stringify(globalStore.user.value.image)))
const loading = ref(false)

const test = useTest()
const {x} = test

const takePicture = async () => {
  try {
    const photo = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera
    });

    await uploadImage(photo.base64String, photo.format);
  } catch (error) {
    console.error("Error taking picture:", error);
  }
};

const selectFromGallery = async () => {
  try {
    const photo = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos
    });

    await uploadImage(photo.base64String, photo.format);
  } catch (error) {
    console.error("Error selecting from gallery:", error);
  }
};

const uploadImage = async (base64String, format) => {
  loading.value = true
  try {
    const response = await window.axios.post("/profile/upload-photo", {
      photo: base64String,
      format: format
    });
    image.value = response.data.url
  } catch (error) {
    console.error("Error uploading image:", error);
    console.error("Error details:", error.response?.data);
  } finally {
    loading.value = false
  }
};

async function savePhoto(shouldFinish = true) {
  loading.value = true
  await window.axios.post("/profile/save-photo", {
    photo: image.value
  })

  await globalStore.loadUser()
  await nextTick()

  if (shouldFinish) {
    finish()
  }

  loading.value = false
}


function finish() {
  router.replace('/dashboard')
}

function deletePhoto() {
  image.value = null
  savePhoto(false)
}

</script>

<style>

</style>