import {StyleSheet} from 'react-native';
import {COLORS} from '../../../constants';

export const styles = StyleSheet.create({
  bigBox: {
    backgroundColor: '#e6e6e6',
    paddingTop: 10,
  },
  smallBox: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    paddingBottom: 30,
    paddingTop: 30,
    width: '92%',
    marginBottom:30
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
    elevation: 5,
    padding: 10,
    marginTop: 30,
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
  flex: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 30,
    marginTop: 30,
  },
});
