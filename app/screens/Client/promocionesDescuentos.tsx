import React, { useState, useEffect } from 'react'
import {
  Text,
  ImageBackground,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native'
import { getBackgroundByIdPartido } from '@/app/constants/partidoBackgrounds'
import { FontAwesome } from '@expo/vector-icons'
import noticias_styles from '@/app/styles/noticiasStyle'
import Banners from '@/app/components/banners'
import promociones_descuentos_styles from '@/app/styles/promocionesDescuentos'
import ModalCupon from '@/app/components/ModalCupon'
import { API_URL } from '@env'
export default function PromocionesDescuentos({ route, navigation }: any) {
  const [idPartido, setIdPartido] = useState<number>(5) // ID predeterminado del partido
  const [promociones, setPromociones] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [selectedCoupon, setSelectedCoupon] = useState<any>(null)

  // 📌 Función para obtener promociones desde la API
  const fetchPromociones = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`${API_URL}api/promociones/${idPartido}`)
      console.log(response, 'promociones')
      const data = await response.json()
      console.log(data, 'data promociones')
      if (!data.success) {
        setPromociones([])
        setError(data.message || 'No hay promociones disponibles.')
      } else {
        setPromociones(data.promociones)
      }
    } catch (error) {
      console.error('Error al obtener promociones:', error)
      setError('Hubo un error al cargar las promociones. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPromociones()
  }, [idPartido])

  const openModal = (coupon: any) => {
    setSelectedCoupon({
      idPromocion: coupon.idPromocion, // 🔹 Asegura que se envía el ID de la promoción
      tituloPromocion: coupon.tituloPromocion,
      logo: coupon.logo ? coupon.logo : null,
      status: coupon.status,
    })
    setModalVisible(true)
  }

  const closeModal = () => {
    setModalVisible(false)
    setSelectedCoupon(null)
  }

  return (
    <ImageBackground
      source={getBackgroundByIdPartido(idPartido)}
      style={promociones_descuentos_styles.container}
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

      <View style={promociones_descuentos_styles.titleContainer}>
        <Text style={promociones_descuentos_styles.titleText}>
          Convenios y Descuentos
        </Text>
        <View style={promociones_descuentos_styles.divider}></View>
      </View>
      {/* 📌 Indicador de carga */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <View>
          <Text>{error}</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={promociones_descuentos_styles.scrollContainer}
        >
          {promociones.map((coupon, index) => (
            <View
              style={promociones_descuentos_styles.coupon}
              key={coupon.id || `coupon-${index}`}
            >
              <View style={promociones_descuentos_styles.cardHeader}>
                <Image
                  source={{ uri: coupon.logo }}
                  style={promociones_descuentos_styles.logo_cupon}
                />
                <Text style={promociones_descuentos_styles.cardTitle}>
                  {coupon.nombreNegocio}
                </Text>
                <Text style={promociones_descuentos_styles.cardTitle}>
                  {coupon.status}
                </Text>
                <TouchableOpacity
                  style={promociones_descuentos_styles.actionButton}
                  onPress={() => openModal(coupon)}
                >
                  <Text style={promociones_descuentos_styles.actionText}>
                    Pedir ahora
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={promociones_descuentos_styles.dashedLine} />

              <View
                style={[
                  promociones_descuentos_styles.cardBody,
                  noticias_styles.noticiaDescripcionContainer,
                ]}
              >
                <View>
                  <Text
                    style={[
                      noticias_styles.noticiaTitulo,
                      promociones_descuentos_styles.cardTitle,
                    ]}
                  >
                    {coupon.tituloPromocion}
                  </Text>
                </View>

                {typeof coupon.detalles === 'string' ? (
                  coupon.detalles
                    .split('|')
                    .map((detalles: string, index: number) => (
                      <Text
                        style={noticias_styles.noticiaDescripcion}
                        key={index}
                      >
                        {detalles.trim()}
                      </Text>
                    ))
                ) : (
                  <Text style={promociones_descuentos_styles.cardDetails}>
                    Sin detalles disponibles
                  </Text>
                )}
                <Text style={promociones_descuentos_styles.cardExpiry}>
                  Vence: {coupon.descripcionPromocion}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {selectedCoupon && (
        <ModalCupon
          visible={modalVisible}
          onClose={closeModal}
          couponTitle={selectedCoupon.tituloPromocion} // 🔹 Se usa el nombre correcto
          logo={{ uri: selectedCoupon.logo }} // 🔹 Asegura que la imagen sea una URL válida
          idPromocion={selectedCoupon.idPromocion}
          status={selectedCoupon.status}
        />
      )}

      {/* Componente de Banners */}
      <Banners idPartido={idPartido} />
    </ImageBackground>
  )
}
