import React from 'react';
import { AppRegistry } from 'react-native';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import App from './App';
import SuedtirolGuideStore from './src/utils/guideSingleton';
import { name as appName } from './app.json';
import { Colors } from './src/styles/colors';

console.disableYellowBox = true;

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.SUDTIROL_GREEN,
    background: Colors.WHITE
  }
};

export default function Main(props) {
  SuedtirolGuideStore.getInstance().setUserLocale(props.beacon_adventure_quest_locale || 'de');
  SuedtirolGuideStore.getInstance().setUserEmail(props.beacon_adventure_user_email || '');

  return (
    <PaperProvider theme={theme}>
      <App />
    </PaperProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
