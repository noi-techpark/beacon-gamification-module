import to from 'await-to-js';
import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import ReactNativeParallaxHeader from 'react-native-parallax-header';
import { material } from 'react-native-typography';
import { NavigationParams, NavigationRoute, NavigationScreenProp } from 'react-navigation';
import { useNavigation, useNavigationEvents, useNavigationParam } from 'react-navigation-hooks';
import { getAuthToken, getUserDetail } from '../../api/auth';
import { getQuests } from '../../api/quests';
import { PointsRecap } from '../../components/PointsRecap';
import { QuestCardItem } from '../../components/QuestCardItem';
import { translate } from '../../localization/locale';
import { Quest } from '../../models/quest';
import { UserDetail } from '../../models/user';
import { ScreenKeys } from '../../screens';
import { Colors } from '../../styles/colors';
import { hashCode } from '../../utils/stringUtils';

const Home = () => {
  const navigation = useNavigation();
  const username: string = useNavigationParam('username');
  const [user, setUser] = useState<UserDetail>({ username });
  const [token, setToken] = useState('');
  const [quests, setQuests] = useState([]);

  useNavigationEvents(evt => {
    if (evt.type === 'willFocus') {
      StatusBar.setBackgroundColor(Colors.GRAY_200, false);
      StatusBar.setBarStyle('dark-content', true);
    }
  });

  useEffect(() => {
    const fetchQuests = async () => {
      const [e, tokenResponse] = await to(getAuthToken(username, hashCode(username)));

      if (tokenResponse) {
        const { token, id } = tokenResponse;

        setToken(token);

        const user = await getUserDetail(token, id);
        const [e, quests] = await to(getQuests(token));

        setUser({ ...user, id });
        setQuests(quests);
      }
    };

    fetchQuests();
  }, []);

  return (
    <View style={styles.root}>
      <ReactNativeParallaxHeader
        backgroundImage={require('../../images/points_pattern_with_gradient.png')}
        backgroundImageScale={1}
        navbarColor={Colors.WHITE}
        headerMinHeight={56 + StatusBar.currentHeight}
        headerMaxHeight={204}
        alwaysShowTitle={false}
        extraScrollHeight={20}
        renderNavBar={() => <View style={{ backgroundColor: 'transparent', flex: 1 }} />}
        title={<PointsRecap points={user.points} />}
        contentContainerStyle={{ flexGrow: 1, backgroundColor: Colors.GRAY_200, paddingHorizontal: 16 }}
        renderContent={() => (
          <>
            <Text style={styles.questListHeader}>{translate('discover_adventures').toUpperCase()}</Text>
            {quests.map(q => renderItem(q, token, user.id || 0, navigation))}
          </>
        )}
      />
    </View>
  );
};

const renderItem = (
  quest: Quest,
  token: string,
  userId: number,
  navigation: NavigationScreenProp<NavigationRoute<NavigationParams>, NavigationParams>
) => {
  async function onOpenQuestPressed() {
    StatusBar.setBackgroundColor('transparent', false);

    navigation.navigate(ScreenKeys.QuestPreview, {
      quest,
      token,
      userId
    });
  }

  return <QuestCardItem key={quest.id} quest={quest} onOpenQuestPressed={onOpenQuestPressed} />;
};

const styles = StyleSheet.create({
  root: {
    flex: 1
  },
  questListHeader: { ...material.captionObject, paddingTop: 28, color: Colors.SUDTIROL_DARK_GREY }
});

Home.navigationOptions = ({ navigation }) => {
  const username: string = navigation.getParam('username');

  return {
    cardStyle: {
      backgroundColor: Colors.WHITE
    },
    title: username,
    headerTransparent: true,
    headerTitleStyle: {
      ...material.subheadingObject
    },
    headerLeft: null
  };
};

Home.sharedElements = (nav, otherNav, isShowing) => {
  if (otherNav.state.routeName === ScreenKeys.Register) {
    return [];
  }

  const quest: Quest = otherNav.getParam('quest');

  return [
    { id: `image_${quest.id}` },
    { id: `gradient_${quest.id}`, animation: 'fade' },
    { id: `name_${quest.id}`, animation: 'fade', resize: 'clip' },
    { id: `description_${quest.id}`, animation: 'fade', resize: 'clip' }
  ];
};

export default Home;
