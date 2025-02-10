import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

// Función para tomar una foto
export const handleTakePhoto = async (setImageUri: React.Dispatch<React.SetStateAction<string | null>>) => {
  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 1,
  });

  if (!result.canceled) {
    setImageUri(result.assets[0].uri);
  }
};

// Función para seleccionar una imagen de la galería
export const handleSelectImage = async (setImageUri: React.Dispatch<React.SetStateAction<string | null>>) => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 1,
  });

  if (!result.canceled) {
    setImageUri(result.assets[0].uri);
  }
};

// Función para obtener la ubicación actual y los detalles
export const handleGetLocation = async (
  setCurrentLocation: React.Dispatch<React.SetStateAction<{ latitude: number; longitude: number } | null>>,
  setLocationDetails: React.Dispatch<
    React.SetStateAction<{
      city: string;
      region: string;
      country: string;
      street: string;
    } | null>
  >
) => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permiso de ubicación denegado');
    return;
  }

  const location = await Location.getCurrentPositionAsync({});
  setCurrentLocation({
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  });

  const geocode = await Location.reverseGeocodeAsync({
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  });

  if (geocode.length > 0) {
    const { city, region, country, street } = geocode[0];
    setLocationDetails({
      city: city || 'No disponible',
      region: region || 'No disponible',
      country: country || 'No disponible',
      street: street || 'No disponible',
    });
  }
};
