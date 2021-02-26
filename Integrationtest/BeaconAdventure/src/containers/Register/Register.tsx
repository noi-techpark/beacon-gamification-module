import to from 'await-to-js';
import React, { useState } from 'react';
import { Image, Keyboard, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Button, HelperText, TextInput } from 'react-native-paper';
import { material } from 'react-native-typography';
import { useNavigation } from 'react-navigation-hooks';
import * as yup from 'yup';
import { getAuthToken, postAddUserToGroup, postCreateUser } from '../../api/auth';
import { translate } from '../../localization/locale';
import { ApiError, isUsernameAlreadyExisiting } from '../../models/error';
import { User } from '../../models/user';
import { ScreenKeys } from '../../screens';
import { Colors } from '../../styles/colors';

const Register = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [isValid, setValid] = useState(true);

  const schema = yup.object().shape({
    username: yup
      .string()
      .email()
      .required()
  });

  async function onSignInPressed() {
    Keyboard.dismiss();

    setValid(
      schema.isValidSync({
        username
      })
    );

    const { token } = await getAuthToken('rizzo', 'rizzorizzorizzo');
    const [err, user] = await to<User, ApiError>(postCreateUser(token, username));

    if (err && isUsernameAlreadyExisiting(err)) {
      // check if already registered user
      navigation.navigate(ScreenKeys.Home, {
        username
      });
    }

    if (user) {
      const isAdded = await postAddUserToGroup(token, user.id);

      if (isAdded) {
        navigation.navigate(ScreenKeys.Home, {
          username: user.username
        });
      }
    } else {
      // show notification error
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.root} keyboardShouldPersistTaps="handled">
      <View style={styles.formContainer}>
        <Image source={require('../../images/beacon_logo.png')} />
        <Text style={styles.emailTitle}>{translate('insert_username')}</Text>
        <TextInput
          value={username}
          onChangeText={username => {
            setUsername(username);
            setValid(true);
          }}
          mode="outlined"
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.usernameInput}
          autoFocus={true}
          error={!isValid}
          label="email"
        />
        <HelperText type="error" visible={!isValid}>
          {translate('email_invalid')}
        </HelperText>
      </View>
      <Button onPress={onSignInPressed} mode="contained" dark={true}>
        {translate('signin')}
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'space-between',
    marginTop: 40 + StatusBar.currentHeight,
    paddingHorizontal: 16,
    marginBottom: 16
  },
  emailTitle: { ...material.titleObject, marginTop: 32, marginBottom: 12, color: Colors.BLACK },
  formContainer: { flexGrow: 1 },
  usernameInput: {
    width: '100%'
  }
});

Register.navigationOptions = {
  header: null
};

export default Register;
