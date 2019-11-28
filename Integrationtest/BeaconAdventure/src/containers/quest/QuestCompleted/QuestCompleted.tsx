import LottieView from 'lottie-react-native';
import React, { useState } from 'react';
import { Animated, Easing, ImageBackground, StyleSheet, View } from 'react-native';
import { useBackHandler } from 'react-native-hooks';
import LinearGradient from 'react-native-linear-gradient';
import { Button, Text } from 'react-native-paper';
import { material } from 'react-native-typography';
import { NavigationScreenComponent, NavigationScreenProps } from 'react-navigation';
import { useNavigation, useNavigationEvents, useNavigationParam } from 'react-navigation-hooks';
import { NavigationStackOptions } from 'react-navigation-stack';
import { PointsTotal } from '../../../components/PointsTotal';
import { DEFAULT_QUEST_IMAGE_URL } from '../../../config';
import { useAnimation } from '../../../hooks/useAnimation';
import { translate } from '../../../localization/locale';
import { Quest } from '../../../models/quest';
import { ScreenKeys } from '../../../screens';
import { Colors } from '../../../styles/colors';

interface IQuestCompletedProps extends NavigationScreenProps {
  // ... other props
}

const FOOTER_HEIGHT = 68;
const BACKGROUND_IMAGE_HEIGHT = 348;
const GRADIENT_PADDING_TOP = 265;

const QuestCompleted: NavigationScreenComponent<NavigationStackOptions, IQuestCompletedProps> = () => {
  const navigation = useNavigation();
  const quest: Quest = useNavigationParam('quest');
  const points: number = useNavigationParam('points');
  const [isScreenAppearing, setScreenAppearing] = useState(false);
  const [isTransitionCompleted, setCompleted] = useState(false);

  useBackHandler(() => {
    navigation.navigate(ScreenKeys.Home);
    return true;
  });

  useNavigationEvents(evt => {
    if (evt.type === 'willFocus') {
      setScreenAppearing(true);
    } else if (evt.type === 'willBlur') {
      setScreenAppearing(false);
    } else if (evt.type === 'didFocus') {
      setCompleted(true);
    }
  });

  const opacity = useAnimation({
    doAnimation: isScreenAppearing,
    duration: 180
  });

  const confettiAnimation = useAnimation({
    doAnimation: isTransitionCompleted,
    duration: 5000,
    easing: Easing.out(Easing.poly(1.5))
  });

  const onFinishQuestPressed = () => {
    navigation.navigate(ScreenKeys.QuestPreview);
  };

  return (
    <>
      <Animated.Image
        source={{
          uri: quest.image || DEFAULT_QUEST_IMAGE_URL
        }}
        resizeMode="cover"
        style={[styles.absoluteFill, { height: BACKGROUND_IMAGE_HEIGHT, opacity }]}
      />
      <LinearGradient
        colors={['rgba(51,51,51,0.48)', Colors.WHITE_048, Colors.WHITE]}
        locations={[0, 0.18, 0.4]}
        style={[styles.absoluteFill, { paddingTop: GRADIENT_PADDING_TOP, alignItems: 'center' }]}
      >
        <ImageBackground
          source={require('../../../images/points_pattern_big.png')}
          resizeMode="contain"
          style={{ flex: 1, paddingHorizontal: 16 }}
        >
          <Text style={styles.title}>{`${translate('quest_completed', { quest_name: quest.name })} 👍🏼`}</Text>
          <PointsTotal points={points} />
        </ImageBackground>
      </LinearGradient>
      <View style={styles.absoluteFill}>
        <LottieView
          source={require('../../../animations/confetti.json')}
          progress={confettiAnimation}
          resizeMode="cover"
        />
      </View>
      <View style={styles.footer}>
        <Button mode="contained" dark={true} style={{ width: '100%' }} onPress={onFinishQuestPressed}>
          {translate('finish_quest')}
        </Button>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1
  },
  absoluteFill: {
    height: '100%',
    width: '100%',
    position: 'absolute'
  },
  fill: {
    height: '100%',
    width: '100%'
  },
  title: {
    ...material.headlineObject,
    fontFamily: 'SuedtirolPro-Regular',
    paddingHorizontal: 24,
    marginTop: BACKGROUND_IMAGE_HEIGHT - GRADIENT_PADDING_TOP + 18,
    marginBottom: 72,
    textAlign: 'center',
    color: Colors.BLACK
  },
  footer: {
    height: FOOTER_HEIGHT,
    width: '100%',
    justifyContent: 'center',
    position: 'absolute',
    paddingHorizontal: 16,
    bottom: 0
  }
});

QuestCompleted.navigationOptions = {
  headerTransparent: true,
  headerTintColor: Colors.WHITE,
  headerLeft: null
};

export default QuestCompleted;
