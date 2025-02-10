import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
} from 'react-native'

interface ModalCuponProps {
  visible: boolean
  onClose: () => void
  couponTitle: string
  logo: any
}

const ModalCupon: React.FC<ModalCuponProps> = ({
  visible,
  onClose,
  couponTitle,
  logo,
}) => {
  const [step, setStep] = useState(1) // Control de pasos
  const [timeLeft, setTimeLeft] = useState(15 * 60) // Tiempo restante en segundos
  const [clickCount, setClickCount] = useState(0) // Conteo de veces solicitado
  const [confirmExitVisible, setConfirmExitVisible] = useState(false) // Control del modal de confirmación
  const timerRef = useRef<NodeJS.Timeout | null>(null) // Referencia al temporizador

  // Formatear tiempo restante
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`
  }

  // Iniciar el conteo regresivo
  useEffect(() => {
    if (step === 2 && visible) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current as NodeJS.Timeout)
            alert('Cupón caducado')
            onClose()
            setStep(1)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current) // Limpiar temporizador al desmontar
    }
  }, [step, visible])

  const handleGetCoupon = () => {
    if (clickCount >= 3) {
      alert('Has usado los 3 cupones permitidos hoy para esta promoción.')
    } else {
      setClickCount((prev) => prev + 1) // Incrementar conteo
      setStep(2) // Pasar al paso 2
    }
  }

  const handleExitConfirm = () => {
    setConfirmExitVisible(true) // Mostrar modal de confirmación
  }

  const confirmExit = () => {
    setConfirmExitVisible(false)
    setStep(1)
    setTimeLeft(15 * 60) // Reiniciar tiempo
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
              <Text style={styles.modalTitle}>CUPÓN VÁLIDO</Text>
              <Text style={styles.validText}>
                Tiempo restante: {formatTime(timeLeft)}
              </Text>
              <Text style={styles.detailsText}>
                Has solicitado este cupón {clickCount}{' '}
                {clickCount === 1 ? 'vez' : 'veces'} hoy.
              </Text>
              {clickCount >= 3 && (
                <Text style={styles.detailsText}>
                  Has usado los 3 cupones permitidos hoy.
                </Text>
              )}

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
