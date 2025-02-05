import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native'
import { Feather } from '@expo/vector-icons'
import SuccessModal from '@/app/constants/successModal'
import ErrorModal from '@/app/constants/errorModal'
import index_styles from '@/app/styles/indexStyle'
import login_styles from '@/app/styles/loginStyle'
import handleLogin from '@/app/services/loginService'

export default function Login({ navigation }: any) {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [successModalVisible, setSuccessModalVisible] = useState(false)
  const [errorModalVisible, setErrorModalVisible] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)

  return (
    <View style={login_styles.container}>
      {/* Logo */}
      <Image
        source={require('../../assets/logos/icono.png')}
        style={index_styles.logo}
      />

      {/* Título */}
      <Text style={login_styles.title}>Inicia Sesión</Text>

      {/* Input: Número de Teléfono */}
      <View style={login_styles.inputContainer}>
        <Feather
          name="phone"
          size={20}
          color="#1E88E5"
          style={login_styles.icon}
        />
        <TextInput
          style={login_styles.input}
          placeholder="Número de Teléfono"
          placeholderTextColor="#A0A0A0"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={(text) => setPhoneNumber(text.replace(/[^0-9]/g, ''))}
          maxLength={10}
        />
      </View>

      {/* Input: Contraseña */}
      <View style={login_styles.inputContainer}>
        <Feather
          name="lock"
          size={20}
          color="#1E88E5"
          style={login_styles.icon}
        />
        <TextInput
          style={login_styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#A0A0A0"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={login_styles.eyeIcon}
        >
          <Feather
            name={showPassword ? 'eye-off' : 'eye'}
            size={20}
            color="#A0A0A0"
          />
        </TouchableOpacity>
      </View>

      {/* Botón de Iniciar Sesión con Carga */}
      <TouchableOpacity
        style={login_styles.button}
        onPress={() =>
          handleLogin(
            phoneNumber,
            password,
            setLoading,
            setSuccessModalVisible,
            setErrorModalVisible,
            setErrorMessage,
            navigation
          )
        }
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFF" />
        ) : (
          <Text style={login_styles.buttonText}>Iniciar Sesión</Text>
        )}
      </TouchableOpacity>

      {/* Modales */}
      <SuccessModal
        visible={successModalVisible}
        onClose={() => setSuccessModalVisible(false)}
      />
      <ErrorModal
        visible={errorModalVisible}
        message={errorMessage}
        onClose={() => setErrorModalVisible(false)}
      />
    </View>
  )
}
