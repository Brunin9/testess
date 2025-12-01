import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('@user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          
          // Verificando se parsedUser é um objeto válido
          if (typeof parsedUser === 'object' && parsedUser !== null) {
            console.log('User loaded from AsyncStorage:', parsedUser); // Log para verificação
            setUser(parsedUser);
          } else {
            console.log('User data is invalid:', parsedUser);
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (e) {
        console.log('Erro ao carregar user:', e);
        setUser(null); // Em caso de erro ao carregar, limpamos o estado do user
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (userData) => {
    // Verificando se userData é um objeto válido antes de armazenar
    if (typeof userData === 'object' && userData !== null) {
      await AsyncStorage.setItem('@user', JSON.stringify(userData));
      setUser(userData);
    } else {
      console.error('Invalid user data:', userData);
    }
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('@user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
