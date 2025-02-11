import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
} from 'react-native'

import { API_URL } from '@env'
interface ModalCuponProps {
  visible: boolean
  onClose: () => void
  couponTitle: string
  logo: any
  idPromocion: number | null
  status: number
}

const ModalCupon: React.FC<ModalCuponProps> = ({
  visible,
  onClose,
  couponTitle,
  logo,
  idPromocion,
  status,
}) => {
  const [step, setStep] = useState(1) // Control de pasos (1: condiciones, 2: cupón activo)
  const [timeLeft, setTimeLeft] = useState(status === 1 ? 15 * 60 : 0) // Tiempo restante en segundos
  const [confirmExitVisible, setConfirmExitVisible] = useState(false) // Control del modal de confirmación
  const [isValid, setIsValid] = useState(true) // Estado de validez del cupón
  const timerRef = useRef<NodeJS.Timeout | null>(null) // Referencia al temporizador

  // 📌 Función para registrar el clic en la API (Método POST)
  const registrarClick = async () => {
    if (!idPromocion) {
      console.error('❌ Error: idPromocion es undefined o null.')
      return
    }

    try {
      const url = `${API_URL}api/promociones/click/${idPromocion}`
      console.log('🔍 Llamando a la API con ID de promoción:', idPromocion)
      console.log('🌐 URL de la API:', url)

      const response = await fetch(url, {
        method: 'POST', // ✅ Cambiado de PUT a POST
        headers: {
          'Content-Type': 'application/json',
        },
      })

      console.log('📩 Código de respuesta HTTP:', response.status)
      console.log('📝 Headers de respuesta:', response.headers)

      if (!response.ok) {
        throw new Error(
          `❌ Error en la API: ${response.status} - ${response.statusText}`
        )
      }

      const contentType = response.headers.get('content-type')
      console.log('📝 Content-Type de la respuesta:', contentType)

      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('❌ La API no devolvió JSON.')
      }

      const data = await response.json()
      console.log('✅ Respuesta JSON de la API:', data)

      if (!data.success) {
        console.error('⚠️ Error al registrar el clic:', data.message)
      } else {
        console.log('🎉 Clic registrado exitosamente en la base de datos.')
      }
    } catch (error) {
      console.error(
        '⚠️ Error en la solicitud:',
        error instanceof Error ? error.message : error
      )
    }
  }

  // 📌 Iniciar el conteo regresivo cuando el usuario obtiene el cupón
  useEffect(() => {
    if (step === 2 && visible) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current as NodeJS.Timeout)
            setIsValid(false) // 📌 Marca el cupón como inválido
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [step, visible])

  // 📌 Manejo de solicitud de cupón
  const handleGetCoupon = async () => {
    await registrarClick() // 📌 Llamar a la API para registrar el clic
    setStep(2) // Pasar al paso 2
    setIsValid(status === 1) // Validar estado del cupón
    setTimeLeft(status === 1 ? 15 * 60 : 0) // Reiniciar tiempo si el cupón es válido
  }

  const handleExitConfirm = () => {
    setConfirmExitVisible(true) // Mostrar modal de confirmación
  }

  const confirmExit = () => {
    setConfirmExitVisible(false)
    setStep(1) // Reiniciar el proceso del cupón
    setTimeLeft(status === 1 ? 15 * 60 : 0) // Reiniciar tiempo dependiendo del estado
    setIsValid(status === 1) // Reiniciar validez
    onClose()
  }

  const cancelExit = () => {
    setConfirmExitVisible(false) // Ocultar modal de confirmación
  }

  return (
    <>
      {/* Modal de condiciones */}
      {step === 1 && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={visible}
          onRequestClose={onClose}
        >
          <View style={styles.overlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>{couponTitle}</Text>
              <View style={styles.conditionsContainer}>
                <Text style={styles.conditionsTitle}>
                  Condiciones del descuento
                </Text>

                <Text style={styles.conditionsText}>
                  El cupón tendrá una duración de 15 minutos. Después de ese
                  tiempo no será válido. Además, solo se puede usar 3 veces por
                  día.
                </Text>
              </View>
              <TouchableOpacity
                style={styles.getCouponButton}
                onPress={handleGetCoupon}
              >
                <Text style={styles.getCouponButtonText}>Obtener Cupón</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Modal principal */}
      {step === 2 && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={visible}
          onRequestClose={handleExitConfirm}
        >
          <View style={styles.overlay}>
            <View style={styles.modalContainer}>
              <Image source={logo} style={styles.logo} />
              <Text style={styles.modalTitle}>
                {status === 1 ? 'CUPÓN VÁLIDO' : 'CUPÓN INVÁLIDO'}
              </Text>
              <Text style={styles.validText}>
                {isValid
                  ? `Tiempo restante: ${Math.floor(timeLeft / 60)}:${(
                      timeLeft % 60
                    )
                      .toString()
                      .padStart(2, '0')}`
                  : 'Cupón inválido'}
              </Text>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleExitConfirm}
              >
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Modal de confirmación de salida */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={confirmExitVisible}
        onRequestClose={cancelExit}
      >
        <View style={styles.overlay}>
          <View style={styles.confirmContainer}>
            <Text style={styles.confirmText}>
              ¿Estás seguro de salir? Una vez que salgas, se tomará como usado.
            </Text>
            <View style={styles.confirmButtons}>
              <TouchableOpacity style={styles.yesButton} onPress={confirmExit}>
                <Text style={styles.buttonText}>Sí</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.noButton} onPress={cancelExit}>
                <Text style={styles.buttonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  conditionsContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  conditionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  conditionsText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },

  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#28A745',
    marginBottom: 15,
    textAlign: 'center',
  },
  validText: {
    fontSize: 18,
    color: '#000',
    marginBottom: 10,
    textAlign: 'center',
  },
  detailsText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#555',
    textAlign: 'center',
  },
  getCouponButton: {
    backgroundColor: '#28A745',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 15,
  },
  getCouponButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#FF6F00',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
  confirmContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  confirmText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  confirmButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
  },
  yesButton: {
    backgroundColor: '#FF4D4D',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 5,
  },
  noButton: {
    backgroundColor: '#28A745',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
})

export default ModalCupon
