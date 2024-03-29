import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  View,
  TextInput,
  Alert,
  Image,
  TouchableOpacity,
  StyleSheet,
  CheckBox
} from 'react-native';
import 'react-native-get-random-values';
import Button from 'react-native-button';
import PhoneInput from 'react-native-phone-input';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import CodeField from 'react-native-confirmation-code-field';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useColorScheme } from 'react-native-appearance';
import TNActivityIndicator from '../../truly-native/TNActivityIndicator';
import TNProfilePictureSelector from '../../truly-native/TNProfilePictureSelector/TNProfilePictureSelector';
import CountriesModalPicker from '../../truly-native/CountriesModalPicker/CountriesModalPicker';
import { IMLocalized } from '../../localization/IMLocalization';
import { setUserData } from '../redux/auth';
import { connect } from 'react-redux';
import authManager from '../utils/authManager';
import { localizedErrorMessage } from '../utils/ErrorCode';
import TermsOfUseView from '../components/TermsOfUseView';
import { firebase } from '../../firebase/config';
import dynamicStyles from './styles';

const SmsAuthenticationScreen = (props) => {
  const appConfig =
    props.navigation.state.params.appConfig ||
    props.navigation.getParam('appConfig');
  const appStyles =
    props.navigation.state.params.appStyles ||
    props.navigation.getParam('appStyles');

  const colorScheme = useColorScheme();
  const styles = dynamicStyles(appStyles, colorScheme);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPhoneVisible, setIsPhoneVisible] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState(false);
  const [countriesPickerData, setCountriesPickerData] = useState(null);
  const [verificationId, setVerificationId] = useState(null);
  const [profilePictureURL, setProfilePictureURL] = useState(null);
  const [countryModalVisible, setCountryModalVisible] = useState(false);
  const myCodeInput = useRef(null);
  const phoneRef = useRef(null);
  const recaptchaVerifier = React.useRef(null);
  const firebaseConfig = firebase.app().options;

  const { isSigningUp } = props.navigation.state.params;
  console.log('here is isSigningup:', isSigningUp)
  const [isSelected, setSelection] = useState(false);
  useEffect(() => {
    if (phoneRef && phoneRef.current) {
      setCountriesPickerData(phoneRef.current.getPickerData());
    }
  }, [phoneRef]);

  const onFBButtonPress = () => {
    authManager
      .loginOrSignUpWithFacebook(appConfig.appIdentifier)
      .then((response) => {
        if (response.user) {
          const user = response.user;
          props.setUserData({ user });
          props.navigation.navigate('MainStack', { user: user });
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
      });
  };

  const signInWithPhoneNumber = (userValidPhoneNumber) => {
    setLoading(true);
    authManager.onVerification(userValidPhoneNumber);
    authManager
      .sendSMSToPhoneNumber(userValidPhoneNumber, recaptchaVerifier.current)
      .then((response) => {
        const confirmationResult = response.confirmationResult;
        if (confirmationResult) {
          // SMS sent. Prompt user to type the code from the message, then sign the
          // user in with confirmationResult.confirm(code).
          window.confirmationResult = confirmationResult;
          setVerificationId(confirmationResult.verificationId);
          setIsPhoneVisible(false);
          setLoading(false);
        } else {
          // Error; SMS not sent
          setLoading(false);
          Alert.alert(
            '',
            localizedErrorMessage(response.error),
            [{ text: IMLocalized('OK') }],
            { cancelable: false },
          );
        }
      });
  };

  const signUpWithPhoneNumber = (smsCode) => {
    const userDetails = {
      firstName,
      lastName,
      phone: phoneNumber,
      photoURI: profilePictureURL,
    };
    setLoading(true);
    authManager
      .registerWithPhoneNumber(
        userDetails,
        smsCode,
        verificationId,
        appConfig.appIdentifier,
      )
      .then((response) => {
        if (response.error) {
          Alert.alert(
            '',
            localizedErrorMessage(response.error),
            [{ text: IMLocalized('OK') }],
            { cancelable: false },
          );
        } else {
          const user = response.user;
          props.setUserData({ user });
          props.navigation.navigate('MainStack', { user: user });
        }
        setLoading(false);
      });
  };

  const onPressSend = () => {
    if (phoneRef.current.isValidNumber()) {
      const userValidPhoneNumber = phoneRef.current.getValue();
      setLoading(true);
      setPhoneNumber(userValidPhoneNumber);
      if (!isSigningUp) {
        // If this is a login attempt, we first need to check that the user associated to this phone number exists
        authManager
          .retrieveUserByPhone(userValidPhoneNumber)
          .then((response) => {
            if (response.success) {
              signInWithPhoneNumber(userValidPhoneNumber);
            } else {
              setPhoneNumber(null);
              setLoading(false);
              Alert.alert(
                '',
                IMLocalized(
                  'You cannot log in. There is no account with this phone number.',
                ),
                [{ text: IMLocalized('OK') }],
                {
                  cancelable: false,
                },
              );
            }
          });
      } else {
        signInWithPhoneNumber(userValidPhoneNumber);
      }
    } else {
      Alert.alert(
        '',
        IMLocalized('Please enter a valid phone number.'),
        [{ text: IMLocalized('OK') }],
        {
          cancelable: false,
        },
      );
    }
  };

  const onPressFlag = () => {
    setCountryModalVisible(true);
  };

  const onPressCancelContryModalPicker = () => {
    setCountryModalVisible(false);
  };

  const onFinishCheckingCode = (newCode) => {
    setLoading(true);
    if (isSigningUp) {
      signUpWithPhoneNumber(newCode);
    } else {
      authManager.loginWithSMSCode(newCode, verificationId).then((response) => {
        if (response.error) {
          Alert.alert(
            '',
            localizedErrorMessage(response.error),
            [{ text: IMLocalized('OK') }],
            { cancelable: false },
          );
        } else {
          const user = response.user;
          props.setUserData({ user });
          props.navigation.navigate('MainStack', { user: user });
        }
        setLoading(false);
      });
    }
  };

  const phoneInputRender = () => {
    return (
      <>
        <PhoneInput
          style={styles.InputContainer}
          flagStyle={styles.flagStyle}
          textStyle={styles.phoneInputTextStyle}
          ref={phoneRef}
          onPressFlag={onPressFlag}
          offset={10}
          allowZeroAfterCountryCode
          textProps={{
            placeholder: IMLocalized('Phone number'),
            placeholderTextColor: '#aaaaaa',
          }}
        />
        {countriesPickerData && (
          <CountriesModalPicker
            data={countriesPickerData}
            appStyles={appStyles}
            onChange={(country) => {
              selectCountry(country);
            }}
            cancelText={IMLocalized('Cancel')}
            visible={countryModalVisible}
            onCancel={onPressCancelContryModalPicker}
          />
        )}
        <Button
          containerStyle={styles.sendContainer}
          style={styles.sendText}
          onPress={() => onPressSend()}>
          {IMLocalized('Send code')}
        </Button>
      </>
    );
  };
  const phoneInputRenderSign = () => {
    return (
      <>
        <PhoneInput
          style={styles.InputContainer}
          flagStyle={styles.flagStyle}
          textStyle={styles.phoneInputTextStyle}
          ref={phoneRef}
          onPressFlag={onPressFlag}
          offset={10}
          allowZeroAfterCountryCode
          textProps={{
            placeholder: IMLocalized('Phone number'),
            placeholderTextColor: '#aaaaaa',
          }}
        />
        {countriesPickerData && (
          <CountriesModalPicker
            data={countriesPickerData}
            appStyles={appStyles}
            onChange={(country) => {
              selectCountry(country);
            }}
            cancelText={IMLocalized('Cancel')}
            visible={countryModalVisible}
            onCancel={onPressCancelContryModalPicker}
          />
        )}

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
          containerStyle={styles.sendContainer}
          style={styles.sendText}
          onPress={() => onPressSend()}>
          {IMLocalized('Send code')}
        </Button>
      </>
    );
  };
  const codeInputRender = () => {
    return (
      <>
        <CodeField
          ref={myCodeInput}
          inputPosition="full-width"
          variant="border-b"
          codeLength={6}
          size={50}
          space={8}
          keyboardType="numeric"
          cellProps={{ style: styles.input }}
          containerProps={{ style: styles.codeFieldContainer }}
          onFulfill={onFinishCheckingCode}
        />
      </>
    );
  };

  const selectCountry = (country) => {
    phoneRef.current.selectCountry(country.iso2);
  };

  const renderAsSignUpState = () => {
    return (
      <>
        <Text style={styles.title}>{IMLocalized('Create new account')}</Text>
        <TNProfilePictureSelector
          setProfilePictureURL={setProfilePictureURL}
          appStyles={appStyles}
        />

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
        {isPhoneVisible ? phoneInputRenderSign() : codeInputRender()}
        <Text style={styles.orTextStyle}> {IMLocalized('OR')}</Text>
        <Button
          containerStyle={styles.signWithEmailContainer}
          onPress={() =>
            props.navigation.navigate('Signup', { appStyles, appConfig })
          }>
          {IMLocalized('Sign up with E-mail')}
        </Button>
      </>
    );
  };
  const renderAsSignUpBack = () => {
    return (
      <>
        <TouchableOpacity onPress={() => props.navigation.navigate('Welcome', { appStyles, appConfig })}>
          <Image
            style={[appStyles.styleSet.backArrowStyle], [{
              tintColor: '#3875e8',
              width: 25,
              height: 25,
              marginTop: Platform.OS === 'ios' ? 50 : 20,
              marginLeft: 10,
            }]}
            source={appStyles.iconSet.backArrow}
          />
        </TouchableOpacity>
      </>
    );
  };
  const renderAsLoginBack = () => {
    return (
      <>
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <Image
            style={[appStyles.styleSet.backArrowStyle], [{
              tintColor: '#3875e8',
              width: 25,
              height: 25,
              marginTop: Platform.OS === 'ios' ? 50 : 20,
              marginLeft: 10,
            }]}
            source={appStyles.iconSet.backArrow}
          />
        </TouchableOpacity>
      </>
    );
  };
  const renderAsLoginState = () => {
    return (
      <>
        <Text style={styles.title}>{IMLocalized('Sign In')}</Text>
        {isPhoneVisible ? phoneInputRender() : codeInputRender()}
        <Text style={styles.orTextStyle}> {IMLocalized('OR')}</Text>
        {/* <Button
          containerStyle={styles.facebookContainer}
          style={styles.facebookText}
          onPress={() => onFBButtonPress()}>
          {IMLocalized('Login With Facebook')}
        </Button> */}
        <Button
          containerStyle={styles.signWithEmailContainer}
          onPress={() =>
            props.navigation.navigate('Login', { appStyles, appConfig })
          }>
          {IMLocalized('Sign in with E-mail')}
        </Button>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: '100%' }}
        keyboardShouldPersistTaps="always">
        {isSigningUp ? renderAsSignUpBack() : renderAsLoginBack()}
        {isSigningUp ? renderAsSignUpState() : renderAsLoginState()}
        {isSigningUp && (
          <TermsOfUseView tosLink={appConfig.tosLink} style={styles.tos} />
        )}
        <FirebaseRecaptchaVerifierModal
          ref={recaptchaVerifier}
          firebaseConfig={firebaseConfig}
        />
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
})(SmsAuthenticationScreen);
