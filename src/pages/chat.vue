<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button  default-href="/dashboard"></ion-back-button>
        </ion-buttons>
        <ion-title @click="$router.push(`/profile_visit`)" class="cursor-pointer">
          <div class="flex items-center gap-2">
            <div class="flex-1">
              <div class="font-semibold">{{ otherUser?.name || 'Chat' }}</div>
              <div class="text-xs opacity-70">{{ isOnline ? 'Συνδεδεμένος' : 'Αποσυνδεδεμένος' }}</div>
            </div>
          </div>
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content ref="contentRef" class="ion-padding demo-wrap content-chat" :fullscreen="true" :data-theme="currentTheme">
      <div v-if="loading" class="flex justify-center items-center h-full">
        <ion-spinner></ion-spinner>
      </div>
      <div v-else class="messages-container">
        <div
            v-for="message in messages"
            :key="message.id"
            :class="['message-wrapper', message.sender_id === user?.uuid ? 'sent' : 'received']"
            :style="bubbleStyle(message)"
        >

          <div class="message-bubble">
            <div v-if="message.type === 'text'" class="message-text">
              {{ message.content }}
            </div>

            <div v-else-if="message.type === 'image'" class="message-media">
              <img :src="message.content" @click="openMedia(message.content)"
                   class="rounded-lg max-w-xs cursor-pointer"/>
            </div>

            <div v-else-if="message.type === 'video'" class="message-media">
              <video :src="message.content" controls class="rounded-lg max-w-xs"></video>
            </div>

            <div v-else-if="message.type === 'voice'" class="message-media">
              <audio :src="message.content" controls class="w-64"></audio>
            </div>

            <div class="message-time">
              {{ formatTime(message.created_at) }}
            </div>
          </div>
        </div>
      </div>
      <div v-if="isTyping" class="typing-indicator px-4 py-2 text-sm text-end">Πληκτρολογεί...</div>
    </ion-content>

    <ion-footer>
      <div class="message-input-container">
        <ion-button fill="clear" @click="toggleVoiceRecording" :class="['media-button', { 'recording': isRecording }]">
          <ion-icon :icon="mic" slot="icon-only"></ion-icon>
        </ion-button>
        <ion-textarea
            v-model="messageText"
            placeholder="Γράψε ένα μήνυμα..."
            :auto-grow="true"
            :rows="1"
            @ionInput="handleTyping"
            class="message-input"
        ></ion-textarea>
        <ion-button :loading="sendLoading" @click="sendMessage()" fill="clear" :disabled="!canSend" class="send-button">
          <ion-icon style="color: blue" :icon="send" slot="icon-only"></ion-icon>
        </ion-button>
      </div>
    </ion-footer>
  </ion-page>
</template>


<script setup>

import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonFooter,
  IonButton, IonIcon, IonTextarea, IonSpinner, IonButtons, IonBackButton, IonModal
} from '@ionic/vue'

import {mic, send} from 'ionicons/icons'

import {ref, computed, onMounted, onUnmounted, nextTick} from 'vue'

import {useGlobalStore} from '@/stores/globalStore'
import {storeToRefs} from "pinia";

const globalStore = useGlobalStore()
const {currentTheme} = storeToRefs(globalStore)

const user = computed(() => globalStore.user)
const otherUser = computed(() => {
  if(globalStore.user.uuid === globalStore.user.match.user1.uuid) return globalStore.user.match.user2
  return globalStore.user.match.user1
})

const messages = ref([])
const messageText = ref('')
const loading = ref(true)
const isTyping = ref(false)
const isRecording = ref(false)
const contentRef = ref(null)
const showUserDetails = ref(false)
const sendLoading = ref(false)
const isOnline = ref(false)

const echo = window.echo

let typingTimer = null
let mediaRecorder = null
let audioChunks = []

const canSend = computed(() => messageText.value.trim().length > 0)

function genderColor(g) {
  if (!g) return '#8E9BAA'
  if (g === 'male' || g === 'Άντρας') return '#0A84FF'
  if (g === 'female' || g === 'Γυναίκα') return '#FF2D55'

  return '#8E9BAA'
}

function colorForMessage(msg) {
  const isMe = msg.sender_id === user?.value.uuid
  const myColor = genderColor(user.value.gender)
  const otherColor = genderColor(otherUser.value.gender)

  return isMe ? myColor : otherColor
}

function bubbleStyle(message) {
  return {'--bubble-bg': colorForMessage(message)}
}

const otherUserAge = computed(() => {
  if (!otherUser.value?.birthdate) return null
  const birthDate = window.moment ? window.moment(otherUser.value.birthdate) : null
  if (!birthDate) return null
  const now = window.moment()

  return now.diff(birthDate, 'years')
})

const formatTime = (timestamp) => {
  return window.moment ? window.moment(timestamp).format('HH:mm') : ''
}

const scrollToBottom = async () => {
  await nextTick()
  if (contentRef.value) {
    contentRef.value.$el.scrollToBottom(0)
  }
}

const loadMessages = async () => {
  try {
    const response = await axios.get('conversation', {params: {match_id: user.value.match_id}})
    messages.value = response.data
    scrollToBottom()

  } catch (error) {
    console.error('Error loading messages:', error)
  } finally {
    loading.value = false
  }
}

const sendMessage = async (type = 'text', content = null) => {
  if (!canSend.value && !content) return
  sendLoading.value = true
  const payload = {match_id: user.value.match_id, type, content: content || messageText.value.trim()}
  messageText.value = ''
  try {
    await axios.post('conversation/messages', payload)
    scrollToBottom()
  } catch (error) {
    console.error('Error sending message:', error)
  } finally {
    sendLoading.value = false
  }
}

const handleTyping = () => {
  if (!echo) return
  echo.private(`chat.${user.value.match_id}`).whisper('typing', {user_id: user.value.uuid, typing: true})
  clearTimeout(typingTimer)
  typingTimer = setTimeout(() => {
    echo.private(`chat.${user.value.match_id}`).whisper('typing', {user_id: user.value.uuid, typing: false})
  }, 5000)
}

const toggleVoiceRecording = async () => {
  isRecording.value ? stopRecording() : startRecording()
}

const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({audio: true})
    mediaRecorder = new MediaRecorder(stream)
    audioChunks = []
    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data)
    }

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, {type: 'audio/webm'})
      const formData = new FormData()
      formData.append('file', audioBlob, 'voice-message.webm')
      formData.append('match_id', user.value.match_id)
      formData.append('type', 'voice')
      try {
        await axios.post('conversation/messages', formData, {headers: {'Content-Type': 'multipart/form-data'}})
        scrollToBottom()
      } catch (error) {
        console.error('Error uploading voice message:', error)
      }
      stream.getTracks().forEach(track => track.stop())
    }

    mediaRecorder.start()
    isRecording.value = true
  } catch (error) {
    console.error('Error accessing microphone:', error)
  }

}


const stopRecording = () => {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop()
    isRecording.value = false
  }
}

const initializeWebSocket = () => {
  if (!echo) {
    console.warn('Echo not initialized.');
    return
  }

  echo.private(`chat.${user.value.match_id}`)
      .listen('MessageSent', (e) => {
        if (e.message.sender_id !== user.value.id) {
          messages.value.push(e.message)
          scrollToBottom()
        }
      })
      .listenForWhisper('typing', (e) => {
        if (e.user_id !== user.value.id) {
          isTyping.value = e.typing
        }
      })

  echo.join(`chat.${user.value.match_id}`)
      .here((users) => {
        isOnline.value = users.some(u => u.uuid !== user.value.uuid)
      })
      .joining((joiningUser) => {
        if (joiningUser.uuid !== user.value.uuid) {
          isOnline.value = true
        }
      })
      .leaving((leavingUser) => {
        if (leavingUser.uuid !== user.value.uuid) {
          isOnline.value = false
        }
      })
}

onMounted(async () => {
  await loadMessages();
  initializeWebSocket()
})

onUnmounted(() => {
  if (echo) {
    echo.leave(`chat.${user.value.match_id}`);
    echo.disconnect()
  }

  if (typingTimer) {
    clearTimeout(typingTimer)
  }

  if (isRecording.value) {
    stopRecording()
  }
})

</script>


<style scoped>


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

.demo-wrap {
  background: var(--bg);
  color: var(--text);
}

.typing-indicator {
  position: fixed;
  right: 10px;
  bottom: 71px;
  font-style: italic;
  text-shadow: 0px 0px 3px #d9d8d8;
  color: #a5a2a2;
}

.muted {
  color: var(--muted);
}


.messages-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-bottom: 20px;
}

.message-wrapper {
  display: flex;
  width: 100%;
}

.message-wrapper.sent {
  justify-content: flex-start;
}

.message-wrapper.received {
  justify-content: flex-end;
}

.message-bubble {

  max-width: 80%;
  padding: 10px 14px;
  border-radius: 18px;
  position: relative;

  background: var(--bubble-bg);
  color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.06);

}

.message-wrapper.sent .message-bubble {
  border-bottom-left-radius: 6px;
}

.message-wrapper.received .message-bubble {
  border-bottom-right-radius: 6px;
}

.message-text {
  word-wrap: break-word;
  white-space: pre-wrap;
}

.message-time {
  font-size: 11px;
  margin-top: 4px;
  opacity: 0.8;
  text-align: right;
}


.message-media img, .message-media video {
  max-width: 100%;
  height: auto;
  border-radius: 12px;
  border: 1px solid var(--border);
}

.message-input-container {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 10px;
  background: var(--card);
  border-top: 1px solid var(--border);
}

.media-button {
  flex-shrink: 0;
  margin: 0;
}

.media-button.recording {
  color: #ff4d4f;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1
  }
  50% {
    opacity: .5
  }
}


.message-input {
  flex: 1;
  font-size: 16px;
  min-height: 36px;
  --color: var(--text);
  --placeholder-color: var(--muted);
}

.send-button {
  flex-shrink: 0;
  margin: 0;
  width: 44px;
  height: 44px;
  border-radius: 14px;
}

.content-chat{
  overflow: hidden;
  --background: none;
  background-color: #ccc;
  background: url('/assets/images/bgSurvey.png') no-repeat center center;
  background-size: cover;
}

</style>