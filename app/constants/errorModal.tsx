import React from 'react'
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'
import error_modal_styles from '../styles/errorModalStyle'
interface ErrorModalProps {
  visible: boolean
  message: string
  onClose: () => void
}

export default function ErrorModal({
  visible,
  message,
  onClose,
}: ErrorModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={error_modal_styles.modalContainer}>
        <View style={error_modal_styles.modal}>
          <Feather name="x-circle" size={60} color="#F44336" />
          <Text style={error_modal_styles.modalText}>{message}</Text>
          <TouchableOpacity
            style={error_modal_styles.modalButton}
            onPress={onClose}
          >
            <Text style={error_modal_styles.modalButtonText}>Aceptar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}
