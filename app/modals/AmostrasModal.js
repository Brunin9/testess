import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

export default function AmostrasModal({ visible, onClose, onSave }) {
  const [codigo] = useState(`AM-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`); 
  const [dataColeta, setDataColeta] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [origem, setOrigem] = useState('');
  const [cultura, setCultura] = useState('');
  const [abelha, setAbelha] = useState('');

  const handleSave = () => {
    if (!origem || !cultura || !abelha) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    const novaAmostra = {
      codigo,
      dataColeta: dataColeta.toLocaleDateString('pt-BR'),
      origem,
      cultura,
      abelha,
      status: 'PENDENTE',
    };
    onSave(novaAmostra);
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setDataColeta(new Date());
    setOrigem('');
    setCultura('');
    setAbelha('');
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
            <Text style={styles.title}>Nova Amostra</Text>

            {/* Código (somente leitura) */}
            <Text style={styles.label}>Código</Text>
            <TextInput
              style={[styles.input, { backgroundColor: '#eee', color: '#555' }]}
              value={codigo}
              editable={false}
            />

            {/* Data de coleta */}
            <Text style={styles.label}>Data de Coleta</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowDatePicker(true)}
            >
              <Text>{dataColeta.toLocaleDateString('pt-BR')}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={dataColeta}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) setDataColeta(selectedDate);
                }}
              />
            )}

            {/* Origem / Produtor */}
            <Text style={styles.label}>Origem/Produtor *</Text>
            <TextInput
              style={styles.input}
              value={origem}
              onChangeText={setOrigem}
              placeholder="Ex: São Paulo - SP, Fazenda do Mel"
            />

            {/* Tipo de Cultura */}
            <Text style={styles.label}>Tipo de Cultura *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={cultura}
                onValueChange={(itemValue) => setCultura(itemValue)}
              >
                <Picker.Item label="Selecione a cultura" value="" />
                <Picker.Item label="Apicultura" value="Apicultura" />
                <Picker.Item label="Agricultura" value="Agricultura" />
              </Picker>
            </View>

            {/* Espécie de Abelha */}
            <Text style={styles.label}>Espécie de Abelha *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={abelha}
                onValueChange={(itemValue) => setAbelha(itemValue)}
              >
                <Picker.Item label="Selecione a espécie de abelha" value="" />
                <Picker.Item label="Apis mellifera" value="Apis mellifera" />
                <Picker.Item label="Jataí" value="Jataí" />
                <Picker.Item label="Mandaçaia" value="Mandaçaia" />
                <Picker.Item label="Uruçu" value="Uruçu" />
                <Picker.Item label="Outra" value="Outra" />
              </Picker>
            </View>

            {/* Botões */}
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
  }
});