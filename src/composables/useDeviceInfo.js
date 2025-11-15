import { Device } from '@capacitor/device';

export const useDeviceInfo = () => {
  /**
   * Παίρνει πληροφορίες συσκευής
   */
  const getDeviceInfo = async () => {
    try {
      const info = await Device.getInfo();
      const deviceId = await Device.getId();

      return {
        model: info.model,
        platform: info.platform, // 'ios', 'android', 'web'
        operatingSystem: info.operatingSystem,
        osVersion: info.osVersion,
        manufacturer: info.manufacturer,
        isVirtual: info.isVirtual,
        webViewVersion: info.webViewVersion,
        deviceId: deviceId.identifier,
      };
    } catch (error) {
      console.error('Σφάλμα κατά τη λήψη πληροφοριών συσκευής:', error);
      return null;
    }
  };

  /**
   * Στέλνει τις πληροφορίες συσκευής στο backend
   */
  const updateDeviceInfoToBackend = async () => {
    try {
      const deviceInfo = await getDeviceInfo();

      if (deviceInfo) {
        // Στέλνουμε στο backend
        const response = await window.axios.post('/updateDeviceInfo', deviceInfo);

        console.log('Οι πληροφορίες συσκευής ενημερώθηκαν επιτυχώς:', response.data);
        return response.data;
      }
    } catch (error) {
      console.error('Σφάλμα κατά την αποστολή πληροφοριών συσκευής στο backend:', error.message);
      return null;
    }
  };

  return {
    getDeviceInfo,
    updateDeviceInfoToBackend
  };
};
