import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Alert, ActivityIndicator } from 'react-native';
import AmostrasModal from '../modals/AmostrasModal';
import { criarAmostra, buscarAmostras, deletarAmostra } from '../services/amostrasService';

export default function AmostrasScreen() {
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [amostras, setAmostras] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carregar amostras ao iniciar
  useEffect(() => {
    carregarAmostras();
  }, []);

  const carregarAmostras = async () => {
    try {
      setLoading(true);
      const dados = await buscarAmostras();
      setAmostras(dados);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as amostras');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSalvarAmostra = async (novaAmostra) => {
    try {
      const amostraCriada = await criarAmostra(novaAmostra);
      setAmostras(prev => [amostraCriada, ...prev]);
      Alert.alert('Sucesso', 'Amostra cadastrada com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a amostra');
      console.error(error);
    }
  };

  const handleDeletarAmostra = (id, codigo) => {
    Alert.alert(
      'Confirmar exclusão',
      `Deseja realmente excluir a amostra ${codigo}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletarAmostra(id);
              setAmostras(prev => prev.filter(a => a.id !== id));
              Alert.alert('Sucesso', 'Amostra excluída com sucesso!');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir a amostra');
              console.error(error);
            }
          }
        }
      ]
    );
  };

  const estatisticas = [
    { label: 'Total de Amostras', valor: amostras.length, detalhe: '+24% que mês passado' },
    { label: 'Pendentes', valor: amostras.filter(a => a.status === 'PENDENTE').length, detalhe: '-2% que semana passada' },
    { label: 'Analisadas', valor: amostras.filter(a => a.status === 'CONCLUÍDA').length, detalhe: '+30% que mês passado' },
  ];

  const renderAmostra = ({ item }) => (
    <View style={styles.row}>
      <View style={{ flex: 4 }}>
        <Text style={styles.cellCodigo}>{item.codigo}</Text>
        <Text style={styles.cell}>{item.origem}</Text>
        <Text style={styles.cell}>{item.cultura}</Text>
        <Text style={styles.cell}>{item.dataColeta}</Text>
        <Text style={[styles.cell, item.status === 'CONCLUÍDA' ? styles.statusConcluida : styles.statusPendente]}>
          {item.status}
        </Text>
      </View>
      <TouchableOpacity 
        style={styles.deleteBtn}
        onPress={() => handleDeletarAmostra(item.id, item.codigo)}
      >
        <Text style={styles.deleteText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#CBB26A" />
        <Text style={{ marginTop: 10 }}>Carregando amostras...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Amostras</Text>
      <Text style={styles.subtitle}>Cadastro e gerenciamento de amostras de mel</Text>

      {/* Estatísticas */}
      <View style={styles.statsContainer}>
        {estatisticas.map((item, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.cardLabel}>{item.label}</Text>
            <Text style={styles.cardValue}>{item.valor}</Text>
            <Text style={styles.cardDetail}>{item.detalhe}</Text>
          </View>
        ))}
      </View>

      {/* Filtros */}
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar amostra..."
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity style={styles.newBtn} onPress={() => setModalVisible(true)}>
          <Text style={styles.newBtnText}>+ Nova</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de amostras */}
      <Text style={styles.sectionTitle}>Todas as Amostras</Text>
      <FlatList
        data={amostras.filter(a =>
          a.codigo.toLowerCase().includes(search.toLowerCase()) ||
          a.origem.toLowerCase().includes(search.toLowerCase())
        )}
        keyExtractor={(item) => item.id}
        renderItem={renderAmostra}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>Nenhuma amostra encontrada</Text>}
      />

      {/* Modal Nova Amostra */}
      <AmostrasModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSalvarAmostra}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFDD0', padding: 15 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#CBB26A' },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 20 },

  statsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { backgroundColor: '#EEE3A9', padding: 15, borderRadius: 12, width: '30%', marginBottom: 15 },
  cardLabel: { fontSize: 14, fontWeight: '600', color: '#333' },
  cardValue: { fontSize: 22, fontWeight: 'bold', marginVertical: 5 },
  cardDetail: { fontSize: 12, color: '#228B22' },

  filterContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  searchInput: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 10, paddingHorizontal: 10, height: 40, backgroundColor: '#fff', marginRight: 10 },
  newBtn: { backgroundColor: '#CBB26A', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10 },
  newBtnText: { color: '#fff', fontWeight: 'bold' },

  sectionTitle: { fontSize: 18, fontWeight: '600', marginVertical: 10 },

  row: { flexDirection: 'row', padding: 10, backgroundColor: '#fff', borderRadius: 8, marginBottom: 10, elevation: 1, alignItems: 'center' },
  cellCodigo: { fontWeight: 'bold', fontSize: 14 },
  cell: { fontSize: 13, marginTop: 3 },
  statusConcluida: { color: 'green', fontWeight: 'bold' },
  statusPendente: { color: 'red', fontWeight: 'bold' },
  
  deleteBtn: { padding: 10 },
  deleteText: { fontSize: 20 },
});