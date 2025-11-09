<!-- EndChatButton.vue -->
<template>
  <div>
    <ion-button expand="block" color="danger"  @click="openConfirm = true">
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
  IonButton,
  IonActionSheet
} from '@ionic/vue'
import {closeCircle, shieldCheckmark} from 'ionicons/icons'

const openConfirm = ref(false)

const emit = defineEmits(['endChat'])

const actionButtons = [
  {
    text: 'Τερματισμός',
    role: 'destructive',
    icon: shieldCheckmark,
    handler: () => emit('endChat')
  },
  {
    text: 'Άκυρο',
    role: 'cancel'
  }
]
</script>
