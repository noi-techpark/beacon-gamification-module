import React, { useState } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import { material } from 'react-native-typography';
import { useNavigation, useNavigationEvents, useNavigationParam } from 'react-navigation-hooks';
import { useAnimation } from '../../../hooks/useAnimation';
import { translate } from '../../../localization/locale';
import { QuestionMetadata, QuestStep } from '../../../models/quest';
import { Colors } from '../../../styles/colors';

const ProvideHelp = () => {
  const navigation = useNavigation();
  const step: QuestStep = useNavigationParam('step');
  const question: QuestionMetadata = useNavigationParam('question');
  const [isScreenAppearing, setScreenAppearing] = useState(false);

  useNavigationEvents(evt => {
    if (evt.type === 'willFocus') {
      setScreenAppearing(true);
    } else if (evt.type === 'willBlur') {
      setScreenAppearing(false);
    }
  });

  const fadeBackground = useAnimation({
    doAnimation: isScreenAppearing
  });

  async function onCloseHelpModalPressed() {
    navigation.goBack();
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
          <Text style={styles.title}>{translate('help')}</Text>
          <Text style={styles.description}>{question.help}</Text>
          <Button onPress={onCloseHelpModalPressed} mode="contained" dark={true}>
            {translate('close')}
          </Button>
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
  cardContainer: {
    width: '100%',
    backgroundColor: Colors.WHITE,
    padding: 16,
    borderRadius: 8
  },
  title: {
    ...material.display1Object,
    fontFamily: 'SuedtirolPro-Regular',
    paddingTop: 40,
    paddingBottom: 8,
    paddingHorizontal: 16,
    color: Colors.TOTAL_BLACK
  },
  description: {
    ...material.subheadingObject,
    paddingHorizontal: 16,
    paddingBottom: 32
  },
});

export default ProvideHelp;
