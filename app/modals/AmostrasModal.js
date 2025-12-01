import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

export default function AmostrasModal({ visible, onClose, onSave }) {
  const [codigo] = useState(`AM-${new Date().getFullYear()}-XXXX`); 
  const [dataColeta, setDataColeta] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [origem, setOrigem] = useState('');
  const [cultura, setCultura] = useState('');
  const [abelha, setAbelha] = useState('');

  const handleSave = () => {
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

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
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
          <Text style={styles.label}>Origem/Produtor</Text>
          <TextInput
            style={styles.input}
            value={origem}
            onChangeText={setOrigem}
            placeholder="Ex: São Paulo - SP, Fazenda do Mel"
          />

          {/* Tipo de Cultura */}
          <Text style={styles.label}>Tipo de Cultura</Text>
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
          <Text style={styles.label}>Espécie de Abelha</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={abelha}
              onValueChange={(itemValue) => setAbelha(itemValue)}
            >
              <Picker.Item label="Selecione a espécie de abelha" value="" />
              <Picker.Item label="Apis mellifera" value="Apis mellifera" />
              <Picker.Item label="Jataí" value="Jataí" />
            </Picker>
          </View>

          {/* Botões */}
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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modal: {
    backgroundColor: '#FFFDD0',
    borderRadius: 12,
    padding: 20,
    width: '90%'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#CBB26A'
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
    backgroundColor: '#fff'
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
    justifyContent: 'flex-end',
    marginTop: 10
  },
  cancelBtn: {
    marginRight: 15
  },
  cancelText: {
    fontSize: 16,
    color: '#666'
  },
  saveBtn: {
    backgroundColor: '#CBB26A',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});
