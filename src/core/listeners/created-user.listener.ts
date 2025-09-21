import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from '../../config/firebaseConfig';
import { EventBus, EventTypes } from "../EventBus";

export type User = {
	uid: string,
  nomeCompleto: string;
  idade: number | string;
	email: string;
  estado: string;
  cidade: string;
  endereco: string;
  telefone: string;
  nomeUsuario: string;
  senha?: string;
};

const eventBus = EventBus.getEventBus()

const USERS_COLLECTION_NAME = "users";

eventBus.listen(EventTypes.CREATED_USER, async (payload) => {
	const user = payload as User

  try {
		const cred = await createUserWithEmailAndPassword(auth, user.email, user.senha!);
    delete user.senha

    const uid = cred.user.uid;
    await setDoc(doc(db, USERS_COLLECTION_NAME, uid), {
      ...user,
      createdAt: new Date(),
    });
    console.log('Usuário salvo no Firestore:', user);
  } catch (error) {
    console.error('Erro ao salvar usuário no Firestore:', {user, error});
  }
})