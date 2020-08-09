import React, { useState, useEffect } from 'react';
import Button from 'react-native-button';
import { Text, View, Image } from 'react-native';

import TNActivityIndicator from '../../truly-native/TNActivityIndicator';
import { IMLocalized } from '../../localization/IMLocalization';
import dynamicStyles from './styles';
import { useColorScheme } from 'react-native-appearance';
import { setUserData } from '../redux/auth';
import { connect } from 'react-redux';

const PrivacyScreen = (props) => {
    console.log(props.navigation)
    const appStyles =
        props.navigation.state.params.appStyles ||
        props.navigation.getParam('appStyles');
    const colorScheme = useColorScheme();
    const styles = dynamicStyles(appStyles, colorScheme);
    const appConfig =
        props.navigation.state.params.appConfig ||
        props.navigation.getParam('appConfig');
    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                {IMLocalized('Squeaks')}
            </Text>
            <View style={styles.logo}>
                <Image style={styles.logoImage} source={appStyles.iconSet.logo} />
            </View>
            <Text style={styles.caption}>
                {IMLocalized('Squeaks Social Media : Friends, TimeLine, Audio Video Chat, Group Chat and much more.')}
            </Text>
            <View style={{ position: 'absolute', bottom: 10 }}>
                <Text style={styles.caption}>
                    {IMLocalized('By continuing and signing up you agree to our')}
                    &nbsp;
                    <Text style={styles.linkText}>

                        {IMLocalized('Terms and Conditions')}
                    </Text>
                    <Text style={styles.caption}>
                        &nbsp;{IMLocalized('and')}&nbsp;
                    </Text>
                    <Text style={styles.linkText}>

                        {IMLocalized('Privacy')}
                    </Text>
                </Text>
                <View style={styles.buttonGroup}>
                    <Button
                        containerStyle={styles.cancelContainer}
                        signupContainer
                        style={styles.cancelText}
                        onPress={() => {
                            props.navigation.navigate('Welcome', { appStyles, appConfig });
                        }}>
                        {IMLocalized('Cancel')}
                    </Button>
                    <View style={{ flex: 0.04 }}>
                    </View>
                    <Button
                        containerStyle={styles.acceptContainer}
                        style={styles.acceptText}
                        onPress={() => {
                            appConfig.isSMSAuthEnabled
                                ? props.navigation.navigate('Sms', {
                                    isSigningUp: true,
                                    appStyles,
                                    appConfig,
                                })
                                :
                                props.navigation.navigate('Signup', { appStyles, appConfig });
                        }}>
                        {IMLocalized('Accept')}
                    </Button>
                </View>
            </View>
        </View>
    );
};
const mapStateToProps = ({ auth }) => {
    return {
        user: auth.user,
    };
};
export default connect(mapStateToProps, {
    setUserData,
})(PrivacyScreen);
