<template>
  <div style="width: 100%;">
    <div class="bg-white rounded-2xl w-[]" style="width: 100%;">
      <div v-if="extra.multiple"></div>
      <div v-else class="px-10 py-4">
        <div class="text-black">
          <div class="flex justify-between">
            <div>Καθόλου</div>
            <div>Πολύ</div>
          </div>
          <!--          <div v-if="extra.value.options?.minLabel && extra.value.options?.maxLabel">-->
          <!--            <div v-if="extra.value.options?.minLabel">{{ extra.value.options.minLabel }}</div>-->
          <!--            <div v-if="extra.value.options?.maxLabel">{{ extra.value.options.maxLabel }}</div>-->
          <!--          </div>-->
          <!--          <h3 v-else>{{ theModel[0] }}</h3>-->
        </div>
        <ion-range @ionChange="onIonChange" v-bind="extra.options"></ion-range>
      </div>
    </div>
  </div>
</template>

<script setup>
import {IonRange} from "@ionic/vue";
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

if (extra.value.options?.min && !theModel.value[0]) theModel.value[0] = (extra.value.options.min + extra.value.options.max) / 2

function onIonChange({detail}) {
  console.log(detail)
  theModel.value[0] = detail.value
}

</script>