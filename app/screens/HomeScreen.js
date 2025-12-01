import React, { useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';

export default function HomeScreen({ navigation }) {
  const { user, logout } = useContext(AuthContext);

  // Menu items - desabilitados os que ainda não têm tela
  const menuItems = [
    { label: 'Dashboard', screen: 'Dashboard', enabled: true },
    { label: 'Amostras', screen: 'Amostras', enabled: true },
    { label: 'Análises', screen: 'Analises', enabled: true },
    { label: 'Laudos', screen: 'Laudos', enabled: true },
    { label: 'Usuários', screen: 'Usuarios', enabled: false },
    { label: 'Parâmetros', screen: 'Parametros', enabled: false },
    { label: 'Revisar Laudos', screen: 'RevisarLaudos', enabled: false },
  ];

  useEffect(() => {
    if (!user) {
      navigation.replace('Login');
    }
  }, [user]);

  const handleMenuPress = (item) => {
    if (item.enabled) {
      navigation.navigate(item.screen);
    } else {
      Alert.alert(
        'Em Desenvolvimento',
        `A tela "${item.label}" ainda não está disponível.`,
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Bem-vindo!</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>
        <TouchableOpacity 
          onPress={async () => {
            await logout();
            navigation.replace('Login');
          }} 
          style={styles.logoutBtn}
        >
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container}>
        <Text style={styles.title}>AQMel APP</Text>
        <Text style={styles.subtitle}>Sistema de Gestão de Análises de Mel</Text>
        
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.button,
              !item.enabled && styles.buttonDisabled
            ]}
            onPress={() => handleMenuPress(item)}
          >
            <Text style={[
              styles.buttonText,
              !item.enabled && styles.buttonTextDisabled
            ]}>
              {item.label}
              {!item.enabled && ' (Em breve)'}
            </Text>
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
    color: '#333',
  },
  email: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  logoutBtn: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#CBB26A',
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#CBB26A',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 25,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#CBB26A',
    marginBottom: 15,
  },
  buttonDisabled: {
    backgroundColor: '#D3D3D3',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonTextDisabled: {
    color: '#888',
  },
});