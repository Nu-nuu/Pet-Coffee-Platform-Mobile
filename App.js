import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import 'react-native-gesture-handler';
//nếu qrcode không được
// import 'react-native-reanimated';
import React, { useEffect, useState } from 'react';
import Login from './src/screens/Authorize/Login/login';
import Signup from './src/screens/Authorize/Signup/signup';
import Verify from './src/screens/Authorize/Verify/verify';
import ForgotPassword from './src/screens/Authorize/ForgotPassword/forgotPassword';
import InfoSignup from './src/screens/Authorize/InfoSignup/infoSignup';
import AppNavigator from './src/routes/AppNavigator';
import NewPassword from './src/screens/Authorize/NewPassword/newPassword';
import { Provider } from 'react-redux';
import { store } from './src/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LogBox } from 'react-native';
import { NativeBaseProvider, View } from 'native-base';
import Downloading from './src/components/Alert/downloading';


const Stack = createNativeStackNavigator();

export default function App() {
  const [checkLogin, setCheckLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  // const netInfo = useNetInfo();
  // console.log(netInfo.isConnected);

  useEffect(() => {
    checkUserLogin();
    LogBox.ignoreLogs([`ReactImageView: Image source "null" doesn't exist`]);
  }, []);

  const checkUserLogin = async () => {
    try {
      const check = await AsyncStorage.getItem('accessToken');
      const status = await AsyncStorage.getItem('status');
      if (check !== null && status !== `"Verifying"`) {
        setCheckLogin(true);
      }
    } catch (error) {
      console.error('Error reading AsyncStorage:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <NativeBaseProvider>
      {loading ? (
        <View style={{
          flex: 1,
        }}>
          <Downloading />
        </View>
      ) : (
        <Provider store={store}>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName={checkLogin ? 'Welcome' : 'Login'}
              screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Welcome" component={AppNavigator} />
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Signup" component={Signup} />
              <Stack.Screen name="Verify" component={Verify} />
              <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
              <Stack.Screen name="InfoSignup" component={InfoSignup} />
              <Stack.Screen name="NewPassword" component={NewPassword} />
            </Stack.Navigator>
          </NavigationContainer>
        </Provider>
      )}
    </NativeBaseProvider>

  );
}
