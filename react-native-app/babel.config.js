module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@': './src',
          '@components': './src/components',
          '@screens': './src/screens',
          '@assets': './assets',
          '@api': './src/api',
          '@context': './src/context',
          '@utils': './src/utils'
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};