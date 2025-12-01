import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

// Buscar estatísticas do dashboard
export const buscarEstatisticas = async () => {
  try {
    // Buscar contagem de cada coleção
    const [amostrasSnap, analisesSnap, laudosSnap] = await Promise.all([
      getDocs(collection(db, 'amostras')),
      getDocs(collection(db, 'analises')),
      getDocs(collection(db, 'laudos'))
    ]);

    // Processar amostras
    const amostras = [];
    amostrasSnap.forEach(doc => amostras.push({ id: doc.id, ...doc.data() }));
    
    // Processar análises
    const analises = [];
    analisesSnap.forEach(doc => analises.push({ id: doc.id, ...doc.data() }));
    
    // Processar laudos
    const laudos = [];
    laudosSnap.forEach(doc => laudos.push({ id: doc.id, ...doc.data() }));

    return {
      usuarios: 0, // Você pode implementar contagem de usuários depois
      amostras: {
        total: amostras.length,
        pendentes: amostras.filter(a => a.status === 'PENDENTE').length,
        concluídas: amostras.filter(a => a.status === 'CONCLUÍDA').length
      },
      analises: {
        total: analises.length,
        pendentes: analises.filter(a => a.status === 'PENDENTE').length,
        concluídas: analises.filter(a => a.status === 'CONCLUÍDA').length
      },
      laudos: {
        total: laudos.length,
        pendentes: laudos.filter(l => l.status === 'PENDENTE').length,
        emitidos: laudos.filter(l => l.status === 'EMITIDO').length
      }
    };
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    throw error;
  }
};