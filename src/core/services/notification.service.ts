import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export class NotificationService {
  private static readonly USERS_COLLECTION = "users";

  static async registerForPushNotifications(userId: string): Promise<string | null> {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Permissão de notificação negada');
        return null;
      }

      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: 'c6a5b59d-0d6e-49e2-a770-c93efab31a66',
      });
      
      const expoPushToken = tokenData.data;
      
      await this.saveUserToken(userId, expoPushToken);
      
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      return expoPushToken;
    } catch (error) {
      console.error('Erro ao registrar notificações:', error);
      return null;
    }
  }

  private static async saveUserToken(userId: string, token: string): Promise<void> {
    try {
      const userRef = doc(db, this.USERS_COLLECTION, userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        await updateDoc(userRef, {
          expoPushToken: token,
          notificationTokenUpdatedAt: new Date(),
        });
      } else {
        await setDoc(userRef, {
          expoPushToken: token,
          notificationTokenUpdatedAt: new Date(),
        });
      }
    } catch (error) {
      console.error('Erro ao salvar token de notificação:', error);
    }
  }

  static async getUserToken(userId: string): Promise<string | null> {
    try {
      const userDoc = await getDoc(doc(db, this.USERS_COLLECTION, userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return userData.expoPushToken || null;
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar token de notificação:', error);
      return null;
    }
  }

  static async sendLocalNotification(
    title: string,
    body: string,
    data?: any
  ): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: data || {},
          sound: true,
        },
        trigger: null,
      });
    } catch (error) {
      console.error('Erro ao enviar notificação local:', error);
    }
  }

  static async sendPushNotification(
    toUserId: string,
    title: string,
    body: string,
    data?: any
  ): Promise<void> {
    try {
      const token = await this.getUserToken(toUserId);
      
      if (!token) {
        console.log(`Usuário ${toUserId} não tem token de notificação registrado`);
        return;
      }

      const notificationId = `${toUserId}_${Date.now()}`;
      const notificationsRef = doc(db, 'pendingNotifications', notificationId);
      await setDoc(notificationsRef, {
        userId: toUserId,
        token,
        title,
        body,
        data: data || {},
        createdAt: new Date(),
        sent: false,
      });

      try {
        await this.sendExpoPushNotification(token, title, body, data);
        await updateDoc(notificationsRef, { sent: true, sentAt: new Date() });
      } catch (error) {
        console.log('Envio imediato falhou, listener processará:', error);
      }

      await this.sendLocalNotification(title, body, data);
    } catch (error) {
      console.error('Erro ao enviar notificação push:', error);
    }
  }

  static async sendExpoPushNotification(
    expoPushToken: string,
    title: string,
    body: string,
    data?: any
  ): Promise<void> {
    try {
      const message = {
        to: expoPushToken,
        sound: 'default',
        title,
        body,
        data: data || {},
        priority: 'high',
        channelId: 'default',
      };

      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-Encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      const result = await response.json();
      
      if (result.data?.status === 'ok') {
        console.log('Notificação push enviada com sucesso');
      } else {
        console.error('Erro ao enviar notificação push:', result);
      }
    } catch (error) {
      console.error('Erro ao chamar API do Expo Push:', error);
    }
  }
}

