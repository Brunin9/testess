import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function DashboardScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Usuários</Text>
        <Text style={styles.cardValue}>25</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Amostras</Text>
        <Text style={styles.cardValue}>102</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Análises</Text>
        <Text style={styles.cardValue}>56</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Laudos</Text>
        <Text style={styles.cardValue}>18</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDD0',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#CBB26A',
  },
  card: {
    backgroundColor: '#EEE3A9',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 10,
  },
});
