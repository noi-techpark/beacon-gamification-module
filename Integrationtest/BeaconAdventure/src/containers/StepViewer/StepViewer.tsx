import to from 'await-to-js';
import find from 'lodash.find';
import LottieView from 'lottie-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Image, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { useBackHandler } from 'react-native-hooks';
import LinearGradient from 'react-native-linear-gradient';
import Mixpanel from 'react-native-mixpanel';
import { Button } from 'react-native-paper';
import { material } from 'react-native-typography';
import { StackActions } from 'react-navigation';
import { useNavigation, useNavigationParam } from 'react-navigation-hooks';
import { getBeaconMetadataById } from '../../api/beacons';
import { postAddPoints, postRemovePoints } from '../../api/quests';
import { AnimatedLinearGradient } from '../../common/AnimatedLinearGradient';
import PlatformTouchable from '../../common/PlatformTouchable/PlatformTouchable';
import BeaconLocalizer from '../../components/BeaconLocalizer/BeaconLocalizer';
import { QuestionContainer } from '../../components/QuestionContainer';
import { DEFAULT_QUEST_IMAGE_URL } from '../../config';
import { useAnimation } from '../../hooks/useAnimation';
import { useContentChangeAnimation } from '../../hooks/useContentChangeAnimation';
import { useDiscoveredBeacons } from '../../hooks/useDiscoveredBeacons';
import { translate } from '../../localization/locale';
import { Beacon, BeaconMedata } from '../../models/beacon';
import { Quest, QuestionMetadata, QuestStep } from '../../models/quest';
import { ScreenKeys } from '../../screens';
import { Colors } from '../../styles/colors';
import { MixpanelKeys } from '../../utils/analytics';
import SuedtirolGuideStore from '../../utils/guideSingleton';
import { getLetterFromAlphabetByIndex, isMaxRetryReached, isQuestionWithTextInput } from '../../utils/uiobjects';

interface IStepViewerProps {}

const PADDING_BOTTOM_FIX = 4;
const DESIRED_DISTANCE = 350;
const FOOTER_SHADOW_DISTANCE = 35;
const FOOTER_HEIGHT = 92 + 48; // 48 is skip button margin + height
const HEADER_MAX_HEIGHT = DESIRED_DISTANCE + 56 + PADDING_BOTTOM_FIX + StatusBar.currentHeight - 12; // DO NOT ASK PLS
const HEADER_MIN_HEIGHT = 56 + StatusBar.currentHeight;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
const SLIDE_OUT_ANIMATION_DURATION = 250;
const SLIDE_IN_ANIMATION_DURATION = 500;

const StepViewer = () => {
  const navigation = useNavigation();
  const quest: Quest = useNavigationParam('quest');
  const stepId: number = useNavigationParam('stepId');
  const token: string = useNavigationParam('token');
  const userId: number = useNavigationParam('userId');
  const currentPoints: number = useNavigationParam('points') || 0;
  const discoveredBeacons = useDiscoveredBeacons();
  const step = quest.steps.find(s => s.quest_index === stepId);
  const isMultiQuestionForStep = step.type === 'multi';

  const [isStepCompleted, setStepCompleted] = useState<boolean>(false);

  const [targetBeacon, setTargetBeacon] = useState<BeaconMedata>();
  const [beaconFound, setBeaconFound] = useState<Beacon | undefined>(undefined);

  const [showQuestion, setShowQuestion] = useState<boolean>(false);
  const [isHeaderTransition, setHeaderTransition] = useState<boolean>(false);
  const [isHeaderFullVisible, setHeaderFullVisible] = useState<boolean>(false);

  const [questIndex, setQuestIndex] = useState<number>(0);
  const [retryTimes, setRetryTimes] = useState<number>(0);

  const question: QuestionMetadata = isMultiQuestionForStep
    ? JSON.parse(step.properties)[questIndex]
    : JSON.parse(step.properties);

  const helpAnimation = useAnimation({
    doAnimation: showQuestion,
    duration: showQuestion ? 1000 : 300,
    delay: showQuestion ? 5000 : 0
  });

  const scrollRef = useRef<ScrollView>();
  const textInputRef = useRef<TextInput>();
  const scrollY = new Animated.Value(0);
  scrollY.addListener(({ value }) => {
    setHeaderFullVisible(value >= HEADER_SCROLL_DISTANCE);
  });

  const [opacityMainContent, translateYMainContent] = useContentChangeAnimation({
    doAnimation: showQuestion,
    duration: SLIDE_OUT_ANIMATION_DURATION,
    delay: !showQuestion ? SLIDE_IN_ANIMATION_DURATION : 0,
    callback: () => {
      if (!showQuestion && isHeaderTransition) {
        setHeaderTransition(false);
      }
    }
  });
  const [opacitySecondayContent, translateSecondaryContent] = useContentChangeAnimation({
    doAnimation: showQuestion,
    scrollDistance: -Dimensions.get('window').height,
    delay: showQuestion ? SLIDE_OUT_ANIMATION_DURATION : 0,
    duration: SLIDE_IN_ANIMATION_DURATION,
    isFadeInverted: true,
    callback: () => {
      if (showQuestion && isQuestionWithTextInput(question)) {
        setTimeout(() => {
          textInputRef.current.focus();
        }, 200);
      }
    }
  });

  const fadeFooter = useAnimation({
    doAnimation: showQuestion,
    delay: !showQuestion ? SLIDE_IN_ANIMATION_DURATION + 200 : 0
  });

  const slideTitle = useAnimation({
    doAnimation: showQuestion,
    delay: showQuestion ? SLIDE_IN_ANIMATION_DURATION : 0
  });

  const initialColors = ['rgba(51,51,51,0.64)', 'rgba(51,51,51,0.6)', Colors.BLACK];
  const finalColors = [Colors.BLACK, 'rgba(51,51,51,0.8)', Colors.BLACK];

  const headerHeight = isHeaderFullVisible
    ? HEADER_MIN_HEIGHT
    : scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
        extrapolate: 'clamp'
      });

  const transitionHeaderOpacity = useAnimation({
    doAnimation: showQuestion,
    delay: !isHeaderTransition ? SLIDE_IN_ANIMATION_DURATION : 0
  });

  const headerOpacity = isHeaderFullVisible
    ? 1
    : !isHeaderTransition
    ? scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE * 0.9, HEADER_SCROLL_DISTANCE],
        outputRange: [0, 0, 1],
        extrapolate: 'clamp'
      })
    : transitionHeaderOpacity.interpolate({
        inputRange: [0, 0.7, 1],
        outputRange: [0, 0, 1]
      });

  useBackHandler(() => {
    if (isStepCompleted) {
      return true;
    }

    if (!navigation.isFocused()) {
      return false;
    } else {
      navigation.navigate(ScreenKeys.QuestPause, {
        onExitPressed: () => {
          navigation.dispatch(
            StackActions.pop({
              n: 2
            })
          );
        }
      });
    }
    return true;
  });

  useEffect(() => {
    if (targetBeacon) {
      const beacon = find(discoveredBeacons, b => b.id === targetBeacon.beacon_id);

      if (beacon && (beacon.range === 'near' || beacon.range === 'immediate')) {
        // if (step.type === 'info') {
        //   // navigation.navigate(ScreenKeys.QuestStepCompleted, { step, onStepCompleted });
        // } else {
        setBeaconFound(beacon);
        // }
      }
    }
  }, [targetBeacon, discoveredBeacons]);

  useEffect(() => {
    const fetchBeacon = async () => {
      setBeaconFound(undefined);

      const [e, targetBeacon] = await to(getBeaconMetadataById(token, step.beacon));

      if (targetBeacon) {
        setTargetBeacon(targetBeacon);

        const alreadyFound = discoveredBeacons.find(b => b.id === targetBeacon.beacon_id);
        if (alreadyFound && (alreadyFound.range === 'near' || alreadyFound.range === 'immediate')) {
          // if (step.type === 'info') {
          //   // navigation.navigate(ScreenKeys.QuestStepCompleted, { step, onStepCompleted });
          // } else {
          setBeaconFound(alreadyFound);
          // }
        }
      }
    };

    fetchBeacon();

    Mixpanel.trackWithProperties(MixpanelKeys.USER_ENTER_STEP_VIEWER, {
      questName: SuedtirolGuideStore.getInstance().getQuestNameByLocale(),
      stepId: stepId,
      stepName: step.name
    });
  }, [stepId]);

  async function onStepCompleted(step: QuestStep, isCorrectAnswer: boolean) {
    if (isMultiQuestionForStep && questIndex < JSON.parse(step.properties).length - 1) {
      setQuestIndex(questIndex + 1);
      setRetryTimes(0);
      navigation.navigate(ScreenKeys.StepViewer, {
        quest,
        stepId: step.quest_index,
        token,
        points: isCorrectAnswer ? currentPoints + step.value_points : currentPoints + step.value_points_error
      });
      return;
    }

    if (step.quest_index < quest.steps.length) {
      setQuestIndex(0);
      setRetryTimes(0);
      setStepCompleted(false);
      setShowQuestion(false);
      setHeaderFullVisible(false);
      setHeaderTransition(false);

      navigation.navigate(ScreenKeys.StepViewer, {
        quest,
        stepId: step.quest_index + 1,
        token,
        points: isCorrectAnswer ? currentPoints + step.value_points : currentPoints + step.value_points_error
      });
    } else {
      setQuestIndex(0);
      setRetryTimes(0);

      setTimeout(() => {
        navigation.navigate(ScreenKeys.QuestFeedback, {
          quest,
          points: isCorrectAnswer ? currentPoints + step.value_points : currentPoints + step.value_points_error
        });
      }, 500);
    }
  }

  async function onRetryStepPressed() {
    setRetryTimes(retryTimes + 1);
  }

  const onSkipStepPressed = (step: QuestStep) => {
    if (step.quest_index < quest.steps.length) {
      if (isQuestionWithTextInput(question)) {
        textInputRef.current.blur();
      }
      setShowQuestion(false);
      setQuestIndex(0);
      setRetryTimes(0);

      Mixpanel.trackWithProperties(MixpanelKeys.USER_SKIPPED_QUESTION, {
        questName: SuedtirolGuideStore.getInstance().getQuestNameByLocale(),
        stepId: stepId,
        stepName: step.name,
        isBeaconFound: beaconFound !== undefined
      });

      navigation.navigate(ScreenKeys.StepViewer, {
        quest,
        stepId: step.quest_index + 1,
        token
      });
    } else {
      setQuestIndex(0);
      setRetryTimes(0);

      setTimeout(() => {
        Mixpanel.trackWithProperties(MixpanelKeys.USER_SKIPPED_QUESTION, {
          questName: SuedtirolGuideStore.getInstance().getQuestNameByLocale(),
          stepId: stepId,
          stepName: step.name,
          isBeaconFound: beaconFound !== undefined
        });

        navigation.navigate(ScreenKeys.QuestFeedback, { quest, points: currentPoints });
      }, 500);
    }
  };

  async function onCorrectAnswer(step: QuestStep) {
    if (userId) {
      const [e, response] = await to(postAddPoints(token, userId, step.value_points));
    }

    setStepCompleted(true);

    Mixpanel.trackWithProperties(MixpanelKeys.STEP_CORRECT_ANSWER, {
      questName: SuedtirolGuideStore.getInstance().getQuestNameByLocale(),
      stepId: stepId,
      stepName: step.name
    });

    navigation.navigate(ScreenKeys.AnswerOutcome, {
      step,
      question,
      onStepCompleted,
      onSkipStepPressed,
      isCorrect: true
    });
  }

  async function onWrongAnswer(step: QuestStep) {
    if (isMaxRetryReached(retryTimes, question)) {
      if (userId) {
        const [e, response] = await to(postRemovePoints(token, userId, step.value_points_error));
      }

      Mixpanel.trackWithProperties(MixpanelKeys.STEP_WRONG_ANSWER, {
        questName: SuedtirolGuideStore.getInstance().getQuestNameByLocale(),
        stepId: stepId,
        stepName: step.name
      });

      setStepCompleted(true);
    }

    navigation.navigate(ScreenKeys.AnswerOutcome, {
      step,
      question,
      onRetryStepPressed,
      onStepCompleted,
      onSkipStepPressed,
      isCorrect: false,
      retryTimes
    });
  }

  function onOpenQuestionPressed() {
    Mixpanel.trackWithProperties(MixpanelKeys.BEACON_READY_SHOW_QUESTION, {
      questName: SuedtirolGuideStore.getInstance().getQuestNameByLocale(),
      stepId: stepId,
      stepName: step.name
    });

    setShowQuestion(true);
    setHeaderTransition(true);
  }

  function onBackPressed() {
    if (showQuestion) {
      if (isQuestionWithTextInput(question)) {
        textInputRef.current.blur();
      }
      setShowQuestion(false);
    }
  }

  function onHelpPressed() {
    navigation.navigate(ScreenKeys.ProvideHelp, { step, question });
  }

  return (
    <>
      <Image
        source={{
          uri: step.image || DEFAULT_QUEST_IMAGE_URL
        }}
        style={[styles.absoluteFill, { height: Dimensions.get('window').height + StatusBar.currentHeight }]}
        resizeMode="cover"
      />
      <AnimatedLinearGradient
        colors={!showQuestion ? initialColors : finalColors}
        locations={[0.15, 0.5, 0.83]}
        style={[styles.absoluteFill, { height: Dimensions.get('window').height + StatusBar.currentHeight }]}
      />
      <View style={styles.fill}>
        <Animated.View
          style={{
            opacity: opacityMainContent,
            transform: [
              {
                translateY: translateYMainContent
              }
            ]
          }}
        >
          <ScrollView
            ref={scrollRef}
            style={{ marginTop: StatusBar.currentHeight }}
            contentContainerStyle={styles.scrollContainer}
            scrollEventThrottle={16}
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }])}
          >
            <Text style={styles.stepTitle}>{step.name}</Text>
            <View style={styles.scrollContent}>
              <Text style={styles.stepDescription}>{step.instructions}</Text>
            </View>
          </ScrollView>
        </Animated.View>
        <Animated.View
          style={[
            styles.footerContainer,
            {
              opacity: fadeFooter.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0]
              })
            }
          ]}
        >
          <LinearGradient colors={['rgba(51,51,51,0)', Colors.BLACK]} locations={[0, 0.3]} style={styles.fill}>
            <View style={styles.footer}>
              <BeaconLocalizer
                beaconFound={beaconFound}
                onOpenQuestionPressed={onOpenQuestionPressed}
                label={question.finder}
              />
              <Button
                onPress={() => onSkipStepPressed(step)}
                mode="text"
                dark={true}
                theme={{
                  colors: {
                    primary: Colors.WHITE
                  }
                }}
                style={{ marginTop: 16 }}
              >
                {translate('skip_question')}
              </Button>
            </View>
          </LinearGradient>
        </Animated.View>
        <Animated.View
          style={[
            styles.scrollSecondaryContent,
            {
              opacity: opacitySecondayContent,
              transform: [
                {
                  translateY: translateSecondaryContent
                }
              ]
            }
          ]}
        >
          <QuestionContainer
            ref={textInputRef}
            step={step}
            question={question}
            questEnumeration={`${step.quest_index}${
              isMultiQuestionForStep ? getLetterFromAlphabetByIndex(questIndex) : ''
            }`}
            onCorrectAnswer={onCorrectAnswer}
            onWrongAnswer={onWrongAnswer}
            onSkipQuestionPressed={onSkipStepPressed}
          />
        </Animated.View>
        <Animated.View
          style={[styles.headerContainer, { height: isHeaderTransition ? HEADER_MIN_HEIGHT : headerHeight }]}
        >
          <Animated.View
            style={[
              styles.header,
              {
                opacity: headerOpacity
              }
            ]}
          />
          {isHeaderTransition && (
            <Animated.View
              style={{
                alignItems: 'center',
                transform: [
                  {
                    translateY: slideTitle.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-56 - StatusBar.currentHeight, 10]
                    })
                  }
                ]
              }}
            >
              <PlatformTouchable style={styles.backContainer} onPress={onBackPressed}>
                <Image source={require('../../images/arrow_up.png')} />
                <Text style={{ ...material.captionObject, color: Colors.WHITE, paddingTop: 8 }}>
                  {translate('back')}
                </Text>
              </PlatformTouchable>
            </Animated.View>
          )}
          {!!question.help && (
            <PlatformTouchable onPress={onHelpPressed} style={styles.helpButtonContainer}>
              <View style={styles.helpButton}>
                <LottieView
                  source={require('../../animations/help.json')}
                  progress={helpAnimation}
                  resizeMode="cover"
                />
              </View>
            </PlatformTouchable>
          )}
        </Animated.View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1
  },
  fill: {
    height: '100%',
    width: '100%'
  },
  absoluteFill: {
    height: '100%',
    width: '100%',
    position: 'absolute'
  },
  stepTitle: {
    ...material.display1Object,
    fontFamily: 'SuedtirolPro-Regular',
    fontSize: 28,
    color: Colors.WHITE,
    marginBottom: PADDING_BOTTOM_FIX
  },
  stepDescription: { ...material.subheadingObject, color: Colors.WHITE },
  scrollContent: {
    paddingTop: 12
  },
  scrollSecondaryContent: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -Dimensions.get('window').height,
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent'
  },
  scrollContainer: {
    paddingTop: DESIRED_DISTANCE,
    paddingHorizontal: 16,
    paddingBottom: FOOTER_HEIGHT + FOOTER_SHADOW_DISTANCE
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingBottom: PADDING_BOTTOM_FIX,
    justifyContent: 'flex-end',
    overflow: 'hidden'
  },
  header: {
    backgroundColor: Colors.BLACK,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_MAX_HEIGHT
  },
  backContainer: { justifyContent: 'center', alignItems: 'center', height: 56, paddingHorizontal: 22 },
  footerContainer: {
    height: FOOTER_HEIGHT + FOOTER_SHADOW_DISTANCE,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  },
  footer: {
    height: FOOTER_HEIGHT,
    width: '100%',
    paddingHorizontal: 16,
    marginTop: FOOTER_SHADOW_DISTANCE
  },
  questionContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16
  },
  helpButtonContainer: {
    width: 32,
    height: 32,
    position: 'absolute',
    top: StatusBar.currentHeight + 14,
    left: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40
  },
  helpButton: {
    position: 'absolute',
    width: 46,
    height: 46,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

StepViewer.navigationOptions = ({ navigation }) => {
  const points: number = navigation.getParam('points') || 0;
  const onBackPressed = () => {
    navigation.navigate(ScreenKeys.QuestPause, {
      onExitPressed: () => {
        navigation.dispatch(
          StackActions.pop({
            n: 2
          })
        );
      }
    });
  };

  return {
    headerTransparent: true,
    headerTintColor: Colors.WHITE,
    headerLeft: (
      <PlatformTouchable
        onPress={onBackPressed}
        style={{
          width: 30,
          height: 30,
          marginHorizontal: 16 + 5,
          marginTop: 36 - StatusBar.currentHeight - 5,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 40
        }}
      >
        <View
          style={{
            position: 'absolute',
            width: 40,
            height: 40,
            borderRadius: 32,
            backgroundColor: Colors.WHITE,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Image source={require('../../images/pause.png')} style={{ width: 16, height: 16 }} />
        </View>
      </PlatformTouchable>
    ),
    headerRight: (
      <View
        style={{
          width: 80,
          height: 32,
          marginHorizontal: 16,
          paddingHorizontal: 12,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 28 - StatusBar.currentHeight,
          borderRadius: 100,
          backgroundColor: Colors.WHITE_024
        }}
      >
        <Image source={require('../../images/star.png')} style={{ width: 16, height: 16 }} />
        <Text style={material.body1White}>{points}</Text>
      </View>
    )
  };
};

export default StepViewer;
