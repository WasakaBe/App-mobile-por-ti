import React, { useEffect, useState, useRef } from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from 'react-native'
import { API_URL } from '@env'

type Banner = {
  id_imagen: number
  ruta_imagen: string
  fecha_subida: string
}

const { width } = Dimensions.get('window') // Obtener ancho de la pantalla

export default function Banners({ idPartido }: { idPartido: number }) {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const scrollRef = useRef<ScrollView>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Función para aleatorizar el orden de los banners
  const shuffleBanners = (array: Banner[]) => {
    return array.sort(() => Math.random() - 0.5)
  }

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch(
          `${API_URL}api/imagenes_banner/partido/${idPartido}`
        )
        const data = await response.json()

        if (response.ok) {
          setBanners(shuffleBanners(data.imagenes || [])) // Aleatorizar banners
        } else {
          setError(data.message || 'Error al cargar los banners')
        }
      } catch (err) {
        console.error('Error fetching banners:', err)
        setError('Error en el servidor. Intenta de nuevo más tarde.')
      } finally {
        setLoading(false)
      }
    }

    fetchBanners()
  }, [idPartido])

  // Configurar desplazamiento automático de derecha a izquierda
  useEffect(() => {
    if (banners.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % banners.length
          scrollRef.current?.scrollTo({
            x: (banners.length - nextIndex - 1) * width,
            animated: true,
          })
          return nextIndex
        })
      }, 3000) // Cambiar cada 3 segundos

      return () => clearInterval(interval) // Limpiar intervalo al desmontar
    }
  }, [banners])

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1E88E5" />
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    )
  }

  return (
    <View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        ref={scrollRef}
        scrollEventThrottle={16}
      >
        {banners.map((item, index) => (
          <View style={styles.bannerItem} key={item.id_imagen}>
            <Image source={{ uri: item.ruta_imagen }} style={styles.image} />
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  bannerItem: {
    width: width, // Usar ancho completo
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  image: {
    width: width * 0.9, // 90% del ancho de la pantalla
    height: 200,
    borderRadius: 10,
  },
})
