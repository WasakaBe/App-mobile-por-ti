import React, { useRef, useEffect } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native'
import { Feather } from '@expo/vector-icons'

import { RootStackParamList } from '@/types'
import { StackNavigationProp } from '@react-navigation/stack'
// Define el tipo para las props de navegación
type IndexScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Index'
>

type Props = {
  navigation: IndexScreenNavigationProp
}
export default function Index({ navigation }: Props) {
  // Valores animados
  const fadeAnimLogo = useRef(new Animated.Value(0)).current // Opacidad del logo
  const fadeAnimText = useRef(new Animated.Value(0)).current // Opacidad del texto y botón
  const translateAnimLogo = useRef(new Animated.Value(-50)).current // Desplazamiento del logo

  useEffect(() => {
    // Animar el logo (fade-in + desplazamiento)
    Animated.parallel([
      Animated.timing(fadeAnimLogo, {
        toValue: 1, // Opacidad final
        duration: 1000, // Duración (1 segundo)
        useNativeDriver: true,
      }),
      Animated.timing(translateAnimLogo, {
        toValue: 0, // Termina en la posición original
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start()

    // Animar el texto y botón después del logo
    Animated.timing(fadeAnimText, {
      toValue: 1, // Opacidad final
      duration: 1000,
      delay: 500, // Espera medio segundo antes de iniciar
      useNativeDriver: true,
    }).start()
  }, [fadeAnimLogo, translateAnimLogo, fadeAnimText])

  return (
    <View style={styles.container}>
      {/* Logo con animación */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnimLogo,
            transform: [{ translateY: translateAnimLogo }],
          },
        ]}
      >
        <Image
          source={require('./assets/logos/icono.png')}
          style={styles.logo}
        />
      </Animated.View>

      {/* Texto y botón con animación */}
      <Animated.View style={[styles.footer, { opacity: fadeAnimText }]}>
        <Text style={styles.phrase}>
          "Las redes no solo conectan dispositivos, conectan personas y sus
          sueños."
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Login')} // Navegar al login
        >
          <Text style={styles.buttonText}>Comenzar</Text>
          <Feather name="arrow-right" size={20} color="white" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080825', // Fondo minimalista oscuro
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 100,
  },
  footer: {
    paddingHorizontal: 20,
    alignItems: 'center',
    paddingBottom: 30, // Espacio inferior
    marginBottom: 30,
  },
  phrase: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E88E5', // Azul moderno
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 15,
    elevation: 5, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
})
