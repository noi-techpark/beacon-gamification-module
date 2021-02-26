import React from 'react';
import { Card } from 'react-native-paper';
import { translate } from '../../localization/locale';
import { CircleAvatar } from '../CircleAvatar';

interface UserRecap {
  username: string;
  points: number;
}

const UserRecap: React.FunctionComponent<UserRecap> = ({ username, points }) => (
  <Card elevation={3} style={{ marginHorizontal: 16, marginVertical: 2 }}>
    <Card.Title
      title={username}
      subtitle={`${points || 0} ${translate('points')}`}
      titleStyle={{ marginHorizontal: 16 }}
      subtitleStyle={{ marginHorizontal: 16 }}
      left={_ => <CircleAvatar username={username} />}
    />
  </Card>
);

export default React.memo(UserRecap);
