import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import LaudosModal from '../modals/LaudosModal';

export default function LaudosScreen() {
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [statusFiltro, setStatusFiltro] = useState('');
  const [dataFiltro, setDataFiltro] = useState(null);
  const [showDataPicker, setShowDataPicker] = useState(false);

  const [laudos, setLaudos] = useState([
    { id: '1', codigo: 'LD-2024-0038', analise: 'AN-2024-0042', tipo: 'Físico-Químico', data: '15/06/2024', status: 'EMITIDO' },
    { id: '2', codigo: 'LD-2024-0039', analise: 'AN-2024-0043', tipo: 'Microbiológico', data: '16/06/2024', status: 'PENDENTE' },
    { id: '3', codigo: 'LD-2024-0040', analise: 'AN-2024-0044', tipo: 'Completo', data: '17/06/2024', status: 'PENDENTE' },
  ]);

  const estatisticas = [
    { label: 'Laudos Hoje', valor: 8, detalhe: '+15% que ontem' },
    { label: 'Pendentes', valor: 5, detalhe: '-2% que semana passada' },
    { label: 'Emitidos', valor: 42, detalhe: '+30% que mês passado' },
  ];

  const renderLaudo = ({ item }) => (
    <View style={styles.row}>
      <Text style={[styles.cell, { flex: 1.3, fontWeight: 'bold' }]}>{item.codigo}</Text>
      <Text style={[styles.cell, { flex: 1.3 }]}>{item.analise}</Text>
      <Text style={[styles.cell, { flex: 1.1 }]}>{item.tipo}</Text>
      <Text style={[styles.cell, { flex: 1 }]}>{item.data}</Text>
      <Text style={[
        styles.cell,
        item.status === 'EMITIDO' ? styles.statusEmitido : styles.statusPendente
      ]}>
        {item.status}
      </Text>
    </View>
  );

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

        <TouchableOpacity style={[styles.dateInput, { flexBasis: '25%' }]} onPress={() => setShowDataPicker(true)}>
          <Text>{dataFiltro ? dataFiltro.toLocaleDateString('pt-BR') : 'dd/mm/aaaa'}</Text>
        </TouchableOpacity>
        {showDataPicker && (
          <DateTimePicker
            value={dataFiltro || new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDataPicker(false);
              if (selectedDate) setDataFiltro(selectedDate);
            }}
          />
        )}

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
        onSave={(novoLaudo) => {
          setLaudos(prev => [
            { id: String(prev.length + 1), ...novoLaudo },
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
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 10, paddingHorizontal: 10, height: 40, backgroundColor: '#fff', marginRight: 10 },
  picker: { borderWidth: 1, borderColor: '#ccc', borderRadius: 10, backgroundColor: '#fff', height: 40, justifyContent: 'center', marginRight: 10 },
  dateInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 10, backgroundColor: '#fff', paddingHorizontal: 10, height: 40, justifyContent: 'center', marginRight: 10 },
  newBtn: { backgroundColor: '#CBB26A', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10 },
  newBtnText: { color: '#fff', fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginVertical: 10 },
  row: { flexDirection: 'row', padding: 10, backgroundColor: '#fff', borderRadius: 8, marginBottom: 10, elevation: 1 },
  cell: { fontSize: 13, flex: 1 },
  statusEmitido: { color: 'green', fontWeight: 'bold' },
  statusPendente: { color: 'orange', fontWeight: 'bold' },
});
