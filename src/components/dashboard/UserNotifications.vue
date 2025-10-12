<!-- UserNotifications.vue -->

<template>

  <!-- Bell + Badge -->

  <div class="notif-wrap" @click="openModal">

    <ion-icon class="bell" :icon="notifications"></ion-icon>

    <div v-if="unreadCount>0" class="notifications-badge">{{ unreadCount }}</div>

  </div>



  <!-- Modal -->

  <ion-modal :is-open="isOpen" @didDismiss="isOpen=false">

    <ion-header>

      <ion-toolbar>

        <ion-title>Ειδοποιήσεις</ion-title>

        <ion-buttons slot="end">

          <ion-button @click="isOpen=false">Κλείσιμο</ion-button>

        </ion-buttons>

      </ion-toolbar>

    </ion-header>



    <ion-content class="ion-padding">

      <div class="card">

        <ion-list class="list" lines="none">

          <!-- empty -->

          <ion-item v-if="(notifs?.length ?? 0)===0" class="rounded-item">

            <ion-label><h2>Καμία ειδοποίηση</h2></ion-label>

          </ion-item>



          <!-- items -->

          <ion-item

              v-for="(n,idx) in notifs"

              :key="n.id ?? idx"

              class="rounded-item"

              button

          >

            <ion-icon :icon="getIcon(n.type)" slot="start" class="notif-icon"/>

            <ion-label>

              <h2>{{ renderTitle(n) }}</h2>

              <p>{{ renderSubtitle(n) }}</p>

              <p class="notif-meta">{{ n.created_at }}</p>

            </ion-label>

          </ion-item>

        </ion-list>

      </div>

    </ion-content>

  </ion-modal>

</template>



<script setup>

import { ref, computed } from 'vue'

import {

  IonIcon, IonModal, IonHeader, IonToolbar, IonTitle,

  IonButtons, IonButton, IonContent, IonList, IonItem, IonLabel

} from '@ionic/vue'

import { notifications, mailOutline, starOutline, sparklesOutline } from 'ionicons/icons'

import axios from 'axios'

import { useGlobalStore } from '@/stores/globalStore'



const globalStore = useGlobalStore()

const isOpen = ref(false)



const notifs = computed(() => globalStore.user?.notifications ?? [])

const unreadCount = computed(() => globalStore.user?.unread_notifications?.length ?? 0)



async function openModal () {

  isOpen.value = true

  try { await axios.post('/notifications/readAll') } catch {}

  if (globalStore.user) globalStore.user.unread_notifications = []

}



function renderTitle(n) {

  if (n.type === 'admin_custom') return 'Μήνυμα διαχειριστή'

  if (n.type === 'match_found') return 'Βρέθηκε ματσάρισμα!'

  if (n.type === 'user_rating') return 'Νέα αξιολόγηση'

  return 'Ειδοποίηση'

}



function renderSubtitle(n) {

  if (n.type === 'admin_custom') return n.data?.message ?? ''

  if (n.type === 'match_found') return 'Άνοιξε για να δεις το ταίριασμα'

  if (n.type === 'user_rating') return 'Κάποιος σε αξιολόγησε'

  return ''

}



function getIcon(t) {

  if (t === 'admin_custom') return mailOutline

  if (t === 'match_found') return sparklesOutline

  if (t === 'user_rating') return starOutline

  return notifications

}

</script>



<style scoped>

/* bell */

.notif-wrap { position: relative; cursor: pointer; }

.bell { font-size: 2rem; color: var(--rowText); }



/* badge */

.notifications-badge {

  position: absolute;

  right: -4px;

  top: -4px;

  min-width: 18px;

  height: 18px;

  padding: 0 5px;

  border-radius: 12px;

  display: flex;

  align-items: center;

  justify-content: center;

  font-weight: 700;

  font-size: 11px;

  background: #FF2D55;

  color: #fff;

  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

  z-index: 10;

}



/* κάρτα */

.card {

  border-radius: 24px;

  background: var(--rowBg);

  border: 1px solid var(--rowBorder);

  padding: 8px;

}



/* rounded items */

.list { padding: 0; }

.rounded-item {

  --background: var(--rowBg);

  --border-radius: 16px;

  border-radius: 16px;

  border: 1px solid var(--rowBorder);

  margin: 8px 0;

  overflow: hidden;

}



ion-item h2 { font-size: 1rem; font-weight: 600; margin: 0 0 4px 0; color: var(--rowText); }

ion-item p { font-size: 0.85rem; margin: 0; color: var(--muted); }

.notif-meta { font-size: 0.75rem; opacity: 0.7; margin-top: 2px; }



.notif-icon {

  font-size: 1.3rem;

  color: var(--muted);

  margin-right: 12px;

}

</style>