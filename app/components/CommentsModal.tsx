import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'

type Comentario = {
  ComentarioID: number
  NombreUsuario: string
  Comentario: string
}

type CommentsModalProps = {
  modalVisible: boolean
  setModalVisible: (visible: boolean) => void
  comentarios: Comentario[]
  sinComentarios: boolean
}

const CommentsModal: React.FC<CommentsModalProps> = ({
  modalVisible,
  setModalVisible,
  comentarios,
  sinComentarios,
}) => {
  return (
    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.modalTitle}>Comentarios</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          {/* Comentarios */}
          {sinComentarios ? (
            <Text style={styles.noCommentsText}>
              Sin comentarios, sé el primero en comentar
            </Text>
          ) : (
            <FlatList
              data={comentarios}
              renderItem={({ item }) => (
                <View style={styles.comment}>
                  <Ionicons name="person-circle" size={30} color="#FFF" />
                  <View style={styles.commentContent}>
                    <Text style={styles.commentUser}>{item.NombreUsuario}</Text>
                    <Text style={styles.commentText}>{item.Comentario}</Text>
                  </View>
                </View>
              )}
              keyExtractor={(item) => item.ComentarioID.toString()}
              contentContainerStyle={styles.commentsList}
            />
          )}

          {/* Input para nuevo comentario */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Escribe tu comentario aquí..."
              placeholderTextColor="#AAA"
            />
            <TouchableOpacity style={styles.sendButton}>
              <Ionicons name="send" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    marginHorizontal: 30,
    marginVertical: 30,
    backgroundColor: '#333',
    borderRadius: 10,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#444',
    padding: 15,
  },
  modalTitle: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  noCommentsText: {
    fontSize: 16,
    color: '#AAA',
    textAlign: 'center',
    marginTop: 20,
  },
  commentsList: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  comment: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  commentContent: {
    marginLeft: 10,
    flex: 1,
  },
  commentUser: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  commentText: {
    color: '#FFF',
    fontSize: 14,
    marginTop: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#444',
    padding: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#555',
    color: '#FFF',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    fontSize: 14,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#1E88E5',
    borderRadius: 20,
    padding: 10,
  },
})

export default CommentsModal
