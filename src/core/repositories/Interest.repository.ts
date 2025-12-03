import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    runTransaction,
    serverTimestamp,
    updateDoc,
    where
} from "firebase/firestore";
import { db } from "../../config/firebaseConfig"; // Assumindo que este caminho está correto

// Modelo de dados de Interesse simplificado
export interface Interest {
    id: string; // Document ID
    animalId: string;
    userId: string;
    status: 'pending' | 'accepted' | 'rejected';
    userName: string; // Adicionado para facilitar a exibição no frontend
    createdAt: any; // Timestamp
}

/**
 * Busca o nome do usuário interessado a partir da coleção 'users'.
 */
const fetchUserName = async (userId: string): Promise<string> => {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
        const userData = userDoc.data();
        return userData.nomeCompleto || userData.name || userData.displayName || "Usuário Desconhecido";
    }
    return "Usuário Desconhecido";
};


export const InterestRepository = {
    /**
     * Busca todos os usuários interessados (pending) em um animal.
     */
    async findPendingInterestsByAnimal(animalId: string): Promise<Interest[]> {
        const interestsRef = collection(db, "interests");
        const q = query(
            interestsRef,
            where("animalId", "==", animalId),
            where("status", "==", "pending")
        );

        const snapshot = await getDocs(q);
        const interests: Interest[] = [];

        for (const interestDoc of snapshot.docs) {
            const data = interestDoc.data();
            // Buscar o nome do usuário para exibição
            const userName = await fetchUserName(data.userId);

            interests.push({
                id: interestDoc.id,
                ...data,
                userName: userName,
            } as Interest);
        }

        return interests;
    },

    /**
     * Recusa o interesse de um usuário em um animal.
     */
    async rejectInterest(interestId: string) {
        const interestRef = doc(db, "interests", interestId);
        await updateDoc(interestRef, {
            status: "rejected",
            updatedAt: serverTimestamp(),
        });
    },

    /**
     * Transação de Aceitação de Adoção (Lógica de Negócio B).
     */
    async acceptAdoption(animalId: string, acceptedInterestId: string, newOwnerId: string): Promise<void> {
        const animalRef = doc(db, "animals", animalId);
        const interestsRef = collection(db, "interests");
        const acceptedInterestRef = doc(db, "interests", acceptedInterestId);

        await runTransaction(db, async (transaction) => {
            // 1. Atualizar o Animal: Mudar o owner_id para o user_id interessado.
            // No seu modelo, o campo para o dono parece ser 'userId'.
            transaction.update(animalRef, {
                userId: newOwnerId, // Novo dono
                visivel: false,     // Ocultar da lista de adoção
                updatedAt: serverTimestamp(),
            });

            // 2. Atualizar a Tabela de Interesse (Aceito):
            transaction.update(acceptedInterestRef, {
                status: "accepted",
                updatedAt: serverTimestamp(),
            });

            // 3. Atualizar a Tabela de Interesse (Recusado) para TODOS os outros:
            const otherInterestsQuery = query(
                interestsRef,
                where("animalId", "==", animalId),
                where("status", "==", "pending") // Apenas os pendentes
            );
            // transaction.get doesn't accept a Query in the current typings; use getDocs instead.
            const otherInterestsSnapshot = await getDocs(otherInterestsQuery);

            otherInterestsSnapshot.docs.forEach((doc) => {
                if (doc.id !== acceptedInterestId) {
                    transaction.update(doc.ref, {
                        status: "rejected",
                        updatedAt: serverTimestamp(),
                    });
                }
            });
        });
    },
    
    /**
     * Cria ou verifica um registro de interesse 'pending' de um usuário em um animal.
     */
    async manifestInterest(animalId: string, userId: string, animalOwnerId: string): Promise<'created' | 'already_interested' | 'already_owner'> {
        const interestsRef = collection(db, "interests");

        // 1. Verificar se o usuário já é o dono
        if (userId === animalOwnerId) {
            return 'already_owner';
        }

        // 2. Verificar se o interesse 'pending' ou 'accepted' já existe
        const q = query(
            interestsRef,
            where("animalId", "==", animalId),
            where("userId", "==", userId),
            where("status", "in", ["pending", "accepted"])
        );
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
            return 'already_interested'; // Já manifestou interesse
        }

        // 3. Criar o novo registro de interesse com status 'pending'
        await addDoc(interestsRef, {
            animalId: animalId,
            userId: userId,
            status: 'pending',
            createdAt: serverTimestamp(),
        });

        return 'created';
    },
};