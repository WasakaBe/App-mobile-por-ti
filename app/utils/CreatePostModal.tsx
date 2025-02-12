import React, { useState } from 'react'
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native'

import { API_URL } from '@env'
import { handleTakePhoto, handleSelectImage } from './hadle'
import { MaterialIcons, Ionicons } from '@expo/vector-icons'

interface CreatePostModalProps {
  visible: boolean
  onClose: () => void
  idUsuario: string
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  visible,
  onClose,
  idUsuario,
}) => {
  const [description, setDescription] = useState('')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [bannedModalVisible, setBannedModalVisible] = useState(false)
  const [successModalVisible, setSuccessModalVisible] = useState(false) // Estado para modal de éxito

  const handleCreatePost = async () => {
    if (!description.trim()) {
      Alert.alert('Error', 'La descripción no puede estar vacía.')
      return
    }

    setLoading(true)

    const formData = new FormData()
    formData.append('descripcion', description)
    formData.append('id_usuario', idUsuario)

    if (selectedImage) {
      formData.append('imagen', {
        uri: selectedImage,
        name: 'upload.jpg',
        type: 'image/jpeg',
      } as any)
    }

    console.log('Enviando datos a la API:', {
      descripcion: description,
      id_usuario: idUsuario,
      imagen: selectedImage ? selectedImage : 'No hay imagen seleccionada',
    })

    try {
      const response = await fetch(`${API_URL}api/post/crear`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      const data = await response.json()
      console.log('Respuesta de la API:', data)

      if (response.ok) {
        setSuccessModalVisible(true) // Muestra la modal de éxito
        setDescription('')
        setSelectedImage(null)
        setTimeout(() => {
          setSuccessModalVisible(false)
          onClose()
        }, 3000) // Cierra la modal automáticamente después de 3 segundos
      } else if (data.message === 'No puedes realizar publicaciones') {
        setBannedModalVisible(true)
      } else {
        Alert.alert('Error', data.message || 'No se pudo crear la publicación.')
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un problema al subir el post.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Modal
        animationType="fade"
        transparent
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={conectate_styles.modalContainer}>
          <View style={conectate_styles.modalContent}>
            <Text style={conectate_styles.modalTitle}>
              Crear Nueva Publicación
            </Text>

            <TextInput
              style={conectate_styles.input}
              placeholder="¿Qué quieres compartir?"
              multiline
              numberOfLines={4}
              value={description}
              onChangeText={setDescription}
            />

            <View style={conectate_styles.imageButtonsContainer}>
              <TouchableOpacity
                onPress={() => handleSelectImage(setSelectedImage)}
                style={conectate_styles.imagePickerButton}
              >
                <MaterialIcons name="photo-library" size={24} color="#FFF" />
                <Text style={conectate_styles.imagePickerText}>
                  {' '}
                  Seleccionar Galería
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleTakePhoto(setSelectedImage)}
                style={conectate_styles.imagePickerButton}
              >
                <Ionicons name="camera" size={24} color="#FFF" />
                <Text style={conectate_styles.imagePickerText}>
                  {' '}
                  Tomar Foto
                </Text>
              </TouchableOpacity>
            </View>

            {selectedImage && (
              <View>
                <Image
                  source={{ uri: selectedImage }}
                  style={conectate_styles.imagePreview}
                />
              </View>
            )}

            <TouchableOpacity
              onPress={handleCreatePost}
              style={conectate_styles.createPostButton}
              disabled={loading}
            >
              <Ionicons name="send" size={24} color="#FFF" />

              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={conectate_styles.createPostText}> Publicar</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onClose}
              style={conectate_styles.modalCloseButton}
            >
              <Ionicons name="close" size={24} color="#FFF" />
              <Text style={conectate_styles.modalCloseText}> Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de Usuario Baneado */}
      <Modal
        animationType="slide"
        transparent
        visible={bannedModalVisible}
        onRequestClose={() => setBannedModalVisible(false)}
      >
        <View style={conectate_styles.modalContainer}>
          <View style={conectate_styles.modalContent}>
            <Text style={conectate_styles.bannedTitle}>
              🚫 Usted está baneado 🚫
            </Text>
            <Text style={conectate_styles.bannedText}>
              No puede realizar publicaciones en este momento.
            </Text>
            <Text style={conectate_styles.bannedSubText}>
              Favor de contactar con soporte para más información.
            </Text>

            <TouchableOpacity
              onPress={() => setBannedModalVisible(false)}
              style={conectate_styles.modalCloseButton}
            >
              <Text style={conectate_styles.modalCloseText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de Éxito */}
      <Modal
        animationType="slide"
        transparent
        visible={successModalVisible}
        onRequestClose={() => setSuccessModalVisible(false)}
      >
        <View style={conectate_styles.modalContainer}>
          <View style={conectate_styles.modalSuccessContent}>
            <Text style={conectate_styles.successIcon}>🎉</Text>
            <Text style={conectate_styles.successTitle}>
              ¡Publicación exitosa!
            </Text>
            <Text style={conectate_styles.successText}>
              Tu post ha sido publicado correctamente.
            </Text>

            <TouchableOpacity
              onPress={() => setSuccessModalVisible(false)}
              style={conectate_styles.successCloseButton}
            >
              <Text style={conectate_styles.modalCloseText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  )
}

export default CreatePostModal

const conectate_styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalCloseButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseText: {
    color: 'white',
    fontWeight: 'bold',
  },
  successIcon: {
    fontSize: 40,
    textAlign: 'center',
    marginBottom: 10,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'green',
    marginBottom: 10,
  },
  successText: {
    fontSize: 16,
    textAlign: 'center',
    color: 'black',
    marginBottom: 10,
  },
  createPostButton: {
    backgroundColor: '#2ecc71',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  createPostText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalSuccessContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  successCloseButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
  },
  input: {
    padding: 20,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  imageButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 10,
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4a90e2',
    padding: 12,
    borderRadius: 10,
    flex: 0.48,
    justifyContent: 'center',
  },
  imagePickerText: {
    color: 'white',
    fontWeight: 'bold',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },

  bannedTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'red',
    marginBottom: 10,
  },
  bannedText: {
    fontSize: 16,
    textAlign: 'center',
    color: 'black',
    marginBottom: 5,
  },
  bannedSubText: {
    fontSize: 12,
    textAlign: 'center',
    color: 'gray',
  },
})
