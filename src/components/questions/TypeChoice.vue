<template>
  <div>
    <div>
      <ion-radio-group v-model="theModelLocal"
                       allow-empty-selection
                       style="">
        <div :style="`width: calc(99%/${extra.grid? extra.grid + 1 : 1})`"
             v-for="option in extra.items"
             :key="option.value + option.title">
          <ion-item button
                    lines="none"
                    class="ion-margin-bottom"
                    color="light" v-bind="extra.options">
            <ion-radio :value="option.value">{{ option.title }}</ion-radio>
          </ion-item>
        </div>
      </ion-radio-group>
    </div>
  </div>
</template>
<script setup lang="ts">
import {IonItem, IonRadio, IonRadioGroup} from "@ionic/vue";
import {computed, ref, watch} from "vue";

const props = defineProps({
  question: {
    type: Object,
    required: true
  }
})

const extra = computed(() => {
  const empty = {
    items: []
  }
  if (!props.question) return empty
  if (!props.question.extra) return empty
  const extra = JSON.parse(props.question.extra)
  if (!extra.choice) return empty

  return extra.choice
})

const selected = defineModel({
  default: [],
  required: true
})

const theModelLocal = ref(selected.value[0] ?? null)

watch(theModelLocal, newModel => {
  selected.value = [newModel]
})
</script>