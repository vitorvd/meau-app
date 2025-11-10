import { db } from '@/src/config/firebaseConfig';
import { NavigationContainerRef } from "@react-navigation/native";
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { doc, setDoc } from 'firebase/firestore';
import { Platform } from 'react-native';

// Configuração de como as notificações aparecem quando o app está aberto
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Função para registrar permissões e salvar token do usuário
let navigationRef: NavigationContainerRef<any> | null = null;

export function setNavigationRef(ref: NavigationContainerRef<any>) {
  navigationRef = ref;
}

export async function registerForPushNotificationsAsync(userId: string) {
  if (!Device.isDevice) {
    alert('As notificações só funcionam em um dispositivo físico.');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    alert('Permissão para notificações negada.');
    return null;
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log('Expo Push Token:', token);

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  await setDoc(doc(db, 'users', userId), { expoPushToken: token }, { merge: true });

  return token;
}

// Listener global
let notificationListener: Notifications.Subscription;
let responseListener: Notifications.Subscription;

export function initializeNotificationListeners() {
  if (notificationListener || responseListener) return;

  notificationListener = Notifications.addNotificationReceivedListener(notification => {
    console.log("📩 Notificação recebida:", notification);
  });

  responseListener = Notifications.addNotificationResponseReceivedListener(response => {
    console.log("👆 Usuário tocou na notificação:", response);

    // Quando o usuário toca na notificação
    const data = response.notification.request.content.data;
    if (data?.chatId && navigationRef) {
      console.log("🔀 Redirecionando para o chat:", data.chatId);
      navigationRef.navigate('ChatScreen', { chatId: data.chatId });
    }
  });
}