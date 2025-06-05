import {createApp} from 'vue'
import App from './App.vue'
import router from './router';
import axios from 'axios'



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

/* @import '@ionic/vue/css/palettes/dark.always.css'; */
/* @import '@ionic/vue/css/palettes/dark.class.css'; */
import '@ionic/vue/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import './theme/style.css';
import {createPinia} from "pinia";

const token = localStorage.getItem('access_token')

if (token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

window.axios = axios
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
window.axios.defaults.withCredentials = true
//window.axios.defaults.baseURL = `http://bondsoulsadmin.test/mobile`
window.axios.defaults.baseURL = `https://operator.bondsouls.com/mobile`

try {
    const response = await axios.get(`/user`)
    if (response.status === 200 && response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
    }
}catch(e){
    localStorage.removeItem('user')
}

const app = createApp(App)
    .use(createPinia())
    .use(IonicVue)
    .use(router);

router.isReady().then(() => {
    app.mount('#app');
});
