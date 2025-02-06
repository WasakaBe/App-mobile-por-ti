import { StyleSheet, Dimensions } from 'react-native'
const reporte_ciudadano_styles = StyleSheet.create({
 container: {
   flex: 1,
   padding: 16,
 },
 header: {
   flexDirection: 'row',
   justifyContent: 'space-between',
   alignItems: 'center',
   marginBottom: 16,
 },
 backButton: {
   flexDirection: 'row',
   alignItems: 'center',
 },
 backText: {
   color: '#FFFFFF',
   fontSize: 16,
   marginLeft: 8,
 },
 createButton: {
   backgroundColor: '#1E88E5',
   paddingHorizontal: 16,
   paddingVertical: 8,
   borderRadius: 8,
 },
 createButtonText: {
   color: '#FFFFFF',
   fontSize: 14,
   fontWeight: 'bold',
 },
 searchContainer: {
   backgroundColor: '#FFFFFF',
   borderRadius: 10,
   padding: 16,
   marginBottom: 16,
 },
 searchTitle: {
   fontSize: 18,
   fontWeight: 'bold',
   marginBottom: 10,
 },
 searchFields: {
   marginBottom: 10,
 },
 picker: {
   height: 60,
   marginBottom: 10,
 },
 dateInputContainer: {
   flexDirection: 'row',
   justifyContent: 'space-between',
 },
 dateInput: {
   flex: 1,
   borderWidth: 1,
   borderColor: '#E0E0E0',
   borderRadius: 8,
   paddingHorizontal: 10,
   marginHorizontal: 5,
 },
 searchButton: {
   backgroundColor: '#1E88E5',
   paddingVertical: 8,
   borderRadius: 8,
   alignItems: 'center',
 },
 searchButtonText: {
   color: '#FFFFFF',
   fontSize: 14,
   fontWeight: 'bold',
 },
 content: {
   paddingBottom: 16,
 },
 card: {
   backgroundColor: '#FFFFFF',
   borderRadius: 10,
   marginBottom: 16,
   padding: 16,
 },
 cardTitle: {
   fontSize: 18,
   fontWeight: 'bold',
   marginBottom: 10,
 },
 cardImage: {
   width: '100%',
   height: 150,
   borderRadius: 8,
   marginBottom: 10,
 },
 cardCategory: {
   fontSize: 14,
   color: '#757575',
   fontStyle: 'italic',
   marginBottom: 6,
 },
 cardDate: {
   fontSize: 14,
   color: '#757575',
   marginBottom: 6,
 },
 cardDescription: {
   fontSize: 14,
   color: '#757575',
   marginBottom: 10,
 },
 cardFooter: {
   flexDirection: 'row',
   alignItems: 'center',
 },
 cardStatus: {
   fontSize: 14,
   marginLeft: 8,
 },
})


export default reporte_ciudadano_styles