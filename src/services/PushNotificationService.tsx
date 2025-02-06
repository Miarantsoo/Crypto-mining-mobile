import { FirebaseMessaging } from "@capacitor-firebase/messaging";
import {
  ActionPerformed,
  LocalNotifications,
} from "@capacitor/local-notifications";
import { PushNotifications, Token } from "@capacitor/push-notifications";

// Track notification state
let lastNotification: any = null;
let fcmToken: string | null = null;

const PushNotificationService = {
  getRandomId: () => Math.floor(Math.random() * 100000), // Small ID,
  register: () => {
    console.log("Initializing HomePage");

    // Register with Apple / Google to receive push via APNS/FCM
    PushNotifications.register();

    // On success, we should be able to receive notifications
    PushNotifications.addListener("registration", (token: Token) => {
      console.log(`Registration success ${token}`);
    });

    // Some issue with our setup and push will not work
    PushNotifications.addListener("registrationError", (error: any) => {
      alert("Error on registration: " + JSON.stringify(error));
    });

    // FirebaseMessaging.subscribeToTopic({ topic: 'nouveau_topic' });

    let index = 1;

    FirebaseMessaging.addListener(
      "notificationReceived",
      (notification: any) => {
        const { title, body, image } = notification.notification ?? {};
        LocalNotifications.schedule({
          notifications: [
            {
              title: title,
              body: body,
              id: PushNotificationService.getRandomId(),
              schedule: { at: new Date(new Date().getTime() + 1000) }, // 1 sec delay
              sound: null,
              attachments: null,
              actionTypeId: "",
              extra: null,
            },
          ],
        });
      }
    );

    // Method called when tapping on a notification
    // PushNotifications.addListener(
    //   "pushNotificationActionPerformed",
    //   (notification: ActionPerformed) => {
    //     // let data: NotificationData = notification.notification.data;
    //   }
    // );

    LocalNotifications.addListener(
      "localNotificationActionPerformed",
      (notification) => {
        // let data: NotificationData = notification.notification.extra;
      }
    );
  },
  initialize: () => {
    PushNotifications.checkPermissions().then((res) => {
      if (res.receive !== "granted") {
        PushNotifications.requestPermissions().then((res) => {
          if (res.receive === "denied") {
            // alert("Push Notification permission denied");
          } else {
            // alert("Push Notification permission granted");
            PushNotificationService.register();
          }
        });
      } else {
        PushNotificationService.register();
      }
    });
  },
  subscribeTo: async (topic: string) => {
    FirebaseMessaging.subscribeToTopic({ topic });
  },
  unSubscribeFrom: async (topic: string) => {
    FirebaseMessaging.unsubscribeFromTopic({ topic });
  },
};

export default PushNotificationService;
