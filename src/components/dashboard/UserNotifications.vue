<template>
  <div class="demo-wrap" :data-theme="currentTheme">
    <div class="notif-wrap" role="button" aria-label="Άνοιγμα ειδοποιήσεων" @click="open = true">
      <div class="bell">🔔</div>
      <div v-if="unreadCount > 0" class="notifications-badge">{{ unreadCount }}</div>
    </div>

    <div v-if="open" class="modal-overlay" @click="open = false">
      <div class="modal-card" @click.stop role="dialog" aria-modal="true">
        <div class="modal-header">
          <h2>Ειδοποιήσεις</h2>
          <button class="close-btn" @click="open = false" aria-label="Κλείσιμο">✕</button>
        </div>

        <div class="notif-list">
          <div v-if="globalStore.user.notifications.length === 0" class="notif-item empty">Καμία ειδοποίηση</div>
          <div v-for="(n, i) in globalStore.user.notifications" :key="i" class="notif-item">
            <div class="notif-icon">{{ getIcon(n.type) }}</div>
            <div>
              <div class="notif-title">{{ getTitle(n.type) }}</div>
              <div>{{ getSubtitle(n) }}</div>
              <div class="notif-meta">{{ n.created_at }}</div>
            </div>
          </div>
        </div>

        <div class="footer">
          <button class="btn secondary" @click="open = false">Κλείσιμο</button>
          <button class="btn primary" @click="open = false">ΟΚ</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import {ref} from 'vue'
import {useGlobalStore} from "@/stores/globalStore";
import {storeToRefs} from "pinia";

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

</script>


<style>
:root {
  --bg: #F2F2F7;
  --card: #FFFFFF;
  --muted: #6B7280;
  --text: #11181C;
  --primary: #0A84FF;
  --accent: #FF2D55;
  --border: rgba(0, 0, 0, 0.08);
}


[data-theme="dark"] {
  --bg: #0A0E1A;
  --card: #0F1424;
  --muted: #9AA3AF;
  --text: #F5F7FA;
  --primary: #0A84FF;
  --accent: #FF2D55;
  --border: rgba(255, 255, 255, 0.08);
}

* {
  box-sizing: border-box;
}


/* IonContent root */

.demo-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg);
  color: var(--text);
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Inter, "Helvetica Neue", Arial;
}


/* Bell */

.notif-wrap {
  position: relative;
  width: 56px;
  height: 56px;
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
  font-size: 22px;
}

.notifications-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: linear-gradient(90deg, var(--primary), var(--accent));
  color: white;
  font-size: 12px;
  font-weight: 700;
  border: 2px solid var(--bg);
}


/* Modal */

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: grid;
  place-items: center;
  padding: 16px;
  z-index: 50;
}

.modal-card {
  width: 100%;
  max-width: 420px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  animation: pop .16s ease-out;
}

@keyframes pop {
  from {
    transform: translateY(6px);
    opacity: .7;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}


.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px;
  border-bottom: 1px solid var(--border);
}

.modal-header h2 {
  margin: 0;
  font-size: 16px;
  letter-spacing: .3px;
}

.close-btn {
  background: transparent;
  color: var(--muted);
  border: 0;
  font-size: 18px;
  cursor: pointer;
  padding: 6px 8px;
  border-radius: 10px;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.03);
  color: var(--text);
}


.notif-list {
  max-height: 60vh;
  overflow: auto;
  padding: 6px 2px;
}

.notif-item {
  display: grid;
  grid-template-columns: 40px 1fr;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--border);
}

.notif-item:last-child {
  border-bottom: 0;
}

.notif-item.empty {
  text-align: center;
  color: var(--muted);
  padding: 28px 0;
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


[data-theme="dark"] .notif-icon {
  background: rgba(255, 255, 255, 0.06);
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


/* Small CTA row */

.footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 16px 16px;
  border-top: 1px solid var(--border);
}

.btn {
  appearance: none;
  border: 0;
  border-radius: 12px;
  padding: 10px 14px;
  font-weight: 600;
  cursor: pointer;
}

.btn.secondary {
  background: rgba(0, 0, 0, 0.03);
  color: var(--text);
  border: 1px solid var(--border);
}

[data-theme="dark"] .btn.secondary {
  background: rgba(255, 255, 255, 0.06);
}

.btn.primary {
  background: linear-gradient(90deg, var(--primary), var(--accent));
  color: white;
}

</style>