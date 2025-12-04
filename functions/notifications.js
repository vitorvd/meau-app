/**
 * Firebase Cloud Functions para enviar notificações push
 * quando o app está fechado
 * 
 * Para usar:
 * 1. Instale Firebase CLI: npm install -g firebase-tools
 * 2. Faça login: firebase login
 * 3. Inicialize Functions: firebase init functions
 * 4. Copie este arquivo para functions/index.js
 * 5. Instale dependências: cd functions && npm install
 * 6. Deploy: firebase deploy --only functions
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

/**
 * Listener que monitora notificações pendentes e as envia via Expo Push API
 * Funciona mesmo com o app completamente fechado
 */
exports.sendPendingNotifications = functions.firestore
  .document('pendingNotifications/{notificationId}')
  .onCreate(async (snap, context) => {
    const notification = snap.data();
    
    // Verificar se já foi enviada
    if (notification.sent) {
      return null;
    }
    
    // Verificar se tem token
    if (!notification.token) {
      console.log('Notificação sem token');
      return null;
    }
    
    try {
      // Enviar via Expo Push Notification Service
      const message = {
        to: notification.token,
        sound: 'default',
        title: notification.title,
        body: notification.body,
        data: notification.data || {},
        priority: 'high',
        channelId: 'default',
      };
      
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Accept-Encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });
      
      const result = await response.json();
      
      if (result.data && result.data.status === 'ok') {
        // Marcar como enviada
        await snap.ref.update({
          sent: true,
          sentAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        console.log('Notificação enviada com sucesso via Cloud Function');
      } else {
        console.error('Erro ao enviar notificação:', result);
      }
    } catch (error) {
      console.error('Erro ao processar notificação:', error);
    }
    
    return null;
  });

