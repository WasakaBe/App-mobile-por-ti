import {
  View,
  Text,
  ImageBackground,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Animated,
  Modal,
  TextInput,
} from 'react-native'
import React, { useEffect, useState, useRef, useCallback } from 'react'
import noticias_styles from '@/app/styles/noticiasStyle'
import conectate_styles from '@/app/styles/conectateStyle'
import { getBackgroundByIdPartido } from '@/app/constants/partidoBackgrounds'
import { API_URL } from '@env'
import CreatePostModal from '@/app/utils/CreatePostModal'

import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons, FontAwesome } from '@expo/vector-icons'

// Definir el tipo de datos que se esperan de la API
type PostType = {
  id_contenido: number
  autor: string
  descripcion: string
  fecha_publicacion: string
  foto_perfil: string | any
  nombre_partido: string
  ruta_imagen: string | any
  numComentarios: number
}

// Definir el tipo de comentario
type CommentType = {
  idcomentario: number
  idcontenido: number
  autor: string
  comentario: string
  fecha_comentario: string
  foto_perfil: string | null
}

export default function Conectate({ route, navigation }: any) {
  const { idPartido, idUsuario } = route.params

  // Estados con tipado en TypeScript
  const [posts, setPosts] = useState<PostType[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true) // Para saber si hay más posts
  const limit = 10 // Número de publicaciones por cada llamada a la API
  const displayLimit = 5 // Número de publicaciones a mostrar por paginación local
  const [visiblePosts, setVisiblePosts] = useState<PostType[]>([])
  const isFetching = useRef(false) // Evita llamadas duplicadas
  // Estado para manejar qué post está expandido
  const [expandedPosts, setExpandedPosts] = useState<Set<number>>(new Set())
  const [modalVisible, setModalVisible] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedPost, setSelectedPost] = useState<number | null>(null)
  const [commentsModalVisible, setCommentsModalVisible] = useState(false)
  const [newComment, setNewComment] = useState<string>('')
  const [liked, setLiked] = useState(false)
  const likeScale = useRef(new Animated.Value(1)).current
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Estado para los comentarios
  const [comments, setComments] = useState<{ [key: number]: CommentType[] }>({})
  const [loadingComments, setLoadingComments] = useState<{
    [key: number]: boolean
  }>({})

  const animateButton = (value: Animated.Value) => {
    Animated.sequence([
      Animated.spring(value, {
        toValue: 0.8,
        speed: 10, // Se usa speed en lugar de duration
        useNativeDriver: true,
      }),
      Animated.spring(value, {
        toValue: 1.2,
        speed: 10,
        useNativeDriver: true,
      }),
      Animated.spring(value, {
        toValue: 1,
        speed: 10,
        useNativeDriver: true,
      }),
    ]).start()
  }

  const handleLike = () => {
    animateButton(likeScale)
    setLiked(!liked)
  }

  // Función para alternar la expansión de un post específico
  const toggleExpanded = (id_contenido: number) => {
    setExpandedPosts((prev) => {
      const newExpanded = new Set(prev)
      if (newExpanded.has(id_contenido)) {
        newExpanded.delete(id_contenido)
      } else {
        newExpanded.add(id_contenido)
        if (!comments[id_contenido]) {
          fetchComments(id_contenido)
        }
      }
      return newExpanded
    })
  }

  // Función para obtener publicaciones de la API
  const fetchPosts = useCallback(
    async (page = 1) => {
      if (isFetching.current || !hasMore) return
      isFetching.current = true
      setLoading(true)

      try {
        const url = new URL(`${API_URL}api/post/${idPartido}`)
        url.searchParams.append('page', page.toString())
        url.searchParams.append('limit', limit.toString())
        const response = await fetch(url.toString())

        if (!response.ok) throw new Error('Error en la API')

        const data = await response.json()
        console.log('Datos obtenidos:', data)

        if (data.posts && Array.isArray(data.posts)) {
          setPosts((prevPosts) => {
            const newPosts = data.posts.map((newPost: PostType) => ({
              ...newPost,
              numComentarios: newPost.numComentarios || 0, // Asegurar el número de comentarios
            }))
            return [...newPosts, ...prevPosts]
          })
          if (data.posts.length < limit) setHasMore(false)
        }
      } catch (error) {
        console.error('Error al obtener publicaciones:', error)
        setError('No se pudieron cargar las publicaciones')
      } finally {
        setLoading(false)
        isFetching.current = false
      }
    },
    [idPartido, hasMore]
  )

  // Función para obtener los comentarios de un post específico
  const fetchComments = async (postId: number, page = 1) => {
    // Si ya se está cargando, evitar llamadas duplicadas
    if (loadingComments[postId]) return

    setLoadingComments((prev) => ({ ...prev, [postId]: true }))

    try {
      const response = await fetch(
        `${API_URL}api/post/comentarios/${postId}?page=${page}&limit=${limit}`
      )
      const data = await response.json()

      if (!data.success) {
        console.warn(`No hay comentarios para el post ${postId}`)
        return
      }

      setComments((prev) => ({
        ...prev,
        [postId]: data.comentarios,
      }))

      // 🔹 Actualizar el número de comentarios dentro de la lista de posts
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id_contenido === postId
            ? { ...post, numComentarios: data.comentarios.length }
            : post
        )
      )
    } catch (error) {
      console.error(
        `Error obteniendo comentarios para el post ${postId}:`,
        error
      )
    } finally {
      setLoadingComments((prev) => ({ ...prev, [postId]: false }))
    }
  }

  // Cargar publicaciones al montar el componente
  useEffect(() => {
    fetchPosts()
    const interval = setInterval(() => {
      fetchPosts(1)
    }, 10000)
    return () => clearInterval(interval)
  }, [fetchPosts])

  // Actualizar la lista visible de posts con paginación local (5 en 5)
  useEffect(() => {
    setVisiblePosts(posts.slice(0, currentPage * displayLimit))
  }, [posts, currentPage])

  // Función para cargar más publicaciones en el paginador local (sin nueva llamada API)
  const loadMoreLocal = () => {
    if (currentPage * displayLimit < posts.length) {
      setCurrentPage((prevPage) => prevPage + 1)
    } else if (hasMore) {
      fetchPosts(currentPage + 1)
    }
  }

  const openCommentsModal = (postId: number) => {
    setSelectedPost(postId)
    setCommentsModalVisible(true)
    fetchComments(postId)

    // Evitar múltiples intervalos activos
    if (intervalRef.current) clearInterval(intervalRef.current)

    // Actualizar comentarios solo si la modal está abierta
    intervalRef.current = setInterval(() => {
      fetchComments(postId)
    }, 10000)
  }

  const closeCommentsModal = () => {
    setCommentsModalVisible(false)
    setSelectedPost(null)

    // Limpiar los comentarios al cerrar la modal
    setComments((prev) => {
      const newComments = { ...prev }
      delete newComments[selectedPost as number]
      return newComments
    })

    // Detener la actualización automática al cerrar la modal
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const handleSendComment = async () => {
    if (!newComment.trim() || selectedPost === null) return // Evitar comentarios vacíos

    // Crear el nuevo comentario con datos locales
    const nuevoComentario: CommentType = {
      idcomentario: Date.now(), // ID temporal (se actualiza en la API)
      idcontenido: selectedPost,
      autor: idUsuario.autor, // Mostrar "Tú" para comentarios del usuario actual
      comentario: newComment,
      fecha_comentario: new Date().toISOString(),
      foto_perfil: null, // Se puede actualizar si se obtiene desde la API
    }

    // Agregar el comentario solo en el post correspondiente
    setComments((prev) => ({
      ...prev,
      [selectedPost]: [...(prev[selectedPost] || []), nuevoComentario],
    }))
    // 🔹 Incrementar el contador de comentarios en la UI
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id_contenido === selectedPost
          ? { ...post, numComentarios: (post.numComentarios || 0) + 1 }
          : post
      )
    )
    // Limpiar el input después de enviar el comentario
    setNewComment('')
    try {
      const response = await fetch(`${API_URL}api/post/comentar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_contenido: selectedPost,
          id_usuario: idUsuario, // Usuario que está comentando
          comentario: newComment,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        console.error('Error al enviar comentario:', data.error)
        return
      }

      // Si el servidor devuelve datos actualizados, podemos recargar los comentarios
      fetchComments(selectedPost)
    } catch (error) {
      console.error('Error en la API de comentarios:', error)
    }
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

        {/* Botón Crear Post */}
        <TouchableOpacity
          style={conectate_styles.createPostButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={conectate_styles.createPostText}>Crear Post</Text>
        </TouchableOpacity>
      </View>

      {/* Renderizar el Modal */}
      {/* Modal para crear post */}
      <CreatePostModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        idUsuario={idUsuario}
      />

      <FlatList
        data={visiblePosts}
        keyExtractor={(item) => item.id_contenido.toString()}
        renderItem={({ item }) => {
          const isExpanded = expandedPosts.has(item.id_contenido)

          return (
            <View style={conectate_styles.cardConectate}>
              <View style={conectate_styles.header}>
                <View style={conectate_styles.userInfo}>
                  <View>
                    <Image
                      source={{ uri: item.foto_perfil }}
                      style={conectate_styles.avatar}
                    />
                  </View>
                  <View style={conectate_styles.userTextContainer}>
                    <Text style={conectate_styles.username}>{item.autor}</Text>
                    <View style={noticias_styles.noticiaCalendarContainer}>
                      <Text style={conectate_styles.time}>
                        {' '}
                        {new Date(item.fecha_publicacion).toLocaleDateString(
                          'es-MX',
                          {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                          }
                        )}
                      </Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity style={conectate_styles.moreButton}>
                  <Ionicons name="ellipsis-horizontal" size={24} color="#333" />
                </TouchableOpacity>
              </View>

              <View style={conectate_styles.subRutaImagen}>
                <Image
                  source={{ uri: item.ruta_imagen }}
                  style={conectate_styles.ruta_imagen}
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.3)']}
                  style={conectate_styles.gradient}
                />
              </View>

              {/* Interaction Buttons */}
              <View style={conectate_styles.interactionBar}>
                <View style={conectate_styles.leftButtons}>
                  <Animated.View style={{ transform: [{ scale: likeScale }] }}>
                    <TouchableOpacity
                      onPress={handleLike}
                      style={conectate_styles.iconButton}
                    >
                      <Ionicons
                        name={liked ? 'heart' : 'heart-outline'}
                        size={28}
                        color={liked ? '#FF4B6E' : '#333'}
                      />
                      <Text style={conectate_styles.interactionText}>2.4K</Text>
                    </TouchableOpacity>
                  </Animated.View>
                  <TouchableOpacity
                    style={conectate_styles.iconButton}
                    onPress={() => openCommentsModal(item.id_contenido)}
                  >
                    <Ionicons
                      name="chatbubble-outline"
                      size={26}
                      color="#333"
                    />
                    <Text style={conectate_styles.interactionText}>
                      {item.numComentarios || 0}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View
                style={[
                  conectate_styles.content,
                  isExpanded && noticias_styles.expandedContainer,
                ]}
              >
                <Text
                  style={conectate_styles.caption}
                  numberOfLines={isExpanded ? undefined : 10}
                >
                  {item.descripcion}
                </Text>

                <TouchableOpacity
                  onPress={() => toggleExpanded(item.id_contenido)}
                >
                  <Text
                    style={
                      isExpanded
                        ? conectate_styles.readMore
                        : conectate_styles.readMore
                    }
                  >
                    {isExpanded ? 'Ver menos' : 'Ver más'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )
        }}
        ListFooterComponent={
          loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : hasMore ? (
            <TouchableOpacity
              onPress={loadMoreLocal}
              style={conectate_styles.botonmas}
            >
              <Text>Cargar más</Text>
            </TouchableOpacity>
          ) : null
        }
      />

      {selectedPost !== null && (
        <Modal
          visible={commentsModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={closeCommentsModal}
        >
          <View style={noticias_styles.modalContainer}>
            <View style={noticias_styles.modalContent}>
              <View style={noticias_styles.modalsubContent}>
                <TouchableOpacity
                  onPress={closeCommentsModal}
                  style={noticias_styles.button_cerrar}
                >
                  <Text style={noticias_styles.txt_button_cerrar}>X</Text>
                </TouchableOpacity>
                <Text style={noticias_styles.modalTitle}>
                  Comentarios del post:{' '}
                  {selectedPost !== null
                    ? posts.find((post) => post.id_contenido === selectedPost)
                        ?.autor || 'Desconocido'
                    : ''}
                </Text>
              </View>

              {/* Mostrar los comentarios del post seleccionado */}
              {loadingComments[selectedPost] ? (
                <ActivityIndicator size="large" color="#0000ff" />
              ) : comments[selectedPost] &&
                comments[selectedPost].length > 0 ? (
                <FlatList
                  data={comments[selectedPost]}
                  keyExtractor={(comment) => comment.idcomentario.toString()}
                  renderItem={({ item }) => (
                    <View style={noticias_styles.commentContainer}>
                      <View style={noticias_styles.avatarContainer}>
                        <Image
                          source={{
                            uri:
                              item.foto_perfil ||
                              'https://via.placeholder.com/50',
                          }}
                          style={noticias_styles.avatar}
                        />
                      </View>

                      <View style={noticias_styles.textContainer}>
                        <Text style={noticias_styles.commentUser}>
                          {item.autor}
                        </Text>
                        <Text style={noticias_styles.commentText}>
                          {item.comentario}
                        </Text>
                        <Text style={noticias_styles.commentfecha}>
                          {new Date(item.fecha_comentario).toLocaleDateString(
                            'es-MX',
                            {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                            }
                          )}{' '}
                          {new Date(item.fecha_comentario).toLocaleTimeString(
                            'es-MX',
                            {
                              hour: '2-digit',
                              minute: '2-digit',
                            }
                          )}
                        </Text>
                      </View>
                    </View>
                  )}
                />
              ) : (
                <Text style={noticias_styles.noComments}>
                  Sin Comentarios. Sé el primero en comentar...
                </Text>
              )}
              {/* Input y botón para agregar un comentario */}
              <View style={noticias_styles.commentInputContainer}>
                <TextInput
                  style={noticias_styles.commentInput}
                  placeholder="Escribe un comentario..."
                  value={newComment}
                  onChangeText={setNewComment} // Guardar el comentario en el estado
                />
                <TouchableOpacity
                  style={noticias_styles.sendButton}
                  onPress={handleSendComment}
                >
                  <FontAwesome name="send" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </ImageBackground>
  )
}
