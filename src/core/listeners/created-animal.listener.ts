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

  // AdocaoSection
  exigenciaAdocao?: Array<"termoAdocao" | "fotosCasa" | "visitaPrvia" | "acompanhamentoPosAdocao">;
  acompanhamentoPosAdocaoCheckBoxChildren?: Array<"1mes" | "3meses" | "6meses">;

  // Outros campos
  sobreAnimal?: string;
};

const eventBus = EventBus.getEventBus()

const ANIMALS_COLLECTION_NAME = "animals";

eventBus.listen(EventTypes.CREATED_ANIMAL, async (payload) => {
  const animal = payload as Animal
  
  const cleanedAnimal = Object.fromEntries(
    Object.entries(animal).filter(([_, value]) => value !== undefined)
  );

  try {
    await setDoc(doc(db, ANIMALS_COLLECTION_NAME, uuid.v4()), {
      ... cleanedAnimal,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error('Erro ao persistir Animal no Firestore:', {animal, error});
  }
})