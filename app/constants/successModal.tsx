import React from 'react'
import { View, Text, Modal, TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'
import success_modal_styles from '../styles/successModalStyle'
interface SuccessModalProps {
  visible: boolean
  onClose: () => void
}

export default function SuccessModal({ visible, onClose }: SuccessModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={success_modal_styles.modalContainer}>
        <View style={success_modal_styles.modal}>
          <Feather name="check-circle" size={60} color="#4CAF50" />
          <Text style={success_modal_styles.modalText}>
            ¡Inicio de sesión exitoso!
          </Text>
          <TouchableOpacity
            style={success_modal_styles.modalButton}
            onPress={onClose}
          >
            <Text style={success_modal_styles.modalButtonText}>Aceptar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}
