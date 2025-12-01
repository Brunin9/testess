import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

export default function LaudosModal({ visible, onClose, onSave }) {
  const [codigo] = useState(`LD-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`);
  const [analise, setAnalise] = useState('');
  const [tipo, setTipo] = useState('');
  const [data, setData] = useState(new Date());
  const [status, setStatus] = useState('PENDENTE');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSave = () => {
    if (!analise || !tipo) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

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

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Novo Laudo</Text>

            <Text style={styles.label}>Código</Text>
            <TextInput 
              style={[styles.input, { backgroundColor: '#eee', color: '#555' }]} 
              value={codigo} 
              editable={false} 
            />

            <Text style={styles.label}>Código da Análise *</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Ex: AN-2024-1234" 
              value={analise} 
              onChangeText={setAnalise} 
            />

            <Text style={styles.label}>Tipo de Laudo *</Text>
            <View style={styles.pickerContainer}>
              <Picker selectedValue={tipo} onValueChange={setTipo}>
                <Picker.Item label="Selecione o tipo" value="" />
                <Picker.Item label="Físico-Químico" value="Físico-Químico" />
                <Picker.Item label="Microbiológico" value="Microbiológico" />
                <Picker.Item label="Completo" value="Completo" />
              </Picker>
            </View>

            <Text style={styles.label}>Data de Emissão</Text>
            <TouchableOpacity 
              style={styles.input} 
              onPress={() => setShowDatePicker(true)}
            >
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
              <TouchableOpacity style={styles.cancelBtn} onPress={handleClose}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  modal: { 
    backgroundColor: '#FFFDD0', 
    borderRadius: 12, 
    padding: 20, 
    width: '90%',
    maxHeight: '80%'
  },
  title: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    color: '#CBB26A',
    textAlign: 'center'
  },
  label: { 
    fontSize: 14, 
    fontWeight: '600', 
    marginBottom: 5, 
    color: '#333' 
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 8, 
    padding: 12, 
    marginBottom: 15, 
    backgroundColor: '#fff',
    fontSize: 14
  },
  pickerContainer: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 8, 
    marginBottom: 15, 
    backgroundColor: '#fff' 
  },
  actions: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 20 
  },
  cancelBtn: { 
    flex: 1,
    marginRight: 10,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBB26A',
    alignItems: 'center'
  },
  cancelText: { 
    fontSize: 16, 
    color: '#CBB26A',
    fontWeight: '600'
  },
  saveBtn: { 
    flex: 1,
    backgroundColor: '#CBB26A', 
    padding: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  saveText: { 
    color: '#fff', 
    fontWeight: 'bold',
    fontSize: 16
  },
});