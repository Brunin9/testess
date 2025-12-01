import React, { useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';

export default function HomeScreen({ navigation }) {
  const menuItems = [
    { label: 'Dashboard', screen: 'Dashboard' },
    { label: 'Amostras', screen: 'Amostras' },
    { label: 'Análises', screen: 'Analises' },
    { label: 'Laudos', screen: 'Laudos' },
    { label: 'Usuários', screen: 'Usuarios' },
    { label: 'Parâmetros', screen: 'Parametros' },
    { label: 'Revisar Laudos', screen: 'RevisarLaudos' },
  ];

  const { user, logout } = useContext(AuthContext); // aqui o hook que faltava
  useEffect(() => {
    if (!user) {
      navigation.replace('Login');
    }
  }, [user]);  

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Bem-vindo, {user?.email}</Text>
        <TouchableOpacity onPress={async () => {
          await logout();
          navigation.replace('Login');
        }} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container}>
        <Text style={styles.title}>AQMel APP</Text>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.button}
            onPress={() => navigation.navigate(item.screen)}
          >
            <Text style={styles.buttonText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFDD0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#EEE3A9',
  },
  welcome: {
    fontSize: 16,
    fontWeight: '600',
  },
  logoutBtn: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    backgroundColor: '#CBB26A',
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#CBB26A',
  },
  button: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#CBB26A',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
