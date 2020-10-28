import LottieView from 'lottie-react-native';
import React, { useEffect, useState } from 'react';
import { Animated, Easing, ImageBackground, StyleSheet, View } from 'react-native';
import { useBackHandler } from 'react-native-hooks';
import LinearGradient from 'react-native-linear-gradient';
import { Button, Text, TextInput } from 'react-native-paper';
import { material } from 'react-native-typography';
import { NavigationScreenComponent, NavigationScreenProps } from 'react-navigation';
import { useNavigation, useNavigationEvents, useNavigationParam } from 'react-navigation-hooks';
import { NavigationStackOptions } from 'react-navigation-stack';
import Mixpanel from 'react-native-mixpanel';
import { PointsTotal } from '../../../components/PointsTotal';
import { DEFAULT_QUEST_IMAGE_URL } from '../../../config';
import { useAnimation } from '../../../hooks/useAnimation';
import { translate } from '../../../localization/locale';
import { Quest } from '../../../models/quest';
import { ScreenKeys } from '../../../screens';
import { Colors } from '../../../styles/colors';
import { MixpanelKeys } from '../../../utils/analytics';
import SuedtirolGuideStore from '../../../utils/guideSingleton';
import { ScrollView } from 'react-native-gesture-handler';
import StarRatingBar from 'react-native-star-rating-view';

interface IQuestCompletedProps extends NavigationScreenProps {
  // ... other props
}

const FOOTER_HEIGHT = 68;
const BACKGROUND_IMAGE_HEIGHT = 348;
const GRADIENT_PADDING_TOP = 265;

const QuestFeedback: NavigationScreenComponent<NavigationStackOptions, IQuestCompletedProps> = () => {
  const navigation = useNavigation();
  const quest: Quest = useNavigationParam('quest');
  const points: number = useNavigationParam('points');
  const [isScreenAppearing, setScreenAppearing] = useState(false);
  const [isTransitionCompleted, setCompleted] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [stars, setStarFeedback] = useState(0);

  useBackHandler(() => {
    navigation.navigate(ScreenKeys.QuestPreview);
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

  useEffect(() => {
    Mixpanel.trackWithProperties(MixpanelKeys.USER_ENTER_STEP_FEEDBACK, {
      questName: SuedtirolGuideStore.getInstance().getQuestNameByLocale()
    });
  }, []);

  const opacity = useAnimation({
    doAnimation: isScreenAppearing,
    duration: 180
  });

  const onSendFeedbackAndShowResultPressed = () => {
    Mixpanel.trackWithProperties(MixpanelKeys.USER_FEEDBACK, {
      questName: SuedtirolGuideStore.getInstance().getQuestNameByLocale(),
      feedback,
      stars
    });

    navigation.navigate(ScreenKeys.QuestCompleted, { quest, points });
  };

  const onSkipFeedbackAndShowResultPressed = () => {
    navigation.navigate(ScreenKeys.QuestCompleted, { quest, points });
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
        <ScrollView
          style={{ width: '100%', paddingHorizontal: 32, marginTop: -40 }}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>{translate('how_evaluate_experience')}</Text>
          <View style={{ alignItems: 'center', paddingVertical: 24 }}>
            <StarRatingBar
              readOnly={false}
              spacing={30}
              allowsHalfStars={false}
              accurateHalfStars={false}
              onStarValueChanged={score => {
                setStarFeedback(score);
              }}
            />
          </View>
          <Text style={styles.title}>{translate('give_us_feedback')}</Text>
          <TextInput
            style={{ marginTop: 24 }}
            onChangeText={feedback => setFeedback(feedback)}
            value={feedback}
            multiline={true}
          />
          <Button
            mode="contained"
            dark={true}
            style={{ width: '100%', marginVertical: 12 }}
            onPress={onSendFeedbackAndShowResultPressed}
          >
            {translate('send')}
          </Button>
          <Button mode="text" style={{ width: '100%' }} onPress={onSkipFeedbackAndShowResultPressed}>
            {translate('skip')}
          </Button>
        </ScrollView>
      </LinearGradient>
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
    ...material.titleObject,
    fontFamily: 'SuedtirolPro-Regular',
    paddingHorizontal: 16,
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

QuestFeedback.navigationOptions = {
  headerTransparent: true,
  headerTintColor: Colors.WHITE,
  headerLeft: null
};

export default QuestFeedback;
