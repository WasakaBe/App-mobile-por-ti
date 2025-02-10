import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { getBackgroundByIdPartido } from '@/app/constants/partidoBackgrounds'
import { FontAwesome } from '@expo/vector-icons'
import noticias_styles from '@/app/styles/noticiasStyle'
import { API_URL } from '@env' // Asegúrate de tener la URL base de la API en tu archivo .env

type Post = {
  id: number
  user: string
  verified: boolean
  avatar: string
  image: string
  description: string
}

type ApiResponse = {
  message: string
  posts: Post[]
}

export default function Conectate({ route, navigation }: any) {
  const [idPartido, setIdPartido] = useState<number>(5) // ID predeterminado del partido
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [limit] = useState<number>(10)
  const [hasMore, setHasMore] = useState<boolean>(true)

  const fetchPosts = async (): Promise<void> => {
    try {
      setLoading(true)

      const url = `${API_URL}/api/post/${idPartido}?page=${currentPage}&limit=${limit}`
      const response = await fetch(url)

      if (!response.ok) {
        if (response.status === 404) {
          Alert.alert(
            `No se encontraron publicaciones para el partido con ID ${idPartido}.`
          )
        } else {
          throw new Error(
            `Error en la respuesta (${
              response.status
            }): ${await response.text()}`
          )
        }
      }

      let result: ApiResponse
      try {
        result = await response.json()
        console.log(result)
      } catch (jsonError) {
        throw new Error('La respuesta no es un JSON válido.')
      }

      if (result.posts.length < limit) {
        setHasMore(false)
      }

      setData((prevData) => [...prevData, ...result.posts])
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error fetching posts:', error.message)
      } else {
        console.error('Error desconocido:', error)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [currentPage])

  const loadMore = () => {
    if (hasMore && !loading) {
      setCurrentPage((prevPage) => prevPage + 1)
    }
  }

  if (loading && currentPage === 1) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text>Cargando datos...</Text>
      </View>
    )
  }

  return (
    <ImageBackground
      source={getBackgroundByIdPartido(idPartido)}
      style={styles.background}
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

      <Text style={styles.title}>Conectate</Text>

      {/* Lista de tarjetas */}
      <ScrollView
        contentContainerStyle={styles.cardContainer}
        onScroll={(event) => {
          const { layoutMeasurement, contentOffset, contentSize } =
            event.nativeEvent

          if (
            layoutMeasurement.height + contentOffset.y >=
            contentSize.height - 10
          ) {
            loadMore()
          }
        }}
        scrollEventThrottle={400}
      >
        {data.map((item, index) => (
          <View key={`${item.id_contenido}-${index}`} style={styles.card}>
            {/* Cabecera de la tarjeta */}
            <View style={styles.cardHeader}>
              <Image
                source={{
                  uri: item.foto_perfil || 'https://via.placeholder.com/40',
                }}
                style={styles.avatar}
              />
              <Text style={styles.userName}>
                {item.autor}{' '}
                {item.verified && (
                  <FontAwesome name="check-circle" size={14} color="#3498db" />
                )}
              </Text>
            </View>

            {/* Imagen principal */}
            <Image
              source={{
                uri: item.ruta_imagen || 'https://via.placeholder.com/200',
              }}
              style={styles.cardImage}
            />

            {/* Descripción */}
            <Text style={styles.description}>{item.description}</Text>

            {/* Acciones */}
            <View style={styles.actions}>
              <View style={styles.actions2}>
                <TouchableOpacity style={styles.actionButton}>
                  <FontAwesome name="heart" size={20} color="#716d6dcc" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <FontAwesome name="thumbs-up" size={20} color="#716d6dcc" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <FontAwesome name="thumbs-down" size={20} color="#716d6dcc" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.commentsButton}>
                <FontAwesome name="comment" size={20} color="#3498db" />
                <Text style={styles.commentsText}>Ver Comentarios</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        {loading && <ActivityIndicator size="large" color="#3498db" />}
      </ScrollView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: '#fff',
  },
  cardContainer: {
    padding: 10,
    width: '100%',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    height: 700,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cardImage: {
    width: '100%',
    height: 500,
    borderRadius: 10,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actions2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  commentsButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentsText: {
    fontSize: 14,
    color: '#3498db',
    marginLeft: 5,
    textDecorationLine: 'underline',
  },
})
