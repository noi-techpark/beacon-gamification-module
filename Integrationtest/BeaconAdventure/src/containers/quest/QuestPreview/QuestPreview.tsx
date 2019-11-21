import React, { useRef, useState, useEffect } from 'react';
import { Animated, Image, StatusBar, StyleSheet, Text, View } from 'react-native';
import NearbyBeacons from 'react-native-beacon-suedtirol-mobile-sdk';
import { ScrollView } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import { Button, ActivityIndicator } from 'react-native-paper';
import { Transition, Transitioning, TransitioningView } from 'react-native-reanimated';
import { material } from 'react-native-typography';
import { NavigationScreenComponent, NavigationScreenProps } from 'react-navigation';
import { useNavigation, useNavigationEvents, useNavigationParam } from 'react-navigation-hooks';
import { SharedElement } from 'react-navigation-shared-element';
import { NavigationStackOptions } from 'react-navigation-stack';
import { DEFAULT_QUEST_IMAGE_URL } from '../../../config';
import { translate } from '../../../localization/locale';
import { Quest } from '../../../models/quest';
import { ScreenKeys } from '../../../screens';
import { Colors } from '../../../styles/colors';
import to from 'await-to-js';
import { getAuthToken, getUserDetail } from '../../../api/auth';
import { hashCode } from '../../../utils/stringUtils';
import { getQuests } from '../../../api/quests';
import { UserDetail } from '../../../models/user';
import find from 'lodash.find';

interface Props extends NavigationScreenProps {
  // ... other props
}

const PADDING_BOTTOM_FIX = 4;
const DESIRED_DISTANCE = 350;
const FOOTER_SHADOW_DISTANCE = 35;
const FOOTER_HEIGHT = 80;
const HEADER_MAX_HEIGHT = DESIRED_DISTANCE + 56 + PADDING_BOTTOM_FIX + StatusBar.currentHeight - 12; // DO NOT ASK PLS
const HEADER_MIN_HEIGHT = 56 + StatusBar.currentHeight;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const QuestPreview: NavigationScreenComponent<NavigationStackOptions, Props> = () => {
  const navigation = useNavigation();
  // const quest: Quest = useNavigationParam('quest');
  const [quest, setQuest] = useState();
  // const userId: number = useNavigationParam('userId');
  // const token = useNavigationParam('token');
  const [token, setToken] = useState('');
  const username = 'ciaototto@gmail.com';
  const [user, setUser] = useState<UserDetail>({ username });
  const [isTransitionCompleted, setCompleted] = useState(false);
  const scrollY = new Animated.Value(0);

  const ref = useRef<TransitioningView>();

  useEffect(() => {
    const fetchQuest = async () => {
      const [e, tokenResponse] = await to(getAuthToken(username, hashCode(username)));

      if (tokenResponse) {
        const { token, id } = tokenResponse;

        setToken(token);

        const user = await getUserDetail(token, id);
        const [e, quests] = await to<Quest>(getQuests(token));

        setUser({ ...user, id });
        setQuest(find(quests, q => q.name.toLowerCase() === 'Merano - Christmas Crime'.toLowerCase()));
      }
    };

    fetchQuest();
  }, []);

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp'
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE * 0.9, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp'
  });

  const headerTranslate = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 0, 60],
    extrapolate: 'clamp'
  });

  useNavigationEvents(evt => {
    if (evt.type === 'willFocus') {
      StatusBar.setBarStyle('light-content', true);
      StatusBar.setBackgroundColor('transparent', false);
      setCompleted(true);
    }

    if (evt.type === 'didFocus' && evt.action.type === 'Navigation/COMPLETE_TRANSITION') {
      NearbyBeacons.stopScanning(() => {
        console.log('stopped scanning');
      });

      ref.current.animateNextTransition();
      setCompleted(true);
    }

    if (evt.type === 'willBlur' && evt.action.type === 'Navigation/BACK') {
      ref.current.animateNextTransition();
      setCompleted(false);
    }
  });

  const onStartQuestPressed = () => {
    NearbyBeacons.configureScanMode(2);
    NearbyBeacons.setDeviceUpdateCallbackInterval(2);

    NearbyBeacons.startScanning(() => {
      console.log('started scanning');
    });

    navigation.navigate(ScreenKeys.StepViewer, {
      quest,
      stepId: 1,
      token,
      userId: user.id
    });
  };

  const transition = (
    <Transition.Together>
      <Transition.In type="slide-bottom" interpolation="easeInOut" durationMs={150} />
      <Transition.Change />
      <Transition.Out type="slide-bottom" interpolation="easeInOut" durationMs={20} />
    </Transition.Together>
  );

  if (!quest) {
    return <View />;
  }

  return (
    <>
      <SharedElement id={`image_${quest.id}`} style={styles.fill}>
        <Image
          source={{
            uri: quest.image || DEFAULT_QUEST_IMAGE_URL
          }}
          style={styles.absoluteFill}
          resizeMode="cover"
        />
      </SharedElement>
      <SharedElement id={`gradient_${quest.id}`} style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={['rgba(51,51,51,0.64)', 'rgba(51,51,51,0.6)', Colors.BLACK]}
          locations={[0.1, 0.5, 0.83]}
          style={StyleSheet.absoluteFill}
        >
          <ScrollView
            style={{ marginTop: StatusBar.currentHeight }}
            contentContainerStyle={styles.scrollContainer}
            scrollEventThrottle={16}
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }])}
          >
            <SharedElement id={`name_${quest.id}`}>
              <Text style={styles.questTitle}>{!isTransitionCompleted ? quest.name : ''}</Text>
            </SharedElement>
            <View style={styles.scrollContent}>
              <SharedElement id={`description_${quest.id}`}>
                <>
                  <Text style={styles.paragraph}>{quest.description || ''}</Text>
                  {!!quest.instructions && <Text style={styles.howToPlayTitle}>{translate('how_to_play')}</Text>}
                  {!!quest.instructions && <Text style={styles.paragraph}>{quest.instructions || ''}</Text>}
                </>
              </SharedElement>
            </View>
          </ScrollView>
          {isTransitionCompleted && (
            <Animated.View style={[styles.headerContainer, { height: headerHeight }]}>
              <Animated.View
                style={[
                  styles.header,
                  {
                    opacity: headerOpacity
                  }
                ]}
              />
              <Animated.Text style={[styles.questTitle, { transform: [{ translateX: headerTranslate }] }]}>
                {quest.name}
              </Animated.Text>
            </Animated.View>
          )}
        </LinearGradient>
      </SharedElement>
      <Transitioning.View ref={ref} transition={transition} style={styles.footerContainer}>
        {isTransitionCompleted && (
          <LinearGradient colors={['rgba(51,51,51,0)', Colors.BLACK]} locations={[0, 0.3]} style={styles.fill}>
            <View style={styles.footer}>
              <Button mode="contained" dark={true} style={{ width: '100%' }} onPress={onStartQuestPressed}>
                {translate('start')}
              </Button>
            </View>
          </LinearGradient>
        )}
      </Transitioning.View>
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
  header: { backgroundColor: Colors.BLACK, position: 'absolute', top: 0, left: 0, right: 0, height: HEADER_MAX_HEIGHT },
  scrollContainer: {
    paddingTop: DESIRED_DISTANCE,
    paddingHorizontal: 16,
    paddingBottom: FOOTER_HEIGHT + FOOTER_SHADOW_DISTANCE
  },
  scrollContent: {
    paddingTop: 12
  },
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
    justifyContent: 'center',
    padding: 16,
    marginTop: FOOTER_SHADOW_DISTANCE
  },
  questTitle: {
    ...material.display1Object,
    fontFamily: 'SuedtirolPro-Regular',
    color: Colors.WHITE,
    marginBottom: PADDING_BOTTOM_FIX
  },
  howToPlayTitle: {
    ...material.display1Object,
    fontFamily: 'SuedtirolPro-Regular',
    color: Colors.WHITE,
    marginTop: 32,
    marginBottom: PADDING_BOTTOM_FIX
  },
  paragraph: { ...material.subheadingObject, color: Colors.WHITE }
});

QuestPreview.navigationOptions = {
  headerTransparent: true,
  headerTintColor: Colors.WHITE,
  headerLeftContainerStyle: {
    width: 40,
    height: 40,
    marginHorizontal: 16,
    marginTop: 36 - StatusBar.currentHeight,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.WHITE_024,
    borderRadius: 40
  }
};

export default QuestPreview;
