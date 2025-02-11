import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  ImageBackground,
  TouchableOpacity,
  Modal,
  TextInput,
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
  Reaccionada?: boolean // Nuevo campo para indicar si el usuario ya reaccionó
}
type Comentario = {
  ComentarioID: number
  NombreUsuario: string
  Comentario: string
  FechaComentario: string
}

export default function Noticias({ route, navigation }: any) {
  const { idUsuario, idPartido } = route.params
  const [noticias, setNoticias] = useState<Noticia[]>([])
  const [currentNoticia, setCurrentNoticia] = useState<any>(null)
  const [comentarios, setComentarios] = useState<Comentario[]>([])
  const [isModalVisible, setModalVisible] = useState<boolean>(false)
  const [newComment, setNewComment] = useState<string>('') // Nuevo comentario
  const [lastCommentUpdate, setLastCommentUpdate] = useState<string | null>(
    null
  ) // Guardar el timestamp de la última actualización

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

  // Función mejorada para obtener los comentarios de una noticia
  const fetchComentarios = async (noticiaId: number, isInitialLoad = false) => {
    try {
      const response = await fetch(
        `${API_URL}api/noticias/comentarios/${noticiaId}?page=1&limit=10`
      )
      const data = await response.json()

      if (data.success && data.comentarios.length > 0) {
        // Verifica si hay nuevos comentarios comparando con el último ID
        const newestCommentId = data.comentarios[0].ComentarioID

        if (isInitialLoad || newestCommentId !== lastCommentUpdate) {
          setComentarios(data.comentarios) // Actualiza los comentarios si son nuevos
          setLastCommentUpdate(newestCommentId) // Actualiza el último ID registrado
        }
      } else if (isInitialLoad) {
        setComentarios([]) // Limpia si no hay comentarios en la carga inicial
      }
    } catch (error) {
      console.error(
        `Error al obtener comentarios para la noticia ${noticiaId}:`,
        error
      )
      if (isInitialLoad) setComentarios([]) // Limpia en caso de error inicial
    }
  }

  // Ejecutar polling para actualizar comentarios en tiempo real
  // Polling mejorado con verificación de cambios
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isModalVisible && currentNoticia) {
      interval = setInterval(async () => {
        await fetchComentarios(currentNoticia.NoticiaID)
      }, 5000) // Verifica cada 5 segundos
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isModalVisible, currentNoticia])

  // Función para registrar un nuevo comentario
  const registrarComentario = async () => {
    if (!newComment.trim()) {
      alert('El comentario no puede estar vacío.')
      return
    }

    if (!idUsuario || !currentNoticia?.NoticiaID) {
      alert('Datos inválidos. No se puede registrar el comentario.')
      return
    }

    try {
      const response = await fetch(
        `${API_URL}api/noticias/comentario/${currentNoticia.NoticiaID}/${idUsuario}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            comentario: newComment,
          }),
        }
      )

      const data = await response.json()

      if (data.success) {
        alert('Comentario enviado con éxito.')

        // Agregar el nuevo comentario solo a la noticia actual
        const nuevoComentario: Comentario = {
          ComentarioID: data.comentario.ComentarioID,
          NombreUsuario: data.comentario.NombreUsuario,
          Comentario: data.comentario.comentario,
          FechaComentario: data.comentario.FechaComentario,
        }

        setComentarios((prevComentarios) => [
          nuevoComentario,
          ...prevComentarios,
        ])

        setNewComment('') // Limpiar el input
      } else {
        alert('No se pudo enviar el comentario: ' + data.message)
      }
    } catch (error) {
      console.error('Error al registrar comentario:', error)
      alert(
        'Error al registrar el comentario. Verifica la conexión al servidor.'
      )
    }
  }

  // Función para registrar una reacción
  const registrarReaccion = async (idNoticia: number, index: number) => {
    try {
      const noticia = noticias[index]

      if (noticia.Reaccionada) {
        alert('Ya has reaccionado a esta noticia.')
        return
      }

      const response = await fetch(
        `${API_URL}api/noticias/reaccion/${idNoticia}/${idUsuario}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ tipo_reaccion: 'like' }),
        }
      )
      const data = await response.json()

      if (data.success) {
        // Actualizar el estado local: marcar como reaccionada y actualizar total de reacciones
        setNoticias((prevNoticias) =>
          prevNoticias.map((item, idx) =>
            idx === index
              ? {
                  ...item,
                  TotalReacciones: data.totalReacciones,
                  Reaccionada: true,
                }
              : item
          )
        )
      } else {
        alert('No se pudo registrar la reacción: ' + data.message)
      }
    } catch (error) {
      console.error('Error al registrar reacción:', error)
      alert('Error al registrar la reacción. Verifica la conexión al servidor.')
    }
  }

  // Abrir modal y cargar comentarios
  // Abrir modal y cargar comentarios iniciales
  const openModal = async (noticia: Noticia) => {
    setComentarios([]) // Limpia los comentarios al abrir el modal
    setCurrentNoticia(noticia) // Establece la noticia actual
    await fetchComentarios(noticia.NoticiaID, true) // Carga inicial de comentarios
    setModalVisible(true) // Abre el modal
  }

  // Cerrar modal y limpiar cualquier intervalo activo
  // Cerrar modal y limpiar intervalos
  const closeModal = () => {
    setModalVisible(false)
    setComentarios([]) // Limpia los comentarios al cerrar el modal
    setLastCommentUpdate(null) // Reinicia el último ID de comentario
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
        <Text style={noticias_styles.noticiaFecha}>
          {new Date(item.Fecha).toLocaleDateString('es-MX', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })}
        </Text>
      </View>

      <View style={noticias_styles.actions}>
        <TouchableOpacity
          style={noticias_styles.actionsCommments}
          onPress={() => registrarReaccion(item.NoticiaID, 1)}
        >
          <FontAwesome
            name="heart"
            size={24}
            color={item.Reaccionada ? 'red' : '#d9d9d9'}
          />
          <Text style={noticias_styles.noticiaDescripcion}>
            {item.TotalReacciones}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={noticias_styles.actionsCommments}
          onPress={() => openModal(item)}
        >
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

      {/* Modal para mostrar comentarios */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={noticias_styles.modalContainer}>
          <View style={noticias_styles.modalContent}>
            {/* Encabezado del modal */}
            <View style={noticias_styles.modalsubContent}>
              <TouchableOpacity
                onPress={closeModal}
                style={noticias_styles.button_cerrar}
              >
                <Text style={noticias_styles.txt_button_cerrar}>X</Text>
              </TouchableOpacity>
              <Text style={noticias_styles.modalTitle}>
                Comentarios de la noticia: {currentNoticia?.Titulo}
              </Text>
            </View>

            {/* Lista de comentarios */}
            {comentarios.length > 0 ? (
              <FlatList
                style={noticias_styles.commentList}
                data={comentarios}
                keyExtractor={(item, index) => `${item.ComentarioID}_${index}`}
                renderItem={({ item }) => (
                  <View style={noticias_styles.commentContainer}>
                    <View style={noticias_styles.avatarContainer}>
                      <Image
                        source={{
                          uri: 'https://randomuser.me/api/portraits/men/1.jpg', // Reemplaza con el enlace del avatar
                        }}
                        style={noticias_styles.avatar}
                      />
                    </View>
                    <View style={noticias_styles.textContainer}>
                      <Text style={noticias_styles.commentUser}>
                        {item.NombreUsuario}
                      </Text>
                      <Text style={noticias_styles.commentText}>
                        {item.Comentario}
                      </Text>
                    </View>
                    <Text style={noticias_styles.commentfecha}>
                      {new Date(item.FechaComentario).toLocaleDateString(
                        'es-MX',
                        {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        }
                      )}{' '}
                      {new Date(item.FechaComentario).toLocaleTimeString(
                        'es-MX',
                        {
                          hour: '2-digit',
                          minute: '2-digit',
                        }
                      )}
                    </Text>
                  </View>
                )}
              />
            ) : (
              <Text style={noticias_styles.noComments}>
                Sin comentarios. Sé el primero en comentar
              </Text>
            )}

            {/* Input y botón para agregar un comentario */}
            <View style={noticias_styles.commentInputContainer}>
              <TextInput
                style={noticias_styles.commentInput}
                placeholder="Escribe un comentario..."
                value={newComment}
                onChangeText={setNewComment}
              />
              <TouchableOpacity
                style={noticias_styles.sendButton}
                onPress={registrarComentario}
              >
                <FontAwesome name="send" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  )
}
