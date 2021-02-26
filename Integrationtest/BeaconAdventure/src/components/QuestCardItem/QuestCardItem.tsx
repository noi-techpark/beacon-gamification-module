import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Card } from 'react-native-paper';
import { material, materialColors } from 'react-native-typography';
import { SharedElement } from 'react-navigation-shared-element';
import { DEFAULT_QUEST_IMAGE_URL } from '../../config';
import { translate } from '../../localization/locale';
import { Quest } from '../../models/quest';
import { Colors } from '../../styles/colors';

interface QuestCardItemProps {
  quest: Quest;
  onOpenQuestPressed: () => void;
}

const QuestCardItem: React.FunctionComponent<QuestCardItemProps> = ({ quest, onOpenQuestPressed }) => {
  return (
    <Card elevation={3} style={styles.questContainer}>
      <SharedElement id={`gradient_${quest.id}`} style={StyleSheet.absoluteFill}>
        <View style={StyleSheet.absoluteFill} collapsable={false} />
      </SharedElement>
      <SharedElement id={`image_${quest.id}`}>
        <Card.Cover
          source={{
            uri: quest.image || DEFAULT_QUEST_IMAGE_URL
          }}
          style={{ borderTopLeftRadius: 8, borderTopRightRadius: 8, height: 164 }}
          resizeMode="cover"
        />
      </SharedElement>
      <Card.Content style={{ paddingTop: 12 }}>
        <SharedElement id={`name_${quest.id}`}>
          <Text style={styles.questTitle}>{quest.name}</Text>
        </SharedElement>
        <SharedElement id={`description_${quest.id}`}>
          <Text style={styles.questDescription} numberOfLines={2}>
            {quest.description}
          </Text>
        </SharedElement>
      </Card.Content>
      <Card.Actions>
        <Button onPress={onOpenQuestPressed} color={Colors.SUDTIROL_DARK_GREEN}>
          {translate('discover')}
        </Button>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  questContainer: {
    marginVertical: 8,
    height: 304
  },
  questTitle: { ...material.headlineObject, fontFamily: 'SuedtirolPro-Regular' },
  questDescription: { ...material.body1Object, color: materialColors.blackSecondary, height: 40 }
});

export default React.memo(QuestCardItem);
