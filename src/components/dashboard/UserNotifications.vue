<template>
  <div>
    <div class="notif-wrap" role="button" aria-label="Άνοιγμα ειδοποιήσεων" @click="handleOpen">
      <div class="bell">🔔</div>
      <div v-if="globalStore.user.unread_notifications.length > 0" class="notifications-badge">
        {{ globalStore.user.unread_notifications.length }}
      </div>
    </div>

    <ion-modal id="example-modal" ref="modal" trigger="open-custom-dialog" :is-open="open" @didDismiss="open = false">
      <div :class="globalStore.currentTheme === 'dark' ? 'wrapper-dark theme-dark' : 'wrapper theme-white'">
        <h5 class="font-medium! ml-3 py-3 mt-3! mb-2! border-b-1 border-b-gray-100">Ειδοποιήσεις</h5>
        <div v-if="globalStore.user.notifications.length === 0" class="px-3 text-center">Καμία ειδοποίηση</div>

        <div class="notif-list">
          <div v-for="(n, i) in globalStore.user.notifications" :key="i" class="notif-item mb-2">
            <div class="notif-icon">{{ getIcon(n.type) }}</div>
            <div>
              <div class="notif-title">{{ getTitle(n.type) }}</div>
              <div>{{ getSubtitle(n) }}</div>
              <div class="notif-meta">{{ n.created_at }}</div>
            </div>
          </div>
        </div>
      </div>
    </ion-modal>
  </div>
</template>


<script setup lang="ts">
import {ref} from 'vue'
import {useGlobalStore} from "@/stores/globalStore";
import {storeToRefs} from "pinia";
import {IonModal} from "@ionic/vue";

const globalStore = useGlobalStore()
const {currentTheme} = storeToRefs(globalStore)

type NotifType = 'match_found' | 'user_rating' | 'admin_custom' | 'other'

const open = ref(false)

function getIcon(type: NotifType): string {
  if (type === 'admin_custom') return '✉️'
  if (type === 'match_found') return '✨'
  if (type === 'user_rating') return '⭐'

  return '🔔'
}

function getTitle(type: NotifType): string {
  if (type === 'admin_custom') return 'Μήνυμα συστήματος'
  if (type === 'match_found') return 'Βρέθηκε ματσάρισμα!'
  if (type === 'user_rating') return 'Νέα αξιολόγηση'

  return 'Ειδοποίηση'
}

function getSubtitle(n) {
  if (n.type === 'admin_custom') return n.data?.message ?? ''
  if (n.type === 'match_found') return 'Άνοιξε για να δεις το ταίριασμα'
  if (n.type === 'user_rating') return 'Κάποιος σε αξιολόγησε'

  return ''
}

function handleOpen(){
  open.value = true
  axios.post("notifications/readAll")
  globalStore.user.unread_notifications = []

}

</script>


<style>
/* Bell */
.notif-wrap {
  position: relative;
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border-radius: 16px;
  background: linear-gradient(180deg, rgba(10, 132, 255, 0.15), rgba(255, 45, 85, 0.15));
  border: 1px solid var(--border);
  cursor: pointer;
  transition: transform .15s ease;
}

.notif-wrap:hover {
  transform: translateY(-1px);
}

.bell {
  font-size: 20px;
}

.notifications-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: 22px;
  height: 22px;
  padding: 0 10px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: linear-gradient(90deg, var(--primary), var(--accent));
  color: white;
  font-size: 12px;
  font-weight: 700;
  border: 2px solid var(--bg);
}

ion-modal#example-modal {
  --width: fit-content - 10px;
  --min-width: 350px;
  --height: fit-content;
  --min-height: 200px;
  --border-radius: 15px;
  padding: 12px;
  --box-shadow: 0 28px 48px rgba(0, 0, 0, 0.4);
}


.modal-header h2 {
  margin: 0;
  font-size: 16px;
  letter-spacing: .3px;
}

.notif-list {
  max-height: 60vh;
  overflow: auto;

}

.notif-item {
  display: grid;
  grid-template-columns: 40px 1fr;
  gap: 12px;
  padding: 14px 16px;
  border: 1px solid rgba(255,255,255,0.60);
}

.notif-item:nth-child(odd) {
  background: linear-gradient(90deg, #0a84ff70, #ff2d5570);
}

.notif-item:nth-child(even) {
  background: linear-gradient(90deg, #0a84ff40, #ff2d5540);
}

.notif-item:last-child {
  border-bottom: 0;
}

.notif-icon {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.03);
  border: 1px solid var(--border);
  font-size: 18px;
}

.wrapper-dark{
  background: linear-gradient(180deg, #0A0E1A 0%, #10172A 100%);;
}

.wrapper{
  background: linear-gradient(90deg, rgba(10, 132, 255, 0.2), rgba(255, 45, 85, 0.2));
}

.notif-title {
  font-weight: 700;
  font-size: 14px;
}

.notif-message {
  color: var(--text);
  opacity: .9;
  font-size: 13px;
  margin-top: 2px;
}

.notif-meta {
  color: var(--muted);
  font-size: 12px;
  margin-top: 6px;
}

</style>