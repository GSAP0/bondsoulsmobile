<template>
  <div style="width: 100%;">
    <div class="rounded-2xl" style="width: 100%;">
      <div v-if="extra.multiple"></div>
      <div v-else class="px-1 py-4">
        <div class="">
          <div class="flex justify-between align-bottom">
            <div>
              <div v-if="extra.options?.min_label && extra.options?.min_label" style="font-size: 1rem">
                {{ extra.options.min_label }}
              </div>
            </div>
            <div>
              <div
                  v-if="hasLabel"
                  class="text-4xl">{{ theModel[0] }}
              </div>
            </div>
            <div>
              <div v-if="extra.options?.max_label && extra.options?.max_label" style="font-size: 1rem">
                {{ extra.options.max_label }}
              </div>
            </div>
          </div>
        </div>
        <div class="flex items-center">
          <ion-button @click="theModel[0] -= 1" v-if="hasLabel" fill="clear">-</ion-button>
          <ion-range :value="theModel[0]" @ionInput="onIonChange" v-bind="extra.options">
          </ion-range>
          <ion-button @click="theModel[0] += 1" v-if="hasLabel" fill="clear">+</ion-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {IonRange, IonButton} from "@ionic/vue";
import {computed, ref} from "vue";

const props = defineProps({
  question: {
    type: Object,
    required: true
  }
})


const theModel = defineModel({
  required: true,
  default: [0],
})

const extra = computed(() => {
  const empty = {}
  if (!props.question) return empty
  if (!props.question.extra) return empty
  const extra = JSON.parse(props.question.extra)
  if (!extra.slider) return empty

  return extra.slider
})

if (extra.value.options?.min && !theModel.value[0]) theModel.value[0] = (parseInt(extra.value.options.min) + parseInt(extra.value.options.max)) / 2

const hasLabel = computed(() => !extra.value.options.hasOwnProperty('hide_label') || extra.value.options.hasOwnProperty('hide_label') && extra.value.options.hide_label == false)

function onIonChange({detail}) {
  theModel.value[0] = detail.value
}

</script>