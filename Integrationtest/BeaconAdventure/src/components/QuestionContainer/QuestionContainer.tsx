import isEqual from 'lodash.isequal';
import sortBy from 'lodash.sortby';
import React, { forwardRef, FunctionComponent, RefObject, useEffect, useState } from 'react';
import { Keyboard, ScrollView, StatusBar, StyleSheet, Text, TextInput as TextInputStatic, View } from 'react-native';
import { useKeyboard } from 'react-native-hooks';
import { Button } from 'react-native-paper';
import { material } from 'react-native-typography';
import { useNavigationEvents } from 'react-navigation-hooks';
import { translate } from '../../localization/locale';
import { QuestionMetadata, QuestStep } from '../../models/quest';
import { Colors } from '../../styles/colors';
import { addOrRemove, isQuestionWithTextInput } from '../../utils/uiobjects';
import QuestionRenderer from '../step/QuestionRenderer/QuestionRenderer';

interface IQuestionContainerProps {
  step: QuestStep;
  question: QuestionMetadata;
  questEnumeration: string;
  onCorrectAnswer: (step: QuestStep) => void;
  onWrongAnswer: (step: QuestStep) => void;
  onSkipQuestionPressed: (step: QuestStep) => void;
  ref?: RefObject<TextInputStatic>;
}

type QuestionContext = {
  answer: string;
  multipleAnswer: string[];
  orderedAnswer: string[];
  setAnswer?: (answer: string) => void;
  toggleAnswer?: (answer: string) => void;
  setOrderedAnswer?: (orderedAnswers: string[]) => void;
};

export const CONTAINER_MARGIN_TOP = 120;

export const QuestContext = React.createContext<QuestionContext>({
  answer: '',
  multipleAnswer: [],
  orderedAnswer: []
});

const QuestionContainer: FunctionComponent<IQuestionContainerProps> = forwardRef(
  (
    { step, question, questEnumeration, onCorrectAnswer, onWrongAnswer, onSkipQuestionPressed },
    ref: RefObject<TextInputStatic>
  ) => {
    const { isKeyboardShow } = useKeyboard();

    const [data, setData] = useState({
      text: '',
      multipleAnswer: [],
      orderedAnswer: []
    });

    const [isCorrect, setCorrect] = useState(false);
    const [isFormSubmitted, setFormSubmitted] = useState(false);
    const [height, setDescriptionHeight] = useState(0);

    useNavigationEvents(evt => {
      if (evt.type === 'didBlur' && isFormSubmitted) {
        clearState();
      }
    });

    useEffect(() => {
      if (!isKeyboardShow && isFormSubmitted) {
        if (isCorrect) {
          onCorrectAnswer(step);
        } else {
          onWrongAnswer(step);
        }
      }
    }, [isKeyboardShow]);

    const onAnswerPressed = () => {
      setFormSubmitted(true);

      const isValid =
        question.kind === 'multiple'
          ? isEqual(sortBy(data.multipleAnswer), sortBy(question.answer))
          : question.kind === 'order'
          ? isEqual(data.orderedAnswer, question.answer)
          : data.text.toLowerCase() === (question.answer as string).toLowerCase();

      if (isKeyboardShow) {
        setCorrect(isValid);
        Keyboard.dismiss();
      } else if (isValid) {
        onCorrectAnswer(step);
      } else {
        onWrongAnswer(step);
      }
    };

    const onSkipPressed = () => {
      onSkipQuestionPressed(step);
    };

    const clearState = () => {
      setData({
        text: '',
        multipleAnswer: [],
        orderedAnswer: []
      });
    };

    const renderButtonArea = () => {
      return (
        <>
          <Button onPress={onAnswerPressed} mode="contained" dark={true}>
            {translate('answer')}
          </Button>
          <Button
            onPress={onSkipPressed}
            mode="text"
            dark={true}
            theme={{
              colors: {
                primary: Colors.WHITE
              }
            }}
            style={{ marginTop: 12 }}
          >
            {translate('skip_question')}
          </Button>
        </>
      );
    };

    const renderQuestionArea = () => {
      return isQuestionWithTextInput(question) ? (
        <>
          <Text style={styles.question}>{`${questEnumeration}. ${question.question}`}</Text>
          <QuestionRenderer ref={ref} question={question} />
        </>
      ) : (
        <View style={{ flexGrow: 1 }}>
          <Text
            onLayout={e => {
              setDescriptionHeight(e.nativeEvent.layout.height);
            }}
            style={styles.question}
          >{`${questEnumeration}. ${question.question}`}</Text>
          <QuestionRenderer ref={ref} question={question} descriptionHeight={height} />
        </View>
      );
    };

    const renderContent = () => {
      return (
        <>
          <View style={{ flex: 1, justifyContent: isQuestionWithTextInput(question) ? 'flex-start' : 'space-between' }}>
            <QuestContext.Provider
              value={{
                answer: data.text,
                multipleAnswer: data.multipleAnswer,
                orderedAnswer: data.orderedAnswer,
                setAnswer: (text: string) => {
                  setCorrect(false);
                  setFormSubmitted(false);
                  setData({
                    ...data,
                    text
                  });
                },
                toggleAnswer: (text: string) => {
                  setData({
                    ...data,
                    multipleAnswer: addOrRemove(data.multipleAnswer, text)
                  });
                },
                setOrderedAnswer: (orderedAnswer: string[]) => {
                  setData({
                    ...data,
                    orderedAnswer
                  });
                }
              }}
            >
              {renderQuestionArea()}
            </QuestContext.Provider>
          </View>
          <View style={isQuestionWithTextInput(question) && { flex: 1, justifyContent: 'flex-end' }}>
            {renderButtonArea()}
          </View>
        </>
      );
    };

    return isQuestionWithTextInput(question) ? (
      <ScrollView
        style={{ paddingHorizontal: 16 }}
        contentContainerStyle={styles.questionScrollableContainer}
        keyboardShouldPersistTaps="handled"
      >
        {renderContent()}
      </ScrollView>
    ) : (
      <View style={styles.questionContainer}>{renderContent()}</View>
    );
  }
);

const styles = StyleSheet.create({
  question: {
    ...material.titleObject,
    color: Colors.WHITE
  },
  questionScrollableContainer: {
    flexGrow: 1,
    paddingTop: CONTAINER_MARGIN_TOP + StatusBar.currentHeight,
    paddingBottom: 16,
    justifyContent: 'space-between'
  },
  questionContainer: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: CONTAINER_MARGIN_TOP + StatusBar.currentHeight,
    marginBottom: 16
  },
  answerInput: {
    width: '100%',
    marginVertical: 12
  }
});

export default QuestionContainer;
