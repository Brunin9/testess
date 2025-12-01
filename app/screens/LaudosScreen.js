import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Alert, ActivityIndicator } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import LaudosModal from '../modals/LaudosModal';
import { criarLaudo, buscarLaudos, deletarLaudo } from '../services/laudosService';

export default function LaudosScreen() {
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [statusFiltro, setStatusFiltro] = useState('');
  const [dataFiltro, setDataFiltro] = useState(null);
  const [showDataPicker, setShowDataPicker] = useState(false);
  const [laudos, setLaudos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarLaudos();
  }, []);

  const carregarLaudos = async () => {
    try {
      setLoading(true);
      const dados = await buscarLaudos();
      setLaudos(dados);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os laudos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSalvarLaudo = async (novoLaudo) => {
    try {
      const laudoCriado = await criarLaudo(novoLaudo);
      setLaudos(prev => [laudoCriado, ...prev]);
      Alert.alert('Sucesso', 'Laudo cadastrado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o laudo');
      console.error(error);
    }
  };

  const handleDeletarLaudo = (id, codigo) => {
    Alert.alert(
      'Confirmar exclusão',
      `Deseja realmente excluir o laudo ${codigo}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletarLaudo(id);
              setLaudos(prev => prev.filter(l => l.id !== id));
              Alert.alert('Sucesso', 'Laudo excluído com sucesso!');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir o laudo');
              console.error(error);
            }
          }
        }
      ]
    );
  };

  const estatisticas = [
    { label: 'Laudos Hoje', valor: 8, detalhe: '+15% que ontem' },
    { label: 'Pendentes', valor: laudos.filter(l => l.status === 'PENDENTE').length, detalhe: '-2% que semana passada' },
    { label: 'Emitidos', valor: laudos.filter(l => l.status === 'EMITIDO').length, detalhe: '+30% que mês passado' },
  ];

  const renderLaudo = ({ item }) => (
    <View style={styles.row}>
      <View style={{ flex: 5 }}>
        <Text style={styles.cellCodigo}>{item.codigo}</Text>
        <Text style={styles.cell}>Análise: {item.analise}</Text>
        <Text style={styles.cell}>Tipo: {item.tipo}</Text>
        <Text style={styles.cell}>Data: {item.data}</Text>
        <Text style={[
          styles.cell,
          item.status === 'EMITIDO' ? styles.statusEmitido : styles.statusPendente
        ]}>
          {item.status}
        </Text>
      </View>
      <TouchableOpacity 
        style={styles.deleteBtn}
        onPress={() => handleDeletarLaudo(item.id, item.codigo)}
      >
        <Text style={styles.deleteText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#CBB26A" />
        <Text style={{ marginTop: 10 }}>Carregando laudos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Laudos</Text>
      <Text style={styles.subtitle}>Emissão e gerenciamento de laudos de análise de mel</Text>

      {/* Estatísticas */}
      <View style={styles.statsContainer}>
        {estatisticas.map((item, i) => (
          <View key={i} style={styles.card}>
            <Text style={styles.cardLabel}>{item.label}</Text>
            <Text style={styles.cardValue}>{item.valor}</Text>
            <Text style={styles.cardDetail}>{item.detalhe}</Text>
          </View>
        ))}
      </View>

      {/* Filtros */}
      <View style={styles.filterContainer}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Pesquisar laudo..."
          value={search}
          onChangeText={setSearch}
        />

        <View style={[styles.picker, { flexBasis: '35%' }]}>
          <Picker selectedValue={statusFiltro} onValueChange={setStatusFiltro}>
            <Picker.Item label="Todos os status" value="" />
            <Picker.Item label="PENDENTE" value="PENDENTE" />
            <Picker.Item label="EMITIDO" value="EMITIDO" />
          </Picker>
        </View>

        <TouchableOpacity style={styles.newBtn} onPress={() => setModalVisible(true)}>
          <Text style={styles.newBtnText}>+ Novo</Text>
        </TouchableOpacity>
      </View>

      {/* Lista */}
      <Text style={styles.sectionTitle}>Todos os Laudos</Text>
      <FlatList
        data={laudos.filter(l =>
          l.codigo.toLowerCase().includes(search.toLowerCase()) &&
          (statusFiltro ? l.status === statusFiltro : true)
        )}
        keyExtractor={item => item.id}
        renderItem={renderLaudo}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>Nenhum laudo encontrado</Text>}
      />

      {/* Modal */}
      <LaudosModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSalvarLaudo}
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
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 10, paddingHorizontal: 10, height: 40, backgroundColor: '#fff', marginRight: 10 },
  picker: { borderWidth: 1, borderColor: '#ccc', borderRadius: 10, backgroundColor: '#fff', height: 40, justifyContent: 'center', marginRight: 10 },
  newBtn: { backgroundColor: '#CBB26A', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10 },
  newBtnText: { color: '#fff', fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginVertical: 10 },
  row: { flexDirection: 'row', padding: 10, backgroundColor: '#fff', borderRadius: 8, marginBottom: 10, elevation: 1, alignItems: 'center' },
  cellCodigo: { fontWeight: 'bold', fontSize: 14 },
  cell: { fontSize: 13, marginTop: 3 },
  statusEmitido: { color: 'green', fontWeight: 'bold' },
  statusPendente: { color: 'orange', fontWeight: 'bold' },
  deleteBtn: { padding: 10 },
  deleteText: { fontSize: 20 },
});