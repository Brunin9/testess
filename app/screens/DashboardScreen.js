import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { buscarEstatisticas } from '../services/dashboardService';

export default function DashboardScreen() {
  const [estatisticas, setEstatisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    carregarEstatisticas();
  }, []);

  const carregarEstatisticas = async () => {
    try {
      setLoading(true);
      const dados = await buscarEstatisticas();
      setEstatisticas(dados);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as estatísticas');
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    carregarEstatisticas();
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#CBB26A" />
        <Text style={{ marginTop: 10 }}>Carregando dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <TouchableOpacity 
          style={styles.refreshBtn} 
          onPress={handleRefresh}
          disabled={refreshing}
        >
          <Text style={styles.refreshText}>
            {refreshing ? '↻ Atualizando...' : '🔄 Atualizar'}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>Visão geral do sistema AQMel</Text>

      {/* Card Usuários */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardIcon}>👥</Text>
          <Text style={styles.cardTitle}>Usuários</Text>
        </View>
        <Text style={styles.cardValue}>{estatisticas?.usuarios || 0}</Text>
        <Text style={styles.cardDescription}>Total de usuários cadastrados</Text>
      </View>

      {/* Card Amostras */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardIcon}>🧪</Text>
          <Text style={styles.cardTitle}>Amostras</Text>
        </View>
        <Text style={styles.cardValue}>{estatisticas?.amostras?.total || 0}</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Pendentes</Text>
            <Text style={[styles.statValue, { color: '#FF6B6B' }]}>
              {estatisticas?.amostras?.pendentes || 0}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Concluídas</Text>
            <Text style={[styles.statValue, { color: '#51CF66' }]}>
              {estatisticas?.amostras?.concluídas || 0}
            </Text>
          </View>
        </View>
      </View>

      {/* Card Análises */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardIcon}>🔬</Text>
          <Text style={styles.cardTitle}>Análises</Text>
        </View>
        <Text style={styles.cardValue}>{estatisticas?.analises?.total || 0}</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Pendentes</Text>
            <Text style={[styles.statValue, { color: '#FF6B6B' }]}>
              {estatisticas?.analises?.pendentes || 0}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Concluídas</Text>
            <Text style={[styles.statValue, { color: '#51CF66' }]}>
              {estatisticas?.analises?.concluídas || 0}
            </Text>
          </View>
        </View>
      </View>

      {/* Card Laudos */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardIcon}>📄</Text>
          <Text style={styles.cardTitle}>Laudos</Text>
        </View>
        <Text style={styles.cardValue}>{estatisticas?.laudos?.total || 0}</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Pendentes</Text>
            <Text style={[styles.statValue, { color: '#FFA94D' }]}>
              {estatisticas?.laudos?.pendentes || 0}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Emitidos</Text>
            <Text style={[styles.statValue, { color: '#51CF66' }]}>
              {estatisticas?.laudos?.emitidos || 0}
            </Text>
          </View>
        </View>
      </View>

      {/* Resumo Geral */}
      <View style={[styles.card, styles.summaryCard]}>
        <Text style={styles.summaryTitle}>📊 Resumo Geral</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>
            Total de registros no sistema: 
          </Text>
          <Text style={styles.summaryValue}>
            {(estatisticas?.usuarios || 0) + 
             (estatisticas?.amostras?.total || 0) + 
             (estatisticas?.analises?.total || 0) + 
             (estatisticas?.laudos?.total || 0)}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>
            Itens pendentes de atenção:
          </Text>
          <Text style={[styles.summaryValue, { color: '#FF6B6B' }]}>
            {(estatisticas?.amostras?.pendentes || 0) + 
             (estatisticas?.analises?.pendentes || 0) + 
             (estatisticas?.laudos?.pendentes || 0)}
          </Text>
        </View>
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDD0',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#CBB26A',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  refreshBtn: {
    backgroundColor: '#CBB26A',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  refreshText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#EEE3A9',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
  },
  cardValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000',
    marginVertical: 5,
  },
  cardDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  summaryCard: {
    backgroundColor: '#CBB26A',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 14,
    color: '#fff',
    flex: 1,
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
});