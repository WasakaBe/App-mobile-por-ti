import { Dimensions, StyleSheet } from 'react-native'
const { width, height } = Dimensions.get('window')

// Estilos
const conectate_styles = StyleSheet.create({
  cardConectate: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    overflow: 'hidden',
  },

  subRutaImagen: {
    width: '100%',
    height: 350,
    position: 'relative',
  },
  ruta_imagen: {
    width: '100%',
    height: '100%',
    objectFit: 'fill',
  },

  botonmas: {
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
  },
  createPostButton: {
    backgroundColor: '#2ecc71',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  createPostText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  userTextContainer: {
    marginLeft: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  time: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
    width: 170,
  },
  moreButton: {
    padding: 8,
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 160,
  },
  interactionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  leftButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  interactionText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  commentsPreview: {
    padding: 16,
    backgroundColor: '#F8F8F8',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  commentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  viewAll: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  comment: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentUsername: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  commentText: {
    fontSize: 14,
    color: '#444',
    marginTop: 2,
  },
  content: {
    padding: 16,
  },
  caption: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
  },
  readMore: {
    color: '#666',
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  noCommentsContainer: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  noCommentsText: {
    fontSize: 14,
    color: '#777',
    fontStyle: 'italic',
  },
})
export default conectate_styles
