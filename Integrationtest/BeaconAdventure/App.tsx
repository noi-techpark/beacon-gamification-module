/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/emin93/react-native-template-typescript
 *
 * @format
 */

import { StatusBar } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import { createStackNavigator } from 'react-navigation-stack';
import { TransitionProps } from 'react-navigation-stack/lib/typescript/types';
import { Home } from './src/containers/Home';
import { Onboarding } from './src/containers/Onboarding';
import { AnswerOutcome } from './src/containers/quest/AnswerOutcome';
import { ProvideHelp } from './src/containers/quest/ProvideHelp';
import { QuestCompleted } from './src/containers/quest/QuestCompleted';
import { QuestFeedback } from './src/containers/quest/QuestFeedback';
import { QuestPause } from './src/containers/quest/QuestPause';
import { QuestPreview } from './src/containers/quest/QuestPreview';
import { Register } from './src/containers/Register';
import { StepViewer } from './src/containers/StepViewer';
import { setupI18nConfig } from './src/localization/locale';
import { ScreenKeys } from './src/screens';
import { Colors } from './src/styles/colors';
import { forVertical, springyFadeIn } from './src/utils/animations';

StatusBar.setTranslucent(true);
StatusBar.setBarStyle('dark-content');
StatusBar.setBackgroundColor(Colors.GRAY_200);

const AppNavigator = createSharedElementStackNavigator(
  createStackNavigator,
  {
    [ScreenKeys.Onboarding]: {
      screen: Onboarding
    },
    [ScreenKeys.Register]: {
      screen: Register
    },
    [ScreenKeys.Home]: {
      screen: Home
    },
    [ScreenKeys.QuestPreview]: {
      screen: QuestPreview
    },
    [ScreenKeys.StepViewer]: {
      screen: StepViewer
    },
    [ScreenKeys.QuestFeedback]: {
      screen: QuestFeedback
    },
    [ScreenKeys.QuestCompleted]: {
      screen: QuestCompleted
    }
  },
  {
    initialRouteName: ScreenKeys.QuestPreview,
    defaultNavigationOptions: {
      headerStyle: {
        elevation: 0,
        backgroundColor: 'transparent',
        marginTop: StatusBar.currentHeight
      }
    },
    transitionConfig: (toProps: TransitionProps, fromProps: TransitionProps) => {
      if (fromProps) {
        const fromScreenKey = fromProps.scene.route.routeName;
        const toScreenKey = toProps.scene.route.routeName;

        if (
          (fromScreenKey === ScreenKeys.Home && toScreenKey === ScreenKeys.QuestPreview) ||
          (fromScreenKey === ScreenKeys.QuestPreview && toScreenKey === ScreenKeys.Home)
        ) {
          return springyFadeIn();
        }
        // else if (fromScreenKey === ScreenKeys.QuestPreview && toScreenKey === ScreenKeys.StepViewer) {
        //   return fromBottom(700);
        // } else if (fromScreenKey === ScreenKeys.StepViewer && toScreenKey === ScreenKeys.QuestPreview) {
        //   return fromBottom(700);
        // }
      }
    }
  }
);

const ModalNavigator = createStackNavigator(
  {
    Main: {
      screen: AppNavigator
    },
    [ScreenKeys.AnswerOutcome]: {
      screen: AnswerOutcome
    },
    [ScreenKeys.ProvideHelp]: {
      screen: ProvideHelp
    },
    [ScreenKeys.QuestPause]: {
      screen: QuestPause
    }
  },
  {
    mode: 'modal',
    headerMode: 'none',
    gesturesEnabled: false,
    transparentCard: true,
    transitionConfig: () => forVertical()
  }
);

setupI18nConfig();

export default createAppContainer(ModalNavigator);
