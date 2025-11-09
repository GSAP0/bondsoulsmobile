<template>
  <ion-page>
    <ion-header>
        <PageHeader>
          <ion-button @click="$router.push(`/profile_visit`)" class="font-semibold">
            Δες το ταίρι σου
          </ion-button>
        </PageHeader>
    </ion-header>

    <ion-content ref="contentRef" class="ion-padding content-chat" :fullscreen="true">

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

    <ion-footer class="ion-no-border">
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
  IonPage, IonHeader, IonContent, IonFooter,
  IonButton, IonIcon, IonTextarea, IonSpinner} from '@ionic/vue'

import {mic, send} from 'ionicons/icons'
import {ref, computed, onMounted, onUnmounted, nextTick} from 'vue'

import {useGlobal} from '@/composables/useGlobal'
import PageHeader from "@/components/PageHeader.vue";
import {useMatching} from "@/composables/useMatching.js";

const globalStore = useGlobal()
const {user} = globalStore

const matching = useMatching()
const { match } = matching

if(!match.value) window.location.href = '/'

const messages = ref([])
const messageText = ref('')
const loading = ref(true)
const isTyping = ref(false)
const isRecording = ref(false)
const contentRef = ref(null)
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
  const isMe = msg.sender_id === user.value.uuid
  const myColor = genderColor(user.value.gender)
  const otherColor = genderColor(match.value.user_info.gender)

  return isMe ? myColor : otherColor
}

function bubbleStyle(message) {
  return {'--bubble-bg': colorForMessage(message)}
}

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
    const res = await axios.post('conversation/messages', payload)
    messages.value.push(res.data)
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
        const res = await axios.post('conversation/messages', formData, {headers: {'Content-Type': 'multipart/form-data'}})
        messages.value.push(res.data)
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
        if (e.message.sender_id !== user.value.uuid) {
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