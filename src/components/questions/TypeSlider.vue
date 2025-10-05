<template>
  <div style="width: 100%;">
    <div class="bg-white rounded-2xl w-[]" style="width: 100%;">
      <div v-if="extra.multiple"></div>
      <div v-else class="px-10 py-4">
        <div class="text-black">
          <div class="flex justify-between align-bottom">
            <div>
              <div v-if="extra.options?.min_label && extra.options?.min_label">
                {{ extra.options.min_label }}
              </div>
            </div>
            <div>
              <div v-if="!extra.options.hasOwnProperty('hide_label') || extra.options.hasOwnProperty('hide_label') && extra.options.hide_label == false" class="text-4xl">{{ theModel[0] }}</div>
            </div>
            <div>
              <div v-if="extra.options?.max_label && extra.options?.max_label">
                {{ extra.options.max_label }}
              </div>
            </div>
          </div>
        </div>
        <ion-range :value="theModel[0]" @ionInput="onIonChange" v-bind="extra.options">
        </ion-range>
      </div>
    </div>
  </div>
</template>

<script setup>
import {IonRange} from "@ionic/vue";
import {computed, ref} from "vue";

const props = defineProps({
  question: {
    type: Object,
    required: true
  }
})

const test = ref(null)

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

function onIonChange({detail}) {
  theModel.value[0] = detail.value
}

</script>