import { doc, setDoc } from "firebase/firestore";
import uuid from 'react-native-uuid';
import { db } from '../../config/firebaseConfig';
import { EventBus, EventTypes } from "../EventBus";

export type Animal = {
  nome: string;
  fotos?: string[];
  especie: "cachorro" | "gato";
  sexo: "macho" | "femea";
  porte: "pequeno" | "medio" | "grande";
  faixaEtaria: "filhote" | "adulto" | "idoso";
  temperamento: Array<"brincalhao" | "timido" | "calmo" | "guarda" | "amoroso" | "preguicoso">;
  saude: Array<"vacinado" | "vermifugado" | "castrado" | "doente">;
  doencas?: string;

  exigenciaAdocao?: Array<"termoAdocao" | "fotosCasa" | "visitaPrvia" | "acompanhamentoPosAdocao">;
  acompanhamentoPosAdocaoCheckBoxChildren?: Array<"1mes" | "3meses" | "6meses">;

  // Outros campos
  sobreAnimal?: string;
  ownerId?: string; // Torne opcional para depuração, mas valide abaixo
};

const eventBus = EventBus.getEventBus()

const ANIMALS_COLLECTION_NAME = "animals";

eventBus.listen(EventTypes.CREATED_ANIMAL, async (payload) => {
  const animal = payload as Animal;
  
  console.log("Payload recebido no listener:", animal); // Log do payload
  
  // Validação: Se ownerId for undefined, não prossiga
  if (!animal.ownerId) {
    console.error("ownerId é undefined no payload. Não é possível salvar o animal. Verifique o RegisterAnimal.tsx.");
    return; // Volta para o processo sem salvar
  }
  
  // Filtra propriedades undefined (exceto ownerId, que já validamos)
  const cleanedAnimalEntries = Object.entries(animal).filter(([key, value]) => {
    if (key === 'ownerId') return true; // Para sempre manter o ownerId
    return value !== undefined && value !== null; // Remove undefined/null para outros campos
  });
  
  const cleanedAnimal = {
    ...Object.fromEntries(cleanedAnimalEntries),
    ownerId: animal.ownerId, // Garante que ownerId esteja presente e válido
    createdAt: new Date(),
  };

  console.log("Animal limpo para salvar (sem undefined):", cleanedAnimal); // Log final

  try {
    const animalRef = doc(db, ANIMALS_COLLECTION_NAME, uuid.v4());
    console.log("Salvando em:", animalRef.path);
    
    await setDoc(animalRef, cleanedAnimal);
    console.log('Animal salvo com sucesso! ownerId:', cleanedAnimal.ownerId);
  } catch (error) {
    console.error('Erro detalhado ao persistir Animal no Firestore:');
    console.error('Código:', (error as any).code);
    console.error('Mensagem:', (error as any).message);
    console.error('Payload original:', animal);
    console.error('Animal limpo:', cleanedAnimal);
  }
});
//teste dessa merda