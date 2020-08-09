import { StyleSheet } from 'react-native';
import { Platform } from 'react-native';

const dynamicStyles = (appStyles, colorScheme) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
        },
        logo: {
            width: 150,
            height: 150,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 20,
            marginTop: -180,
        },
        logoImage: {
            width: '100%',
            height: '100%',
            resizeMode: 'contain',
            // tintColor: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
        },
        title: {
            fontSize: 30,
            fontWeight: 'bold',
            color: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
            marginBottom: 10,
            textAlign: 'center',
            position: 'absolute',
            top: 30
        },
        linkText: {
            fontSize: 16,
            color: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
        },
        caption: {
            fontSize: 16,
            paddingHorizontal: 20,
            marginBottom: 20,
            textAlign: 'center',
            color: appStyles.colorSet[colorScheme].mainTextColor,
        },
        acceptContainer: {
            width: appStyles.sizeSet.buttonWidth,
            backgroundColor: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
            borderRadius: appStyles.sizeSet.radius,

            height: 45,
            justifyContent: 'center',
            alignItems: 'center',
            flex: 0.48
        },
        acceptText: {
            color: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
        },
        cancelContainer: {
            justifyContent: 'center',
            alignItems: 'center',
            width: appStyles.sizeSet.buttonWidth,
            backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
            borderRadius: appStyles.sizeSet.radius,
            borderWidth: Platform.OS === 'ios' ? 0.5 : 1.0,
            borderColor: appStyles.colorSet[colorScheme].mainThemeForegroundColor,

            height: 45,
            flex: 0.48
        },
        cancelText: {
            color: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
        },
        buttonGroup: {
            display: 'flex', flex: 1, flexDirection: 'row',
            paddingHorizontal: 20,
        }
    });
};

export default dynamicStyles;
