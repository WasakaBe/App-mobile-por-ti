import React, { useState } from 'react'
import {
  Text,
  ImageBackground,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native'
import { getBackgroundByIdPartido } from '@/app/constants/partidoBackgrounds'
import { FontAwesome } from '@expo/vector-icons'
import noticias_styles from '@/app/styles/noticiasStyle'
import Banners from '@/app/components/banners'
import promociones_descuentos_styles from '@/app/styles/promocionesDescuentos'
import ModalCupon from '@/app/components/ModalCupon'
export default function PromocionesDescuentos({ route, navigation }: any) {
  const [idPartido, setIdPartido] = useState<number>(5) // ID predeterminado del partido
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [selectedCoupon, setSelectedCoupon] = useState<any>(null)

  // Array con los datos de los cupones
  const coupons = [
    {
      id: 1,
      logo: require('../../assets/promocion/cupon3.png'),
      title: 'Flexi',
      details: [
        'Verdura al 15% descuento',
        'Valido los dias Martes',
        'Escobedo, Nuevo Leon.',
      ],
      expiry: '06/02/2025',
    },
    {
      id: 2,
      logo: require('../../assets/promocion/cupon1.png'),
      title: 'CINEPOLIS',
      details: [
        '2x1',
        'Valido solo Domingos',
        'San Pedro Garza Garcia, Nuevo Leon.',
      ],
      expiry: '06/03/2025',
    },
    {
      id: 3,
      logo: require('../../assets/promocion/cupon2.png'),
      title: 'Farmacia Similares',
      details: [
        'Productos de Electrors al 5% descuento',
        'Valido los dias Domingos',
        'Santa Catarina, Nuevo Leon.',
      ],
      expiry: '26/02/2025',
    },
    {
      id: 4,
      logo: require('../../assets/promocion/cupon3.png'),
      title: 'Flexi',
      details: [
        'Verdura al 15% descuento',
        'Valido los dias Martes',
        'Escobedo, Nuevo Leon.',
      ],
      expiry: '20/02/2025',
    },
    {
      id: 5,
      logo: require('../../assets/promocion/cupon1.png'),
      title: 'CINEPOLIS INTER',
      details: [
        '2x1',
        'Valido solo Domingos',
        'San Pedro Garza Garcia, Nuevo Leon.',
      ],
      expiry: '16/03/2025',
    },
    {
      id: 6,
      logo: require('../../assets/promocion/cupon2.png'),
      title: 'Farmacia Similares Cuenca',
      details: [
        'Bajo de Precio a productos de GDRAGON FARMA',
        'Valido todo el Mes de Febrero',
        'Santa Mina, Nuevo Leon.',
      ],
      expiry: '29/02/2025',
    },
  ]

  const openModal = (coupon: any) => {
    setSelectedCoupon(coupon)
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

      <ScrollView
        contentContainerStyle={promociones_descuentos_styles.scrollContainer}
      >
        {coupons.map((coupon) => (
          <View style={promociones_descuentos_styles.coupon} key={coupon.id}>
            <View style={promociones_descuentos_styles.cardHeader}>
              <Image
                source={coupon.logo}
                style={promociones_descuentos_styles.logo_cupon}
              />
              <Text style={promociones_descuentos_styles.cardTitle}>
                {coupon.title}
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
            <View style={promociones_descuentos_styles.cardBody}>
              {coupon.details.map((detail, index) => (
                <Text
                  style={promociones_descuentos_styles.cardDetails}
                  key={index}
                >
                  {detail}
                </Text>
              ))}
              <Text style={promociones_descuentos_styles.cardExpiry}>
                Vence: {coupon.expiry}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
      {selectedCoupon && (
        <ModalCupon
          visible={modalVisible}
          onClose={closeModal}
          couponTitle={selectedCoupon.title}
          logo={selectedCoupon.logo}
        />
      )}

      {/* Componente de Banners */}
      <Banners idPartido={idPartido} />
    </ImageBackground>
  )
}
