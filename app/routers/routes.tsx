import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import Index from '../index'
import Login from '../screens/Home/Login'
import LoadingScreen from '../services/LoadingScreen'
import Dashboard from '../screens/Client/dashboard'

const Stack = createStackNavigator()

export default function Router() {
  return (
    <Stack.Navigator initialRouteName="LoadingScreen">
      {/* Pantalla de Carga */}
      <Stack.Screen
        name="LoadingScreen"
        component={LoadingScreen}
        options={{
          headerShown: false,
        }}
      />

      {/* Pantalla de Inicio */}
      <Stack.Screen
        name="Index"
        component={Index}
        options={{
          headerShown: false,
        }}
      />

      {/* Pantalla de Login */}
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false,
        }}
      />

      {/* Pantalla de Dashboard */}
      <Stack.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  )
}
