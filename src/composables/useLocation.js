import { Geolocation } from '@capacitor/geolocation';

export const useLocation = () => {
  /**
   * Ζητάει άδεια για πρόσβαση στην τοποθεσία
   */
  const requestPermissions = async () => {
    try {
      const permission = await Geolocation.requestPermissions();
      return permission;
    } catch (error) {
      console.error('Σφάλμα κατά το αίτημα permissions:', error);
      return null;
    }
  };

  /**
   * Παίρνει την τρέχουσα τοποθεσία
   */
  const getCurrentPosition = async () => {
    try {
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: false, // Χρήση GPS για μεγαλύτερη ακρίβεια
        timeout: 10000,
        maximumAge: 0
      });

      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp
      };
    } catch (error) {
      console.error('Σφάλμα κατά την λήψη τοποθεσίας:', error);

      // Αν δεν έχουμε permission, ζητάμε
      if (error.message && error.message.includes('permission')) {
        await requestPermissions();
      }

      return null;
    }
  };

  /**
   * Ελέγχει τα permissions για location
   */
  const checkPermissions = async () => {
    try {
      const permission = await Geolocation.checkPermissions();
      return permission;
    } catch (error) {
      console.error('Σφάλμα κατά τον έλεγχο permissions:', error);
      return null;
    }
  };

  /**
   * Στέλνει την τοποθεσία στο backend
   */
  const updateLocationToBackend = async () => {
    try {
      // Ελέγχουμε αν έχουμε permission
      const permission = await checkPermissions();

      if (permission && (permission.location === 'granted' || permission.coarseLocation === 'granted')) {
        // Παίρνουμε την τοποθεσία
        const position = await getCurrentPosition();

        if (position) {
          // Στέλνουμε στο backend
          const response = await window.axios.post('/updateLocation', {
            latitude: position.latitude,
            longitude: position.longitude,
            accuracy: position.accuracy
          });

          console.log('Η τοποθεσία ενημερώθηκε επιτυχώς:', response.data);
          return response.data;
        }
      } else {
        // Ζητάμε permission αν δεν το έχουμε
        const newPermission = await requestPermissions();

        if (newPermission && (newPermission.location === 'granted' || newPermission.coarseLocation === 'granted')) {
          // Προσπαθούμε ξανά
          return await updateLocationToBackend();
        } else {
          console.log('Ο χρήστης δεν έδωσε άδεια για πρόσβαση στην τοποθεσία');
        }
      }
    } catch (error) {
      console.error('Σφάλμα κατά την αποστολή τοποθεσίας στο backend:', error.message, error.response.message);
      return null;
    }
  };

  return {
    requestPermissions,
    getCurrentPosition,
    checkPermissions,
    updateLocationToBackend
  };
};