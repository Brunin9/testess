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

const COLLECTION_NAME = 'laudos';

// Criar novo laudo
export const criarLaudo = async (laudoData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...laudoData,
      criadoEm: Timestamp.now(),
      atualizadoEm: Timestamp.now()
    });
    return { id: docRef.id, ...laudoData };
  } catch (error) {
    console.error('Erro ao criar laudo:', error);
    throw error;
  }
};

// Buscar todos os laudos
export const buscarLaudos = async () => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('criadoEm', 'desc'));
    const querySnapshot = await getDocs(q);
    const laudos = [];
    querySnapshot.forEach((doc) => {
      laudos.push({ id: doc.id, ...doc.data() });
    });
    return laudos;
  } catch (error) {
    console.error('Erro ao buscar laudos:', error);
    throw error;
  }
};

// Atualizar laudo
export const atualizarLaudo = async (id, laudoData) => {
  try {
    const laudoRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(laudoRef, {
      ...laudoData,
      atualizadoEm: Timestamp.now()
    });
    return { id, ...laudoData };
  } catch (error) {
    console.error('Erro ao atualizar laudo:', error);
    throw error;
  }
};

// Deletar laudo
export const deletarLaudo = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return id;
  } catch (error) {
    console.error('Erro ao deletar laudo:', error);
    throw error;
  }
};