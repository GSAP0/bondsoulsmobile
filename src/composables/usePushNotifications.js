import { PushNotifications } from '@capacitor/push-notifications';
import { useGlobalStore } from '@/stores/globalStore';
import { useRouter } from 'vue-router';

export function usePushNotifications() {
    const router = useRouter();
    const globalStore = useGlobalStore();

    /**
     * Initialize push notifications
     * Requests permissions, registers device, and sets up listeners
     */
    const initialize = async () => {
        try {
            // Request permission to use push notifications
            const permStatus = await PushNotifications.requestPermissions();

            if (permStatus.receive === 'granted') {
                console.log('Push notification permission granted');

                // Register with Apple / Google to receive push via APNS/FCM
                await PushNotifications.register();
            } else {
                console.log('Push notification permission denied');
                return;
            }

            // On success, we should be able to receive notifications
            await PushNotifications.addListener('registration', async (token) => {
                console.log('Push registration success, token: ' + token.value);

                // Store token locally
                localStorage.setItem('fcm_token', token.value);

                // Send token to backend
                try {
                    const { useFcmToken } = await import('@/composables/useFcmToken');
                    const { sendToBackend } = useFcmToken();
                    await sendToBackend('/fcm-token');
                    console.log('FCM token sent to backend successfully');
                } catch (error) {
                    console.error('Failed to send FCM token to backend:', error);
                }
            });

            // Some issue with our setup and push will not work
            await PushNotifications.addListener('registrationError', (error) => {
                console.error('Error on registration: ' + JSON.stringify(error));
            });

            // Show us the notification payload if the app is open on our device
            await PushNotifications.addListener('pushNotificationReceived', async (notification) => {
                console.log('Push notification received: ', notification);

                // Update global store if needed
                // For example, reload user data or specific data based on notification type
                if (notification.data?.refresh_data) {
                    try {
                        await globalStore.load();
                    } catch (error) {
                        console.error('Failed to refresh data:', error);
                    }
                }

                // You can show a toast or alert here if needed
                // For example using Ionic's ToastController
            });

            // Method called when tapping on a notification
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

                // Update global store if needed
                if (data?.refresh_data) {
                    try {
                        await globalStore.load();
                    } catch (error) {
                        console.error('Failed to refresh data:', error);
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
