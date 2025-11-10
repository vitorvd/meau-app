import { db } from "@/src/config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { sendPushNotification } from "./push.notifications";

export async function notifyReceiver(
  receiverId: string,
  senderName: string,
  messageText: string,
  chatId: string,
  senderId: string,
) {
  try {
    const receiverRef = doc(db, "users", receiverId);
    const receiverSnap = await getDoc(receiverRef);

    if (!receiverSnap.exists()) {
      console.log("⚠️ Usuário não encontrado:", receiverId);
      return;
    }

    const receiverData = receiverSnap.data();
    const expoPushToken = receiverData?.expoPushToken;

    if (!expoPushToken) {
      console.log("⚠️ Usuário não possui token salvo:", receiverId);
      return;
    }

    await sendPushNotification(
      expoPushToken,
      `Nova mensagem de ${senderName}`,
      messageText,
      {
        chatId,
        senderId,
        type: "chat_message"
      }
    );
  } catch (error) {
    console.error("❌ Erro ao enviar notificação:", error);
  }
}
