<template>
  <div>
    <p class="text-black text-2xl mb-4">{{ extra.options?.multiple_max ? `${extra.options?.multiple_max} Επιλογές` : ''}}</p>
    <div style="flex-grow: 1;width: 100%;">
      <div :style="`width: calc(99%/${extra.grid? extra.grid + 1 : 1})`" v-for="option in extra.items"
           :key="option.value + option.title"
      >
        <ion-item
            button
            class="ion-margin-bottom rounded-lg"
            :color="theModel.includes(option.value) ? 'primary' : 'light'">
          <ion-checkbox :checked="theModel.includes(option.value)"
                        :value="option.value"
                        @ionChange="handleChange(option.value)"
                        justify="space-between"
                        >
            <div class="my-label" :class="theModel.includes(option.value) ? 'text-white!' : 'text-black'">
              {{ option.title }}
            </div>
          </ion-checkbox>
        </ion-item>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {IonItem, IonCheckbox} from "@ionic/vue";
import {computed} from "vue";

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
  if (!extra.multi_choice) return empty

  return extra.multi_choice
})

const theModel = defineModel({
  required: true,
  default: []
})

function handleChange(v) {
  if (theModel.value.includes(v)) theModel.value = theModel.value.filter(item => item !== v)
  else {
    const max = extra.value?.options?.multiple_max ?? -1
    if(max > 0 && theModel.value.length >= max){
      theModel.value[0] = v
    }else {
      theModel.value.push(v)
    }
  }
}
</script>

<style>
.my-label {
  white-space: normal;
  overflow: visible;
  text-overflow: unset;
}
</style>