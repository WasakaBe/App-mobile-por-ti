import React, { useState, useEffect } from 'react'
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native'
import { Picker } from '@react-native-picker/picker'
import * as ImagePicker from 'expo-image-picker'
import { API_URL } from '@env'

interface Dependencia {
  id_dependencia: number
  nombre: string
}



interface CreateReportModalProps {
  visible: boolean
  onClose: () => void
  idUsuario: number // ID del usuario para la creación del reporte
}

const CreateReportModal: React.FC<CreateReportModalProps> = ({
  visible,
  onClose,
  idUsuario,
}) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dependencias, setDependencias] = useState<Dependencia[]>([])
  const [selectedDependencia, setSelectedDependencia] = useState<string>('')

  const [imageUri, setImageUri] = useState<string | null>(null)
  const [manualLatitude, setManualLatitude] = useState<string>('')
  const [manualLongitude, setManualLongitude] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  // Obtener dependencias al cargar el modal
  useEffect(() => {
    const fetchDependencias = async () => {
      try {
        const response = await fetch(`${API_URL}api/reportes/dependencias`)
        const data: Dependencia[] = await response.json()
        setDependencias(data)
      } catch (error) {
        console.error('Error fetching dependencias:', error)
      }
    }
    fetchDependencias()
  }, [])

  // Seleccionar imagen
  const handleSelectImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    })

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri)
    }
  }

  // Tomar foto
  const handleTakePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    })

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri)
    }
  }

  // Guardar reporte
  const handleSaveReport = async () => {
    if (
      !title ||
      !description ||
      !selectedDependencia ||
      !manualLatitude ||
      !manualLongitude
    ) {
      alert('Por favor, completa todos los campos obligatorios.')
      return
    }

    setIsLoading(true)
    try {
      const formData = new FormData()

      // Adjuntar los datos del reporte
      formData.append('id_usuario', idUsuario.toString())
      formData.append('titulo', title)
      formData.append('descripcion', description)
      formData.append('id_dependencia', selectedDependencia)
      formData.append('fecha_reporte', new Date().toISOString())
      formData.append('latitud', manualLatitude)
      formData.append('longitud', manualLongitude)

      // Adjuntar la imagen si existe
      if (imageUri) {
        const fileName = imageUri.split('/').pop() || 'image.jpg'
        const fileType = fileName.split('.').pop() || 'jpg'
        formData.append('imagen', {
          uri: imageUri,
          name: fileName,
          type: `image/${fileType}`,
        } as any)
      }

      console.log('Datos enviados a la API:', {
        id_usuario: idUsuario.toString(),
        titulo: title,
        descripcion: description,
        id_dependencia: selectedDependencia,
        fecha_reporte: new Date().toISOString(),
        latitud: manualLatitude,
        longitud: manualLongitude,
        imagen: imageUri,
      })

      const response = await fetch(`${API_URL}api/reportes/crear`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      })

      const textResponse = await response.text()
      console.log('Server response:', textResponse)

      if (!response.ok) {
        throw new Error(`Error al crear el reporte: ${textResponse}`)
      }

      const data = JSON.parse(textResponse)
      console.log('Respuesta del servidor:', data)
      alert('Reporte creado exitosamente.')
      onClose()
    } catch (error) {
      console.error('Error al guardar el reporte:', error)
      alert('Error al guardar el reporte. Intenta nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Crear Reporte Ciudadano</Text>

          {/* Título del reporte */}
          <TextInput
            placeholder="Título del reporte"
            style={styles.input}
            value={title}
            onChangeText={setTitle}
          />

          {/* Descripción del reporte */}
          <TextInput
            placeholder="Descripción del reporte"
            multiline
            style={[styles.input, { height: 100 }]}
            value={description}
            onChangeText={setDescription}
          />

          {/* Select de dependencias */}
          <Picker
            selectedValue={selectedDependencia}
            onValueChange={(itemValue) => setSelectedDependencia(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Seleccione una dependencia" value="" />
            {dependencias.map((dep) => (
              <Picker.Item
                key={dep.id_dependencia}
                label={dep.nombre}
                value={dep.id_dependencia.toString()}
              />
            ))}
          </Picker>

          {/* Ingresar coordenadas manualmente */}
          <TextInput
            placeholder="Latitud (ej: 25.675)"
            style={styles.input}
            value={manualLatitude}
            onChangeText={setManualLatitude}
            keyboardType="numeric"
          />
          <TextInput
            placeholder="Longitud (ej: -100.318)"
            style={styles.input}
            value={manualLongitude}
            onChangeText={setManualLongitude}
            keyboardType="numeric"
          />

          {/* Previsualización de la imagen */}
          {imageUri && (
            <Image
              source={{ uri: imageUri }}
              style={styles.previewImage}
              resizeMode="cover"
            />
          )}

          {/* Botón para seleccionar imagen */}
          <TouchableOpacity
            style={styles.imageButton}
            onPress={handleSelectImage}
          >
            <Text style={styles.imageButtonText}>
              {imageUri ? 'Cambiar Imagen' : 'Seleccionar Imagen'}
            </Text>
          </TouchableOpacity>

          {/* Botón para tomar una foto */}
          <TouchableOpacity
            style={styles.imageButton}
            onPress={handleTakePhoto}
          >
            <Text style={styles.imageButtonText}>Tomar Foto</Text>
          </TouchableOpacity>

          {/* Botón para guardar */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleSaveReport}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Guardando...' : 'Guardar'}
            </Text>
          </TouchableOpacity>

          {/* Botón para cancelar */}
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  coordinatesText: {
    fontSize: 14,
    marginVertical: 10,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
    fontSize: 16,
  },
  imageButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  imageButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  previewImage: {
    width: '100%',
    height: 200,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#757575',
    fontSize: 16,
  },
})

export default CreateReportModal
