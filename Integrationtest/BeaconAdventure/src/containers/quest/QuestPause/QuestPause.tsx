import React, { useState } from 'react';
import { Animated, Dimensions, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation, useNavigationEvents, useNavigationParam } from 'react-navigation-hooks';
import { useAnimation } from '../../../hooks/useAnimation';
import { translate } from '../../../localization/locale';
import { Colors } from '../../../styles/colors';

const QuestPause = () => {
  const navigation = useNavigation();
  // const step: QuestStep = useNavigationParam('step');
  const mele = useNavigationParam('onContinuePressed');
  const [isScreenAppearing, setScreenAppearing] = useState(false);
  const [isTransitionCompleted, setCompleted] = useState(false);

  useNavigationEvents(evt => {
    if (evt.type === 'willFocus') {
      setScreenAppearing(true);
    } else if (evt.type === 'willBlur') {
      setScreenAppearing(false);
    } else if (evt.type === 'didFocus') {
      setCompleted(true);
    }
  });

  const fadeBackground = useAnimation({
    doAnimation: isScreenAppearing
  });

  const onContinuePressed = () => {
    navigation.goBack();
  };

  async function onRestartPressed() {
    navigation.goBack();
  }

  async function onExitPressed() {
    navigation.goBack();
    navigation.state.params.onExitPressed();
  }

  return (
    <>
      <Animated.View
        style={[
          styles.background,
          {
            opacity: fadeBackground.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1]
            })
          }
        ]}
      />
      <Animated.View
        style={[
          styles.root,
          {
            transform: [
              {
                translateY: fadeBackground.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -Dimensions.get('window').height]
                })
              }
            ]
          }
        ]}
      >
        <Button onPress={onContinuePressed} mode="contained" dark={true} style={{ width: '100%', marginBottom: 12 }}>
          {translate('continue')}
        </Button>
        {/* <Button
          onPress={onRestartPressed}
          mode="text"
          dark={true}
          theme={{
            colors: {
              primary: Colors.WHITE
            }
          }}
          style={{ width: '100%', marginBottom: 12 }}
        >
          {translate('restart')}
        </Button> */}
        <Button
          onPress={onExitPressed}
          mode="text"
          dark={true}
          theme={{
            colors: {
              primary: Colors.WHITE
            }
          }}
          style={{ width: '100%' }}
        >
          {translate('exit_from_game')}
        </Button>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    paddingHorizontal: 16,
    left: 0,
    right: 0,
    bottom: -Dimensions.get('window').height
  },
  background: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(51,51,51,1)',
    position: 'absolute'
  }
});

export default QuestPause;
