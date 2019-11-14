import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../styles/colors';

const QuestStepFinder = ({ step, distance }) => {
  return (
    <View style={styles.founderContainer}>
      {!!distance ? (
        <Text>{`Metri di distanza dal beacon: ${distance}`}</Text>
      ) : (
        <ActivityIndicator size="large" color={Colors.BLUE_500} />
      )}
      <Text>{step.instructions}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  founderContainer: {
    flexGrow: 1,
    justifyContent: 'space-between'
  },
  answerInput: {
    height: 40,
    width: '100%',
    paddingHorizontal: 6,
    marginVertical: 16
  }
});

export default QuestStepFinder;
