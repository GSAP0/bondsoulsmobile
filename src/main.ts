import {createApp} from 'vue'
import App from './App.vue'
import router from './router';
import axios from 'axios'
import {register} from 'swiper/element/bundle';
import {Capacitor} from '@capacitor/core';

register()

import {IonicVue} from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

//import '@ionic/vue/css/palettes/dark.always.css';
// import '@ionic/vue/css/palettes/high-contrast.class.css'
/* import '@ionic/vue/css/palettes/dark.system.css'; */

/* Theme variables */
import './theme/variables.css';
import './theme/style.css';
import './theme/theme.css';
import Echo from "laravel-echo";
import Pusher from 'pusher-js';

window.Pusher = Pusher;

// Environment-specific configuration (loaded from .env.development or .env.production)
const isProduction = import.meta.env.PROD;
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const reverbAppKey = import.meta.env.VITE_REVERB_APP_KEY;
const reverbHost = import.meta.env.VITE_REVERB_HOST;
const reverbPort = import.meta.env.VITE_REVERB_PORT;
const reverbScheme = import.meta.env.VITE_REVERB_SCHEME;


const token = localStorage.getItem('access_token')

if (token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

window.axios = axios
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
window.axios.defaults.withCredentials = true
window.axios.defaults.baseURL = apiBaseUrl


const wsHost = reverbHost || 'localhost';
const wsPort = reverbPort || 8080;
const scheme = reverbScheme || 'http';

console.log('Environment:', isProduction ? 'Production' : 'Development');
console.log('API Base URL:', apiBaseUrl);
console.log('WebSocket connecting to:', `${scheme}://${wsHost}:${wsPort}`);

try {
    window.echo = new Echo({
        broadcaster: 'reverb',
        key: reverbAppKey,
        wsHost: wsHost,
        wsPort: wsPort,
        wssPort: wsPort,
        forceTLS: isProduction,
        enabledTransports: ['ws', 'wss'],
        disableStats: true,
        authEndpoint: `${apiBaseUrl}/broadcasting/auth`,
        auth: {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    })
} catch (e) {
}

try {
    const response = await axios.get(`/user`)
    if (response.status === 200 && response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))

        // Send FCM token to backend if on native platform and token exists
        if (Capacitor.isNativePlatform()) {
            const fcmToken = localStorage.getItem('fcm_token');
            if (fcmToken) {
                try {
                    const {useFcmToken} = await import('@/composables/useFcmToken');
                    const {sendToBackend} = useFcmToken();
                    await sendToBackend('/fcm-token');
                    console.log('FCM token sent to backend on app startup');
                } catch (fcmError) {
                    console.error('Failed to send FCM token on startup:', fcmError);
                }
            }
        }
    }
} catch (e) {
    localStorage.removeItem('user')
}

const app = createApp(App)
    .use(IonicVue, {})
    .use(router);

router.isReady().then(() => {
    app.mount('#app');
});
