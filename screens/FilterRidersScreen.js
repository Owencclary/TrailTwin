import React from 'react';
import {
  Button,
  LoadingIndicator,
  MultiSelectPicker,
  NumberInput,
  ScreenContainer,
  SimpleStyleKeyboardAwareScrollView,
  TextInput,
  withTheme,
} from '@draftbit/ui';
import { useIsFocused } from '@react-navigation/native';
import { Text, View } from 'react-native';
import * as GlobalStyles from '../GlobalStyles.js';
import * as GlobalVariables from '../config/GlobalVariableContext';
import palettes from '../themes/palettes';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import useWindowDimensions from '../utils/useWindowDimensions';
import waitUtil from '../utils/wait';

const FilterRidersScreen = props => {
  const { theme, navigation } = props;
  const dimensions = useWindowDimensions();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const setGlobalVariableValue = GlobalVariables.useSetValue();
  const [ampm, setAmpm] = React.useState(null);
  const [lookingForInput, setLookingForInput] = React.useState([]);
  const [pickerValue, setPickerValue] = React.useState('');
  const [ridingStyleInput, setRidingStyleInput] = React.useState([]);
  const [skillLevelInput, setSkillLevelInput] = React.useState([]);
  const [sliderValue, setSliderValue] = React.useState(0);
  const [textAreaValue, setTextAreaValue] = React.useState('');
  const [textInputValue, setTextInputValue] = React.useState('');
  const [userAgeInput, setUserAgeInput] = React.useState(0);
  const checkForNoFilter = value => {
    const specialValues = ['Any Skill Level', 'Any Type'];

    if (specialValues.includes(value)) {
      return null;
    }

    return value;
  };

  const metersToMile = meters => {
    const metersInAMile = 1609.34;
    const miles = meters / metersInAMile;
    return Math.floor(miles);
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
    } catch (err) {
      console.error(err);
    }
  }, [isFocused]);

  return (
    <ScreenContainer
      scrollable={false}
      hasSafeArea={false}
      hasTopSafeArea={true}
      style={StyleSheet.applyWidth(
        { backgroundColor: Constants['backgroundColor'] },
        dimensions.width
      )}
    >
      <SimpleStyleKeyboardAwareScrollView
        enableResetScrollToCoords={false}
        showsVerticalScrollIndicator={true}
        enableAutomaticScroll={true}
        enableOnAndroid={true}
        keyboardShouldPersistTaps={'always'}
        style={StyleSheet.applyWidth(
          { height: '100%', width: '100%' },
          dimensions.width
        )}
        viewIsInsideTabBar={false}
      >
        <View
          style={StyleSheet.applyWidth(
            {
              backgroundColor: [
                {
                  minWidth: Breakpoints.Mobile,
                  value: palettes['Trail Twin']['Background - Trail Twin'],
                },
                {
                  minWidth: Breakpoints.Mobile,
                  value: Constants['backgroundColor'],
                },
              ],
              gap: 48,
              paddingBottom: 128,
              paddingLeft: 32,
              paddingRight: 32,
              paddingTop: 72,
            },
            dimensions.width
          )}
        >
          {/* Name */}
          <View
            style={StyleSheet.applyWidth(
              {
                alignItems: 'stretch',
                flex: 1,
                justifyContent: 'space-evenly',
              },
              dimensions.width
            )}
          >
            {/* Name */}
            <View
              style={StyleSheet.applyWidth(
                { position: 'relative' },
                dimensions.width
              )}
            >
              {/* Label */}
              <Text
                accessible={true}
                selectable={false}
                style={StyleSheet.applyWidth(
                  {
                    color: Constants['textColor'],
                    fontFamily: 'Inter_400Regular',
                    fontSize: 16,
                    marginBottom: 8,
                    opacity: 0.85,
                  },
                  dimensions.width
                )}
              >
                {'Name'}
              </Text>
              <TextInput
                autoCapitalize={'none'}
                autoCorrect={true}
                changeTextDelay={500}
                onChangeText={newTextInputValue => {
                  try {
                    setGlobalVariableValue({
                      key: 'userNameFilter',
                      value: newTextInputValue,
                    });
                  } catch (err) {
                    console.error(err);
                  }
                }}
                webShowOutline={true}
                {...GlobalStyles.TextInputStyles(theme)['Text Input'].props}
                placeholder={'Enter a name'}
                style={StyleSheet.applyWidth(
                  StyleSheet.compose(
                    GlobalStyles.TextInputStyles(theme)['Text Input'].style,
                    {
                      backgroundColor:
                        palettes['Trail Twin']['White - Trail Twin'],
                      borderColor: palettes.Brand['Secondary Grey'],
                      color: theme.colors.text.strong,
                      fontFamily: 'Inter_300Light',
                      paddingBottom: 18,
                      paddingLeft: 16,
                      paddingRight: 16,
                      paddingTop: 18,
                    }
                  ),
                  dimensions.width
                )}
                value={Constants['userNameFilter']}
              />
            </View>
          </View>
          {/* Location */}
          <View
            style={StyleSheet.applyWidth(
              {
                alignItems: 'stretch',
                flex: 1,
                justifyContent: 'space-evenly',
              },
              dimensions.width
            )}
          >
            {/* Name */}
            <View
              style={StyleSheet.applyWidth(
                { position: 'relative' },
                dimensions.width
              )}
            >
              {/* Label */}
              <Text
                accessible={true}
                selectable={false}
                style={StyleSheet.applyWidth(
                  {
                    color: Constants['textColor'],
                    fontFamily: 'Inter_400Regular',
                    fontSize: 16,
                    marginBottom: 8,
                    opacity: 0.85,
                  },
                  dimensions.width
                )}
              >
                {'Location'}
              </Text>
              <TextInput
                autoCapitalize={'none'}
                autoCorrect={true}
                changeTextDelay={500}
                onChangeText={newTextInputValue => {
                  try {
                    setGlobalVariableValue({
                      key: 'userLocationFilter',
                      value: newTextInputValue,
                    });
                  } catch (err) {
                    console.error(err);
                  }
                }}
                webShowOutline={true}
                {...GlobalStyles.TextInputStyles(theme)['Text Input'].props}
                placeholder={'Enter a location'}
                style={StyleSheet.applyWidth(
                  StyleSheet.compose(
                    GlobalStyles.TextInputStyles(theme)['Text Input'].style,
                    {
                      backgroundColor:
                        palettes['Trail Twin']['White - Trail Twin'],
                      borderColor: palettes.Brand['Secondary Grey'],
                      color: theme.colors.text.strong,
                      fontFamily: 'Inter_300Light',
                      paddingBottom: 18,
                      paddingLeft: 16,
                      paddingRight: 16,
                      paddingTop: 18,
                    }
                  ),
                  dimensions.width
                )}
                value={Constants['userLocationFilter']}
              />
            </View>
          </View>
          {/* Age */}
          <View>
            <Text
              accessible={true}
              selectable={false}
              style={StyleSheet.applyWidth(
                {
                  color: Constants['textColor'],
                  fontFamily: 'Inter_400Regular',
                  fontSize: 16,
                },
                dimensions.width
              )}
            >
              {'Age'}
            </Text>
            <NumberInput
              changeTextDelay={500}
              onChangeText={newNumberInputValue => {
                try {
                  setGlobalVariableValue({
                    key: 'userAgeFilter',
                    value: newNumberInputValue,
                  });
                } catch (err) {
                  console.error(err);
                }
              }}
              webShowOutline={true}
              {...GlobalStyles.NumberInputStyles(theme)['Number Input'].props}
              placeholder={'0'}
              style={StyleSheet.applyWidth(
                StyleSheet.compose(
                  GlobalStyles.NumberInputStyles(theme)['Number Input'].style,
                  {
                    backgroundColor:
                      palettes['Trail Twin']['White - Trail Twin'],
                    borderColor: palettes.Brand['Secondary Grey'],
                    height: 48,
                    marginTop: 12,
                    paddingLeft: 20,
                    width: '100%',
                  }
                ),
                dimensions.width
              )}
              value={Constants['userAgeFilter']}
            />
          </View>
          {/* Skill Level */}
          <View
            style={StyleSheet.applyWidth(
              {
                alignItems: 'stretch',
                flex: 1,
                justifyContent: 'space-evenly',
                zIndex: 1,
              },
              dimensions.width
            )}
          >
            {/* Skill */}
            <View
              style={StyleSheet.applyWidth(
                { position: 'relative' },
                dimensions.width
              )}
            >
              {/* Label */}
              <Text
                accessible={true}
                selectable={false}
                style={StyleSheet.applyWidth(
                  {
                    color: Constants['textColor'],
                    fontFamily: 'Inter_400Regular',
                    fontSize: 16,
                    marginBottom: 8,
                    opacity: 0.85,
                  },
                  dimensions.width
                )}
              >
                {'Skill Level'}
              </Text>
              <MultiSelectPicker
                autoDismissKeyboard={true}
                dropDownBorderColor={theme.colors.border.brand}
                dropDownBorderRadius={8}
                dropDownBorderWidth={1}
                dropDownTextColor={theme.colors.text.strong}
                iconSize={24}
                leftIconMode={'inset'}
                onValueChange={newMultiSelectPickerValue => {
                  try {
                    setSkillLevelInput(newMultiSelectPickerValue);
                  } catch (err) {
                    console.error(err);
                  }
                }}
                selectedIconColor={theme.colors.text.strong}
                selectedIconName={'Feather/check'}
                selectedIconSize={20}
                type={'solid'}
                dropDownBackgroundColor={
                  palettes['Trail Twin']['White - Trail Twin']
                }
                options={[
                  { label: 'Any Skill Level', value: 'Any Skill Level' },
                  { label: 'Beginner', value: 'Beginner' },
                  { label: 'Intermediate', value: 'Intermediate' },
                  { label: 'Advanced', value: 'Advanced' },
                  { label: 'Pro', value: 'Pro' },
                ]}
                placeholder={'Select options'}
                rightIconName={'AntDesign/down'}
                style={StyleSheet.applyWidth(
                  {
                    backgroundColor: palettes.Brand.Surface,
                    borderColor: palettes.Brand['Secondary Grey'],
                    color: palettes.Brand['Secondary Text'],
                    fontFamily: 'Inter_300Light',
                    position: 'relative',
                    zIndex: 1,
                  },
                  dimensions.width
                )}
                value={skillLevelInput}
              />
            </View>
          </View>
          {/* Riding Style */}
          <View
            style={StyleSheet.applyWidth(
              {
                alignItems: 'stretch',
                flex: 1,
                justifyContent: 'space-evenly',
                zIndex: 0,
              },
              dimensions.width
            )}
          >
            {/* Riding Style */}
            <View
              style={StyleSheet.applyWidth(
                { position: 'relative' },
                dimensions.width
              )}
            >
              {/* Label */}
              <Text
                accessible={true}
                selectable={false}
                style={StyleSheet.applyWidth(
                  {
                    color: Constants['textColor'],
                    fontFamily: 'Inter_400Regular',
                    fontSize: 16,
                    marginBottom: 8,
                    opacity: 0.85,
                  },
                  dimensions.width
                )}
              >
                {'Riding Style'}
              </Text>
              <MultiSelectPicker
                autoDismissKeyboard={true}
                dropDownBorderColor={theme.colors.border.brand}
                dropDownBorderRadius={8}
                dropDownBorderWidth={1}
                dropDownTextColor={theme.colors.text.strong}
                iconSize={24}
                leftIconMode={'inset'}
                onValueChange={newMultiSelectPickerValue => {
                  try {
                    setRidingStyleInput(newMultiSelectPickerValue);
                  } catch (err) {
                    console.error(err);
                  }
                }}
                selectedIconColor={theme.colors.text.strong}
                selectedIconName={'Feather/check'}
                selectedIconSize={20}
                type={'solid'}
                dropDownBackgroundColor={
                  palettes['Trail Twin']['White - Trail Twin']
                }
                options={[
                  { label: 'Downhill', value: 'Downhill' },
                  { label: 'Enduro', value: 'Enduro' },
                  { label: 'Freeride', value: 'Freeride' },
                  { label: 'Tech', value: 'Tech' },
                  { label: 'Flow', value: 'Flow' },
                  { label: 'Jumps', value: 'Jumps' },
                  { label: 'Tricks', value: 'Tricks' },
                  { label: 'Trail Builder', value: 'Trail Builder' },
                ]}
                placeholder={'Select options'}
                rightIconName={'AntDesign/down'}
                style={StyleSheet.applyWidth(
                  {
                    backgroundColor:
                      palettes['Trail Twin']['White - Trail Twin'],
                    borderColor: palettes.Brand['Secondary Grey'],
                    color: palettes.Brand['Secondary Text'],
                    fontFamily: 'Inter_300Light',
                    position: 'relative',
                  },
                  dimensions.width
                )}
                value={ridingStyleInput}
              />
            </View>
          </View>
          {/* Looking For */}
          <View
            style={StyleSheet.applyWidth(
              {
                alignItems: 'stretch',
                flex: 1,
                justifyContent: 'space-evenly',
                zIndex: -1,
              },
              dimensions.width
            )}
          >
            {/* Looking For */}
            <View
              style={StyleSheet.applyWidth(
                { position: 'relative' },
                dimensions.width
              )}
            >
              {/* Label */}
              <Text
                accessible={true}
                selectable={false}
                style={StyleSheet.applyWidth(
                  {
                    color: Constants['textColor'],
                    fontFamily: 'Inter_400Regular',
                    fontSize: 16,
                    marginBottom: 8,
                    opacity: 0.85,
                  },
                  dimensions.width
                )}
              >
                {'Looking For'}
              </Text>
              <MultiSelectPicker
                autoDismissKeyboard={true}
                dropDownBorderColor={theme.colors.border.brand}
                dropDownBorderRadius={8}
                dropDownBorderWidth={1}
                dropDownTextColor={theme.colors.text.strong}
                iconSize={24}
                leftIconMode={'inset'}
                onValueChange={newMultiSelectPickerValue => {
                  try {
                    setLookingForInput(newMultiSelectPickerValue);
                  } catch (err) {
                    console.error(err);
                  }
                }}
                selectedIconColor={theme.colors.text.strong}
                selectedIconName={'Feather/check'}
                selectedIconSize={20}
                type={'solid'}
                dropDownBackgroundColor={
                  palettes['Trail Twin']['White - Trail Twin']
                }
                options={[
                  { label: 'Group Rides', value: 'Group Rides' },
                  { label: 'Riding Partners', value: 'Riding Partners' },
                  { label: 'Training Partners', value: 'Training Partners' },
                  { label: 'Casual Riders', value: 'Casual Riders' },
                  { label: 'Serious Riders', value: 'Serious Riders' },
                  { label: 'Trail Work', value: 'Trail Work' },
                  { label: 'Coaching', value: 'Coaching' },
                  { label: 'Races', value: 'Races' },
                  { label: 'E-Bike Rides', value: 'E-Bike Rides' },
                ]}
                placeholder={'Select options'}
                rightIconName={'AntDesign/down'}
                style={StyleSheet.applyWidth(
                  {
                    backgroundColor: palettes.Brand.Surface,
                    borderColor: palettes.Brand['Secondary Grey'],
                    color: palettes.Brand['Secondary Text'],
                    fontFamily: 'Inter_300Light',
                    position: 'relative',
                  },
                  dimensions.width
                )}
                value={lookingForInput}
              />
            </View>
          </View>
          {/* Apply view */}
          <View
            style={StyleSheet.applyWidth(
              { alignItems: 'center', justifyContent: 'center', zIndex: -2 },
              dimensions.width
            )}
          >
            {/* Apply filter */}
            <>
              {Constants['loading'] ? null : (
                <Button
                  accessible={true}
                  iconPosition={'left'}
                  onPress={() => {
                    try {
                      setGlobalVariableValue({
                        key: 'loading',
                        value: true,
                      });
                      setGlobalVariableValue({
                        key: 'userSkillLevelFilter',
                        value: skillLevelInput,
                      });
                      setGlobalVariableValue({
                        key: 'userRidingStyleFilter',
                        value: ridingStyleInput,
                      });
                      setGlobalVariableValue({
                        key: 'userLookingForFilter',
                        value: lookingForInput,
                      });
                      navigation.navigate('BottomTabNavigator', {
                        screen: 'MeetRidersTab',
                        params: { screen: 'MeetRidersScreen' },
                      });
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                  style={StyleSheet.applyWidth(
                    {
                      backgroundColor:
                        palettes['Trail Twin']['Primary Green - Trail Twin'],
                      borderRadius: 8,
                      fontFamily: 'Inter_500Medium',
                      fontSize: 14,
                      height: 5,
                      textAlign: 'center',
                      width: '100%',
                    },
                    dimensions.width
                  )}
                  title={'Apply Filter'}
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
          {/* remove filter */}
          <View
            style={StyleSheet.applyWidth(
              { marginBottom: 256, zIndex: -2 },
              dimensions.width
            )}
          >
            {/* Clear Filter */}
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
                        setGlobalVariableValue({
                          key: 'userAgeFilter',
                          value: null,
                        });
                        setGlobalVariableValue({
                          key: 'userNameFilter',
                          value: null,
                        });
                        setGlobalVariableValue({
                          key: 'userLocationFilter',
                          value: null,
                        });
                        setGlobalVariableValue({
                          key: 'userLookingForFilter',
                          value: null,
                        });
                        setGlobalVariableValue({
                          key: 'userSkillLevelFilter',
                          value: null,
                        });
                        setGlobalVariableValue({
                          key: 'userRidingStyleFilter',
                          value: null,
                        });
                        setSkillLevelInput(null);
                        setRidingStyleInput(null);
                        setLookingForInput(null);
                        await waitUtil({ milliseconds: 300 });
                        navigation.navigate('BottomTabNavigator', {
                          screen: 'MeetRidersTab',
                          params: { screen: 'MeetRidersScreen' },
                        });
                      } catch (err) {
                        console.error(err);
                      }
                    };
                    handler();
                  }}
                  style={StyleSheet.applyWidth(
                    {
                      backgroundColor: palettes.App.Peoplebit_Salmon_Red,
                      borderRadius: 8,
                      fontFamily: 'Inter_500Medium',
                      fontSize: 14,
                      height: 5,
                      textAlign: 'center',
                    },
                    dimensions.width
                  )}
                  title={'Remove Filter'}
                />
              )}
            </>
          </View>
        </View>
      </SimpleStyleKeyboardAwareScrollView>
    </ScreenContainer>
  );
};

export default withTheme(FilterRidersScreen);
