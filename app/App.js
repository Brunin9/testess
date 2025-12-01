import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
//import DashboardScreen from './screens/DashboardScreen';
import AmostrasScreen from './screens/AmostrasScreen';
import AnalisesScreen from './screens/AnalisesScreen';
import LaudosScreen from './screens/LaudosScreen';
import { AuthProvider } from './contexts/AuthContext';

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Amostras" component={AmostrasScreen} />
          <Stack.Screen name="Analises" component={AnalisesScreen} />
          <Stack.Screen name="Laudos" component={LaudosScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

//add quando tiver outras telas:
/*
<Stack.Screen name="Dashboard" component={DashboardScreen} />
<Stack.Screen name="Dashboard" component={DashboardScreen} />
<Stack.Screen name="Amostras" component={AmostrasScreen} />
<Stack.Screen name="Analises" component={AnalisesScreen} />
<Stack.Screen name="Laudos" component={LaudosScreen} />
<Stack.Screen name="Usuarios" component={UsuariosScreen} />
<Stack.Screen name="Parametros" component={ParametrosScreen} />
<Stack.Screen name="RevisarLaudos" component={RevisarLaudosScreen} />
*/
