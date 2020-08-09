import React, { useState } from 'react';
import {
  Text,
  TextInput,
  View,
  Alert,
  Image,
  TouchableOpacity,
  StyleSheet,
  CheckBox
} from 'react-native';
import Button from 'react-native-button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import dynamicStyles from './styles';
import { useColorScheme } from 'react-native-appearance';
import TNActivityIndicator from '../../truly-native/TNActivityIndicator';
import TNProfilePictureSelector from '../../truly-native/TNProfilePictureSelector/TNProfilePictureSelector';
import { IMLocalized } from '../../localization/IMLocalization';
import { setUserData } from '../redux/auth';
import { connect } from 'react-redux';
import authManager from '../utils/authManager';
import { localizedErrorMessage } from '../utils/ErrorCode';
import TermsOfUseView from '../components/TermsOfUseView';

const SignupScreen = (props) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [profilePictureURL, setProfilePictureURL] = useState(null);
  const [loading, setLoading] = useState(false);

  const appConfig =
    props.navigation.state.params.appConfig ||
    props.navigation.getParam('appConfig');
  const appStyles =
    props.navigation.state.params.appStyles ||
    props.navigation.getParam('appStyles');
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(appStyles, colorScheme);
  const [isSelected, setSelection] = useState(false);
  const onRegister = () => {
    setLoading(true);

    const userDetails = {
      firstName,
      lastName,
      email,
      password,
      photoURI: profilePictureURL,
      appIdentifier: appConfig.appIdentifier,
    };
    authManager
      .createAccountWithEmailAndPassword(userDetails, appConfig)
      .then((response) => {
        const user = response.user;
        if (user) {
          props.setUserData({
            user: response.user,
          });
          props.navigation.navigate('Login', { appStyles, appConfig });
        } else {
          Alert.alert(
            '',
            localizedErrorMessage(response.error),
            [{ text: IMLocalized('OK') }],
            {
              cancelable: false,
            },
          );
        }
        setLoading(false);
      });
  };

  const renderSignupWithEmail = () => {
    return (
      <>
        <TextInput
          style={styles.InputContainer}
          placeholder={IMLocalized('First Name')}
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setFirstName(text)}
          value={firstName}
          underlineColorAndroid="transparent"
        />
        <TextInput
          style={styles.InputContainer}
          placeholder={IMLocalized('Last Name')}
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setLastName(text)}
          value={lastName}
          underlineColorAndroid="transparent"
        />
        <TextInput
          style={styles.InputContainer}
          placeholder={IMLocalized('E-mail Address')}
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setEmail(text)}
          value={email}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.InputContainer}
          placeholder={IMLocalized('Password')}
          placeholderTextColor="#aaaaaa"
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
          value={password}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <View style={styles.container}>
          <View style={style.checkboxContainer}>
            <CheckBox
              value={isSelected}
              onValueChange={setSelection}
              style={style.checkbox}
              tintColors={{ true: '#3669b5', false: 'black' }}
            />
            <View >
              <View>
                <Text>
                  I accept Privacy Policy and
                </Text>
              </View>
              <View>
                <Text>
                  Terms and Conditions</Text>
              </View>
            </View>
          </View>
        </View>
        <Button
          containerStyle={styles.signupContainer}
          style={styles.signupText}
          onPress={() => onRegister()}>
          {IMLocalized('Sign Up')}
        </Button>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: '100%' }}
        keyboardShouldPersistTaps="always">
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <Image
            style={[appStyles.styleSet.backArrowStyle], {
              tintColor: '#3875e8',
              width: 25,
              height: 25,
              marginTop: Platform.OS === 'ios' ? 50 : 20,
              marginLeft: 10,
            }}
            source={appStyles.iconSet.backArrow}
          />
        </TouchableOpacity>
        <Text style={styles.title}>{IMLocalized('Create new account')}</Text>
        <TNProfilePictureSelector
          setProfilePictureURL={setProfilePictureURL}
          appStyles={appStyles}
        />
        {renderSignupWithEmail()}
        {appConfig.isSMSAuthEnabled && (
          <>
            <Text style={styles.orTextStyle}>{IMLocalized('OR')}</Text>
            <Button
              containerStyle={styles.PhoneNumberContainer}
              onPress={() =>
                props.navigation.navigate('Sms', {
                  isSigningUp: true,
                  appStyles,
                  appConfig,
                })
              }>
              {IMLocalized('Sign up with phone number')}
            </Button>
          </>
        )}
        <TermsOfUseView tosLink={appConfig.tosLink} style={styles.tos} />
      </KeyboardAwareScrollView>
      {loading && <TNActivityIndicator appStyles={appStyles} />}
    </View>
  );
};
const style = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    justifyContent: "center",
  },
  checkboxContainer: {
    display: 'flex',
    flexDirection: "row",
    marginTop: 20,
    margin: 'auto'
  },
  checkbox: {
    alignSelf: "center",
  },
  label: {
    margin: 8,
  },
});
export default connect(null, {
  setUserData,
})(SignupScreen);
