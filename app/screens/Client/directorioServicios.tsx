import React, { useState } from 'react'
import {
  Text,
  ImageBackground,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
} from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { getBackgroundByIdPartido } from '@/app/constants/partidoBackgrounds'
import Banners from '@/app/components/banners'

// Datos con iconos y avatares dinámicos
const data = [
  {
    id: 1,
    title: 'CARPINTERO',
    name: 'José Luis Uribe Zárate',
    address: 'C. De Los Pinos 234, Col. Álamos 1',
    location: 'Los Mochis, Sin.',
    icon: '🪚', // Icono para carpintero
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg', // Avatar de prueba
  },
  {
    id: 2,
    title: 'ELECTRICISTA',
    name: 'Daniel Alfaro Rosas',
    address: 'Misioneros 23, Las Misiones',
    location: 'Los Mochis, Sin.',
    icon: '🔌', // Icono para electricista
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
  },
  {
    id: 3,
    title: 'TAPICERO',
    name: 'Martín Lerma Ochoa',
    address: 'Agua Azul 14, Vista Hermosa',
    location: 'Los Mochis, Sin.',
    icon: '🪑', // Icono para tapicero
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
  },
  {
    id: 4,
    title: 'PINTOR',
    name: 'Cristian Salas Gómez',
    address: 'Geranios 254, Jardines del Sol',
    location: 'Los Mochis, Sin.',
    icon: '🎨', // Icono para pintor
    avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
  },
  {
    id: 5,
    title: 'TABLA ROCA Y ALUMINIO',
    name: 'Gabriela Rojas Quintana',
    address: 'C. De Los Pinos 234, Col. Álamos 1',
    location: 'Los Mochis, Sin.',
    icon: '🏗️', // Icono para tabla roca
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
  },
  {
    id: 6,
    title: 'DENTISTA',
    name: 'Dr. Pablo Osuna Castro',
    address: 'Rosales 223, Centro',
    location: 'Los Mochis, Sin.',
    icon: '🦷', // Icono para dentista
    avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
  },
]

export default function DirectorioServicios({ route, navigation }: any) {
  const [idPartido, setIdPartido] = useState<number>(5) // ID predeterminado del partido
  const [selectedService, setSelectedService] = useState<string>('ALL') // Estado del filtro

  // Filtrar los datos según el servicio seleccionado
  const filteredData =
    selectedService === 'ALL'
      ? data
      : data.filter((item) => item.title === selectedService)

  return (
    <ImageBackground
      source={getBackgroundByIdPartido(idPartido)}
      style={styles.background}
    >
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>Regresar</Text>
        </TouchableOpacity>
        <Text style={styles.header}>DIRECTORIO DE SERVICIOS</Text>
      </View>

      {/* Filtro de servicios */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filtrar por servicio:</Text>
        <Picker
          selectedValue={selectedService}
          onValueChange={(itemValue) => setSelectedService(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Todos los servicios" value="ALL" />
          <Picker.Item label="Carpintero" value="CARPINTERO" />
          <Picker.Item label="Electricista" value="ELECTRICISTA" />
          <Picker.Item label="Tapicero" value="TAPICERO" />
          <Picker.Item label="Pintor" value="PINTOR" />
          <Picker.Item
            label="Tabla Roca y Aluminio"
            value="TABLA ROCA Y ALUMINIO"
          />
          <Picker.Item label="Dentista" value="DENTISTA" />
        </Picker>
      </View>

      {/* Lista de servicios */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {filteredData.map((item) => (
          <View key={item.id} style={styles.card}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>
                {item.icon} {item.title}
              </Text>
              <Text style={styles.cardName}>{item.name}</Text>
              <Text style={styles.cardAddress}>{item.address}</Text>
              <Text style={styles.cardLocation}>{item.location}</Text>
            </View>
            <TouchableOpacity style={styles.iconContainer}>
              <Image
                source={{
                  uri: 'https://i.pinimg.com/736x/bf/8a/76/bf8a76719f900b8757154eb3cfbc844a.jpg',
                }}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      {/* Componente de Banners */}
      <Banners idPartido={idPartido} />
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  headerContainer: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: '#FF6F00',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6F00',
  },
  filterContainer: {
    margin: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  filterLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  picker: {
    width: '100%',
    height: 80,
  },
  scrollContainer: {
    padding: 10,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6F00',
    marginBottom: 5,
  },
  cardName: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  cardAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  cardLocation: {
    fontSize: 14,
    color: '#666',
  },
  iconContainer: {
    marginLeft: 10,
  },
  icon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    borderRadius: 50,
  },
})
