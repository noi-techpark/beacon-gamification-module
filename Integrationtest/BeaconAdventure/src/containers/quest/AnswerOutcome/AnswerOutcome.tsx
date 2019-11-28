import LottieView from 'lottie-react-native';
import React, { useState } from 'react';
import { Animated, Dimensions, Easing, Image, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import { material } from 'react-native-typography';
import { useNavigation, useNavigationEvents, useNavigationParam } from 'react-navigation-hooks';
import { useAnimation } from '../../../hooks/useAnimation';
import { translate } from '../../../localization/locale';
import { QuestionMetadata, QuestStep } from '../../../models/quest';
import { Colors } from '../../../styles/colors';
import { isLowerThanMaxRetry, isMaxRetryReached, showValuePointsSigned } from '../../../utils/uiobjects';

const AnswerOutcome = () => {
  const navigation = useNavigation();
  const step: QuestStep = useNavigationParam('step');
  const question: QuestionMetadata = useNavigationParam('question');
  const isCorrect: boolean = useNavigationParam('isCorrect');
  const retryTimes: number = useNavigationParam('retryTimes');
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

  const confettiAnimation = useAnimation({
    doAnimation: isTransitionCompleted,
    duration: 5000,
    easing: Easing.out(Easing.poly(2))
  });

  const fadeConfetti = useAnimation({
    doAnimation: isTransitionCompleted,
    delay: 5800 - 2000
  });

  async function onCloseOutcomePressed() {
    navigation.goBack();
    if (isCorrect || isMaxRetryReached(retryTimes, question)) {
      navigation.state.params.onStepCompleted(step, isCorrect);
    } else {
      navigation.state.params.onRetryStepPressed();
    }
  }

  async function onSkipPressed() {
    navigation.goBack();
    if (navigation.state.params.onSkipStepPressed) {
      navigation.state.params.onSkipStepPressed(step);
    }
  }

  return (
    <>
      <Animated.View
        style={[
          styles.background,
          {
            opacity: fadeBackground.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.7]
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
        <View style={styles.cardContainer}>
          {isCorrect && (
            <LottieView
              source={require('../../../animations/confetti.json')}
              progress={confettiAnimation}
              resizeMode="cover"
            />
          )}
          {isCorrect && (
            <Animated.Image
              source={require('../../../images/confetti_win.png')}
              style={[
                styles.confetti,
                {
                  opacity: fadeConfetti
                }
              ]}
              resizeMode="cover"
            />
          )}
          <Text style={styles.title}>{translate(isCorrect ? 'right_answer' : 'wrong_answer')}</Text>
          <Text style={styles.description}>
            {isCorrect
              ? question.correctAnswerMessage || translate('general_correct_answer')
              : question.wrongAnswerMessage || translate('general_wrong_answer')}
          </Text>
          {(isCorrect || isMaxRetryReached(retryTimes, question)) && (
            <View style={styles.pointsContainer}>
              <Image source={require('../../../images/star_gradient.png')} style={{ marginEnd: 8 }} />
              <>
                <Text style={styles.pointsText}>{showValuePointsSigned(step, isCorrect)}</Text>
              </>
            </View>
          )}
          <Button onPress={onCloseOutcomePressed} mode="contained" dark={true} style={{ marginTop: 48 }}>
            {translate(isCorrect || isMaxRetryReached(retryTimes, question) ? 'proceed' : 'retry')}
          </Button>
          {isLowerThanMaxRetry(retryTimes, question) && (
            <Button
              onPress={onSkipPressed}
              mode="text"
              dark={true}
              theme={{
                colors: {
                  primary: Colors.BLACK
                }
              }}
              style={{ marginTop: 12 }}
            >
              {translate('skip_question')}
            </Button>
          )}
        </View>
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
    backgroundColor: Colors.TOTAL_BLACK,
    position: 'absolute'
  },
  confetti: {
    width: Dimensions.get('window').width - 32,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0
  },
  cardContainer: {
    width: '100%',
    minHeight: 240,
    backgroundColor: Colors.WHITE,
    padding: 16,
    borderRadius: 8
  },
  title: {
    ...material.display1Object,
    // fontFamily: 'SuedtirolPro-Regular',
    paddingTop: 40,
    paddingBottom: 8,
    paddingHorizontal: 16,
    color: Colors.TOTAL_BLACK
  },
  description: {
    ...material.subheadingObject,
    paddingHorizontal: 16
  },
  pointsContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    minWidth: 124,
    paddingHorizontal: 30,
    marginTop: 16,
    borderRadius: 100,
    backgroundColor: ' rgba(222, 112, 0, 0.08)',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  pointsText: {
    ...material.display1WhiteObject,
    color: Colors.SUDTIROL_DARK_ORANGE,
    // fontFamily: 'SuedtirolPro-Regular'
  }
});

export default AnswerOutcome;
