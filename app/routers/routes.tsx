import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import Index from '../index'
import Login from '../screens/Home/Login'
const Stack = createStackNavigator() // Usa los tipos aquí

export default function Router() {
  return (
    <>
      <Stack.Navigator initialRouteName="Index">
        <Stack.Screen
          name="Index"
          component={Index}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </>
  )
}
