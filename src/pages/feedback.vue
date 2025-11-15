<template>
  <ion-page>
    <ion-content :fullscreen="true" class="ion-padding">
      <div class="">
        <!-- Rating Section -->
        <div class="section-container">
          <div class="text-2xl text-center mb-5!">Rating & Feedback</div>

          <div class="rounded-item rating-content">
            <h3 class="rating-title">
              Πώς θα αξιολογούσες τη <b>στάση</b> και τη <b>συμπεριφορά</b> του {{ user.feedback_pending_for_user_name }} μέσα στη διαδικασία της γνωριμίας;
            </h3>

            <div class="stars-container">
              <button
                  v-for="i in 5"
                  :key="i"
                  @click="rating = i"
                  class="star-button"
                  :class="{ active: i <= rating }"
                  type="button"
              >
                <ion-icon
                    :icon="i <= rating ? star : starOutline"
                    class="star-icon"
                />
              </button>
            </div>

            <p class="rating-label">{{ getRatingLabel() }}</p>
          </div>
        </div>

        <!-- Feedback Text Section -->
        <div class="section-container">
          <div class="text-xl text-center mb-5!">Τι θα συμβούλευες τον {{ user.feedback_pending_for_user_name }} για μελλοντικές γνωριμίες;</div>

          <div class="rounded-item feedback-content">
            <div class="textarea-wrapper">
              <ion-textarea
                  v-model="feedbackText"
                  placeholder=""
                  class="w-full text-2xl!"
                  rows="10"
                  maxlength="500"
              />
              <span class="character-count">{{ feedbackText.length }}/500</span>
            </div>
          </div>
        </div>
      </div>
    </ion-content>

    <ion-footer class="px-3 py-3 bg-transparent!">
      <div class="text-center" v-if="loading">
        <ion-spinner></ion-spinner>
      </div>
      <ion-button
          v-else
          expand="block"
          @click="submitFeedback"
          :disabled="!rating"
          class="cta"
      >
        <ion-icon :icon="sendOutline" class="mr-3"></ion-icon>
        Υποβολή αξιλόγησης
      </ion-button>
    </ion-footer>
  </ion-page>
</template>

<script setup>
import {ref} from 'vue'
import {
  IonSpinner,
    IonTextarea,
  IonPage,
  IonContent,
  IonButton,
  IonIcon,
  IonFooter,
} from '@ionic/vue'

import {useRouter} from 'vue-router'
import {star, starOutline, sendOutline} from 'ionicons/icons'
import {useGlobal} from "@/composables/useGlobal.js";

const global = useGlobal()
const { user } = global

if(!user.value.feedback_pending_for_user_id) window.location.href = '/'

const router = useRouter()
const rating = ref(0)
const feedbackText = ref('')
const loading = ref(false)

const getRatingLabel = () => {
  const labels = {
    0: '',
    1: 'Πολύ δυσαρεστημένος/η',
    2: 'Δυσαρεστημένος/η',
    3: 'Ουδέτερος/η',
    4: 'Ικανοποιημένος/η',
    5: 'Πολύ ικανοποιημένος/η'
  }
  return labels[rating.value] || ''
}

const submitFeedback = async () => {
  try {
    const feedbackData = {
      rating: rating.value,
      content: feedbackText.value
    }
    loading.value = true
    await axios.post(`/match/storeFeedback`, feedbackData)
    window.location.href = '/'

  } catch (error) {
    console.error('Error submitting feedback:', error)
  }
}
</script>

<style scoped>
.scroll {
  padding-top: 16px;
}

/* Section */
.section-container {
  margin-bottom: 24px;
}

/* Card */
.rounded-item {
  background: var(--ion-card-background);
  border: 1px solid var(--ion-color-light-shade);
  border-radius: 16px;
  padding: 16px;
  margin: 0 0 8px 0;
  box-shadow: var(--ion-card-box-shadow, 0 1px 3px rgba(0, 0, 0, 0.1));
}

/* Rating */
.rating-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 14px;
}

.rating-title {
  font-size: 1rem;
  letter-spacing: -0.2px;
  color: var(--ion-text-color);
  margin: 0 0 16px 0;
  text-align: center;
}

.stars-container {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.star-button {
  background: transparent;
  border: 1px solid var(--ion-color-light-shade);
  border-radius: 12px;
  padding: 8px;
  cursor: pointer;
  transition: transform .15s ease, border-color .2s ease;
  -webkit-tap-highlight-color: transparent;
}

.star-button:hover {
  border-color: var(--ion-color-medium);
}

.star-button:active {
  transform: scale(.96);
}

.star-icon {
  font-size: 28px;
  color: var(--ion-color-medium-tint);
  transition: color .2s ease, filter .2s ease;
}

.star-button.active .star-icon {
  color: #FFB800;
  filter: drop-shadow(0 2px 6px rgba(255, 184, 0, .35));
}

.rating-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  margin: 2px 0 0 0;
  min-height: 18px;
  text-align: center;
}

/* Feedback */
.feedback-content {
  padding: 14px;
}

.feedback-content textarea:focus{
  border: none;
  outline: none !important;
}

.feedback-content textarea:focus-within{
  border: none !important;
  outline: none !important;
}

.textarea-wrapper {
  position: relative;
}

.character-count {
  position: absolute;
  bottom: 8px;
  right: 10px;
  font-size: 11px;
  font-weight: 600;
  color: var(--ion-color-medium);
}

</style>