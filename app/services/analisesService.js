import { db } from '../firebaseConfig';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  Timestamp
} from 'firebase/firestore';

const COLLECTION_NAME = 'analises';

// Criar nova análise
export const criarAnalise = async (analiseData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...analiseData,
      criadoEm: Timestamp.now(),
      atualizadoEm: Timestamp.now()
    });
    return { id: docRef.id, ...analiseData };
  } catch (error) {
    console.error('Erro ao criar análise:', error);
    throw error;
  }
};

// Buscar todas as análises
export const buscarAnalises = async () => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('criadoEm', 'desc'));
    const querySnapshot = await getDocs(q);
    const analises = [];
    querySnapshot.forEach((doc) => {
      analises.push({ id: doc.id, ...doc.data() });
    });
    return analises;
  } catch (error) {
    console.error('Erro ao buscar análises:', error);
    throw error;
  }
};

// Atualizar análise
export const atualizarAnalise = async (id, analiseData) => {
  try {
    const analiseRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(analiseRef, {
      ...analiseData,
      atualizadoEm: Timestamp.now()
    });
    return { id, ...analiseData };
  } catch (error) {
    console.error('Erro ao atualizar análise:', error);
    throw error;
  }
};

// Deletar análise
export const deletarAnalise = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return id;
  } catch (error) {
    console.error('Erro ao deletar análise:', error);
    throw error;
  }
};