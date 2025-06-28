<template>
  <ion-page :style="show_survey ? '' : 'background-color:rgba(0,0,0,0.1)'">
    <div v-if="show_survey">
      <QuestionsSurvey @close="show_survey=false"></QuestionsSurvey>
    </div>
    <ion-content :fullscreen="true" v-else-if="currentQuestion"  class="content-questions">
      <div class="top-section">
        <h1>{{ currentQuestion.name }}</h1>
      </div>
      <div class="">
        <div class="content m-auto" style="margin-top: 40%;">
          <component v-if="!loading" :question="currentQuestion" :is="handleComponent()" v-model="answer"></component>
        </div>
      </div>
      <div  v-if="!loading" style="position: absolute;
                  bottom: 0;
                  left: 50%;
                  transform: translateX(-50%);
                  width: 90%;">
        <div style="padding-top: 5px;padding-left: 5px; padding-right: 5px;">
          <div style="display: flex; align-items: center">
            <ion-button class="text-black" fill="clear" :disabled="!prevQuestion" @click="handlePrev" >
              <ion-icon style="font-size: 3rem" :icon="arrowBackCircle"></ion-icon>
            </ion-button>
            <div style="flex-grow: 1; text-align: center">
              <ion-progress-bar class="h-[40px] border" :value="percentage"></ion-progress-bar>
            </div>
            <ion-button class="text-black" fill="clear" @click="handleNext" :disabled="answer.length === 0">
              <ion-icon style="font-size: 3rem" :icon="arrowForwardCircle"></ion-icon>
            </ion-button>
          </div>
        </div>
        <ion-button @click="$router.replace('/dashboard')"
                    class="text-white! w-full p-1"
                    v-if="globalStore.questions_unanswered_required.length === 0">
          Παράληψη
        </ion-button>
        <ion-button @click="$router.replace('/dashboard')"
                    class="text-white! w-full p-1"
                    v-if="globalStore.questions_unanswered_required.length === 0">
          Επιστροφή
        </ion-button>
      </div>
      <div v-else style="display: flex; align-items: center; justify-content: center">
        <ion-spinner></ion-spinner>
      </div>
    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">
import {computed, nextTick, ref} from "vue";
import {useGlobalStore} from "@/stores/globalStore";
import {useRoute, useRouter} from "vue-router";
import {IonButton, IonContent, IonIcon, IonPage, IonProgressBar, IonSpinner} from "@ionic/vue";
import {arrowBackCircle, arrowForwardCircle} from "ionicons/icons";
import TypeChoice from "@/components/questions/TypeChoice.vue";
import TypeSlider from "@/components/questions/TypeSlider.vue";
import TypeText from "@/components/questions/TypeText.vue";
import TypeChoiceMultiple from "@/components/questions/TypeChoiceMultiple.vue";
import QuestionsSurvey from "@/components/questions/QuestionsSurvey.vue";
import TypeCalendar from "@/components/questions/TypeCalendar.vue";

const globalStore = useGlobalStore()
const route = useRoute()
const router = useRouter()

const required = route.query.hasOwnProperty('required')
const show_survey = ref(!localStorage.getItem('questions_required'))

const answer = ref([])
const loading = ref(false)
const currentQuestion = ref(null)

const percentage = computed(() => {
  if (required) {
    const idx = globalStore.questions_required.findIndex(q => q.uuid === currentQuestion.value.uuid) + 1
    return idx / globalStore.questions_required
  } else {
    const idx = globalStore.questions.findIndex(q => q.uuid === currentQuestion.value.uuid) + 1
    return idx / globalStore.questions.length
  }
})

const prevQuestion = computed(() => {
  if (!currentQuestion.value) return null

  if (required) {
    const idx = globalStore.questions_required.findIndex(q => q.uuid === currentQuestion.value.uuid)
    if (idx > 0) return globalStore.questions_required[idx - 1]
  } else if (globalStore.questions_unanswered.length > 0) {
    const idx = globalStore.questions_unanswered.findIndex(q => q.uuid === currentQuestion.value.uuid)
    if (idx > 0) return globalStore.questions_unanswered[idx - 1]
  } else {
    const idx = globalStore.questions.findIndex(q => q.uuid === currentQuestion.value.uuid)
    if (idx > 0) return globalStore.questions[idx - 1]
  }
  return null
})

const nextQuestion = computed(() => {
  if (!currentQuestion.value) return null

  if (required) {
    const idx = globalStore.questions_required.findIndex(q => q.uuid === currentQuestion.value.uuid)
    if (idx > 0) return globalStore.questions_required[idx + 1]
  } else if (globalStore.questions_unanswered.length > 0) {
    currentQuestion.value = globalStore.questions_unanswered[0]
  } else {
    const idx = globalStore.questions.findIndex(q => q.uuid === currentQuestion.value.uuid)
    if (idx >= 0) return globalStore.questions[idx + 1]
  }
  return null
})

if (required) {
  if (globalStore.questions_unanswered_required.length > 0) {
    currentQuestion.value = globalStore.questions_unanswered_required[0]
  } else router.replace(`/dashboard`)
} else if (globalStore.questions_unanswered.length > 0) {
  currentQuestion.value = globalStore.questions_unanswered[0]
} else {
  currentQuestion.value = globalStore.questions[0]
}

assignAnswer()

async function handleNext() {
  loading.value = true

  await axios.post(`/answers`, {
    answer: answer.value,
    question: currentQuestion.value.uuid
  })

  answer.value = []

  await globalStore.loadAnswers()
  loading.value = false

  await nextTick()

  assignNext()
}

function handlePrev() {
  if (prevQuestion.value) {
    currentQuestion.value = prevQuestion.value
    assignAnswer()
  } else router.replace(`/dashboard`)
}

function assignNext() {
  if (nextQuestion.value) {
    currentQuestion.value = nextQuestion.value
    assignAnswer()
  } else router.replace(`/dashboard`)
}

function assignAnswer() {
  answer.value = []
  answer.value = JSON.parse(JSON.stringify(globalStore.answers.filter(ans => ans.question_id === currentQuestion.value.uuid)))
      .map(ans => ans.answer)
}

function handleComponent() {
  if (!currentQuestion.value) return 'div'
  if (currentQuestion.value.type === 'choice') return TypeChoice
  if (currentQuestion.value.type === 'multi_choice') return TypeChoiceMultiple
  if (currentQuestion.value.type === 'slider') return TypeSlider
  if (currentQuestion.value.type === 'text') return TypeText
  if (currentQuestion.value.type === 'calendar') return TypeCalendar
}
</script>

<style>
.content-questions{
  --background: none;
  background-color: #ccc;
  background: url('/assets/images/bgSurvey.png') no-repeat center center;
  background-size: cover;
}


.label-text-wrapper{
  text-overflow: unset !important;
  white-space: unset !important;
  overflow: unset !important;
}
</style>