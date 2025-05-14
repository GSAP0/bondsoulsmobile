<template>
  <div>
    <div style="flex-grow: 1;width: 100%;">
    <div v-if="extra.multiple"></div>
    <div v-else>
      <h3>{{theModel[0]}}</h3>
      <ion-range @ionChange="onIonChange" v-bind="extra.options"></ion-range>
    </div>
    </div>
  </div>
</template>

<script setup>
import {computed} from "vue";

const props = defineProps({
  question: {
    type: Object,
    required: true
  }
})

const theModel = defineModel({
  required: true,
  default: [],
})

const extra = computed(() => {
  const empty = {}
  if (!props.question) return empty
  if (!props.question.extra) return empty
  const extra = JSON.parse(props.question.extra)
  if (!extra.slider) return empty

  return extra.slider
})

if(extra.value.options?.min && !theModel.value[0]) theModel.value[0] = extra.value.options.min

function onIonChange({ detail }) {
  theModel.value[0] = detail.value
}

</script>