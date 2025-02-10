import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native'
import { Picker } from '@react-native-picker/picker'
import reporte_ciudadano_styles from '@/app/styles/reporteCiudadanoStyle'
import { API_URL } from '@env'
import { fetchReportes } from '@/app/services/reportesService'
import { handleTakePhoto, handleSelectImage } from './hadle'

// Tipos necesarios
type LocationType = {
  latitude: number
  longitude: number
}

type Dependencia = {
  id_dependencia: number
  nombre: string
}

export const handleCreateReportManual = async ({
  idUsuario,
  idPartido,
  newReportTitle,
  newReportDescription,
  selectedDependencia,
  manualCoordinates,
  imageUri,
  setReportes,
  setLoading,
  setModalVisible,
  setNewReportTitle,
  setNewReportDescription,
  setImageUri,
  setSelectedDependencia,
  setManualCoordinates,
}: {
  idUsuario: number
  idPartido: number
  newReportTitle: string
  newReportDescription: string
  selectedDependencia: string
  manualCoordinates: LocationType
  imageUri: string | null
  setReportes: React.Dispatch<React.SetStateAction<any[]>>
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>
  setNewReportTitle: React.Dispatch<React.SetStateAction<string>>
  setNewReportDescription: React.Dispatch<React.SetStateAction<string>>
  setImageUri: React.Dispatch<React.SetStateAction<string | null>>
  setSelectedDependencia: React.Dispatch<React.SetStateAction<string>>
  setManualCoordinates: React.Dispatch<React.SetStateAction<LocationType>>
}) => {
  if (
    !newReportTitle ||
    !newReportDescription ||
    !selectedDependencia ||
    !manualCoordinates
  ) {
    alert('Por favor, complete todos los campos requeridos.')
    return
  }
  const formData = new FormData() // Instancia de FormData

  // Adjuntar los datos del reporte
  formData.append('id_usuario', idUsuario.toString())
  formData.append('titulo', newReportTitle)
  formData.append('descripcion', newReportDescription)
  formData.append('id_dependencia', selectedDependencia)
  formData.append('fecha_reporte', new Date().toISOString())
  formData.append('latitud', manualCoordinates.latitude.toString())
  formData.append('longitud', manualCoordinates.longitude.toString())
  // Adjuntar la imagen si existe
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
  console.log('Datos enviados a la API:', formData)

  try {
    const response = await fetch(`${API_URL}api/reportes/crear`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    })

    const result = await response.json()
    console.log('Resultado del JSON:', result)

    if (response.ok) {
      alert('Reporte creado exitosamente.')
      fetchReportes(idPartido, setReportes, setLoading)
      setModalVisible(false)
      setNewReportTitle('')
      setNewReportDescription('')
      setImageUri(null)
      setSelectedDependencia('')
      setManualCoordinates({ latitude: 0, longitude: 0 })
    } else {
      alert(result.message || 'Hubo un problema al crear el reporte.')
    }
  } catch (error) {
    console.error('Error al crear el reporte:', error)
    alert('Hubo un problema al crear el reporte. Inténtalo nuevamente.')
  }
}

// Componente reutilizable para la Modal
export const CreateReportModalManual = ({
  isModalVisible,
  setModalVisible,
  newReportTitle,
  setNewReportTitle,
  newReportDescription,
  setNewReportDescription,
  setImageUri,
  imageUri,
  dependencias,
  selectedDependencia,
  setSelectedDependencia,
  manualCoordinates,
  setManualCoordinates,
  handleCreateReport,
}: {
  isModalVisible: boolean
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>
  newReportTitle: string
  setNewReportTitle: React.Dispatch<React.SetStateAction<string>>
  newReportDescription: string
  setNewReportDescription: React.Dispatch<React.SetStateAction<string>>
  setImageUri: React.Dispatch<React.SetStateAction<string | null>>
  imageUri: string | null
  dependencias: Dependencia[]
  selectedDependencia: string
  setSelectedDependencia: React.Dispatch<React.SetStateAction<string>>
  manualCoordinates: LocationType
  setManualCoordinates: React.Dispatch<React.SetStateAction<LocationType>>
  handleCreateReport: () => void
}) => {
  // Estados temporales para permitir escritura sin borrar valores
  const [latitudeText, setLatitudeText] = useState(
    manualCoordinates.latitude.toString()
  )
  const [longitudeText, setLongitudeText] = useState(
    manualCoordinates.longitude.toString()
  )

  return (
    <Modal
      visible={isModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={reporte_ciudadano_styles.modalContainer}>
        <View style={reporte_ciudadano_styles.modalContent}>
          <Text style={reporte_ciudadano_styles.modalTitle}>
            Crear Nuevo Reporte
          </Text>

          <Text style={reporte_ciudadano_styles.modalLabel}>
            Título del Reporte
          </Text>
          <TextInput
            style={reporte_ciudadano_styles.input}
            placeholder="Escribe el título del reporte"
            value={newReportTitle}
            onChangeText={setNewReportTitle}
          />

          <Text style={reporte_ciudadano_styles.modalLabel}>Descripción</Text>
          <TextInput
            style={[reporte_ciudadano_styles.input, { height: 80 }]}
            placeholder="Escribe la descripción del reporte"
            multiline
            value={newReportDescription}
            onChangeText={setNewReportDescription}
          />

          <Text style={reporte_ciudadano_styles.modalLabel}>Imagen</Text>
          <View style={reporte_ciudadano_styles.imageActions}>
            <TouchableOpacity
              style={[
                reporte_ciudadano_styles.modalButton,
                { marginRight: 10 },
              ]}
              onPress={() => handleTakePhoto(setImageUri)}
            >
              <Text style={reporte_ciudadano_styles.modalButtonText}>
                Tomar Foto
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={reporte_ciudadano_styles.modalButton}
              onPress={() => handleSelectImage(setImageUri)}
            >
              <Text style={reporte_ciudadano_styles.modalButtonText}>
                Seleccionar Imagen
              </Text>
            </TouchableOpacity>
          </View>

          {imageUri && (
            <View style={reporte_ciudadano_styles.imagePreviewContainer}>
              <Image
                source={{ uri: imageUri }}
                style={reporte_ciudadano_styles.imagePreview}
              />
            </View>
          )}

          <Text style={reporte_ciudadano_styles.modalLabel}>Dependencia</Text>
          <Picker
            selectedValue={selectedDependencia}
            onValueChange={setSelectedDependencia}
            style={reporte_ciudadano_styles.picker}
          >
            <Picker.Item
              label="Seleccione una dependencia"
              value=""
              color="#888"
            />
            {dependencias.map((dependencia) => (
              <Picker.Item
                key={dependencia.id_dependencia}
                label={dependencia.nombre}
                value={dependencia.id_dependencia}
              />
            ))}
          </Picker>

          <Text style={reporte_ciudadano_styles.modalLabel}>
            Coordenadas Manuales
          </Text>
          <Text style={reporte_ciudadano_styles.modalLabel}>Latitud</Text>
          <TextInput
            style={reporte_ciudadano_styles.input}
            placeholder="Latitud"
            keyboardType="numeric"
            value={latitudeText}
            onChangeText={(text) => {
              setLatitudeText(text) // Guarda el texto temporalmente
              const parsed = parseFloat(text)
              if (!isNaN(parsed)) {
                setManualCoordinates((prev) => ({
                  ...prev,
                  latitude: parsed, // Convierte a número solo si es válido
                }))
              }
            }}
          />

          <Text style={reporte_ciudadano_styles.modalLabel}>Longitud</Text>
          <TextInput
            style={reporte_ciudadano_styles.input}
            placeholder="Longitud"
            keyboardType="numeric"
            value={longitudeText}
            onChangeText={(text) => {
              setLongitudeText(text) // Guarda el texto temporalmente
              const parsed = parseFloat(text)
              if (!isNaN(parsed)) {
                setManualCoordinates((prev) => ({
                  ...prev,
                  longitude: parsed, // Convierte a número solo si es válido
                }))
              }
            }}
          />

          <View style={reporte_ciudadano_styles.modalActionsEnd}>
            <TouchableOpacity
              style={reporte_ciudadano_styles.modalButtonEnd}
              onPress={handleCreateReport}
            >
              <Text style={reporte_ciudadano_styles.modalButtonText}>
                Crear
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                reporte_ciudadano_styles.modalButtonEnd,
                { backgroundColor: '#d9534f' },
              ]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={reporte_ciudadano_styles.modalButtonText}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}
