import { Dimensions, StyleSheet } from 'react-native'
const { width } = Dimensions.get('window') // Obtener ancho de la pantalla

const noticias_styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  subcontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 8,
  },
  logo: {
    width: 130,
    height: 30,
    alignSelf: 'center',
    marginBottom: 20,
  },
  loadingIndicator: {
    marginTop: 20,
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    margin: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },

  noticiaTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 5,
    color: '#333',
  },
  noticiaFecha: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
    marginTop: 5,
  },
  noticiaDescripcion: {
    fontSize: 16,
    color: '#444',
    marginBottom: 5,
    marginTop: 5,
  },
  noticiaTipo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  noticiaImagenContainer: {
    padding: 20,
  },
  noticiaImagen: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    objectFit: 'fill',
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  viewComments: {
    color: '#007bff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  actionsCommments: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    height: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    justifyContent: 'space-between', // Espacia el contenido y el input hacia los extremos
  },
  modalsubContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    width: width / 2,
  },
  commentList: {
    flex: 1, // Permite que la lista de comentarios ocupe el espacio restante
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarContainer: {
    marginRight: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  textContainer: {
    flex: 1,
  },
  commentUser: {
    fontWeight: 'bold',
  },
  commentText: {
    fontSize: 14,
  },
  commentfecha: {
    fontSize: 10,
  },
  noComments: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  button_cerrar: {
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: 'red',
    padding: 10,
    width: 40,
  },
  txt_button_cerrar: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  commentInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 14,
    color: '#333',
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#1E88E5',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default noticias_styles
