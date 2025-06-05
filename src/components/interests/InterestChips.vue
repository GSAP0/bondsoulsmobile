<template>
  <div class="">
    <ion-chip
        class="px-3 mb-2 mr-3"
        v-for="interest in globalStore.interests"
        :key="interest.id"
        :color="isActiveInterest(interest) ? 'success' : 'primary'"
        @click="toggleInterest(interest)"
    >
      <ion-icon v-if="isActiveInterest(interest)" :icon="checkmark"></ion-icon>
      <ion-label>{{ interest.interest }}</ion-label>
    </ion-chip>
  </div>
</template>
<script setup>
import {checkmark} from "ionicons/icons";
import {IonChip, IonIcon, IonLabel} from "@ionic/vue";
import {useGlobalStore} from "@/stores/globalStore";
import {storeToRefs} from "pinia";
import {nextTick, onBeforeUnmount, onMounted, ref, watch} from "vue";

const globalStore = useGlobalStore()
const { user } = storeToRefs(globalStore)
const selectedInterests = ref([]);

function isActiveInterest(interest){
  return selectedInterests.value.find(i => i.id === interest.id) !== undefined
}

function toggleInterest(interest) {
  if (isActiveInterest(interest)) {
    selectedInterests.value = selectedInterests.value.filter((i) => i.id !== interest.id);
  } else {
    selectedInterests.value.push(interest);
  }
}

onMounted(async () => {
  selectedInterests.value = []
  user.value.interests.forEach(interest => {
    const foundInterest = globalStore.interests.find(i => i.id === interest.interest_id)
    if(foundInterest) selectedInterests.value.push(JSON.parse(JSON.stringify(foundInterest)))
  })

  await nextTick()

  watch(selectedInterests, async (newValue) => {
    await axios.put(`interests`, {
      interests: newValue
    })
    await globalStore.loadUser()
  }, {
    deep: true
  });
})
</script>