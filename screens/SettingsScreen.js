import React from 'react';
import {
  Button,
  Divider,
  Picker,
  ScreenContainer,
  SimpleStyleScrollView,
  Switch,
  Touchable,
  withTheme,
} from '@draftbit/ui';
import * as Linking from 'expo-linking';
import { Text, View } from 'react-native';
import * as GlobalStyles from '../GlobalStyles.js';
import * as SupabaseUsersApi from '../apis/SupabaseUsersApi.js';
import * as GlobalVariables from '../config/GlobalVariableContext';
import palettes from '../themes/palettes';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import useWindowDimensions from '../utils/useWindowDimensions';

const defaultProps = { TRUE: null };

const SettingsScreen = props => {
  const { theme, navigation } = props;
  const dimensions = useWindowDimensions();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const setGlobalVariableValue = GlobalVariables.useSetValue();
  const [confirmAccountDeleteDisplay, setConfirmAccountDeleteDisplay] =
    React.useState(null);
  const [pickerValue, setPickerValue] = React.useState('');
  const [pickerValue2, setPickerValue2] = React.useState('');
  const [switchRowValue, setSwitchRowValue] = React.useState(false);
  const [switchValue, setSwitchValue] = React.useState(false);
  const supabaseUsersUpdateDarkModePATCH =
    SupabaseUsersApi.useUpdateDarkModePATCH();
  const supabaseUsersUpdateMapStylePATCH =
    SupabaseUsersApi.useUpdateMapStylePATCH();
  const supabaseUsersDeleteAccountDELETE =
    SupabaseUsersApi.useDeleteAccountDELETE();

  return (
    <ScreenContainer
      hasSafeArea={false}
      scrollable={false}
      style={StyleSheet.applyWidth(
        { backgroundColor: Constants['backgroundColor'] },
        dimensions.width
      )}
    >
      <SimpleStyleScrollView
        bounces={true}
        horizontal={false}
        keyboardShouldPersistTaps={'never'}
        nestedScrollEnabled={false}
        showsHorizontalScrollIndicator={true}
        showsVerticalScrollIndicator={true}
        style={StyleSheet.applyWidth(
          { paddingLeft: 32, paddingRight: 32, paddingTop: 48 },
          dimensions.width
        )}
      >
        <View>
          {/* Dark Mode */}
          <Touchable
            style={StyleSheet.applyWidth(
              { marginBottom: 16 },
              dimensions.width
            )}
          >
            {/* Item */}
            <View
              style={StyleSheet.applyWidth(
                {
                  alignItems: 'center',
                  backgroundColor: Constants['backgroundColor'],
                  flexDirection: 'row',
                  height: 48,
                  justifyContent: 'space-between',
                  zIndex: -1,
                },
                dimensions.width
              )}
            >
              {/* Name */}
              <Text
                accessible={true}
                selectable={false}
                style={StyleSheet.applyWidth(
                  {
                    color: Constants['textColor'],
                    fontFamily: 'Inter_400Regular',
                    fontSize: 18,
                  },
                  dimensions.width
                )}
              >
                {'Dark Mode'}
              </Text>
              <Switch
                onValueChange={newSwitchValue => {
                  const handler = async () => {
                    try {
                      setGlobalVariableValue({
                        key: 'darkMode',
                        value: newSwitchValue,
                      });
                      (
                        await supabaseUsersUpdateDarkModePATCH.mutateAsync({
                          darkMode: Constants['darkMode'],
                          user_id: Constants['user_id'],
                        })
                      )?.json;
                      if (Constants['darkMode']) {
                        setGlobalVariableValue({
                          key: 'backgroundColor',
                          value: '#1C1C1C',
                        });
                        setGlobalVariableValue({
                          key: 'textColor',
                          value: '#FFFFFF',
                        });
                        setGlobalVariableValue({
                          key: 'dividerColor',
                          value: '#555555',
                        });
                      } else {
                        setGlobalVariableValue({
                          key: 'backgroundColor',
                          value: '#FDFDF5FF',
                        });
                        setGlobalVariableValue({
                          key: 'textColor',
                          value: '#333333',
                        });
                        setGlobalVariableValue({
                          key: 'dividerColor',
                          value: '#E0E0E0',
                        });
                      }
                    } catch (err) {
                      console.error(err);
                    }
                  };
                  handler();
                }}
                activeTrackColor={
                  palettes['Trail Twin']['Secondary Green #2 - Trail Twin']
                }
              />
            </View>
          </Touchable>
          {/* Map Style */}
          <View
            style={StyleSheet.applyWidth(
              {
                alignItems: 'center',
                flexDirection: 'row',
                height: 48,
                justifyContent: 'space-between',
                marginBottom: 32,
              },
              dimensions.width
            )}
          >
            {/* Map Style */}
            <Text
              accessible={true}
              selectable={false}
              style={StyleSheet.applyWidth(
                {
                  color: Constants['textColor'],
                  fontFamily: 'Inter_400Regular',
                  fontSize: 18,
                },
                dimensions.width
              )}
            >
              {'Map Style'}
            </Text>
            <Picker
              autoDismissKeyboard={true}
              dropDownBorderColor={theme.colors.border.brand}
              dropDownBorderRadius={8}
              dropDownBorderWidth={1}
              dropDownTextColor={theme.colors.text.strong}
              iconSize={24}
              onValueChange={newPickerValue => {
                const handler = async () => {
                  const pickerValue = newPickerValue;
                  try {
                    (
                      await supabaseUsersUpdateMapStylePATCH.mutateAsync({
                        mapStyle: 'iwinfosefnsldkjnfsdfdsfsdf',
                        user_id: Constants['user_id'],
                      })
                    )?.json;
                  } catch (err) {
                    console.error(err);
                  }
                };
                handler();
              }}
              selectedIconColor={theme.colors.text.strong}
              selectedIconName={'Feather/check'}
              selectedIconSize={20}
              dropDownBackgroundColor={
                palettes['Trail Twin']['White - Trail Twin']
              }
              leftIconMode={'inset'}
              mode={'dropdown'}
              options={[
                { label: 'Retro', value: 'retro' },
                { label: ':Lush', value: 'lush' },
                { label: 'Dark Mode', value: 'darkMode' },
                { label: 'Midnight', value: 'midnight' },
                { label: 'Silver', value: 'silver' },
                { label: 'Aubergine', value: 'aubergine' },
              ]}
              placeholder={''}
              rightIconName={'AntDesign/down'}
              style={StyleSheet.applyWidth(
                {
                  backgroundColor: palettes['Trail Twin']['White - Trail Twin'],
                  height: 40,
                  width: 100,
                  zIndex: 1,
                },
                dimensions.width
              )}
              type={'solid'}
              value={pickerValue}
            />
          </View>
          <Divider
            {...GlobalStyles.DividerStyles(theme)['Divider'].props}
            color={palettes.App['Custom Color 2']}
            style={StyleSheet.applyWidth(
              StyleSheet.compose(
                GlobalStyles.DividerStyles(theme)['Divider'].style,
                { marginBottom: 32, zIndex: -1 }
              ),
              dimensions.width
            )}
          />
          {/* FAQ */}
          <View
            style={StyleSheet.applyWidth(
              {
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                marginBottom: 12,
                paddingBottom: 16,
                paddingTop: 16,
              },
              dimensions.width
            )}
          >
            <Touchable
              onPress={() => {
                try {
                  navigation.navigate('FAQScreen');
                } catch (err) {
                  console.error(err);
                }
              }}
            >
              {/* FAQ */}
              <Text
                accessible={true}
                selectable={false}
                style={StyleSheet.applyWidth(
                  {
                    color: palettes.App.Studily_Blue_Night,
                    fontFamily: 'Inter_400Regular',
                    fontSize: 14,
                  },
                  dimensions.width
                )}
              >
                {'Frequently Asked Questions'}
              </Text>
            </Touchable>
          </View>
          {/* Contact */}
          <View
            style={StyleSheet.applyWidth(
              {
                alignItems: 'center',
                flexDirection: 'column',
                gap: 4,
                justifyContent: 'space-evenly',
                marginBottom: 12,
                paddingBottom: 16,
                paddingTop: 16,
              },
              dimensions.width
            )}
          >
            <Text
              accessible={true}
              selectable={false}
              style={StyleSheet.applyWidth(
                {
                  color: palettes.App.Studily_Blue_Night,
                  fontFamily: 'Inter_400Regular',
                  fontSize: 14,
                },
                dimensions.width
              )}
            >
              {'Contact Support:\n\n'}
            </Text>

            <Touchable
              onPress={() => {
                try {
                  Linking.openURL('https://mail.google.com/mail/u/0/#inbox');
                } catch (err) {
                  console.error(err);
                }
              }}
              style={StyleSheet.applyWidth(
                { marginBottom: 12 },
                dimensions.width
              )}
            >
              {/* Text 3 */}
              <Text
                accessible={true}
                selectable={false}
                style={StyleSheet.applyWidth(
                  {
                    color: Constants['textColor'],
                    fontFamily: 'Inter_400Regular',
                    fontSize: 14,
                    marginBottom: 4,
                    textDecorationLine: 'underline',
                  },
                  dimensions.width
                )}
              >
                {'owencclary@gmail.com'}
              </Text>
            </Touchable>
            {/* Touchable 2 */}
            <Touchable
              onPress={() => {
                try {
                  Linking.openURL('https://mail.google.com/mail/u/0/#inbox');
                } catch (err) {
                  console.error(err);
                }
              }}
            >
              {/* Text 2 */}
              <Text
                accessible={true}
                selectable={false}
                style={StyleSheet.applyWidth(
                  {
                    color: Constants['textColor'],
                    fontFamily: 'Inter_400Regular',
                    fontSize: 14,
                    textDecorationLine: 'underline',
                  },
                  dimensions.width
                )}
              >
                {'spook.devv@gmail.com\n'}
              </Text>
            </Touchable>
          </View>
          {/* Blocked User */}
          <View
            style={StyleSheet.applyWidth(
              {
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                marginBottom: 12,
                paddingBottom: 16,
                paddingTop: 16,
                zIndex: -1,
              },
              dimensions.width
            )}
          >
            <Touchable
              onPress={() => {
                try {
                  navigation.navigate('BlockedUsersScreen');
                } catch (err) {
                  console.error(err);
                }
              }}
            >
              <Text
                accessible={true}
                selectable={false}
                style={StyleSheet.applyWidth(
                  {
                    color: palettes.App.Peoplebit_Salmon_Red,
                    fontFamily: 'Inter_400Regular',
                    fontSize: 14,
                  },
                  dimensions.width
                )}
              >
                {'Blocked Users'}
              </Text>
            </Touchable>
          </View>
          {/* Delete Account */}
          <View
            style={StyleSheet.applyWidth(
              {
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                marginBottom: 12,
                paddingBottom: 16,
                paddingTop: 16,
                zIndex: -1,
              },
              dimensions.width
            )}
          >
            <Touchable
              onPress={() => {
                try {
                  setConfirmAccountDeleteDisplay(true);
                } catch (err) {
                  console.error(err);
                }
              }}
            >
              <Text
                accessible={true}
                selectable={false}
                style={StyleSheet.applyWidth(
                  {
                    color: palettes.App.Peoplebit_Salmon_Red,
                    fontFamily: 'Inter_400Regular',
                    fontSize: 14,
                  },
                  dimensions.width
                )}
              >
                {'Delete Account'}
              </Text>
            </Touchable>
          </View>
          {/* Confirm Account Deletion */}
          <>
            {!confirmAccountDeleteDisplay ? null : (
              <View
                style={StyleSheet.applyWidth(
                  {
                    alignItems: 'center',
                    backgroundColor:
                      palettes['Trail Twin']['White - Trail Twin'],
                    borderBottomLeftRadius: 8,
                    borderBottomRightRadius: 8,
                    borderColor: theme.colors.border.brand,
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                    borderWidth: 1,
                    bottom: -60,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    paddingBottom: 16,
                    paddingLeft: 8,
                    paddingRight: 8,
                    paddingTop: 16,
                    position: 'absolute',
                    zIndex: 1,
                  },
                  dimensions.width
                )}
              >
                <Text
                  accessible={true}
                  selectable={false}
                  style={StyleSheet.applyWidth(
                    {
                      color: theme.colors.text.strong,
                      fontFamily: 'Inter_400Regular',
                      fontSize: 14,
                      marginBottom: 16,
                    },
                    dimensions.width
                  )}
                >
                  {'Are you sure you want to delete your account?'}
                </Text>

                <View
                  style={StyleSheet.applyWidth(
                    {
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      width: '100%',
                    },
                    dimensions.width
                  )}
                >
                  {/* Yes */}
                  <Button
                    accessible={true}
                    iconPosition={'left'}
                    onPress={() => {
                      const handler = async () => {
                        try {
                          (
                            await supabaseUsersDeleteAccountDELETE.mutateAsync({
                              id: 597,
                            })
                          )?.json;
                          setGlobalVariableValue({
                            key: 'user_id',
                            value: null,
                          });
                          setGlobalVariableValue({
                            key: 'usersName',
                            value: null,
                          });
                          setGlobalVariableValue({
                            key: 'AUTHORIZATION_HEADER',
                            value: null,
                          });
                          navigation.navigate('SignUpScreen');
                        } catch (err) {
                          console.error(err);
                        }
                      };
                      handler();
                    }}
                    {...GlobalStyles.ButtonStyles(theme)['Button'].props}
                    style={StyleSheet.applyWidth(
                      StyleSheet.compose(
                        GlobalStyles.ButtonStyles(theme)['Button'].style,
                        {
                          backgroundColor: palettes.App.Peoplebit_Salmon_Red,
                          width: 80,
                        }
                      ),
                      dimensions.width
                    )}
                    title={'Yes'}
                  />
                  {/* No */}
                  <Button
                    accessible={true}
                    iconPosition={'left'}
                    onPress={() => {
                      try {
                        setConfirmAccountDeleteDisplay(null);
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                    {...GlobalStyles.ButtonStyles(theme)['Button'].props}
                    style={StyleSheet.applyWidth(
                      StyleSheet.compose(
                        GlobalStyles.ButtonStyles(theme)['Button'].style,
                        {
                          backgroundColor:
                            palettes['Trail Twin'][
                              'Secondary Green #2 - Trail Twin'
                            ],
                          width: 80,
                        }
                      ),
                      dimensions.width
                    )}
                    title={'No'}
                  />
                </View>
              </View>
            )}
          </>
        </View>
      </SimpleStyleScrollView>
    </ScreenContainer>
  );
};

export default withTheme(SettingsScreen);
