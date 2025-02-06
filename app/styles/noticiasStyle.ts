import {StyleSheet } from 'react-native'


const noticias_styles = StyleSheet.create({
 container: {
   flex: 1,
   padding: 16,
 },
 subcontainer: {
   flexDirection: 'row',
   justifyContent: 'space-between',
   alignItems: 'center',
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
 title: {
   fontSize: 24,
   fontWeight: 'bold',
   color: '#FFFFFF',
   textAlign: 'center',
   marginBottom: 20,
 },
 picker: {
   backgroundColor: '#FFFFFF',
   marginVertical: 10,
   borderRadius: 10,
 },
 list: {
   paddingBottom: 16,
 },
 card: {
   backgroundColor: '#FFFFFF',
   borderRadius: 10,
   padding: 16,
   marginBottom: 20,
 },
 cardTitle: {
   fontSize: 18,
   fontWeight: 'bold',
   marginBottom: 10,
 },
 cardImage: {
   width: '100%',
   height: 200,
   borderRadius: 10,
   marginBottom: 10,
 },
 cardDescription: {
   fontSize: 14,
   color: '#757575',
   marginBottom: 10,
 },
 readMore: {
   color: '#1E88E5',
   fontSize: 14,
   fontWeight: 'bold',
   marginBottom: 10,
 },
 reactions: {
   flexDirection: 'row',
   justifyContent: 'space-between',
   alignItems: 'center',
   marginBottom: 10,
 },
 reaction: {
   flexDirection: 'row',
   alignItems: 'center',
 },
 reactionCount: {
   marginLeft: 5,
   fontSize: 14,
   color: '#757575',
 },
 errorText: {
   color: 'white',
   fontSize: 16,
   textAlign: 'center',
   marginBottom: 20,
 },
})

export default noticias_styles