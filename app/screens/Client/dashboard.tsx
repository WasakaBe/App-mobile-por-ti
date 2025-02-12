import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { decode as atob } from 'base-64'
import { getBackgroundByIdPartido } from '@/app/constants/partidoBackgrounds'
import dashboard_styles from '@/app/styles/dashboardStyle'
import getLogoByIdPartido from '@/app/constants/logoPartidos'
import ErrorModal from '@/app/constants/errorModal'
import Banners from '@/app/components/banners'
export default function Dashboard({ navigation }: any) {
  const [userName, setUserName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [userPhoto, setUserPhoto] = useState('')
  const [idUsuario, setIdUsuario] = useState<number | null>(null) // Almacena idUsuario
  const [backgroundSource, setBackgroundSource] = useState(
    getBackgroundByIdPartido(5) // Fondo predeterminado
  )
  const [logoSource, setLogoSource] = useState(getLogoByIdPartido(5)) // Logo predeterminado
  const [idPartido, setIdPartido] = useState<number>(5) // ID predeterminado del partido
  const [errorModalVisible, setErrorModalVisible] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('token')

        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]))

          const validPartidos = [1, 2, 3, 4, 5]
          if (!validPartidos.includes(payload.id_partido)) {
            setErrorMessage('No tienes permisos para acceder a esta sección.')
            setErrorModalVisible(true)
            return
          }

          setUserName(
            `${payload.nombre} ${payload.a_paterno} ${payload.a_materno} ${payload.id_partido}` ||
              'Usuario'
          )
          setPhoneNumber(payload.telefono)
          setUserPhoto(payload.foto_perfil) // Setear la foto del usuario
          setBackgroundSource(getBackgroundByIdPartido(payload.id_partido))
          setLogoSource(getLogoByIdPartido(payload.id_partido)) // Setear el logo del partido
          setIdPartido(payload.id_partido) // Guardar el id del partido
          setIdUsuario(payload.id) // Extrae y almacena idUsuario
        }
      } catch (error) {
        console.error('Error obteniendo el token:', error)
      }
    }

    fetchUserData()
  }, [navigation])

  return (
    <ImageBackground
      source={backgroundSource}
      style={dashboard_styles.background}
      resizeMode="cover"
    >
      <View style={dashboard_styles.header}>
        {/* Logo del Partido */}
        <Image
          source={require('../../assets/logo_partidos/unidosPt.png')}
          style={dashboard_styles.logo}
        />
        {/* Foto del Usuario */}
        {userPhoto && (
          <Image
            source={{ uri: userPhoto }}
            style={dashboard_styles.userPhoto}
          />
        )}

        <Text style={dashboard_styles.welcomeText}>¡Hola {userName}!</Text>
        <Text style={dashboard_styles.phoneText}>{phoneNumber}</Text>
        {/* Línea debajo del teléfono */}
      </View>
      <View style={dashboard_styles.divider} />

      <View style={dashboard_styles.gridContainer}>
        {/* Fila Destacada */}
        <View style={dashboard_styles.row}>
          {/* Noticias PT */}
          <TouchableOpacity
            style={[
              dashboard_styles.gridItem,
              dashboard_styles.highlightedItem,
            ]}
            onPress={() =>
              navigation.navigate('Noticias', { idUsuario, idPartido })
            }
          >
            <Image
              source={require('../../assets/iconos/NOTICIASPT.png')}
              style={dashboard_styles.gridIconRow}
            />
            <Text style={dashboard_styles.gridTextHighlighted}>
              Noticias PT
            </Text>
          </TouchableOpacity>

          {/* Reporte Ciudadano */}
          <TouchableOpacity
            style={[
              dashboard_styles.gridItem,
              dashboard_styles.highlightedItem,
            ]}
            onPress={() =>
              navigation.navigate('ReporteCiudadano', { idUsuario, idPartido })
            }
          >
            <Image
              source={require('../../assets/iconos/REPORTECIUDADANO.png')}
              style={dashboard_styles.gridIconRow}
            />
            <Text style={dashboard_styles.gridTextHighlighted}>
              Reporte ciudadano
            </Text>
          </TouchableOpacity>
        </View>

        {/* Fila 1 */}
        <View style={dashboard_styles.row}>
          {/* Promociones */}
          <TouchableOpacity
            style={[dashboard_styles.gridItem, dashboard_styles.grayItem]}
            onPress={() => navigation.navigate('PromocionesDescuentos')}
          >
            <Image
              source={require('../../assets/iconos/PROMOCIONESYDESCUENTOS.png')}
              style={dashboard_styles.gridIcon}
            />
            <Text style={dashboard_styles.gridText}>Promociones</Text>
          </TouchableOpacity>

          {/* Directorio Servicios */}
          <TouchableOpacity
            style={[dashboard_styles.gridItem, dashboard_styles.grayItem]}
            onPress={() => navigation.navigate('DirectorioServicios')}
          >
            <Image
              source={require('../../assets/iconos/DIRECTORIODESERVICIOS.png')}
              style={dashboard_styles.gridIcon}
            />
            <Text style={dashboard_styles.gridText}>Directorio Servicios</Text>
          </TouchableOpacity>

          {/* Conéctate */}
          <TouchableOpacity
            style={[dashboard_styles.gridItem, dashboard_styles.grayItem]}
            onPress={() =>
              navigation.navigate('Conectate', { idUsuario, idPartido })
            }
          >
            <Image
              source={require('../../assets/iconos/CONECTATE.png')}
              style={dashboard_styles.gridIcon}
            />
            <Text style={dashboard_styles.gridText}>Conéctate</Text>
          </TouchableOpacity>
        </View>

        {/* Fila 2 */}
        <View style={dashboard_styles.row}>
          {/* Invita a ser parte del PT */}
          <TouchableOpacity
            style={[dashboard_styles.gridItem, dashboard_styles.grayItem]}
            onPress={() => navigation.navigate('Invitacion')}
          >
            <Image source={logoSource} style={dashboard_styles.gridIcon} />
            <Text style={dashboard_styles.gridText}>Invitación</Text>
          </TouchableOpacity>

          {/* Recargas */}
          <TouchableOpacity
            style={[dashboard_styles.gridItem, dashboard_styles.grayItem]}
            onPress={() => navigation.navigate('Recargas')}
          >
            <Image
              source={require('../../assets/iconos/RECARGAAQUI.png')}
              style={dashboard_styles.gridIcon}
            />
            <Text style={dashboard_styles.gridText}>Recargas</Text>
          </TouchableOpacity>

          {/* Consultar Saldo */}
          <TouchableOpacity
            style={[dashboard_styles.gridItem, dashboard_styles.grayItem]}
            onPress={() =>
              navigation.navigate('ConsultarSaldo', { idUsuario, idPartido })
            }
          >
            <Image
              source={require('../../assets/iconos/CONSULTAR SALDO.png')}
              style={dashboard_styles.gridIcon}
            />
            <Text style={dashboard_styles.gridText}>Consultar Saldo</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Componente de Banners */}
      <Banners idPartido={idPartido} />

      <ErrorModal
        visible={errorModalVisible}
        message={errorMessage}
        onClose={() => {
          setErrorModalVisible(false)
          navigation.replace('Login')
        }}
      />
    </ImageBackground>
  )
}
