<template>
  <ion-page>
    <ion-content :fullscreen="true" class="app" v-if="currentQuestion">
      <div class="top-section">
        <h1>{{ currentQuestion.name }}</h1>
      </div>
      <div class="content-wrapper">
        <div class="content">
          <component v-if="!loading" :question="currentQuestion" :is="handleComponent()" v-model="answer"></component>
        </div>
      </div>
      <div style="padding-top: 5px;padding-left: 5px; padding-right: 5px;">
        <div style="display: flex; align-items: center" v-if="!loading">
          <ion-button style="margin-right: 1rem;" :disabled="!prevQuestion" @click="handlePrev">
            <ion-icon :icon="chevronBackSharp"></ion-icon>
          </ion-button>
          <div style="flex-grow: 1; text-align: center">
            <ion-button @click="$router.replace('/dashboard')" v-if="globalStore.questions_unanswered_required.length === 0">Παράλειψη</ion-button>
            <ion-progress-bar :value="percentage"></ion-progress-bar>
          </div>
          <ion-button style="margin-left: 1rem" @click="handleNext" :disabled="answer.length === 0">
            <ion-icon :icon="chevronForwardSharp"></ion-icon>
          </ion-button>
        </div>
        <div v-else style="display: flex; align-items: center; justify-content: center">
          <ion-spinner></ion-spinner>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">
import {computed, nextTick, ref} from "vue";
import {useGlobalStore} from "@/stores/globalStore";
import {useRoute, useRouter} from "vue-router";
import {IonButton, IonContent, IonIcon, IonPage, IonProgressBar, IonSpinner} from "@ionic/vue";
import {chevronBackSharp, chevronForwardSharp} from "ionicons/icons";
import TypeChoice from "@/components/questions/TypeChoice.vue";
import TypeSlider from "@/components/questions/TypeSlider.vue";
import TypeText from "@/components/questions/TypeText.vue";
import TypeChoiceMultiple from "@/components/questions/TypeChoiceMultiple.vue";

const globalStore = useGlobalStore()
const route = useRoute()
const router = useRouter()

const required = route.query.hasOwnProperty('required')

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
}
</script>