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

const COLLECTION_NAME = 'amostras';

// Criar nova amostra
export const criarAmostra = async (amostraData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...amostraData,
      criadoEm: Timestamp.now(),
      atualizadoEm: Timestamp.now()
    });
    return { id: docRef.id, ...amostraData };
  } catch (error) {
    console.error('Erro ao criar amostra:', error);
    throw error;
  }
};

// Buscar todas as amostras
export const buscarAmostras = async () => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('criadoEm', 'desc'));
    const querySnapshot = await getDocs(q);
    const amostras = [];
    querySnapshot.forEach((doc) => {
      amostras.push({ id: doc.id, ...doc.data() });
    });
    return amostras;
  } catch (error) {
    console.error('Erro ao buscar amostras:', error);
    throw error;
  }
};

// Atualizar amostra
export const atualizarAmostra = async (id, amostraData) => {
  try {
    const amostraRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(amostraRef, {
      ...amostraData,
      atualizadoEm: Timestamp.now()
    });
    return { id, ...amostraData };
  } catch (error) {
    console.error('Erro ao atualizar amostra:', error);
    throw error;
  }
};

// Deletar amostra
export const deletarAmostra = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return id;
  } catch (error) {
    console.error('Erro ao deletar amostra:', error);
    throw error;
  }
};