import { StyleSheet, Dimensions } from 'react-native'
// Estilos
const reporte_ciudadano_styles = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: 'cover',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    flex: 1,
  },
  userInfo: {
    marginVertical: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 15,
    borderRadius: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  value: {
    fontSize: 16,
    color: '#d9d9d9',
  },
  content: {
    flex: 1,
  },
  infoText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
  listaReportes: {
    flex: 1,
  },
  reporteCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  reporteCategoria: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d9534f', // Color rojo similar al diseño
    padding: 10,
  },
  reporteImagen: {
    width: '100%',
    height: 280,
    objectFit: 'fill',
  },
  reporteTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 10,
    marginHorizontal: 10,
  },
  reporteDescripcion: {
    fontSize: 16,
    color: '#555',
    marginHorizontal: 10,
    marginBottom: 10,
  },
  reporteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    padding: 10,
  },
  reporteDependencia: {
    fontSize: 14,
    color: '#888',
  },
  reporteFecha: {
    fontSize: 14,
    color: '#888',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
    width: 100,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    width: '90%',
    height: '95%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  imagePreviewContainer: {
    marginTop: 10,
    alignItems: 'center',
    width: '100%',
    height: 100,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    marginBottom: 10,
    objectFit: 'fill',
  },

  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    backgroundColor: '#007BFF',
    height: 40,
  },
  modalActionsEnd: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
  },
  modalButtonEnd: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    backgroundColor: '#007BFF',
    height: 40,
    marginTop: 30,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 18,
    width: '100%',
    textAlign: 'center',
  },
  modalButtonUbicacion: {
    padding: 10,
    borderRadius: 5,
    width: '100%',
    backgroundColor: 'blue',
    height: 40,
    marginBottom: 10,
  },
  modalButtonTextUbicacion: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  imageActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
    width: '100%',
    height: 60,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  locationContainer: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    height: 200, // Ajusta la altura según sea necesario
    width: '100%',
  },
  map: {
    width: '100%',
    height: '100%', // Ajusta la altura según sea necesario
    borderRadius: 10,
  },

  locationText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  confirmExitContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semi-transparente
  },
  confirmExitContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff', // Fondo blanco
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // Para sombra en Android
  },
  confirmExitText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  confirmExitActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  confirmExitButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    backgroundColor: '#d9534f', // Rojo para el botón
    borderRadius: 5,
    alignItems: 'center',
  },
  confirmExitButtonText: {
    color: '#fff', // Texto blanco
    fontSize: 16,
    fontWeight: 'bold',
  },
})

export default reporte_ciudadano_styles
