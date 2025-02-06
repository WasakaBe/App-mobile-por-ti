import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native'
import { Picker } from '@react-native-picker/picker'
import Banners from '@/app/components/banners'
import { FontAwesome } from '@expo/vector-icons'
import { getBackgroundByIdPartido } from '@/app/constants/partidoBackgrounds'
import { useNavigation } from '@react-navigation/native'
import { API_URL } from '@env'
import CommentsModal from '@/app/components/CommentsModal'
import noticias_styles from '@/app/styles/noticiasStyle'

type Noticia = {
  NoticiaID: number
  Fecha: string
  Titulo: string
  Descripcion: string
  TipoNoticia: string
  ImagenesAsociadas: string[]
  TotalComentarios: number
  TotalReacciones: number
}

type Comentario = {
  ComentarioID: number
  UsuarioID: number
  NombreUsuario: string
  Comentario: string
  FechaComentario: string
}

export default function Noticias({ route, navigation }: any) {
  const { idUsuario } = route.params // Recuperar el idUsuario desde las props
  const [idPartido, setIdPartido] = useState<number>(5) // ID predeterminado del
  //  partido
  const [noticias, setNoticias] = useState<Noticia[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tipoNoticia, setTipoNoticia] = useState<string>('Todas') // Filtro de tipo de noticia
  const [comentarios, setComentarios] = useState<Comentario[]>([]) // Comentarios actuales
  const [modalVisible, setModalVisible] = useState(false) // Estado del modal
  const [sinComentarios, setSinComentarios] = useState(false) // Indicador de comentarios vacíos
  const [refreshing, setRefreshing] = useState(false) // Estado de "refresh"

  const fetchNoticias = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `${API_URL}api/noticias/partido/${idPartido}?page=1&limit=10`
      )
      const data = await response.json()

      if (response.ok) {
        setNoticias(data.noticias || [])
        setError(null)
      } else {
        setError(data.message || 'Error al cargar las noticias')
      }
    } catch (err) {
      console.error('Error fetching noticias:', err)
      setError('Error en el servidor. Intenta de nuevo más tarde.')
    } finally {
      setLoading(false)
    }
  }

  const fetchComentarios = async (noticiaID: number) => {
    try {
      const response = await fetch(
        `${API_URL}api/noticias/comentarios/${noticiaID}?page=1&limit=10`
      )
      const data = await response.json()

      if (response.ok && data.success) {
        setSinComentarios(data.comentarios.length === 0)
        setComentarios(data.comentarios || [])
      } else {
        setSinComentarios(true)
      }
      setModalVisible(true)
    } catch (err) {
      setSinComentarios(true)
      console.error(
        `Error al obtener comentarios para la noticia ${noticiaID}:`,
        err
      )
      setModalVisible(true)
    }
  }

  const handleReaction = async (noticiaID: number) => {
    try {
      const response = await fetch(
        `${API_URL}api/noticias/reaccion/${noticiaID}/${idUsuario}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tipo_reaccion: 'heart' }),
        }
      )
      const data = await response.json()

      if (response.ok && data.success) {
        setNoticias((prevNoticias) =>
          prevNoticias.map((noticia) =>
            noticia.NoticiaID === noticiaID
              ? { ...noticia, TotalReacciones: data.totalReacciones }
              : noticia
          )
        )
      } else {
        console.error('Error al registrar la reacción:', data.message)
      }
    } catch (err) {
      console.error('Error al registrar la reacción:', err)
    }
  }

  // Manejar el "pull-to-refresh"
  const onRefresh = async () => {
    setRefreshing(true)
    await fetchNoticias() // Actualizar noticias
    setRefreshing(false)
  }

  useEffect(() => {
    fetchNoticias()
  }, [idPartido, tipoNoticia]) // Actualiza noticias cuando cambia el filtro o el ID del partido

  const renderNoticia = ({ item }: { item: Noticia }) => (
    <View style={noticias_styles.card}>
      <Text style={noticias_styles.cardTitle}>{item.Titulo}</Text>
      {item.ImagenesAsociadas.length > 0 && (
        <Image
          source={{ uri: item.ImagenesAsociadas[0] }}
          style={noticias_styles.cardImage}
        />
      )}
      <Text style={noticias_styles.cardDescription}>{item.Descripcion}</Text>
      <Text style={noticias_styles.cardDescription}>
        Categoría: {item.TipoNoticia}
      </Text>
      <TouchableOpacity>
        <Text style={noticias_styles.readMore}>Leer más</Text>
      </TouchableOpacity>

      <View style={noticias_styles.reactions}>
        {/* Botón de comentarios */}
        <TouchableOpacity
          style={noticias_styles.reaction}
          onPress={() => fetchComentarios(item.NoticiaID)}
        >
          <FontAwesome name="comment" size={20} color="#757575" />
          <Text style={noticias_styles.reactionCount}>
            {item.TotalComentarios}
          </Text>
        </TouchableOpacity>

        {/* Botón de reacción (corazón) */}
        <TouchableOpacity
          style={noticias_styles.reaction}
          onPress={() => handleReaction(item.NoticiaID)}
        >
          <FontAwesome name="heart" size={20} color="#E53935" />
          <Text style={noticias_styles.reactionCount}>
            {item.TotalReacciones}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <ImageBackground
      source={getBackgroundByIdPartido(idPartido)} // Fondo dinámico basado en idPartido
      style={noticias_styles.container}
    >
      <View style={noticias_styles.subcontainer}>
        {/* Botón de regresar */}
        <TouchableOpacity
          style={noticias_styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <FontAwesome name="arrow-left" size={18} color="#FFFFFF" />
          <Text style={noticias_styles.backText}>Regresar</Text>
        </TouchableOpacity>

        {/* Logo del Partido */}
        <Image
          source={require('../../assets/logo_partidos/unidosPt.png')}
          style={noticias_styles.logo}
        />
      </View>

      {/* Componente de Banners */}
      <Banners idPartido={idPartido} />

      {/* Encabezado de Noticias */}
      <Text style={noticias_styles.title}>Noticias</Text>

      {/* Filtro de tipo de noticias */}
      <Picker
        selectedValue={tipoNoticia}
        onValueChange={(value) => setTipoNoticia(value)}
        style={noticias_styles.picker}
      >
        <Picker.Item label="Todas" value="Todas" />
        <Picker.Item label="Nacional" value="Nacional" />
        <Picker.Item label="Local" value="Local" />
        <Picker.Item label="Seguridad" value="Seguridad" />
        <Picker.Item label="Cultura y Social" value="Cultura y Social" />
        <Picker.Item label="Deportes" value="Deportes" />
      </Picker>

      {loading ? (
        <ActivityIndicator size="large" color="#FFFFFF" />
      ) : error ? (
        <Text style={noticias_styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={noticias}
          renderItem={renderNoticia}
          keyExtractor={(item) => item.NoticiaID.toString()}
          contentContainerStyle={noticias_styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}

      {/* Modal de comentarios */}
      <CommentsModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        comentarios={comentarios}
        sinComentarios={sinComentarios}
      />
    </ImageBackground>
  )
}
