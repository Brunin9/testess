import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import AnalisesModal from '../modals/AnalisesModal';

export default function AnalisesScreen() {
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [tipoFiltro, setTipoFiltro] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('');
  const [dataInicio, setDataInicio] = useState(null);
  const [dataFim, setDataFim] = useState(null);
  const [showInicio, setShowInicio] = useState(false);
  const [showFim, setShowFim] = useState(false);

  const [analises, setAnalises] = useState([
    { id: '1', codigo: 'AN-2024-0001', amostra: 'AM-2024-0015', tipo: 'Físico-química', responsavel: 'Maria Silva', data: '15/06/2024', status: 'CONCLUÍDA' },
    { id: '2', codigo: 'AN-2024-0002', amostra: 'AM-2024-0016', tipo: 'Microbiológica', responsavel: 'João Pereira', data: '20/06/2024', status: 'PENDENTE' },
  ]);

  const estatisticas = [
    { label: 'Análises Hoje', valor: 15, detalhe: '+8% que ontem' },
    { label: 'Pendentes', valor: 18, detalhe: '-3% que semana passada' },
    { label: 'Concluídas', valor: 42, detalhe: '+25% que mês passado' },
  ];

  const renderAnalise = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cellCodigo}>{item.codigo}</Text>
      <Text style={styles.cell}>{item.amostra}</Text>
      <Text style={styles.cell}>{item.tipo}</Text>
      <Text style={styles.cell}>{item.responsavel}</Text>
      <Text style={styles.cell}>{item.data}</Text>
      <Text style={[styles.cell, item.status === 'CONCLUÍDA' ? styles.statusConcluida : styles.statusPendente]}>
        {item.status}
      </Text>
    </View>
  );

  const limparFiltros = () => {
    setSearch('');
    setTipoFiltro('');
    setStatusFiltro('');
    setDataInicio(null);
    setDataFim(null);
  };

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

        {/* Datas */}
        <TouchableOpacity style={styles.dateInput} onPress={() => setShowInicio(true)}>
          <Text>{dataInicio ? dataInicio.toLocaleDateString('pt-BR') : 'Data início'}</Text>
        </TouchableOpacity>
        {showInicio && (
          <DateTimePicker
            value={dataInicio || new Date()}
            mode="date"
            display="default"
            onChange={(event, selected) => {
              setShowInicio(false);
              if (selected) setDataInicio(selected);
            }}
          />
        )}

        <TouchableOpacity style={styles.dateInput} onPress={() => setShowFim(true)}>
          <Text>{dataFim ? dataFim.toLocaleDateString('pt-BR') : 'Data fim'}</Text>
        </TouchableOpacity>
        {showFim && (
          <DateTimePicker
            value={dataFim || new Date()}
            mode="date"
            display="default"
            onChange={(event, selected) => {
              setShowFim(false);
              if (selected) setDataFim(selected);
            }}
          />
        )}

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
        onSave={(novaAnalise) => {
          setAnalises(prev => [
            { id: String(prev.length + 1), ...novaAnalise },
            ...prev
          ]);
        }}
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
  dateInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 10, backgroundColor: '#fff', paddingHorizontal: 10, height: 40, justifyContent: 'center', marginRight: 10 },
  newBtn: { backgroundColor: '#CBB26A', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10 },
  newBtnText: { color: '#fff', fontWeight: 'bold' },
  clearBtn: { alignSelf: 'flex-start', marginBottom: 10 },
  clearText: { color: '#444', fontWeight: '600' },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginVertical: 10 },
  row: { flexDirection: 'row', padding: 10, backgroundColor: '#fff', borderRadius: 8, marginBottom: 10, elevation: 1 },
  cellCodigo: { flex: 1.2, fontWeight: 'bold' },
  cell: { flex: 1, fontSize: 13 },
  statusConcluida: { color: 'green', fontWeight: 'bold' },
  statusPendente: { color: 'red', fontWeight: 'bold' },
});
