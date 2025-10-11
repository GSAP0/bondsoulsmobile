<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/dashboard"></ion-back-button>
        </ion-buttons>
        <ion-title @click="showUserDetails = true" class="cursor-pointer">
          <div class="flex items-center gap-2">
            <img
              v-if="otherUser?.image"
              :src="otherUser.image"
              class="w-8 h-8 rounded-full object-cover"
            />
            <div class="flex-1">
              <div class="font-semibold">{{ otherUser?.name || 'Chat' }}</div>
              <div class="text-xs opacity-70">{{ isOnline ? 'Συνδεδεμένος' : 'Αποσυνδεδεμένος' }}</div>
            </div>
          </div>
        </ion-title>
      </ion-toolbar>
      <div v-if="isTyping" class="typing-indicator px-4 py-2 text-sm text-gray-600">
        Γράφει...
      </div>
    </ion-header>

    <ion-content ref="contentRef" class="ion-padding">
      <div v-if="loading" class="flex justify-center items-center h-full">
        <ion-spinner></ion-spinner>
      </div>

      <div v-else class="messages-container">
        <div
          v-for="message in messages"
          :key="message.id"
          :class="['message-wrapper', message.user_id === user?.id ? 'sent' : 'received']"
        >
          <div class="message-bubble">
            <div v-if="message.type === 'text'" class="message-text">
              {{ message.content }}
            </div>

            <div v-else-if="message.type === 'image'" class="message-media">
              <img :src="message.content" @click="openMedia(message.content)" class="rounded-lg max-w-xs cursor-pointer" />
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
    </ion-content>

    <ion-footer>
      <div class="message-input-container">
        <ion-button
          fill="clear"
          @click="selectMedia('image')"
          class="media-button"
        >
          <ion-icon :icon="image" slot="icon-only"></ion-icon>
        </ion-button>

        <ion-button
          fill="clear"
          @click="selectMedia('video')"
          class="media-button"
        >
          <ion-icon :icon="videocam" slot="icon-only"></ion-icon>
        </ion-button>

        <ion-button
          fill="clear"
          @click="toggleVoiceRecording"
          :class="['media-button', { 'recording': isRecording }]"
        >
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

        <ion-button
          @click="sendMessage()"
          :disabled="!canSend"
          fill="solid"
          shape="round"
          class="send-button"
        >
          <ion-icon :icon="send" slot="icon-only"></ion-icon>
        </ion-button>
      </div>

      <input
        ref="fileInput"
        type="file"
        :accept="mediaAccept"
        @change="handleFileSelect"
        style="display: none"
      />
    </ion-footer>

    <ion-modal :is-open="showUserDetails" @did-dismiss="showUserDetails = false">
      <ion-header>
        <ion-toolbar>
          <ion-title>Προφίλ</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="showUserDetails = false">Κλείσιμο</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <div v-if="otherUser" class="flex flex-col items-center">
          <img
            v-if="otherUser.image"
            :src="otherUser.image"
            class="w-32 h-32 rounded-full object-cover mb-4"
          />
          <h2 class="text-2xl font-bold mb-2">{{ otherUser.name }}</h2>
          <p v-if="otherUserAge" class="text-gray-600 mb-2">{{ otherUserAge }} χρόνων</p>
          <div class="flex items-center gap-2 mb-4">
            <div :class="['w-3 h-3 rounded-full', isOnline ? 'bg-green-500' : 'bg-gray-400']"></div>
            <span class="text-sm">{{ isOnline ? 'Συνδεδεμένος' : 'Αποσυνδεδεμένος' }}</span>
          </div>
          <div v-if="otherUser.bio" class="w-full mt-4">
            <h3 class="font-semibold mb-2">Βιογραφικό</h3>
            <p class="text-gray-700">{{ otherUser.bio }}</p>
          </div>
          <div v-if="otherUser.ratings_avg" class="w-full mt-4">
            <h3 class="font-semibold mb-2">Αξιολόγηση</h3>
            <p class="text-gray-700">{{ otherUser.ratings_avg }} / 5</p>
          </div>
        </div>
      </ion-content>
    </ion-modal>
  </ion-page>
</template>

<script setup>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonFooter,
  IonButton,
  IonIcon,
  IonTextarea,
  IonSpinner,
  IonButtons,
  IonBackButton,
  IonModal,
} from '@ionic/vue';
import { image, videocam, mic, send } from 'ionicons/icons';
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { useGlobalStore } from '@/stores/globalStore';
import moment from 'moment';

const globalStore = useGlobalStore();
const user = computed(() => globalStore.user);

const messages = ref([]);
const messageText = ref('');
const loading = ref(true);
const isTyping = ref(false);
const isRecording = ref(false);
const mediaAccept = ref('');
const fileInput = ref(null);
const contentRef = ref(null);
const showUserDetails = ref(false);
const otherUser = ref(null);
const isOnline = ref(false);

const echo = window.echo
let typingTimer = null;
let mediaRecorder = null;
let audioChunks = [];

const canSend = computed(() => messageText.value.trim().length > 0);

const otherUserAge = computed(() => {
  if (!otherUser.value?.birthdate) return null;
  const birthDate = moment(otherUser.value.birthdate);
  const now = moment();
  return now.diff(birthDate, 'years');
});

const formatTime = (timestamp) => {
  return moment(timestamp).format('HH:mm');
};

const scrollToBottom = async () => {
  await nextTick();
  if (contentRef.value) {
    contentRef.value.$el.scrollToBottom(300);
  }
};

const loadMessages = async () => {
  try {
    const response = await axios.get('conversation', {
      params: { match_id: user.value.match_id }
    });
    messages.value = response.data;

    if (user.value.match) {
      const isUser1 = user.value.match.user1_id === user.value.id;
      otherUser.value = isUser1 ? user.value.match.user2 : user.value.match.user1;
    }

    scrollToBottom();
  } catch (error) {
    console.error('Error loading messages:', error);
  } finally {
    loading.value = false;
  }
};

const sendMessage = async (type = 'text', content = null) => {
  if (!canSend.value && !content) return;

  const payload = {
    match_id: user.value.match_id,
    type: type,
    content: content || messageText.value.trim(),
  };

  try {
    const response = await axios.post('conversation/messages', payload);
    messageText.value = '';
    scrollToBottom();
  } catch (error) {
    console.error('Error sending message:', error);
  }
};

const handleTyping = () => {
  if (!echo) return;

  echo.private(`chat.${user.value.match_id}`)
    .whisper('typing', {
      user_id: user.value.id,
      typing: true
    });

  clearTimeout(typingTimer);
  typingTimer = setTimeout(() => {
    echo.private(`chat.${user.value.match_id}`)
      .whisper('typing', {
        user_id: user.value.id,
        typing: false
      });
  }, 1000);
};

const selectMedia = (type) => {
  if (type === 'image') {
    mediaAccept.value = 'image/*';
  } else if (type === 'video') {
    mediaAccept.value = 'video/*';
  }
  fileInput.value.click();
};

const handleFileSelect = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('match_id', user.value.match_id);
  formData.append('type', file.type.startsWith('image') ? 'image' : 'video');

  try {
    const response = await axios.post('conversation/messages', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    scrollToBottom();
  } catch (error) {
    console.error('Error uploading media:', error);
  }

  event.target.value = '';
};

const toggleVoiceRecording = async () => {
  if (isRecording.value) {
    stopRecording();
  } else {
    startRecording();
  }
};

const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      const formData = new FormData();
      formData.append('file', audioBlob, 'voice-message.webm');
      formData.append('match_id', user.value.match_id);
      formData.append('type', 'voice');

      try {
        await axios.post('conversation/messages', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        scrollToBottom();
      } catch (error) {
        console.error('Error uploading voice message:', error);
      }

      stream.getTracks().forEach(track => track.stop());
    };

    mediaRecorder.start();
    isRecording.value = true;
  } catch (error) {
    console.error('Error accessing microphone:', error);
  }
};

const stopRecording = () => {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
    isRecording.value = false;
  }
};

const openMedia = (url) => {
  window.open(url, '_blank');
};

const initializeWebSocket = () =>
{
  if (!echo) {
    console.warn('Echo is not initialized. WebSocket features will be disabled.');
    return;
  }

  echo.private(`chat.${user.value.match_id}`)
    .listen('MessageSent', (e) => {
      if (e.message.sender_id !== user.value.id) {
        messages.value.push(e.message);
        scrollToBottom();
      }
    })
    .listenForWhisper('typing', (e) => {
      if (e.user_id !== user.value.id) {
        isTyping.value = e.typing;
      }
    });

  echo.join(`chat.${user.value.match_id}`)
    .here((users) => {
      isOnline.value = users.some(u => u.id !== user.value.id);
    })
    .joining((joiningUser) => {
      if (joiningUser.id !== user.value.id) {
        isOnline.value = true;
      }
    })
    .leaving((leavingUser) => {
      if (leavingUser.id !== user.value.id) {
        isOnline.value = false;
      }
    });
};

onMounted(async () => {
  await loadMessages();
  initializeWebSocket();
});

onUnmounted(() => {
  if (echo) {
    echo.leave(`chat.${user.value.match_id}`);
    echo.disconnect();
  }
  if (typingTimer) {
    clearTimeout(typingTimer);
  }
  if (isRecording.value) {
    stopRecording();
  }
});
</script>

<style scoped>
.typing-indicator {
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
  font-style: italic;
}

.messages-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 20px;
}

.message-wrapper {
  display: flex;
  width: 100%;
}

.message-wrapper.sent {
  justify-content: flex-end;
}

.message-wrapper.received {
  justify-content: flex-start;
}

.message-bubble {
  max-width: 75%;
  padding: 10px 14px;
  border-radius: 18px;
  position: relative;
}

.message-wrapper.sent .message-bubble {
  background-color: #007aff;
  color: white;
  border-bottom-right-radius: 4px;
}

.message-wrapper.received .message-bubble {
  background-color: #e5e5ea;
  color: black;
  border-bottom-left-radius: 4px;
}

.message-text {
  word-wrap: break-word;
  white-space: pre-wrap;
}

.message-time {
  font-size: 11px;
  margin-top: 4px;
  opacity: 0.7;
  text-align: right;
}

.message-media img,
.message-media video {
  max-width: 100%;
  height: auto;
}

.message-input-container {
  display: flex;
  align-items: flex-end;
  padding: 8px;
  background-color: white;
  border-top: 1px solid #ddd;
  gap: 8px;
}

.media-button {
  flex-shrink: 0;
  margin: 0;
}

.media-button.recording {
  color: red;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.message-input {
  flex: 1;
  font-size: 16px;
  min-height: 36px;
  --color: #000;
  --placeholder-color: #999;
}

.send-button {
  flex-shrink: 0;
  margin: 0;
  width: 40px;
  height: 40px;
}
</style>
