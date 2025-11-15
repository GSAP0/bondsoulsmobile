<!-- EndChatButton.vue -->
<template>
  <div>
    <div class="text-center" v-if="loading">
      <ion-spinner></ion-spinner>
    </div>
    <ion-button v-else expand="block" color="danger" @click="openConfirm = true" style="text-transform: unset">
      Τερματισμός συνομιλίας
    </ion-button>

    <IonActionSheet
        :is-open="openConfirm"
        header="Είστε βέβαιοι;"
        :buttons="actionButtons"
        @didDismiss="openConfirm = false"
    />
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {
  IonSpinner,
  IonButton,
  IonActionSheet
} from '@ionic/vue'

import {shieldCheckmark} from 'ionicons/icons'
import {useMatching} from "@/composables/useMatching.js";

const matching = useMatching()

const openConfirm = ref(false)
const loading = ref(false)

const actionButtons = [
  {
    text: 'Τερματισμός',
    role: 'destructive',
    icon: shieldCheckmark,
    handler: () => {
      loading.value = true
      matching.finishMatching().then(() => window.location.href = '/feedback')
    }
  },
  {
    text: 'Άκυρο',
    role: 'cancel'
  }
]
</script>
