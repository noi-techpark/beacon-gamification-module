import React from 'react';
import { Image, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import { material, materialColors } from 'react-native-typography';
import { useNavigation } from 'react-navigation-hooks';
import { PatternBackground } from '../../common/PatternBackground';
import { translate } from '../../localization/locale';
import { ScreenKeys } from '../../screens';
import { requestFineLocationPermission } from '../../utils/permissions';

const Onboarding = () => {
  const navigation = useNavigation();

  async function onStartOnboardingPressed() {
    const hasPermissions = await requestFineLocationPermission();

    if (hasPermissions) {
      navigation.navigate(ScreenKeys.Register);
    }
  }

  return (
    <PatternBackground>
      <View style={styles.root}>
        {/* <Image
          source={require('../../images/sudtirol_logo.png')}
          style={{ alignSelf: 'center', marginTop: -10 }}
          resizeMode="center"
        /> */}
        <Image
          source={require('../../images/beacon_logo.png')}
          style={{ alignSelf: 'center', marginTop: 32 }}
          resizeMode="center"
        />
        <View style={{ padding: 16 }}>
          <Text style={styles.title}>{translate('welcome')}</Text>
          <Text style={{ ...material.body1Object, marginTop: 12, marginBottom: 32 }}>{translate('onboarding')}</Text>
          <Button onPress={onStartOnboardingPressed} mode="contained" dark={true}>
            {translate('start')}
          </Button>
        </View>
      </View>
    </PatternBackground>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
    justifyContent: 'space-between'
  },
  title: {
    ...material.display2Object,
    fontFamily: 'SuedtirolPro-Regular',
    color: materialColors.blackSecondary
  }
});

Onboarding.navigationOptions = {
  header: null
};

export default Onboarding;
