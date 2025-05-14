<template>
  <div style="flex-grow: 1;width: 100%;">
    <div style="background: white; color: black; width: 90%; padding: 5px 10px">
    <ion-input
        autofocus
        v-bind="extra.options"
        v-model="theModel[0]"
    ></ion-input>
    </div>
  </div>
</template>
<script setup lang="ts">
import {IonInput} from "@ionic/vue";
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

</script>