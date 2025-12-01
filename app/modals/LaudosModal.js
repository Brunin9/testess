import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

export default function LaudosModal({ visible, onClose, onSave }) {
  const [codigo] = useState(`LD-${new Date().getFullYear()}-XXXX`);
  const [analise, setAnalise] = useState('');
  const [tipo, setTipo] = useState('');
  const [data, setData] = useState(new Date());
  const [status, setStatus] = useState('PENDENTE');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSave = () => {
    const novoLaudo = {
      codigo,
      analise,
      tipo,
      data: data.toLocaleDateString('pt-BR'),
      status,
    };
    onSave(novoLaudo);
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setAnalise('');
    setTipo('');
    setData(new Date());
    setStatus('PENDENTE');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Novo Laudo</Text>

          <Text style={styles.label}>Código</Text>
          <TextInput style={[styles.input, { backgroundColor: '#eee' }]} value={codigo} editable={false} />

          <Text style={styles.label}>Análise</Text>
          <TextInput style={styles.input} placeholder="Código da análise" value={analise} onChangeText={setAnalise} />

          <Text style={styles.label}>Tipo</Text>
          <View style={styles.pickerContainer}>
            <Picker selectedValue={tipo} onValueChange={setTipo}>
              <Picker.Item label="Selecione o tipo" value="" />
              <Picker.Item label="Físico-Químico" value="Físico-Químico" />
              <Picker.Item label="Microbiológico" value="Microbiológico" />
              <Picker.Item label="Completo" value="Completo" />
            </Picker>
          </View>

          <Text style={styles.label}>Data</Text>
          <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
            <Text>{data.toLocaleDateString('pt-BR')}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={data}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setData(selectedDate);
              }}
            />
          )}

          <Text style={styles.label}>Status</Text>
          <View style={styles.pickerContainer}>
            <Picker selectedValue={status} onValueChange={setStatus}>
              <Picker.Item label="PENDENTE" value="PENDENTE" />
              <Picker.Item label="EMITIDO" value="EMITIDO" />
            </Picker>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modal: { backgroundColor: '#FFFDD0', borderRadius: 12, padding: 20, width: '90%' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#CBB26A' },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 5, color: '#333' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 15, backgroundColor: '#fff' },
  pickerContainer: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 15, backgroundColor: '#fff' },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 },
  cancelBtn: { marginRight: 15 },
  cancelText: { fontSize: 16, color: '#666' },
  saveBtn: { backgroundColor: '#CBB26A', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  saveText: { color: '#fff', fontWeight: 'bold' },
});