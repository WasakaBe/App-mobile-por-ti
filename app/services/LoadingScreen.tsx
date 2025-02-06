import React, { useEffect } from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function LoadingScreen({ navigation }: any) {
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verifica si el token existe en AsyncStorage
        const token = await AsyncStorage.getItem('token')
        if (token) {
          // Si el token existe, redirige al Dashboard
          navigation.replace('Dashboard')
        } else {
          // Si no hay token, redirige al Login
          navigation.replace('Index')
        }
      } catch (error) {
        console.error('Error verificando autenticación:', error)
        navigation.replace('Index') // Redirige al Login en caso de error
      }
    }

    checkAuth()
  }, [navigation])

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#1E88E5" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#080825',
  },
})
