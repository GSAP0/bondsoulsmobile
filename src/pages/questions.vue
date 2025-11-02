<template>
  <ion-page>
      <ion-content :fullscreen="true" class="ion-padding app">
        <div class="">
          <div class="">
            <!-- Header -->
            <PageHeader :has-back="false">
              Ερωτηματολόγιο
            </PageHeader>

            <hr style="background: rgba(0,0,0,0.1)"/>

            <!-- Question Card -->
            <div v-if="loading" class="loading">
              <ion-spinner></ion-spinner>
            </div>
            <div v-else-if="currentQuestion" class="">
              <div class="question-title">{{ currentQuestion.name }}</div>

              <!-- Question Component -->
              <div class="question-body">
                <component
                    :question="currentQuestion"
                    :is="handleComponent()"
                    v-model="answer"
                ></component>
              </div>
            </div>
          </div>
        </div>
      </ion-content>
      <ion-footer class="px-3 pb-3">
        <!-- Progress Bar -->
        <div class="my-4 px-3">
          <div class="progress-label">Πρόοδος</div>
          <div class="rail">
            <div class="bar" :style="{ width: `${percentage * 100}%` }"></div>
          </div>
        </div>

        <div class="nav-buttons">
          <ion-button
              @click="handleNext"
              :disabled="answer.length === 0 || loading"
              class="next-btn"
              expand="block"
          >
            Επόμενο
            <ion-icon :icon="arrowForwardCircle" slot="end"></ion-icon>
          </ion-button>
        </div>

        <!-- Skip/Return Buttons -->
        <div v-if="globalStore.questions_unanswered_required.value.length === 0" class="action-buttons">
          <ion-button
              @click="$router.replace('/dashboard')"
              fill="outline"
              expand="block"
              class="action-btn"
          >
            Επιστροφή
          </ion-button>
        </div>
      </ion-footer>
  </ion-page>
</template>
<script setup lang="ts">
import {computed, ref} from "vue";
import {useGlobal} from "@/composables/useGlobal";
import {useRoute} from "vue-router";
import {IonButton, IonContent, IonFooter, IonIcon, IonPage, IonItemDivider, IonSpinner} from "@ionic/vue";
import {arrowForwardCircle} from "ionicons/icons";
import TypeChoice from "@/components/questions/TypeChoice.vue";
import TypeSlider from "@/components/questions/TypeSlider.vue";
import TypeText from "@/components/questions/TypeText.vue";
import TypeChoiceMultiple from "@/components/questions/TypeChoiceMultiple.vue";
import QuestionsSurvey from "@/components/questions/QuestionsSurvey.vue";
import TypeCalendar from "@/components/questions/TypeCalendar.vue";
import PageHeader from "@/components/PageHeader.vue";

const globalStore = useGlobal()
const {
  answers,
  total_answered,
  questions
} = globalStore

const route = useRoute()

const required = route.query.hasOwnProperty('required')

const answer = ref([])
const loading = ref(false)
const currentQuestion = ref(null)

const percentage = computed(() => {
  return total_answered.value / questions.value.length
})

function assignAnswer() {
  answer.value = []
  answer.value = JSON.parse(JSON.stringify(answers.value.filter(ans => ans.question_id === currentQuestion.value.uuid)))
      .map(ans => ans.answer)
}

async function handleNext() {
  loading.value = true

  await axios.post(`/answers`, {
    answer: answer.value,
    question: currentQuestion.value.uuid
  })

  answer.value = []

  await globalStore.loadAnswers()
  await fetchData()
  loading.value = false
}

function handleComponent() {
  if (!currentQuestion.value) return 'div'
  if (currentQuestion.value.type === 'choice') return TypeChoice
  if (currentQuestion.value.type === 'multi_choice') return TypeChoiceMultiple
  if (currentQuestion.value.type === 'slider') return TypeSlider
  if (currentQuestion.value.type === 'text') return TypeText
  if (currentQuestion.value.type === 'calendar') return TypeCalendar
}

async function fetchData() {
  const result = (await axios.get(`/questions/next?required=${required}`)).data
  if (!result) {
    if(required)
      window.location.href = '/picture?optional'
      else
    window.location.href = '/dashboard'
  }
  currentQuestion.value = result
  assignAnswer()
}

fetchData()
</script>

<style scoped>
/* Layout */
.app {
  display: grid;
  place-items: start;
}

.frame {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}

.scroll {
  height: 100%;
  overflow-y: auto;
  padding-bottom: 24px;
}

/* Header */
.header {
  display: grid;
  grid-template-columns: 40px 1fr 40px;
  align-items: center;
  gap: 10px;
  padding: 14px 16px 6px;
}

.back {
  background: transparent;
  border: 0;
  font-size: 22px;
  cursor: pointer;
  color: var(--text);
}

.title {
  font-weight: 800;
  font-size: 18px;
  color: var(--text);
  text-align: center;
}

/* Card */
.card {
  margin: 0 12px;
  border-radius: 24px;
  background: var(--rowBg);
  border: 1px solid var(--rowBorder);
  padding: 16px;
}

.question-title {
  text-align: center;
  font-weight: 700;
  font-size: 18px;
  padding: 8px 8px 16px;
  color: var(--rowText);
  line-height: 1.4;
}

.question-body {
  padding: 16px 8px 24px;
  min-height: 200px;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.progress-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.rail {
  position: relative;
  height: 8px;
  border-radius: 999px;
  background: var(--rail);
  overflow: hidden;
}

.bar {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  border-radius: 999px;
  background: linear-gradient(90deg, #0A84FF, #FF2D55);
  transition: width 0.3s ease;
}

/* Navigation Buttons */
.nav-buttons {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.nav-btn {
  --color: var(--rowText);
  font-size: 2rem;
  flex-shrink: 0;
}

.next-btn {
  flex: 1;
  --border-radius: 16px;
  --background: linear-gradient(90deg, #0A84FF, #FF2D55);
  font-weight: 700;
  height: 48px;
}

.next-btn[disabled] {
  opacity: 0.5;
}

/* Action Buttons */
.action-buttons {
  margin-top: 12px;
}

.action-btn {
  --border-radius: 16px;
  --border-color: var(--rowBorder);
  --color: var(--rowText);
  font-weight: 700;
  height: 48px;
}

/* Label text wrapper (for question components) */
.label-text-wrapper {
  text-overflow: unset !important;
  white-space: unset !important;
  overflow: unset !important;
}

/* Themes */
.theme-dark {
  --bg: linear-gradient(180deg, #0A0E1A 0%, #10172A 100%);
  --text: #F5F7FA;
  --rowText: #F5F7FA;
  --muted: rgba(245, 247, 250, 0.7);
  --rowBg: #0E111A;
  --rowBorder: rgba(255, 255, 255, 0.10);
  --rail: rgba(255, 255, 255, 0.08);
  background: var(--bg);
  color: var(--text);
}

.theme-light {
  --bg: linear-gradient(180deg, #FFFFFF 0%, #F2F6FF 100%);
  --text: #11181C;
  --rowText: #11181C;
  --muted: rgba(0, 0, 0, 0.55);
  --rowBg: #FFFFFF;
  --rowBorder: rgba(0, 0, 0, 0.10);
  --rail: rgba(0, 0, 0, 0.08);
  background: var(--bg);
  color: var(--text);
}
</style>