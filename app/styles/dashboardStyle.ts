import { StyleSheet } from 'react-native'

const dashboard_styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: 'center',
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
    width: 100,
    height: 100,
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
    width: '80%',
    height: 2,
    backgroundColor: '#FFFFFF',
    marginVertical: 10,
  },
  gridContainer: {
    marginTop: 20,
    flexDirection: 'column',
    alignItems: 'center',
    width: '90%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    width: '100%',
  },
  gridItem: {
    width: 100,
    height: 130,
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
    width: 250,
    height: 130,
  },
  grayItem: {
    backgroundColor: '#D3D3D3', // Gris
    width: 170,
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
