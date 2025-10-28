<template>
  <ion-page>
    <ion-header>
      <PageHeader title="Ειδοποίηση" default-href="/dashboard"/>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <div v-if="notification" class="">
        <div class="">

          <h2 class="text-xl font-semibold mb-2">{{ getNotificationTitle(notification) }}</h2>
          <p class="text-gray-600 dark:text-gray-400 mb-4">{{ notification.data?.message }}</p>

          <div class="text-xs text-gray-400 mt-4 flex items-center justify-between">
            <span>{{ formatDateTime(notification.created_at) }}</span>
            <span v-if="notification.read_at" class="text-green-500">✓ Αναγνωσμένο</span>
            <span v-else class="text-orange-500">● Νέο</span>
          </div>
        </div>
      </div>

    </ion-content>
  </ion-page>
</template>

<script setup>
import {ref, onMounted, computed} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import {
  IonPage,
  IonHeader,
  IonContent,
  IonButton,
  IonFooter,
} from '@ionic/vue'

import {useGlobal} from '@/composables/useGlobal'
import PageHeader from '@/components/PageHeader.vue'
import { formatDateTime } from '@/helpers.js'

const router = useRouter()
const route = useRoute()
const {user} = useGlobal()

const notificationId = route.query.id
const notification = computed(() => user.value.notifications.find(n => n.id === notificationId))


const getNotificationTitle = (notification) => {
  if (!notification) return 'Ειδοποίηση'

  const typeMap = {
    'admin_custom': 'Ειδοποίηση από το Σύστημα',
    'match': 'Νέο Match',
    'message': 'Νέο Μήνυμα',
    'like': 'Σας άρεσε κάποιος'
  }

  return typeMap[notification.type] || 'Ειδοποίηση'
}

const markAsRead = async () => {
  try {
    await axios.post(`notifications/${notification.value.id}/read`)
    notification.value.read_at = new Date()

    // Ενημέρωση του notification στο user object
    if (user.value?.notifications) {
      const index = user.value.notifications.findIndex(n => n.id === notification.value.id)
      if (index !== -1) {
        user.value.notifications[index].read_at = notification.value.read_at
      }
    }
  } catch (error) {
    console.error('Error marking notification as read:', error)
  }
}

onMounted(() => {
  if (!notification.value) window.location.href = '/'
  else markAsRead()
})
</script>

<style scoped>
ion-content {
  --background: var(--ion-background-color);
}
</style>
