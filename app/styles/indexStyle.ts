import { StyleSheet } from 'react-native'

const index_styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: '#080825', // Fondo minimalista oscuro
 },
 logoContainer: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center',
 },
 logo: {
   width: 200,
   height: 100,
 },
 footer: {
   paddingHorizontal: 20,
   alignItems: 'center',
   paddingBottom: 30, // Espacio inferior
   marginBottom: 30,
 },
 phrase: {
   fontSize: 16,
   color: 'white',
   textAlign: 'center',
   marginBottom: 20,
   fontStyle: 'italic',
 },
 button: {
   flexDirection: 'row',
   alignItems: 'center',
   backgroundColor: '#1E88E5', // Azul moderno
   paddingVertical: 14,
   paddingHorizontal: 28,
   borderRadius: 15,
   elevation: 5, // Sombra para Android
   shadowColor: '#000', // Sombra para iOS
   shadowOffset: { width: 0, height: 4 },
   shadowOpacity: 0.3,
   shadowRadius: 4,
 },
 buttonText: {
   color: 'white',
   fontSize: 18,
   fontWeight: 'bold',
   marginRight: 10,
 },
})

export default index_styles