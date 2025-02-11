import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  ImageBackground,
  TouchableOpacity,
} from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { API_URL } from '@env'
import { getBackgroundByIdPartido } from '@/app/constants/partidoBackgrounds'
import noticias_styles from '@/app/styles/noticiasStyle'
import { FontAwesome } from '@expo/vector-icons'
import Banners from '@/app/components/banners'

interface Noticia {
  NoticiaID: number
  Fecha: string
  Titulo: string
  Descripcion: string
  TipoNoticia: string
  NombrePartido: string
  ImagenesAsociadas: string[]
  TotalComentarios: number
  TotalReacciones: number
}

const MAX_LENGTH = 100
export default function Noticias({ route, navigation }: any) {
  const { idUsuario, idPartido } = route.params
  const [noticias, setNoticias] = useState<Noticia[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [expanded, setExpanded] = useState(false)
  const toggleExpanded = () => setExpanded(!expanded)
  // 📌 Función para obtener noticias
  // 📌 Función para obtener noticias sin necesidad de recargar la pantalla
  const fetchNoticias = async () => {
    try {
      console.log('🔄 Solicitando noticias desde el backend...')
      const response = await fetch(
        `${API_URL}api/noticias/partido/${idPartido}?page=1&limit=10`
      )
      const data = await response.json()

      if (!data.success || !data.noticias) {
        setNoticias([])
      } else {
        setNoticias(data.noticias)
      }
    } catch (err) {
      console.error('❌ Error al obtener noticias:', err)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchNoticias()
    const interval = setInterval(fetchNoticias, 10000)
    return () => clearInterval(interval)
  }, [idPartido])

  // 📌 Renderizar cada noticia
  const renderNoticia = ({ item }: { item: Noticia }) => (
    <View style={noticias_styles.card}>
      {item.ImagenesAsociadas.length > 0 && (
        <View style={noticias_styles.noticiaImagenContainer}>
          <Image
            source={{ uri: item.ImagenesAsociadas[0] }}
            style={noticias_styles.noticiaImagen}
          />
        </View>
      )}
      <View style={noticias_styles.noticiaTitleContainer}>
        <Text style={noticias_styles.noticiaTitulo}>{item.Titulo}</Text>
        <Text style={noticias_styles.noticiaTipo}>{item.TipoNoticia}</Text>
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
          {item.Descripcion}
        </Text>
      </View>
      <TouchableOpacity onPress={toggleExpanded}>
        <Text
          style={expanded ? noticias_styles.verMenos : noticias_styles.verMas}
        >
          {expanded ? 'Ver menos' : 'Ver más'}
        </Text>
      </TouchableOpacity>

      <View style={noticias_styles.noticiaCalendarContainer}>
        <FontAwesome name="calendar" size={24} color={'black'} />
        <Text style={noticias_styles.noticiaFecha}>{item.Fecha}</Text>
      </View>

      <View style={noticias_styles.actions}>
        <TouchableOpacity style={noticias_styles.actionsCommments}>
          <FontAwesome name="heart" size={24} color={'red'} />
          <Text style={noticias_styles.noticiaDescripcion}>
            {item.TotalReacciones}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={noticias_styles.actionsCommments}>
          <Text style={noticias_styles.viewComments}>Ver Comentarios</Text>
          <Text style={noticias_styles.noticiaDescripcion}>
            {item.TotalComentarios}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  // 📌 Mostrar indicador de carga
  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />
  }

  // 📌 Mostrar mensaje si no hay noticias
  if (noticias.length === 0) {
    return (
      <View>
        <Text>🚫 No hay noticias disponibles para este partido.</Text>
      </View>
    )
  }

  return (
    <ImageBackground
      source={getBackgroundByIdPartido(idPartido)}
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

      <FlatList
        data={noticias}
        keyExtractor={(item) => item.NoticiaID.toString()}
        renderItem={renderNoticia}
      />
    </ImageBackground>
  )
}
