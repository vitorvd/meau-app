import { collection, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import { NotificationService } from '../services/notification.service';

export function setupNotificationListener() {
  try {
    const notificationsRef = collection(db, 'pendingNotifications');
    const q = query(notificationsRef, where('sent', '==', false));
    
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const promises = snapshot.docChanges()
        .filter(change => change.type === 'added')
        .map(async (change) => {
          const notification = change.doc.data();
          
          if (!notification.token) {
            console.log('Notificação sem token, pulando...');
            return;
          }
          
          try {
            await NotificationService.sendExpoPushNotification(
              notification.token,
              notification.title,
              notification.body,
              notification.data
            );
            
            const notificationRef = doc(db, 'pendingNotifications', change.doc.id);
            await updateDoc(notificationRef, { 
              sent: true, 
              sentAt: new Date() 
            });
          } catch (error) {
            console.error('Erro ao processar notificação pendente:', error);
          }
        });
      
      await Promise.all(promises);
    }, (error) => {
      console.error('Erro no listener de notificações:', error);
    });

    return unsubscribe;
  } catch (error) {
    console.error('Erro ao configurar listener de notificações:', error);
    return () => {};
  }
}

