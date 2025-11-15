import { PushNotifications } from '@capacitor/push-notifications';
import { useGlobal } from '@/composables/useGlobal';
import { useRouter } from 'vue-router';
import {useMatching} from "@/composables/useMatching.js";

export function usePushNotifications() {
    const router = useRouter();
    const globalStore = useGlobal();
    const matching = useMatching()

    /**
     * Initialize push notifications
     * Requests permissions, registers device, and sets up listeners
     */
    const initialize = async () => {
        try {
            // Request permission to use push notifications
            const permStatus = await PushNotifications.requestPermissions();

            if (permStatus.receive === 'granted') {
                await PushNotifications.register();
            } else {
                console.log('Push notification permission denied');
                return;
            }

            await PushNotifications.addListener('registration', async (token) => {
                localStorage.setItem('fcm_token', token.value);
            });

            await PushNotifications.addListener('registrationError', (error) => {
                console.error('Error on registration: ' + JSON.stringify(error));
            });

            await PushNotifications.addListener('pushNotificationReceived', async (notification) => {
                console.log('Push notification received: ', notification);
                globalStore.load();
                matching.load();
            });

            await PushNotifications.addListener('pushNotificationActionPerformed', async (notification) => {
                console.log('Push notification action performed', notification);

                const data = notification.notification.data;

                // Navigate based on notification data
                if (data?.route) {
                    try {
                        await router.push(data.route);
                    } catch (error) {
                        console.error('Failed to navigate:', error);
                    }
                }
            });
            console.log('Push notifications initialized successfully');
        } catch (error) {
            console.error('Error initializing push notifications:', error);
        }
    };

    /**
     * Get current FCM token from localStorage
     */
    const getToken = () => {
        return localStorage.getItem('fcm_token');
    };

    /**
     * Remove all listeners
     */
    const cleanup = async () => {
        await PushNotifications.removeAllListeners();
    };

    return {
        initialize,
        getToken,
        cleanup
    };
}
