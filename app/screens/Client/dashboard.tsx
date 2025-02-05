import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ImageBackground, Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { decode as atob } from 'base-64'
import { getBackgroundByIdPartido } from '@/app/constants/partidoBackgrounds'

import ErrorModal from '@/app/constants/errorModal'
export default function Dashboard({ navigation }: any) {
  const [userName, setUserName] = useState('')
  const [backgroundSource, setBackgroundSource] = useState(
    getBackgroundByIdPartido(4) // Fondo predeterminado
  )
  const [errorModalVisible, setErrorModalVisible] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Obtener el token almacenado
        const token = await AsyncStorage.getItem('token')

        if (token) {
          // Decodificar el token para obtener los datos del usuario
          const payload = JSON.parse(atob(token.split('.')[1]))

          // Validar el id_partido
          const validPartidos = [1, 2, 3, 4, 5]
          if (!validPartidos.includes(payload.id_partido)) {
            setErrorMessage('No tienes permisos para acceder a esta sección.')
            setErrorModalVisible(true)
            return
          }

          // Establecer el nombre del usuario
          setUserName(
            `${payload.nombre} ${payload.a_paterno} ${payload.a_materno}` ||
              'Usuario'
          )

          // Obtener y establecer el fondo según el id_partido
          setBackgroundSource(getBackgroundByIdPartido(payload.id_partido))
        }
      } catch (error) {
        console.error('Error obteniendo el token:', error)
      }
    }

    fetchUserData()
  }, [navigation])

  return (
    <ImageBackground
      source={backgroundSource}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.welcomeText}>Bienvenido, {userName}</Text>
      </View>

      {/* Modal de Error */}
      <ErrorModal
        visible={errorModalVisible}
        message={errorMessage}
        onClose={() => {
          setErrorModalVisible(false)
          navigation.replace('Login') // Redirigir al login
        }}
      />
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente para mejorar el contraste
    width: '100%',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
})
