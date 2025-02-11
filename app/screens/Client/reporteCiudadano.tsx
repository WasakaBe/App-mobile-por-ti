import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { getBackgroundByIdPartido } from '@/app/constants/partidoBackgrounds'
import Banners from '@/app/components/banners'
import { FontAwesome } from '@expo/vector-icons'
import noticias_styles from '@/app/styles/noticiasStyle'
import reporte_ciudadano_styles from '@/app/styles/reporteCiudadanoStyle'
import { API_URL } from '@env'
import {
  fetchReportes,
  listenForNewReports,
  Report,
} from '@/app/services/reportesService'
import { CreateReportModal, handleCreateReport } from '@/app/utils/reportUtils'
import {
  CreateReportModalManual,
  handleCreateReportManual,
} from '@/app/utils/handleCreateReport'
import connectSocket, {
  disconnectSocket,
} from '@/app/services/SocketIOComponent'

type Dependencia = {
  id_dependencia: number
  nombre: string
}

export default function ReporteCiudadano({ route, navigation }: any) {
  const { idUsuario, idPartido } = route.params
  const [loading, setLoading] = useState<boolean>(true)
  const [reportes, setReportes] = useState<Report[]>([])
  const [isModalVisible, setModalVisible] = useState<boolean>(false)
  const [isManualModalVisible, setManualModalVisible] = useState<boolean>(false)
  const [newReportTitle, setNewReportTitle] = useState<string>('')
  const [newReportDescription, setNewReportDescription] = useState<string>('')
  const [imageUri, setImageUri] = useState<string | null>(null)
  const [manualCoordinates, setManualCoordinates] = useState<{
    latitude: number
    longitude: number
  }>({ latitude: 0, longitude: 0 }) // Coordenadas manuales inicializadas

  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number
    longitude: number
  } | null>(null)
  const [selectedDependencia, setSelectedDependencia] = useState<string>('')
  const [locationDetails, setLocationDetails] = useState<{
    city: string
    region: string
    country: string
    street: string
  } | null>(null)

  const [dependencias, setDependencias] = useState<Dependencia[]>([])
  const [expanded, setExpanded] = useState(false)
  const toggleExpanded = () => setExpanded(!expanded)
  useEffect(() => {
    const fetchDependencias = async () => {
      try {
        const response = await fetch(`${API_URL}api/reportes/dependencias`)
        const data = await response.json()
        setDependencias(data)
      } catch (error) {
        console.error('Error al obtener dependencias:', error)
      }
    }

    fetchDependencias()
  }, [])

  useEffect(() => {
    fetchReportes(idPartido, setReportes, setLoading)
    // Conectar a socket.io y escuchar eventos en tiempo real
    const socket = connectSocket()
    listenForNewReports(idPartido, setReportes)

    return () => {
      disconnectSocket()
    }
  }, [idPartido])

  // Renderizar cada reporte
  const renderReporte = ({ item }: { item: Report }) => (
    <View style={noticias_styles.card}>
      <Text style={reporte_ciudadano_styles.reporteDependencia}>
        {item.dependencia}
      </Text>
      <Image
        source={{ uri: item.foto }}
        style={noticias_styles.noticiaImagen}
      />

      <View style={noticias_styles.noticiaTitleContainer}>
        <Text style={noticias_styles.noticiaTitulo}>{item.titulo}</Text>
        <Text style={[noticias_styles.noticiaTipo]}>{item.estatus}</Text>
      </View>

      <View
        style={[
          noticias_styles.noticiaDescripcionContainer,
          expanded && noticias_styles.expandedContainer,
        ]}
      >
        <Text
          style={noticias_styles.noticiaDescripcion}
          numberOfLines={expanded ? undefined : 3}
        >
          {item.descripcion}
        </Text>
      </View>

      <View style={noticias_styles.noticiaCalendarContainer}>
        <FontAwesome name="calendar" size={24} color={'black'} />
        <Text style={noticias_styles.noticiaFecha}>
          {new Date(item.fecha_reporte).toLocaleDateString('es-MX', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })}
        </Text>
      </View>
    </View>
  )

  return (
    <ImageBackground
      source={getBackgroundByIdPartido(idPartido)}
      style={reporte_ciudadano_styles.container}
    >
      <View style={reporte_ciudadano_styles.header}>
        <TouchableOpacity
          style={noticias_styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <FontAwesome name="arrow-left" size={18} color="#fff" />
          <Text style={noticias_styles.backText}>Regresar</Text>
        </TouchableOpacity>
        <Text style={reporte_ciudadano_styles.title}>Reporte Ciudadano</Text>
        <TouchableOpacity
          style={reporte_ciudadano_styles.actionButton}
          onPress={() => setModalVisible(true)}
        >
          <FontAwesome name="plus" size={18} color="#fff" />
          <Text style={reporte_ciudadano_styles.buttonText}>Crear Reporte</Text>
        </TouchableOpacity>
      </View>

      <View style={reporte_ciudadano_styles.userInfo}>
        <TouchableOpacity
          style={reporte_ciudadano_styles.actionButton}
          onPress={() => setManualModalVisible(true)}
        >
          <FontAwesome name="plus" size={18} color="#fff" />
          <Text style={reporte_ciudadano_styles.buttonText}>
            Crear Reporte Manual
          </Text>
        </TouchableOpacity>
      </View>

      <View style={reporte_ciudadano_styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : reportes.length > 0 ? (
          <FlatList
            data={reportes}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderReporte}
            style={reporte_ciudadano_styles.listaReportes}
          />
        ) : (
          <Text style={reporte_ciudadano_styles.infoText}>
            No hay reportes disponibles.
          </Text>
        )}
      </View>

      {/* Modal para crear reporte */}
      <CreateReportModal
        isModalVisible={isModalVisible}
        setModalVisible={setModalVisible}
        newReportTitle={newReportTitle}
        setNewReportTitle={setNewReportTitle}
        newReportDescription={newReportDescription}
        setNewReportDescription={setNewReportDescription}
        setImageUri={setImageUri}
        imageUri={imageUri}
        dependencias={dependencias}
        selectedDependencia={selectedDependencia}
        setSelectedDependencia={setSelectedDependencia}
        setCurrentLocation={setCurrentLocation}
        setLocationDetails={setLocationDetails}
        currentLocation={currentLocation}
        locationDetails={locationDetails}
        handleCreateReport={() =>
          handleCreateReport({
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
          })
        }
      />

      {/* Modal para crear reporte manual */}
      <CreateReportModalManual
        isModalVisible={isManualModalVisible}
        setModalVisible={setManualModalVisible}
        newReportTitle={newReportTitle}
        setNewReportTitle={setNewReportTitle}
        newReportDescription={newReportDescription}
        setNewReportDescription={setNewReportDescription}
        setImageUri={setImageUri}
        imageUri={imageUri}
        dependencias={dependencias}
        selectedDependencia={selectedDependencia}
        setSelectedDependencia={setSelectedDependencia}
        manualCoordinates={manualCoordinates}
        setManualCoordinates={setManualCoordinates}
        handleCreateReport={() =>
          handleCreateReportManual({
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
          })
        }
      />
      <Banners idPartido={idPartido} />
    </ImageBackground>
  )
}
