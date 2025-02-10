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
import MapView, { Marker } from 'react-native-maps'
import reporte_ciudadano_styles from '@/app/styles/reporteCiudadanoStyle'
import { API_URL } from '@env'
import { fetchReportes } from '@/app/services/reportesService'
import { handleTakePhoto, handleGetLocation, handleSelectImage } from './hadle'

// Tipos necesarios
type LocationType = {
  latitude: number
  longitude: number
}

type Dependencia = {
  id_dependencia: number
  nombre: string
}

type LocationDetailsType = {
  city: string
  region: string
  country: string
  street: string
}

// Función para manejar la creación de reportes
export const handleCreateReport = async ({
  idUsuario,
  idPartido,
  newReportTitle,
  newReportDescription,
  selectedDependencia,
  currentLocation,
  imageUri,
  setReportes,
  setLoading,
  setModalVisible,
  setNewReportTitle,
  setNewReportDescription,
  setImageUri,
  setSelectedDependencia,
  setCurrentLocation,
}: {
  idUsuario: number
  idPartido: number
  newReportTitle: string
  newReportDescription: string
  selectedDependencia: string
  currentLocation: LocationType | null
  imageUri: string | null
  setReportes: React.Dispatch<React.SetStateAction<any[]>>
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>
  setNewReportTitle: React.Dispatch<React.SetStateAction<string>>
  setNewReportDescription: React.Dispatch<React.SetStateAction<string>>
  setImageUri: React.Dispatch<React.SetStateAction<string | null>>
  setSelectedDependencia: React.Dispatch<React.SetStateAction<string>>
  setCurrentLocation: React.Dispatch<React.SetStateAction<LocationType | null>>
}) => {
  if (
    !newReportTitle ||
    !newReportDescription ||
    !selectedDependencia ||
    !currentLocation
  ) {
    alert('Por favor, complete todos los campos requeridos.')
    return
  }

  const formData = new FormData() // Instancia de FormData

  formData.append('id_usuario', idUsuario.toString())
  formData.append('titulo', newReportTitle)
  formData.append('descripcion', newReportDescription)
  formData.append('id_dependencia', selectedDependencia)
  formData.append('fecha_reporte', new Date().toISOString())
  formData.append('latitud', currentLocation.latitude.toString())
  formData.append('longitud', currentLocation.longitude.toString())
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
      setCurrentLocation(null)
    } else {
      alert(result.message)
    }
  } catch (error) {
    console.error('Error al crear el reporte:', error)
    alert('Hubo un problema al crear el reporte. Inténtalo nuevamente.')
  }
}

// Componente reutilizable para la Modal
export const CreateReportModal = ({
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
  setCurrentLocation,
  setLocationDetails,
  currentLocation,
  locationDetails,
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
  setCurrentLocation: React.Dispatch<React.SetStateAction<LocationType | null>>
  setLocationDetails: React.Dispatch<
    React.SetStateAction<LocationDetailsType | null>
  >
  currentLocation: LocationType | null
  locationDetails: LocationDetailsType | null
  handleCreateReport: () => void
}) => {
  const [confirmExitVisible, setConfirmExitVisible] = useState(false)

  const clearFields = () => {
    setNewReportTitle('')
    setNewReportDescription('')
    setImageUri(null)
    setSelectedDependencia('')
    setCurrentLocation(null)
    setLocationDetails(null)
  }

  const handleCancel = () => {
    if (
      newReportTitle ||
      newReportDescription ||
      imageUri ||
      selectedDependencia ||
      currentLocation
    ) {
      setConfirmExitVisible(true)
    } else {
      setModalVisible(false)
    }
  }

  const confirmExit = () => {
    setConfirmExitVisible(false)
    clearFields()
    setModalVisible(false)
  }
  return (
    <Modal
      visible={isModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCancel}
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
                { backgroundColor: '#007BFF', marginRight: 10 },
              ]}
              onPress={() => handleTakePhoto(setImageUri)}
            >
              <Text style={reporte_ciudadano_styles.modalButtonText}>
                Tomar Foto
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                reporte_ciudadano_styles.modalButton,
                { backgroundColor: '#28a745' },
              ]}
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

          {/* Select para Dependencias */}
          <Text style={reporte_ciudadano_styles.modalLabel}>Dependencia</Text>
          <View style={reporte_ciudadano_styles.pickerContainer}>
            <Picker
              selectedValue={selectedDependencia}
              onValueChange={(itemValue) => setSelectedDependencia(itemValue)}
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
          </View>

          <Text style={reporte_ciudadano_styles.modalLabel}>Ubicación</Text>
          <TouchableOpacity
            style={reporte_ciudadano_styles.modalButtonUbicacion}
            onPress={() =>
              handleGetLocation(setCurrentLocation, setLocationDetails)
            }
          >
            <Text style={reporte_ciudadano_styles.modalButtonTextUbicacion}>
              Obtener Ubicación
            </Text>
          </TouchableOpacity>

          {currentLocation && (
            <View style={reporte_ciudadano_styles.locationContainer}>
              <Text style={reporte_ciudadano_styles.locationText}>
                Latitud: {currentLocation.latitude}, Longitud:{' '}
                {currentLocation.longitude}
              </Text>
              {locationDetails && (
                <>
                  <Text style={reporte_ciudadano_styles.locationText}>
                    Calle: {locationDetails.street}, Ciudad:{' '}
                    {locationDetails.city}, Región: {locationDetails.region},
                    País: {locationDetails.country}
                  </Text>
                </>
              )}
              <MapView
                style={reporte_ciudadano_styles.map}
                initialRegion={{
                  latitude: currentLocation.latitude,
                  longitude: currentLocation.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: currentLocation.latitude,
                    longitude: currentLocation.longitude,
                  }}
                  title="Tu ubicación"
                  description={`Latitud: ${currentLocation.latitude}, Longitud: ${currentLocation.longitude}`}
                />
              </MapView>
            </View>
          )}

          <View style={reporte_ciudadano_styles.modalActionsEnd}>
            <TouchableOpacity
              style={reporte_ciudadano_styles.modalButtonEnd}
              onPress={() => {
                handleCreateReport()
                clearFields()
              }}
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
              onPress={handleCancel}
            >
              <Text style={reporte_ciudadano_styles.modalButtonText}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Confirmación de salida */}
      <Modal
        visible={confirmExitVisible}
        animationType="fade"
        transparent={true}
      >
        <View style={reporte_ciudadano_styles.confirmExitContainer}>
          <View style={reporte_ciudadano_styles.confirmExitContent}>
            <Text style={reporte_ciudadano_styles.confirmExitText}>
              ¿Estás seguro de salir?
            </Text>
            <View style={reporte_ciudadano_styles.confirmExitActions}>
              <TouchableOpacity
                style={reporte_ciudadano_styles.confirmExitButton}
                onPress={confirmExit}
              >
                <Text style={reporte_ciudadano_styles.confirmExitButtonText}>
                  Sí
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  reporte_ciudadano_styles.confirmExitButton,
                  { backgroundColor: '#007BFF' },
                ]}
                onPress={() => setConfirmExitVisible(false)}
              >
                <Text style={reporte_ciudadano_styles.confirmExitButtonText}>
                  No
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Modal>
  )
}
