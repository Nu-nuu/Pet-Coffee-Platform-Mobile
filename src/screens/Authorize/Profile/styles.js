import { StyleSheet } from "react-native";
import {COLORS, SIZES} from '../../../constants';

export const styles = StyleSheet.create({
    modalImage: {
      width: 350,
      height: 500,
      objectFit: 'contain',
    },
    backgroundImage: {
      width: '100%',
      objectFit: 'cover',
      height: SIZES.height/5,
      marginBottom: 20,
      position: 'relative',
    },
    image: {
      width: 120,
      height: 120,
      borderRadius: 60,
    },
    name: {
      fontWeight: 'bold',
      fontSize: 25,
      color: 'black',
    },
    flexRow: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 30,
    },
    flexColumn: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
    },
    number: {
      fontSize: 19,
      fontWeight: 'bold',
      color: COLORS.primary,
    },
    text: {
      color: 'gray',
      fontSize: 17,
    },
    menuItem: {
      fontSize: 16,
      color: 'black',
    },
    backgroundContainer: {
      position: 'relative',
    },
    menuContainer: {
      position: 'absolute',
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      flexDirection: 'row',
      paddingTop: 30,
      zIndex: 1,
      width: '100%',
    },
    menuBtn: {
      marginRight: 20,
      backgroundColor: 'black',
      padding: 7,
      borderRadius: 7,
    },
  });