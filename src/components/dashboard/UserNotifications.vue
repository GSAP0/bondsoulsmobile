<template>
  <div style="position: relative" @click="handleOpen">
    <ion-icon style="font-size: 2.5rem" :icon="notifications"></ion-icon>
    <div class="notifications-badge">
      {{ globalStore.user.unread_notifications.length }}
    </div>
  </div>
  <ion-modal :is-open="isOpen">
    <ion-header>
      <ion-toolbar>
        <ion-title>Ειδοποιήσεις</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="isOpen = false">Κλείσιμο</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-list>
        <ion-item v-for="(notif,idx) in globalStore.user.notifications" :key="notif.id">
            <span slot="start">
            {{ idx + 1 }}
            </span>
          <ion-label class="ml-3">
            <div>
              <div v-if="notif.type === 'admin_custom'">
                {{ notif.data.message }}
              </div>
              <div v-if="notif.type === 'match_found'">
                Βρέθηκε ματσάρισμα !
              </div>
              <div v-if="notif.type === 'user_rating'">
                Έχεις μια νέα αξιολόγηση !
              </div>
              <p><small>{{ notif.created_at }}</small></p>
            </div>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-modal>
</template>

<script setup>
import {useGlobalStore} from "@/stores/globalStore.js";
import {IonIcon, IonContent, IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle} from "@ionic/vue";
import {notifications} from "ionicons/icons";
import {ref} from "vue";

const globalStore = useGlobalStore()

const isOpen = ref(false)

function handleOpen(){
  isOpen.value = true
  axios.post(`/notifications/readAll`)
  globalStore.user.unread_notifications = []
}
</script>

<style scoped>
.notifications-badge {
  position: absolute;
  right: 0;
  top: 0;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.95rem;
  background: var(--ion-color-secondary);
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 10;
}
</style>