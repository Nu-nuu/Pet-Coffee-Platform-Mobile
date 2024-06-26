import {StyleSheet} from 'react-native';
import { COLORS } from '../../../constants';

export const styles = StyleSheet.create({
  bigBox: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: '#e6e6e6',
  },
  smallBox: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    paddingBottom: 30,
    paddingTop: 30,
    width:"92%"
  },
  heading: {color: COLORS.primary, fontSize: 20},
  desc: {
    color: 'gray',
    fontSize: 16,
    marginTop: 5,
    marginBottom: 10,
    textAlign: 'center',
  },
  passIcon: {
    position: 'absolute',
    right: 10,
    height: '100%',
    justifyContent: 'center',
    marginTop: 4,
  },
  loginBtn: {
    borderRadius: 10,
    elevation: 2,
    padding:10
  },
  validationError: {
    color: 'red',
    fontWeight: 'bold',
    marginTop:3
  },
  flexContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 20,
  },
  divideLine: {
    height: 1,
    width: '35%',
    backgroundColor: '#8b8b8b',
  },
  orText: {
    color: '#8b8b8b',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    padding: 10,
    elevation: 2, // Add elevation for a subtle shadow
  },
  googleImage: {
    width: 30,
    height: 30,
    marginRight: 5,
  },
  googleText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
