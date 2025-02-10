import AsyncStorage from '@react-native-async-storage/async-storage'
import { API_URL } from '@env'
import { connectSocket } from '@/app/services/SocketIOComponent' // 🔹 Importar el socket

const handleLogin = async (
  phoneNumber: string,
  password: string,
  setLoading: (loading: boolean) => void,
  setSuccessModalVisible: (visible: boolean) => void,
  setErrorModalVisible: (visible: boolean) => void,
  setErrorMessage: (message: string) => void,
  navigation: any
) => {
  // Validaciones básicas
  if (!phoneNumber || !password) {
    setErrorMessage('Error, favor de rellenar los campos.')
    setErrorModalVisible(true)
    return
  }

  if (!/^\d{10}$/.test(phoneNumber)) {
    setErrorMessage('Error, el número de teléfono debe tener 10 dígitos.')
    setErrorModalVisible(true)
    return
  }

  if (password.length < 8) {
    setErrorMessage('Error, la contraseña debe tener al menos 8 caracteres.')
    setErrorModalVisible(true)
    return
  }

  try {
    setLoading(true)

    const response = await fetch(`${API_URL}api/userspartido/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        telefono: phoneNumber,
        password: password,
      }),
    })

    const data = await response.json()
    setLoading(false)

    if (response.status === 200) {
      // Guardar el token en AsyncStorage
      await AsyncStorage.setItem('token', data.token)

      console.log('✅ Inicio de sesión exitoso:', data.token)
      console.log('🏛️ Usuario pertenece al partido:', data.idPartido)

      // 🔥 Conectar al socket y unirse al grupo del partido
      connectSocket(data.idPartido)

      // Mostrar modal de éxito y redirigir
      setSuccessModalVisible(true)
      setTimeout(() => {
        setSuccessModalVisible(false)
        navigation.navigate('Dashboard') // Redirige al Dashboard
      }, 1500)
    } else {
      setErrorMessage(data.message || 'Error en el inicio de sesión.')
      setErrorModalVisible(true)
    }
  } catch (error) {
    setLoading(false)
    console.error('❌ Error en la conexión con el backend:', error)
    setErrorMessage('Error en el servidor. Inténtalo de nuevo.')
    setErrorModalVisible(true)
  }
}

export default handleLogin
