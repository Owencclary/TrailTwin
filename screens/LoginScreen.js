import React from 'react';
import {
  Button,
  LoadingIndicator,
  ScreenContainer,
  SimpleStyleKeyboardAwareScrollView,
  TextInput,
  Touchable,
  withTheme,
} from '@draftbit/ui';
import { useIsFocused } from '@react-navigation/native';
import { Image, Text, View } from 'react-native';
import * as GlobalStyles from '../GlobalStyles.js';
import * as SupabaseAuthApi from '../apis/SupabaseAuthApi.js';
import * as GlobalVariables from '../config/GlobalVariableContext';
import Images from '../config/Images';
import posthogEventCapture from '../global-functions/posthogEventCapture';
import posthogEventCaptureSetPersonId from '../global-functions/posthogEventCaptureSetPersonId';
import palettes from '../themes/palettes';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import imageSource from '../utils/imageSource';
import useWindowDimensions from '../utils/useWindowDimensions';
import waitUtil from '../utils/wait';

const LoginScreen = props => {
  const { theme, navigation } = props;
  const dimensions = useWindowDimensions();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const setGlobalVariableValue = GlobalVariables.useSetValue();
  const [emailInputV1, setEmailInputV1] = React.useState('');
  const [error_message, setError_message] = React.useState(null);
  const [loginEmail, setLoginEmail] = React.useState('');
  const [loginPassword, setLoginPassword] = React.useState('');
  const [passwordInputV1, setPasswordInputV1] = React.useState('');
  const [textInputValue, setTextInputValue] = React.useState('');
  const checkLoginStatus = status => {
    if (status === '200 OK') {
      return true;
    }
    return false;
  };
  const isFocused = useIsFocused();
  React.useEffect(() => {
    try {
      if (!isFocused) {
        return;
      }
      setGlobalVariableValue({
        key: 'loading',
        value: false,
      });
      console.log(Constants['AUTHORIZATION_HEADER'], '< AUTH');
      console.log(Constants['user_id'], '< ID');
      console.log(Constants['usersName'], '< NAME');
      if (Constants['AUTHORIZATION_HEADER']) {
        if (Constants['user_id']) {
          if (Constants['usersName']) {
            setGlobalVariableValue({
              key: 'searchRadius',
              value: 65000,
            });
            navigation.navigate('BottomTabNavigator', {
              screen: 'FindRidesTab',
              params: { screen: 'FindRidesScreen' },
            });
            posthogEventCaptureSetPersonId('user_logged_in', 'user_id');
          } else {
          }
        } else {
        }
      } else {
      }
    } catch (err) {
      console.error(err);
    }
  }, [isFocused]);

  return (
    <ScreenContainer
      hasBottomSafeArea={false}
      hasLeftSafeArea={false}
      hasRightSafeArea={false}
      hasSafeArea={false}
      hasTopSafeArea={false}
      scrollable={false}
      style={StyleSheet.applyWidth(
        { backgroundColor: Constants['backgroundColor'] },
        dimensions.width
      )}
    >
      <Image
        resizeMode={'cover'}
        {...GlobalStyles.ImageStyles(theme)['Image 2'].props}
        source={imageSource(Images['federicobottosz3ncesezqgiunsplash'])}
        style={StyleSheet.applyWidth(
          StyleSheet.compose(GlobalStyles.ImageStyles(theme)['Image 2'].style, {
            height: '100%',
            position: 'absolute',
            width: '100%',
          }),
          dimensions.width
        )}
      />
      <SimpleStyleKeyboardAwareScrollView
        enableResetScrollToCoords={false}
        viewIsInsideTabBar={false}
        enableAutomaticScroll={true}
        enableOnAndroid={true}
        keyboardShouldPersistTaps={'always'}
        showsVerticalScrollIndicator={false}
        style={StyleSheet.applyWidth(
          { height: '100%', width: '100%' },
          dimensions.width
        )}
      >
        {/* Header */}
        <View
          style={StyleSheet.applyWidth(
            {
              alignItems: 'center',
              height: '25%',
              justifyContent: 'center',
              position: 'relative',
              width: '100%',
              zIndex: 1,
            },
            dimensions.width
          )}
        >
          {/* Heading */}
          <Text
            accessible={true}
            selectable={false}
            style={StyleSheet.applyWidth(
              {
                color: palettes['Trail Twin']['White - Trail Twin'],
                fontFamily: 'Inter_300Light',
                fontSize: 48,
              },
              dimensions.width
            )}
          >
            {'Log in'}
          </Text>
        </View>

        <View
          style={StyleSheet.applyWidth(
            { justifyContent: 'center', zIndex: 1 },
            dimensions.width
          )}
        >
          {/* Form */}
          <View
            style={StyleSheet.applyWidth(
              {
                backgroundColor: [
                  {
                    minWidth: Breakpoints.Mobile,
                    value: palettes['Trail Twin']['White - Trail Twin'],
                  },
                  {
                    minWidth: Breakpoints.Mobile,
                    value: Constants['backgroundColor'],
                  },
                ],
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
                borderColor: Constants['dividerColor'],
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                bottom: -30,
                flex: 1,
                justifyContent: 'center',
                overflow: 'hidden',
                paddingBottom: 128,
                paddingLeft: 20,
                paddingRight: 20,
                paddingTop: 64,
                position: 'relative',
              },
              dimensions.width
            )}
          >
            {/* Error Message */}
            <View
              style={StyleSheet.applyWidth(
                {
                  paddingLeft: 24,
                  position: 'absolute',
                  top: 50,
                  width: '100%',
                },
                dimensions.width
              )}
            >
              {/* Error Message */}
              <Text
                accessible={true}
                selectable={false}
                {...GlobalStyles.TextStyles(theme)['Text 2'].props}
                style={StyleSheet.applyWidth(
                  StyleSheet.compose(
                    GlobalStyles.TextStyles(theme)['Text 2'].style,
                    {
                      color: [
                        { minWidth: Breakpoints.Mobile, value: null },
                        {
                          minWidth: Breakpoints.Mobile,
                          value: Constants['textColor'],
                        },
                      ],
                      fontFamily: 'Inter_400Regular',
                      fontSize: 14,
                    }
                  ),
                  dimensions.width
                )}
              >
                {error_message}
                {'\n'}
              </Text>
            </View>
            {/* Email */}
            <View
              style={StyleSheet.applyWidth({ marginTop: 20 }, dimensions.width)}
            >
              {/* Label */}
              <Text
                accessible={true}
                selectable={false}
                style={StyleSheet.applyWidth(
                  {
                    color: Constants['textColor'],
                    fontFamily: 'Inter_400Regular',
                    fontSize: 12,
                  },
                  dimensions.width
                )}
              >
                {'Email'}
              </Text>
              <TextInput
                autoCapitalize={'none'}
                changeTextDelay={500}
                onChangeText={newTextInputValue => {
                  try {
                    setEmailInputV1(newTextInputValue);
                  } catch (err) {
                    console.error(err);
                  }
                }}
                webShowOutline={true}
                autoCorrect={false}
                editable={true}
                placeholder={'Your email'}
                placeholderTextColor={theme.colors.text.strong}
                style={StyleSheet.applyWidth(
                  {
                    backgroundColor:
                      palettes['Trail Twin']['White - Trail Twin'],
                    borderBottomWidth: 1,
                    borderColor: theme.colors.border.brand,
                    borderLeftWidth: 1,
                    borderRadius: 10,
                    borderRightWidth: 1,
                    borderTopWidth: 1,
                    color: theme.colors.text.strong,
                    fontFamily: 'Inter_400Regular',
                    fontSize: 12,
                    height: 48,
                    marginTop: 10,
                    paddingBottom: 8,
                    paddingLeft: 15,
                    paddingRight: 8,
                    paddingTop: 8,
                  },
                  dimensions.width
                )}
                value={emailInputV1}
              />
            </View>
            {/* Password */}
            <View
              style={StyleSheet.applyWidth({ marginTop: 20 }, dimensions.width)}
            >
              {/* Label */}
              <Text
                accessible={true}
                selectable={false}
                style={StyleSheet.applyWidth(
                  {
                    color: [
                      {
                        minWidth: Breakpoints.Mobile,
                        value: theme.colors.text.strong,
                      },
                      {
                        minWidth: Breakpoints.Mobile,
                        value: Constants['textColor'],
                      },
                    ],
                    fontFamily: 'Inter_400Regular',
                    fontSize: 12,
                  },
                  dimensions.width
                )}
              >
                {'Password'}
              </Text>
              <TextInput
                autoCapitalize={'none'}
                changeTextDelay={500}
                onChangeText={newTextInputValue => {
                  try {
                    setPasswordInputV1(newTextInputValue);
                  } catch (err) {
                    console.error(err);
                  }
                }}
                webShowOutline={true}
                autoCorrect={false}
                editable={true}
                placeholder={'********'}
                placeholderTextColor={theme.colors.text.strong}
                secureTextEntry={true}
                style={StyleSheet.applyWidth(
                  {
                    backgroundColor:
                      palettes['Trail Twin']['White - Trail Twin'],
                    borderBottomWidth: 1,
                    borderColor: theme.colors.border.brand,
                    borderLeftWidth: 1,
                    borderRadius: 10,
                    borderRightWidth: 1,
                    borderTopWidth: 1,
                    color: theme.colors.text.strong,
                    fontFamily: 'Inter_400Regular',
                    fontSize: 12,
                    height: 48,
                    marginTop: 10,
                    paddingBottom: 8,
                    paddingLeft: 15,
                    paddingRight: 8,
                    paddingTop: 8,
                  },
                  dimensions.width
                )}
                value={passwordInputV1}
              />
            </View>
            {/* Already have an account  */}
            <View
              style={StyleSheet.applyWidth(
                {
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginTop: 32,
                },
                dimensions.width
              )}
            >
              <Text
                accessible={true}
                selectable={false}
                style={StyleSheet.applyWidth(
                  {
                    color: [
                      {
                        minWidth: Breakpoints.Mobile,
                        value: theme.colors.text.strong,
                      },
                      {
                        minWidth: Breakpoints.Mobile,
                        value: Constants['textColor'],
                      },
                    ],
                    fontFamily: 'Inter_400Regular',
                    fontSize: 12,
                  },
                  dimensions.width
                )}
              >
                {"Don't have an account?"}
              </Text>

              <Touchable
                onPress={() => {
                  try {
                    navigation.navigate('SignUpScreen');
                  } catch (err) {
                    console.error(err);
                  }
                }}
                style={StyleSheet.applyWidth(
                  { marginLeft: 8 },
                  dimensions.width
                )}
              >
                <Text
                  accessible={true}
                  selectable={false}
                  style={StyleSheet.applyWidth(
                    {
                      color:
                        palettes['Trail Twin']['Primary Green - Trail Twin'],
                      fontFamily: 'Inter_400Regular',
                      fontSize: 12,
                    },
                    dimensions.width
                  )}
                >
                  {'Sign up'}
                </Text>
              </Touchable>
            </View>
            {/* Login Button */}
            <View
              style={StyleSheet.applyWidth(
                {
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 48,
                },
                dimensions.width
              )}
            >
              {/* Log in Button */}
              <>
                {Constants['loading'] ? null : (
                  <Button
                    accessible={true}
                    iconPosition={'left'}
                    onPress={() => {
                      const handler = async () => {
                        try {
                          setGlobalVariableValue({
                            key: 'loading',
                            value: true,
                          });
                          const loginResponseJson = (
                            await SupabaseAuthApi.loginPOST(Constants, {
                              loginEmail: emailInputV1,
                              loginPassword: passwordInputV1,
                            })
                          )?.json;
                          const message = loginResponseJson?.['msg'];
                          if (message) {
                            setError_message(message);
                            await waitUtil({ milliseconds: 2000 });
                            setGlobalVariableValue({
                              key: 'loading',
                              value: false,
                            });
                            setError_message(null);
                          } else {
                            const accessToken =
                              loginResponseJson?.['access_token'];
                            const extractedUserID =
                              loginResponseJson?.['user']['id'];
                            setGlobalVariableValue({
                              key: 'AUTHORIZATION_HEADER',
                              value: 'Bearer ' + accessToken,
                            });
                            setGlobalVariableValue({
                              key: 'user_id',
                              value: extractedUserID,
                            });
                            setGlobalVariableValue({
                              key: 'searchRadius',
                              value: 65000,
                            });
                            await waitUtil({ milliseconds: 500 });
                            navigation.navigate('BottomTabNavigator', {
                              screen: 'FindRidesTab',
                              params: { screen: 'FindRidesScreen' },
                            });
                            /* hidden 'Run a Custom Function' action */
                            posthogEventCaptureSetPersonId(
                              'user_logged_in',
                              extractedUserID
                            );
                          }
                        } catch (err) {
                          console.error(err);
                        }
                      };
                      handler();
                    }}
                    style={StyleSheet.applyWidth(
                      {
                        backgroundColor:
                          palettes['Trail Twin'][
                            'Secondary Green #2 - Trail Twin'
                          ],
                        borderRadius: 8,
                        fontFamily: 'Inter_600SemiBold',
                        height: 5,
                        textAlign: 'center',
                        width: '100%',
                      },
                      dimensions.width
                    )}
                    title={'Log in'}
                  />
                )}
              </>
              <>
                {!Constants['loading'] ? null : (
                  <LoadingIndicator
                    size={30}
                    color={palettes.Brand['Secondary Grey']}
                    type={'flow'}
                  />
                )}
              </>
            </View>
          </View>
        </View>
      </SimpleStyleKeyboardAwareScrollView>
    </ScreenContainer>
  );
};

export default withTheme(LoginScreen);
