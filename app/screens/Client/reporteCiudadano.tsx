import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
} from 'react-native'
import { useRoute } from '@react-navigation/native'
import { RouteProp } from '@react-navigation/native'
import { RootStackParamList } from '@/types'
import { Picker } from '@react-native-picker/picker'
import { getBackgroundByIdPartido } from '@/app/constants/partidoBackgrounds'
import { FontAwesome } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import {
  fetchReportesPorPartido,
  fetchDependencias,
  filterReports,
  Report,
  Dependencia,
} from '@/app/services/reporteCiudadanoService'
import reporte_ciudadano_styles from '@/app/styles/reporteCiudadanoStyle'
import CreateReportModal from '@/app/utils/CreateReportModal'
import Banners from '@/app/components/banners'
type ReporteCiudadanoRouteProp = RouteProp<
  RootStackParamList,
  'ReporteCiudadano'
>
export default function ReporteCiudadano() {
  const [idPartido] = useState<number>(5) // ID del partido por defecto
  const [dependencias, setDependencias] = useState<Dependencia[]>([])
  const [selectedDependencia, setSelectedDependencia] = useState<string>('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [status, setStatus] = useState<string>('')
  const [filteredReports, setFilteredReports] = useState<Report[]>([])
  const [reportes, setReportes] = useState<Report[]>([])
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)

  const navigation = useNavigation()
  const route = useRoute<ReporteCiudadanoRouteProp>()
  console.log(route.params) // Verifica qué datos llegan aquí
  const { idUsuario = null } = route.params || {} // Valor predeterminado para evitar el error

  if (!idUsuario) {
    console.error('idUsuario no está definido')
    return <Text>Error: Usuario no identificado</Text>
  }

  const handleBackPress = () => {
    navigation.goBack()
  }

  // Obtener reportes al cargar el componente
  useEffect(() => {
    const fetchData = async () => {
      const dependenciasData = await fetchDependencias()
      setDependencias(dependenciasData)

      const reportesData = await fetchReportesPorPartido(idPartido)
      setReportes(reportesData)
      setFilteredReports(reportesData)
    }

    fetchData()
  }, [idPartido])

  // Manejar búsqueda avanzada
  const handleSearch = () => {
    const filtered = filterReports(
      reportes,
      selectedDependencia,
      status,
      startDate,
      endDate
    )
    setFilteredReports(filtered)
  }

  const getStatusColor = (status: string) => {
    return status === 'Pendiente' ? '#757575' : '#4CAF50' // Gris para Pendiente, Verde para Aprobado
  }

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible)
  }

  return (
    <ImageBackground
      source={getBackgroundByIdPartido(idPartido)} // Fondo dinámico según idPartido
      style={reporte_ciudadano_styles.container}
    >
      <View style={reporte_ciudadano_styles.header}>
        {/* Botón de regresar */}
        <TouchableOpacity
          style={reporte_ciudadano_styles.backButton}
          onPress={handleBackPress}
        >
          <FontAwesome name="arrow-left" size={18} color="#FFFFFF" />
          <Text style={reporte_ciudadano_styles.backText}>Regresar</Text>
        </TouchableOpacity>

        {/* Botón de Crear reporte */}
        <TouchableOpacity
          style={reporte_ciudadano_styles.createButton}
          onPress={toggleModal}
        >
          <Text style={reporte_ciudadano_styles.createButtonText}>
            CREAR REPORTE CIUDADANO
          </Text>
        </TouchableOpacity>
      </View>
      {/* Búsqueda Avanzada */}
      <View style={reporte_ciudadano_styles.searchContainer}>
        <Text style={reporte_ciudadano_styles.searchTitle}>
          Búsqueda Avanzada
        </Text>
        <View style={reporte_ciudadano_styles.searchFields}>
          <Picker
            selectedValue={selectedDependencia}
            onValueChange={(itemValue) => setSelectedDependencia(itemValue)}
            style={reporte_ciudadano_styles.picker}
          >
            <Picker.Item label="Seleccione una dependencia" value="" />
            {dependencias.map((dep) => (
              <Picker.Item
                key={dep.id_dependencia}
                label={dep.nombre}
                value={dep.nombre}
              />
            ))}
          </Picker>
          <View style={reporte_ciudadano_styles.dateInputContainer}>
            <TextInput
              placeholder="Fecha inicio (YYYY-MM-DD)"
              style={reporte_ciudadano_styles.dateInput}
              value={startDate}
              onChangeText={setStartDate}
            />
            <TextInput
              placeholder="Fecha fin (YYYY-MM-DD)"
              style={reporte_ciudadano_styles.dateInput}
              value={endDate}
              onChangeText={setEndDate}
            />
          </View>
          <Picker
            selectedValue={status}
            onValueChange={(itemValue) => setStatus(itemValue)}
            style={reporte_ciudadano_styles.picker}
          >
            <Picker.Item label="Seleccione un estado" value="" />
            <Picker.Item label="Pendiente" value="Pendiente" />
            <Picker.Item label="Aprobado" value="Aprobado" />
          </Picker>
        </View>
        <TouchableOpacity
          style={reporte_ciudadano_styles.searchButton}
          onPress={handleSearch}
        >
          <Text style={reporte_ciudadano_styles.searchButtonText}>Buscar</Text>
        </TouchableOpacity>
      </View>
      {/* Reportes Filtrados */}
      <ScrollView contentContainerStyle={reporte_ciudadano_styles.content}>
        {filteredReports && filteredReports.length > 0 ? (
          filteredReports.map((report, index) => (
            <View key={index} style={reporte_ciudadano_styles.card}>
              <Text style={reporte_ciudadano_styles.cardTitle}>
                {report.titulo}
              </Text>
              <Image
                source={{ uri: report.foto }}
                style={reporte_ciudadano_styles.cardImage}
              />
              <Text style={reporte_ciudadano_styles.cardCategory}>
                {report.dependencia}
              </Text>
              <Text style={reporte_ciudadano_styles.cardDate}>
                Fecha: {report.fecha_reporte}
              </Text>
              <Text style={reporte_ciudadano_styles.cardDescription}>
                {report.descripcion}
              </Text>
              <View style={reporte_ciudadano_styles.cardFooter}>
                <FontAwesome
                  name="check-circle"
                  size={18}
                  color={getStatusColor(report.estatus)}
                />
                <Text
                  style={[
                    reporte_ciudadano_styles.cardStatus,
                    { color: getStatusColor(report.estatus) },
                  ]}
                >
                  {report.estatus}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text>No se encontraron reportes.</Text>
        )}
      </ScrollView>

      {/* Componente de Banners */}
      <Banners idPartido={idPartido} />

      <CreateReportModal
        visible={isModalVisible}
        onClose={toggleModal}
        idUsuario={idUsuario} // Asegúrate de pasar un valor válido para idUsuario
      />
    </ImageBackground>
  )
}
