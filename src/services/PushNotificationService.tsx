// src/services/PushNotificationService.ts
import { PushNotifications } from '@capacitor/push-notifications';
import { FirebaseMessaging } from "@capacitor-firebase/messaging";
import { LocalNotifications } from '@capacitor/local-notifications';

const PushNotificationService = {
  initialize: async () => {
    try {
      const permStatus = await PushNotifications.checkPermissions();
      
      if (permStatus.receive === 'prompt') {
        await PushNotifications.requestPermissions();
      }

      if (permStatus.receive !== 'granted') {
        throw new Error('User denied permissions!');
      }

      await PushNotifications.register();
      await FirebaseMessaging.subscribeToTopic({ topic: 'default' });

      // Set up listeners
      PushNotifications.addListener('registration', (token) => {
        console.log('Push registration success:', token);
      });

      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Push received:', notification);
        LocalNotifications.schedule({
          notifications: [{
            title: notification.title || 'New Notification',
            body: notification.body || '',
            id: Date.now()
          }]
        });
      });

      PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        console.log('Push action performed:', notification);
      });

    } catch (error) {
      console.error('Push notifications initialization error:', error);
      throw error;
    }
  },

  getToken: async () => {
    const result = await FirebaseMessaging.getToken();
    return result.token;
  },

  subscribeToTopic: async (topic: string) => {
    await FirebaseMessaging.subscribeToTopic({ topic });
  },

  unsubscribeFromTopic: async (topic: string) => {
    await FirebaseMessaging.unsubscribeFromTopic({ topic });
  },

  addNotificationReceivedListener: async () => {
    await FirebaseMessaging.addListener('notificationReceived', event => {
      console.log('notificationReceived', { event });
    });
  },
  
  addNotificationActionPerformedListener: async () => {
    await FirebaseMessaging.addListener('notificationActionPerformed', event => {
      console.log('notificationActionPerformed', { event });
    });
  },
};

export default PushNotificationService;