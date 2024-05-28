module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    //nếu qr code không được
    // {
    //   globals: ['__scanCodes'],
    // },
  ],
};
