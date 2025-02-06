import { StyleSheet } from 'react-native'

const promociones_descuentos_styles = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: 'cover',
  },
  scrollContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  titleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20, // Espaciado alrededor del título
  },
  titleText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  coupon: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 16,
    width: '90%',
    marginBottom: 15,
    position: 'relative',
  },
  divider: {
    width: '80%',
    height: 2,
    backgroundColor: '#FFFFFF',
    marginVertical: 10,
  },
  logo_cupon: {
    width: 80,
    height: 40,
    resizeMode: 'contain',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6F00',
  },
  actionButton: {
    borderWidth: 1,
    borderColor: '#FF6F00',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  actionText: {
    color: '#FF6F00',
    fontWeight: 'bold',
  },
  dashedLine: {
    borderBottomWidth: 1,
    borderColor: 'black',
    borderStyle: 'dashed',
    marginVertical: 8,
  },
  cardBody: {
    marginTop: 8,
  },
  cardDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  cardExpiry: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF6F00',
    textAlign: 'right',
  },
})
export default promociones_descuentos_styles
