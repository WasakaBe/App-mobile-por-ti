import { StyleSheet, Dimensions } from 'react-native'

const { width } = Dimensions.get('window') // Obtener ancho de la pantalla

const dashboard_styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  header: {
    marginTop: 50,
    alignItems: 'center',
  },
  userPhoto: {
    width: 80,
    height: 80,
    borderRadius: 4,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  logo: {
    width: 300,
    height: 80,
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  phoneText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  divider: {
    width: '100%',
    height: 2,
    backgroundColor: '#FFFFFF',
    marginVertical: 10,
  },
  gridContainer: {
    marginTop: 20,
    flexDirection: 'column',
    alignItems: 'center',
    width: width,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    width: width,
  },
  gridItem: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  highlightedItem: {
    backgroundColor: '#FFC107', // Amarillo-Naranja
    width: 230,
    height: 130,
  },
  grayItem: {
    backgroundColor: '#D3D3D3', // Gris
    width: 150,
    height: 150,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  gridIconRow: {
    width: 50,
    height: 70,
  },
  gridIcon: {
    width: 70,
    height: 70,
  },
  gridText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    marginTop: 10,
  },
  gridTextHighlighted: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    marginTop: 10,
  },
})

export default dashboard_styles
