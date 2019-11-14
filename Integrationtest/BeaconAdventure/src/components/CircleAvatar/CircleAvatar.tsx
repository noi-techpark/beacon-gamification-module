import React from 'react';
import { StyleSheet } from 'react-native';
import { Avatar } from 'react-native-paper';
import { Colors } from '../../styles/colors';
import { firstLetter } from '../../utils/stringUtils';

interface AvatarProps {
  username?: string;
}

const CircleAvatar: React.FunctionComponent<AvatarProps> = ({ username }) => {
  return (
    <Avatar.Text
      size={56}
      label={!!username ? firstLetter(username) : ''}
      color={Colors.WHITE}
      style={styles.avatarContainer}
    />
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    backgroundColor: Colors.BLUE_500
  }
});

export default React.memo(CircleAvatar);
