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
          <!-- Cropper View -->
          <div class="content" v-if="showCropper">
            <Cropper
              ref="cropperRef"
              :src="srcImage"
              :stencil-props="{
                aspectRatio: 1/1
              }"
              class="cropper"
            />
          </div>

          <!-- Default View (No Image) -->
          <div class="content" v-else-if="!image">
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
                      <IonIcon style="width: 10em; height: 10em" :icon="camera"></IonIcon>
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

          <!-- Image Uploaded View -->
          <div class="content mb-5" v-else>
            <ion-img style="" :src="image" v-if="image"/>
          </div>
        </div>
        <!-- Cropper Buttons -->
        <div class="flex flex-col px-5" v-if="showCropper">
          <ion-button class="mb-3 cta" :disabled="loading" @click="cropImage">
            <ion-spinner v-if="loading" slot="start"></ion-spinner>
            Αποδοχή
          </ion-button>
          <ion-button @click="cancelCrop" fill="clear" :disabled="loading">Ακύρωση</ion-button>
        </div>

        <!-- Initial Buttons (No Image) -->
        <div class="flex flex-col px-5" v-else-if="!image">
          <ion-button class="mb-3 cta" style="--background: #8A56AC90;" @click="takePicture">Λήψη φωτογραφίας
          </ion-button>
          <ion-button class="mb-3 cta" style="--background: #8A56AC90;" @click="selectFromGallery">Επιλογή από συλλογή
          </ion-button>
          <ion-button v-if="optional" @click="finish" fill="clear">Όχι τώρα, ίσως αργότερα</ion-button>
        </div>

        <!-- Image Uploaded Buttons -->
        <div class="flex flex-col px-5" v-else>
          <ion-button @click="savePhoto" style="" class="cta mb-3">Ολοκλήρωση</ion-button>
          <ion-button v-if="!optional" style="text-transform: unset" @click="deletePhoto" color="danger" fill="clear">Αφαίρεση φωτογραφίας
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
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';

const router = useIonRouter()

const route = useRoute()
const globalStore = useGlobal()
const optional = route.query.hasOwnProperty('optional')

const image = ref(JSON.parse(JSON.stringify(globalStore.user.value.photo)))
const srcImage = ref(null)
const showCropper = ref(false)
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

    srcImage.value = `data:image/${photo.format};base64,${photo.base64String}`;
    showCropper.value = true;
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

    srcImage.value = `data:image/${photo.format};base64,${photo.base64String}`;
    showCropper.value = true;
  } catch (error) {
    console.error("Error selecting from gallery:", error);
  }
};

const cropperRef = ref(null);

const cropImage = async () => {
  if (!cropperRef.value) return;

  loading.value = true;
  try {
    const { canvas } = cropperRef.value.getResult();
    if (canvas) {
      canvas.toBlob(async (blob) => {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64String = reader.result.split(',')[1];
          await uploadImage(base64String, 'jpeg');
          showCropper.value = false;
          srcImage.value = null;
        };
        reader.readAsDataURL(blob);
      }, 'image/jpeg', 0.9);
    }
  } catch (error) {
    console.error("Error cropping image:", error);
    loading.value = false;
  }
};

const cancelCrop = () => {
  showCropper.value = false;
  srcImage.value = null;
  loading.value = false;
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

<style scoped>
.cropper {
  height: 400px;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  border-radius: 10px;
  overflow: hidden;
}

@media (max-width: 768px) {
  .cropper {
    height: 300px;
  }
}
</style>