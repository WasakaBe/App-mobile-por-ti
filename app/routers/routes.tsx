import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import Index from '../index'
import Login from '../screens/Home/Login'
import LoadingScreen from '../services/LoadingScreen'
import Dashboard from '../screens/Client/dashboard'
import Noticias from '../screens/Client/Noticias'
import Conectate from '../screens/Client/conectate'
import ConsultarSaldo from '../screens/Client/consultarSaldo'
import DirectorioServicios from '../screens/Client/directorioServicios'
import Invitacion from '../screens/Client/invitacion'
import promocionesDescuentos from '../screens/Client/promocionesDescuentos'
import Recargas from '../screens/Client/recargas'
import ReporteCiudadano from '../screens/Client/ReporteCiudadano'

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

      {/* Pantalla de Noticias */}
      <Stack.Screen
        name="Noticias"
        component={Noticias}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Conectate"
        component={Conectate}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ConsultarSaldo"
        component={ConsultarSaldo}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="DirectorioServicios"
        component={DirectorioServicios}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Invitacion"
        component={Invitacion}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PromocionesDescuentos"
        component={promocionesDescuentos}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Recargas"
        component={Recargas}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ReporteCiudadano"
        component={ReporteCiudadano}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  )
}
