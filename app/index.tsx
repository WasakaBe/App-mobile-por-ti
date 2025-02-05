import React, { useRef, useEffect } from 'react'
import { View, Text, TouchableOpacity, Image, Animated } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { RootStackParamList } from '@/types'
import { StackNavigationProp } from '@react-navigation/stack'
import index_styles from './styles/indexStyle'
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
    <View style={index_styles.container}>
      {/* Logo con animación */}
      <Animated.View
        style={[
          index_styles.logoContainer,
          {
            opacity: fadeAnimLogo,
            transform: [{ translateY: translateAnimLogo }],
          },
        ]}
      >
        <Image
          source={require('./assets/logos/icono.png')}
          style={index_styles.logo}
        />
      </Animated.View>

      {/* Texto y botón con animación */}
      <Animated.View style={[index_styles.footer, { opacity: fadeAnimText }]}>
        <Text style={index_styles.phrase}>
          "Las redes no solo conectan dispositivos, conectan personas y sus
          sueños."
        </Text>
        <TouchableOpacity
          style={index_styles.button}
          onPress={() => navigation.navigate('Login')} // Navegar al login
        >
          <Text style={index_styles.buttonText}>Comenzar</Text>
          <Feather name="arrow-right" size={20} color="white" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  )
}
