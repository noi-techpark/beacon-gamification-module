import React, { useEffect, useState } from 'react';
import { Keyboard, StyleSheet, Text, TextInput } from 'react-native';
import { Button } from 'react-native-paper';
import { translate } from '../../../localization/locale';
import { Question } from '../../../models/quest';
import { Colors } from '../../../styles/colors';
import { useKeyboard } from './node_modules/react-native-hooks';

const QuestStepQuestion = ({ step, onCorrectAnswer }) => {
  const [answer, setAnswer] = useState('');
  const { isKeyboardShow } = useKeyboard();

  if (step.type !== 'question') {
    return <></>;
  }

  const question: Question = JSON.parse(step.properties);

  useEffect(() => {
    if (!isKeyboardShow && answer === question.r) {
      onCorrectAnswer(step);
    }
  }, [isKeyboardShow]);

  const onAnswerPressed = () => {
    if (isKeyboardShow) {
      Keyboard.dismiss();
    } else {
      onCorrectAnswer(step);
    }
  };

  switch (question.kind) {
    case 'text':
      return (
        <>
          <Text>{question.q}</Text>
          <TextInput
            onChangeText={answer => setAnswer(answer)}
            value={answer}
            autoCapitalize="none"
            style={styles.answerInput}
            selectionColor={Colors.BLUE_500}
            underlineColorAndroid={Colors.BLUE_500}
          />
          <Button onPress={onAnswerPressed} mode="contained">
            {translate('answer')}
          </Button>
        </>
      );
    case 'number':
      return (
        <>
          <Text>{question.q}</Text>
          <TextInput
            onChangeText={answer => setAnswer(answer)}
            value={answer}
            keyboardType="number-pad"
            style={styles.answerInput}
            selectionColor={Colors.BLUE_500}
            underlineColorAndroid={Colors.BLUE_500}
          />
          <Button onPress={onAnswerPressed} mode="contained">
            {translate('answer')}
          </Button>
        </>
      );
  }
};

const styles = StyleSheet.create({
  answerInput: {
    height: 40,
    width: '100%',
    paddingHorizontal: 6,
    marginVertical: 16
  }
});

export default QuestStepQuestion;
