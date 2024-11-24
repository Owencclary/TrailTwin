import React from 'react';
import {
  IconButton,
  ScreenContainer,
  SimpleStyleScrollView,
  withTheme,
} from '@draftbit/ui';
import { Text, View } from 'react-native';
import * as GlobalStyles from '../GlobalStyles.js';
import * as GlobalVariables from '../config/GlobalVariableContext';
import palettes from '../themes/palettes';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import useWindowDimensions from '../utils/useWindowDimensions';

const FAQScreen = props => {
  const { theme, navigation } = props;
  const dimensions = useWindowDimensions();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const [Q1, setQ1] = React.useState(null);
  const [Q2, setQ2] = React.useState(null);

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
          {
            paddingBottom: 48,
            paddingLeft: 32,
            paddingRight: 32,
            paddingTop: 48,
          },
          dimensions.width
        )}
      >
        <View
          style={StyleSheet.applyWidth(
            { gap: 8, marginBottom: 32 },
            dimensions.width
          )}
        >
          {/* Question */}
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
                  fontFamily: 'Inter_500Medium',
                  fontSize: 16,
                }
              ),
              dimensions.width
            )}
          >
            {'How do I create a ride?'}
          </Text>
          {/* Dropdown */}
          <>
            {Q1 ? null : (
              <IconButton
                onPress={() => {
                  try {
                    setQ1(true);
                  } catch (err) {
                    console.error(err);
                  }
                }}
                color={Constants['textColor']}
                icon={'AntDesign/right'}
                size={22}
              />
            )}
          </>
          {/* Drop Up */}
          <>
            {!Q1 ? null : (
              <IconButton
                onPress={() => {
                  try {
                    setQ1(null);
                  } catch (err) {
                    console.error(err);
                  }
                }}
                color={Constants['textColor']}
                icon={'AntDesign/down'}
                size={22}
              />
            )}
          </>
          {/* Answer */}
          <>
            {!Q1 ? null : (
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
                {
                  '- You can create a ride by clicking the "+" Create button on the find rides screen. You can create up to three rides per day.'
                }
              </Text>
            )}
          </>
        </View>
        {/* View 2 */}
        <View
          style={StyleSheet.applyWidth(
            { gap: 8, marginBottom: 32 },
            dimensions.width
          )}
        >
          {/* Question */}
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
                  fontFamily: 'Inter_500Medium',
                  fontSize: 16,
                }
              ),
              dimensions.width
            )}
          >
            {'How do I join a ride?'}
          </Text>
          {/* Dropdown */}
          <>
            {Q2 ? null : (
              <IconButton
                onPress={() => {
                  try {
                    setQ2(true);
                  } catch (err) {
                    console.error(err);
                  }
                }}
                color={Constants['textColor']}
                icon={'AntDesign/right'}
                size={22}
              />
            )}
          </>
          {/* Drop Up */}
          <>
            {!Q2 ? null : (
              <IconButton
                onPress={() => {
                  try {
                    setQ2(null);
                  } catch (err) {
                    console.error(err);
                  }
                }}
                color={Constants['textColor']}
                icon={'AntDesign/down'}
                size={22}
              />
            )}
          </>
          {/* Answer */}
          <>
            {!Q2 ? null : (
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
                {
                  '- You can join a ride by clicking on "View Ride", then scroll down then select "Join Ride". You will then be added to a group chat for the ride. You be able to view in the meetup location by clicking on the pin icon within the group chat.'
                }
              </Text>
            )}
          </>
        </View>
      </SimpleStyleScrollView>
    </ScreenContainer>
  );
};

export default withTheme(FAQScreen);
