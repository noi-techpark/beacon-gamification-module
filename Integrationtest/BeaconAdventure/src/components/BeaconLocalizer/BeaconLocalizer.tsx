import LottieView from 'lottie-react-native';
import React from 'react';
import { Dimensions, StyleSheet, Text, Vibration, View } from 'react-native';
import { Button } from 'react-native-paper';
import { usePrevious } from '../../hooks/usePrevious';
import { translate } from '../../localization/locale';
import { Beacon } from '../../models/beacon';
import { Colors } from '../../styles/colors';

interface IBeaconLocalizerProps {
  beaconFound?: Beacon;
  onOpenQuestionPressed: () => void;
}

const BUTTON_WIDTH = 88;

const BeaconLocalizer: React.FunctionComponent<IBeaconLocalizerProps> = ({ beaconFound, onOpenQuestionPressed }) => {
  const isFound = !usePrevious(beaconFound) && beaconFound;

  if (isFound) {
    Vibration.vibrate(500);
  }

  return (
    <View style={styles.root}>
      <View style={styles.container}>
        <LottieView
          source={require('../../animations/radar.json')}
          autoPlay={!isFound}
          autoSize={true}
          speed={2}
          style={{ width: 48, height: 48 }}
        />
        <Text>Vai all'ingresso della sala per cominciare la sfida!</Text>
      </View>
      <Button
        onPress={onOpenQuestionPressed}
        disabled={!beaconFound}
        mode="contained"
        dark={true}
        style={styles.button}
        contentStyle={styles.fill}
      >
        {translate('start_step')}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    height: 72,
    width: Dimensions.get('window').width - 32,
    backgroundColor: Colors.WHITE,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    width: Dimensions.get('window').width - BUTTON_WIDTH - 32
  },
  fill: {
    height: '100%',
    width: '100%'
  },
  button: {
    width: BUTTON_WIDTH,
    height: 72,
    justifyContent: 'center',
    borderTopStartRadius: 0,
    borderBottomStartRadius: 0
  }
});

export default BeaconLocalizer;
