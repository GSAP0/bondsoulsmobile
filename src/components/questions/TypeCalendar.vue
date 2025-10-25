<template>
  <div style="flex-grow: 1;width: 100%;">
    <div style="background: white; color: black; width: 100%; padding: 5px 10px">
      <ion-datetime-button datetime="datetime"></ion-datetime-button>

      <ion-modal :keep-contents-mounted="true">
        <ion-datetime presentation="date"
                      id="datetime"
                      locale="el-GR"
                      :max="maxDateString"
                      v-model="theModel"
                      >
        </ion-datetime>
      </ion-modal>

    </div>
  </div>
</template>
<script setup lang="ts">
import {IonInput, IonDatetime, IonDatetimeButton} from "@ionic/vue";
import {computed} from "vue";

const props = defineProps({
  question: {
    type: Object,
    required: true
  }
})

const theModel = defineModel({
  required: true,
  default: [""],
})

const extra = computed(() => {
  const empty = {}
  if (!props.question) return empty
  if (!props.question.extra) return empty
  const extra = JSON.parse(props.question.extra)
  if (!extra.text) return empty

  return extra.text
})

// Compute max date (today - 18 years)
const maxDate = new Date();
maxDate.setFullYear(maxDate.getFullYear() - 18);
const maxDateString = maxDate.toISOString().split('T')[0]; // e.g. "2007-06-28
</script>