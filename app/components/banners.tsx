import React, { useEffect, useState, useRef } from 'react'
import {
  View,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from 'react-native'
import { API_URL } from '@env'

type Banner = {
  id_imagen: number
  fecha_subida: string
  ruta_imagen: string
}

const { width } = Dimensions.get('window') // Obtener ancho de la pantalla

export default function Banners({ idPartido }: { idPartido: number }) {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<ScrollView>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Variable para evitar múltiples peticiones en un corto período
  let fetchBannersTimeout: NodeJS.Timeout | null = null

  // Función para obtener banners desde la API con debounce
  const fetchBanners = async () => {
    if (fetchBannersTimeout) {
      clearTimeout(fetchBannersTimeout)
    }

    fetchBannersTimeout = setTimeout(async () => {
      try {
        const response = await fetch(
          `${API_URL}api/imagenes_banner/partido/${idPartido}`
        )

        if (!response.ok) {
          throw new Error(
            `Error en la API: ${response.status} - ${response.statusText}`
          )
        }

        const data = await response.json() // Obtener JSON directamente

        if (!data.success) {
          console.error('Error en los datos:', data.message)
          return
        }

        setBanners((prevBanners) => {
          const nuevosBanners = data.imagenes.filter(
            (nuevoBanner: Banner) =>
              !prevBanners.some(
                (bannerExistente) =>
                  bannerExistente.id_imagen === nuevoBanner.id_imagen
              )
          )
          return [...nuevosBanners, ...prevBanners]
        })
      } catch (error) {
        console.error('Error al obtener los banners:', error)
      } finally {
        setLoading(false)
      }
    }, 5000)
  }

  // Cargar banners iniciales y configurar actualizaciones periódicas
  useEffect(() => {
    fetchBanners()

    // Actualizar banners automáticamente cada 10 segundos
    const interval = setInterval(() => {
      fetchBanners()
    }, 10000)

    return () => clearInterval(interval) // Limpiar intervalo al desmontar
  }, [idPartido])

  // Desplazamiento automático de banners
  useEffect(() => {
    if (banners.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % banners.length
          scrollRef.current?.scrollTo({
            x: nextIndex * width,
            animated: true,
          })
          return nextIndex
        })
      }, 3000)

      return () => clearInterval(interval)
    }
  }, [banners])

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1E88E5" />
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
        {banners.map((item) => (
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
  bannerItem: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  image: {
    width: width * 0.9,
    height: 200,
    borderRadius: 10,
  },
})
