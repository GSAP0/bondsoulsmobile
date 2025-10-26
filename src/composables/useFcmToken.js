import { Capacitor } from '@capacitor/core';

/**
 * Helper composable for managing FCM token with backend
 */
export function useFcmToken() {
    /**
     * Send FCM token to backend
     * @param {string} endpoint - Backend endpoint (e.g., '/fcm-token', '/device/register')
     * @returns {Promise<void>}
     */
    const sendToBackend = async (endpoint = '/fcm-token') => {
        const token = localStorage.getItem('fcm_token');

        if (!token) {
            console.warn('No FCM token found in localStorage');
            return;
        }

        try {
            const platform = Capacitor.getPlatform(); // 'android', 'ios', or 'web'

            const response = await window.axios.post(endpoint, {
                token: token,
                platform: platform,
                // Προσθέτω και user_id αν υπάρχει
                user_id: JSON.parse(localStorage.getItem('user') || '{}').id
            });

            console.log('FCM token sent to backend successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('Failed to send FCM token to backend:', error);
            throw error;
        }
    };

    /**
     * Get current FCM token from localStorage
     */
    const getToken = () => {
        return localStorage.getItem('fcm_token');
    };

    /**
     * Delete FCM token from backend (for logout, etc)
     * @param {string} endpoint - Backend endpoint
     * @returns {Promise<void>}
     */
    const deleteFromBackend = async (endpoint = '/fcm-token') => {
        const token = localStorage.getItem('fcm_token');

        if (!token) {
            return;
        }

        try {
            await window.axios.delete(endpoint, {
                data: { token }
            });
            console.log('FCM token deleted from backend');
        } catch (error) {
            console.error('Failed to delete FCM token from backend:', error);
            throw error;
        }
    };

    return {
        sendToBackend,
        getToken,
        deleteFromBackend
    };
}
