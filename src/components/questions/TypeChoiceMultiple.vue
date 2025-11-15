<template>
  <div>
    <p class="text-black text-2xl mb-4">{{ extra.options?.multiple_max ? `Μέχρι ${extra.options?.multiple_max} επιλογές` : ''}}</p>
    <div style="flex-grow: 1;width: 100%;" v-if="!hasImage">
      <div :style="`width: calc(99%/${extra.grid? extra.grid + 1 : 1})`" v-for="option in extra.items"
           :key="option.value + option.title"
      >
        <ion-item
            button
            class="ion-margin-bottom rounded-lg"
            :color="theModel.includes(option.value) ? 'primary' : 'light'">
          <ion-checkbox :checked="theModel.includes(option.value)"
                        :value="option.value"
                        @ionChange.stop.prevent="handleChange(option.value)"
                        justify="space-between"
                        >
            <div class="my-label" :class="theModel.includes(option.value) ? 'text-white!' : 'text-black'">
              {{ option.title }}
            </div>
          </ion-checkbox>
        </ion-item>
      </div>
    </div>
    <div v-else class="flex flex-wrap">
      <div @click="handleChange(option.value)" style="width: calc(50% - 10px); margin-left: 10px;" class="mb-2 drop-shadow-xl" :class="theModel.includes(option.value) ? 'selected' : ''" v-for="option in extra.items" :key="option.value + option.title">
        <ion-img class="" v-if="option.image" :src="option.image"></ion-img>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {IonItem, IonCheckbox, IonImg} from "@ionic/vue";
import {computed} from "vue";

const props = defineProps({
  question: {
    type: Object,
    required: true
  }
})

const theModel = defineModel({
  required: true,
  default: []
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

const hasImage = computed(() => extra.value.items.some(it => !!it.image))

function handleChange(v) {
  if (theModel.value.includes(v)) theModel.value = theModel.value.filter(item => item !== v)
  else {
    const max = extra.value?.options?.multiple_max ?? -1
    if(max > 0 && theModel.value.length >= max){
      return
      // theModel.value[0] = v
    }else {
      theModel.value.push(v)
    }
  }
}
</script>

<style scoped>
.my-label {
  white-space: normal;
  overflow: visible;
  text-overflow: unset;
}

.selected{
  background: linear-gradient(to right, #1780f7, #f1325f);
  padding: 2px;
}
</style>