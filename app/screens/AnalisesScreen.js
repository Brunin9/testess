import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Alert, ActivityIndicator } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import AnalisesModal from '../modals/AnalisesModal';
import { criarAnalise, buscarAnalises, deletarAnalise } from '../services/analisesService';

export default function AnalisesScreen() {
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [tipoFiltro, setTipoFiltro] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('');
  const [dataInicio, setDataInicio] = useState(null);
  const [dataFim, setDataFim] = useState(null);
  const [showInicio, setShowInicio] = useState(false);
  const [showFim, setShowFim] = useState(false);
  const [analises, setAnalises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarAnalises();
  }, []);

  const carregarAnalises = async () => {
    try {
      setLoading(true);
      const dados = await buscarAnalises();
      setAnalises(dados);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as análises');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSalvarAnalise = async (novaAnalise) => {
    try {
      const analiseCriada = await criarAnalise(novaAnalise);
      setAnalises(prev => [analiseCriada, ...prev]);
      Alert.alert('Sucesso', 'Análise cadastrada com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a análise');
      console.error(error);
    }
  };

  const handleDeletarAnalise = (id, codigo) => {
    Alert.alert(
      'Confirmar exclusão',
      `Deseja realmente excluir a análise ${codigo}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletarAnalise(id);
              setAnalises(prev => prev.filter(a => a.id !== id));
              Alert.alert('Sucesso', 'Análise excluída com sucesso!');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir a análise');
              console.error(error);
            }
          }
        }
      ]
    );
  };

  const estatisticas = [
    { label: 'Análises Hoje', valor: 15, detalhe: '+8% que ontem' },
    { label: 'Pendentes', valor: analises.filter(a => a.status === 'PENDENTE').length, detalhe: '-3% que semana passada' },
    { label: 'Concluídas', valor: analises.filter(a => a.status === 'CONCLUÍDA').length, detalhe: '+25% que mês passado' },
  ];

  const renderAnalise = ({ item }) => (
    <View style={styles.row}>
      <View style={{ flex: 5 }}>
        <Text style={styles.cellCodigo}>{item.codigo}</Text>
        <Text style={styles.cell}>Amostra: {item.amostra}</Text>
        <Text style={styles.cell}>Tipo: {item.tipo}</Text>
        <Text style={styles.cell}>Responsável: {item.responsavel}</Text>
        <Text style={styles.cell}>Data: {item.data}</Text>
        <Text style={[styles.cell, item.status === 'CONCLUÍDA' ? styles.statusConcluida : styles.statusPendente]}>
          {item.status}
        </Text>
      </View>
      <TouchableOpacity 
        style={styles.deleteBtn}
        onPress={() => handleDeletarAnalise(item.id, item.codigo)}
      >
        <Text style={styles.deleteText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  const limparFiltros = () => {
    setSearch('');
    setTipoFiltro('');
    setStatusFiltro('');
    setDataInicio(null);
    setDataFim(null);
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#CBB26A" />
        <Text style={{ marginTop: 10 }}>Carregando análises...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Análises</Text>
      <Text style={styles.subtitle}>Gerenciamento de análises físico-químicas e microbiológicas</Text>

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
          placeholder="Pesquisar código..."
          value={search}
          onChangeText={setSearch}
        />
        <View style={styles.picker}>
          <Picker selectedValue={tipoFiltro} onValueChange={setTipoFiltro}>
            <Picker.Item label="Todos os tipos" value="" />
            <Picker.Item label="Físico-química" value="Físico-química" />
            <Picker.Item label="Microbiológica" value="Microbiológica" />
          </Picker>
        </View>
        <View style={styles.picker}>
          <Picker selectedValue={statusFiltro} onValueChange={setStatusFiltro}>
            <Picker.Item label="Todos os status" value="" />
            <Picker.Item label="PENDENTE" value="PENDENTE" />
            <Picker.Item label="CONCLUÍDA" value="CONCLUÍDA" />
          </Picker>
        </View>

        <TouchableOpacity style={styles.newBtn} onPress={() => setModalVisible(true)}>
          <Text style={styles.newBtnText}>+ Nova</Text>
        </TouchableOpacity>
      </View>

      {/* Botão limpar */}
      <TouchableOpacity style={styles.clearBtn} onPress={limparFiltros}>
        <Text style={styles.clearText}>🧹 Limpar</Text>
      </TouchableOpacity>

      {/* Lista */}
      <Text style={styles.sectionTitle}>Todas as Análises</Text>
      <FlatList
        data={analises.filter(a =>
          a.codigo.toLowerCase().includes(search.toLowerCase()) &&
          (tipoFiltro ? a.tipo === tipoFiltro : true) &&
          (statusFiltro ? a.status === statusFiltro : true)
        )}
        keyExtractor={(item) => item.id}
        renderItem={renderAnalise}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>Nenhuma análise encontrada</Text>}
      />

      {/* Modal Nova Análise */}
      <AnalisesModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSalvarAnalise}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFDD0', padding: 15 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#CBB26A' },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 20 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  card: { backgroundColor: '#EEE3A9', padding: 15, borderRadius: 12, width: '30%' },
  cardLabel: { fontSize: 14, fontWeight: '600', color: '#333' },
  cardValue: { fontSize: 22, fontWeight: 'bold', marginVertical: 5 },
  cardDetail: { fontSize: 12, color: '#228B22' },
  filterContainer: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginBottom: 10 },
  searchInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 10, paddingHorizontal: 10, height: 40, backgroundColor: '#fff', flex: 1, marginRight: 10 },
  picker: { borderWidth: 1, borderColor: '#ccc', borderRadius: 10, backgroundColor: '#fff', marginRight: 10, height: 40, justifyContent: 'center', flexBasis: '30%' },
  newBtn: { backgroundColor: '#CBB26A', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10 },
  newBtnText: { color: '#fff', fontWeight: 'bold' },
  clearBtn: { alignSelf: 'flex-start', marginBottom: 10 },
  clearText: { color: '#444', fontWeight: '600' },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginVertical: 10 },
  row: { flexDirection: 'row', padding: 10, backgroundColor: '#fff', borderRadius: 8, marginBottom: 10, elevation: 1, alignItems: 'center' },
  cellCodigo: { fontWeight: 'bold', fontSize: 14 },
  cell: { fontSize: 13, marginTop: 3 },
  statusConcluida: { color: 'green', fontWeight: 'bold' },
  statusPendente: { color: 'red', fontWeight: 'bold' },
  deleteBtn: { padding: 10 },
  deleteText: { fontSize: 20 },
});