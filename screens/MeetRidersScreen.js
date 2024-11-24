import React from 'react';
import {
  Button,
  LoadingIndicator,
  ScreenContainer,
  SimpleStyleFlatList,
  SimpleStyleScrollView,
  withTheme,
} from '@draftbit/ui';
import { useIsFocused } from '@react-navigation/native';
import { ActivityIndicator, Image, Text, View } from 'react-native';
import { Fetch } from 'react-request';
import * as GlobalStyles from '../GlobalStyles.js';
import * as SupabaseUsersApi from '../apis/SupabaseUsersApi.js';
import * as UserPhotosApi from '../apis/UserPhotosApi.js';
import * as GlobalVariables from '../config/GlobalVariableContext';
import filterBlockedUsers from '../global-functions/filterBlockedUsers';
import filterEventsWithoutUser from '../global-functions/filterEventsWithoutUser';
import filterUsers from '../global-functions/filterUsers';
import formatJSON from '../global-functions/formatJSON';
import palettes from '../themes/palettes';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import imageSource from '../utils/imageSource';
import useWindowDimensions from '../utils/useWindowDimensions';

const MeetRidersScreen = props => {
  const { theme, navigation } = props;
  const dimensions = useWindowDimensions();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const setGlobalVariableValue = GlobalVariables.useSetValue();
  const [ampm, setAmpm] = React.useState('');
  const [otherUserIndex, setOtherUserIndex] = React.useState(0);
  const [usersData, setUsersData] = React.useState(null);
  const addBrackets = number => {
    return `[${number}]`;
  };

  const getRowByIndex = (array, otherUserIndex) => {
    const result = array[otherUserIndex];
    console.log(result);
    return result;
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
      hasBottomSafeArea={false}
      hasLeftSafeArea={false}
      hasRightSafeArea={false}
      hasSafeArea={false}
      hasTopSafeArea={false}
      style={StyleSheet.applyWidth(
        { backgroundColor: Constants['backgroundColor'], height: 5 },
        dimensions.width
      )}
    >
      <SimpleStyleScrollView
        bounces={true}
        keyboardShouldPersistTaps={'never'}
        nestedScrollEnabled={false}
        horizontal={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={StyleSheet.applyWidth(
          {
            flexDirection: 'column',
            paddingLeft: 36,
            paddingRight: 36,
            paddingTop: 36,
            position: 'relative',
          },
          dimensions.width
        )}
      >
        <SupabaseUsersApi.FetchGetUsersGET>
          {({ loading, error, data, refetchGetUsers }) => {
            const fetchData = data?.json;
            if (loading) {
              return <ActivityIndicator />;
            }

            if (error || data?.status < 200 || data?.status >= 300) {
              return <ActivityIndicator />;
            }

            return (
              <SimpleStyleFlatList
                data={filterBlockedUsers(
                  filterEventsWithoutUser(
                    filterUsers(
                      fetchData,
                      Constants['userNameFilter'],
                      Constants['userAgeFilter'],
                      Constants['userLocationFilter'],
                      Constants['userSkillLevelFilter'],
                      Constants['userRidingStyleFilter'],
                      Constants['userLookingForFilter']
                    ),
                    Constants['user_id']
                  ),
                  Constants['blockedUsers']
                )}
                keyExtractor={(listData, index) =>
                  listData?.id ??
                  listData?.uuid ??
                  index?.toString() ??
                  JSON.stringify(listData)
                }
                keyboardShouldPersistTaps={'never'}
                listKey={'tDTzjt5t'}
                nestedScrollEnabled={false}
                numColumns={1}
                onEndReachedThreshold={0.5}
                renderItem={({ item, index }) => {
                  const listData = item;
                  return (
                    <View
                      style={StyleSheet.applyWidth(
                        { marginBottom: 48 },
                        dimensions.width
                      )}
                    >
                      {/* Rider Image */}
                      <Image
                        resizeMode={'cover'}
                        {...GlobalStyles.ImageStyles(theme)['Image'].props}
                        source={imageSource(`${listData?.background_photo}`)}
                        style={StyleSheet.applyWidth(
                          StyleSheet.compose(
                            GlobalStyles.ImageStyles(theme)['Image'].style,
                            { borderRadius: 12, height: 400, width: '100%' }
                          ),
                          dimensions.width
                        )}
                      />
                      <View
                        style={StyleSheet.applyWidth(
                          {
                            alignItems: 'flex-start',
                            alignSelf: 'center',
                            marginTop: 16,
                            width: '100%',
                          },
                          dimensions.width
                        )}
                      >
                        {/* User name */}
                        <View
                          style={StyleSheet.applyWidth(
                            {
                              alignContent: 'center',
                              alignItems: 'stretch',
                              alignSelf: 'auto',
                              flexDirection: 'row',
                              gap: 0,
                              justifyContent: 'space-between',
                              marginBottom: 4,
                              position: 'relative',
                              width: '100%',
                            },
                            dimensions.width
                          )}
                        >
                          <View
                            style={StyleSheet.applyWidth(
                              {
                                alignItems: 'center',
                                alignSelf: 'center',
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                              },
                              dimensions.width
                            )}
                          >
                            {/* Attendee Name Text */}
                            <Text
                              accessible={true}
                              selectable={false}
                              numberOfLines={1}
                              style={StyleSheet.applyWidth(
                                {
                                  alignSelf: 'flex-start',
                                  color: Constants['textColor'],
                                  fontFamily: 'Inter_500Medium',
                                  fontSize: 22,
                                  marginRight: 8,
                                  textAlign: 'auto',
                                },
                                dimensions.width
                              )}
                            >
                              {listData?.name}
                              {','}
                            </Text>
                            {/* Attendee Age Text */}
                            <Text
                              accessible={true}
                              selectable={false}
                              numberOfLines={1}
                              style={StyleSheet.applyWidth(
                                {
                                  alignSelf: 'center',
                                  color: Constants['textColor'],
                                  fontFamily: 'Inter_300Light',
                                  fontSize: 18,
                                  textAlign: 'center',
                                },
                                dimensions.width
                              )}
                            >
                              {listData?.age}
                            </Text>
                          </View>
                        </View>
                        {/* Location */}
                        <View
                          style={StyleSheet.applyWidth(
                            {
                              alignItems: 'center',
                              flexDirection: 'row',
                              marginBottom: 6,
                            },
                            dimensions.width
                          )}
                        >
                          {/* Location */}
                          <Text
                            accessible={true}
                            selectable={false}
                            ellipsizeMode={'tail'}
                            numberOfLines={2}
                            style={StyleSheet.applyWidth(
                              {
                                color: [
                                  {
                                    minWidth: Breakpoints.Mobile,
                                    value: palettes.Brand['Secondary Text'],
                                  },
                                  {
                                    minWidth: Breakpoints.Mobile,
                                    value: Constants['textColor'],
                                  },
                                ],
                                fontFamily: 'Inter_400Regular',
                                fontSize: 14,
                              },
                              dimensions.width
                            )}
                          >
                            {'Location: '}
                            {listData?.location}
                          </Text>
                        </View>
                        {/* SKill View */}
                        <View
                          style={StyleSheet.applyWidth(
                            {
                              alignItems: 'center',
                              flexDirection: 'row',
                              flexWrap: 'nowrap',
                              marginBottom: 6,
                            },
                            dimensions.width
                          )}
                        >
                          {/* Skill Level Text */}
                          <Text
                            accessible={true}
                            selectable={false}
                            style={StyleSheet.applyWidth(
                              {
                                color: Constants['textColor'],
                                fontFamily: 'Inter_400Regular',
                                fontSize: 14,
                              },
                              dimensions.width
                            )}
                          >
                            {'Skill Level: '}
                            {listData?.skill_level}{' '}
                          </Text>
                        </View>
                        {/* Exp View */}
                        <View
                          style={StyleSheet.applyWidth(
                            {
                              alignItems: 'center',
                              flexDirection: 'row',
                              flexWrap: 'nowrap',
                              justifyContent: 'space-between',
                            },
                            dimensions.width
                          )}
                        >
                          {/* Riding Style Text */}
                          <Text
                            accessible={true}
                            selectable={false}
                            numberOfLines={0}
                            style={StyleSheet.applyWidth(
                              {
                                color: Constants['textColor'],
                                fontFamily: 'Inter_400Regular',
                                fontSize: 14,
                              },
                              dimensions.width
                            )}
                          >
                            {'Riding Style: '}
                            {formatJSON(listData?.riding_style)}
                          </Text>
                        </View>
                      </View>
                      {/* Button View */}
                      <View
                        style={StyleSheet.applyWidth(
                          {
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 24,
                            marginTop: 32,
                            width: '100%',
                          },
                          dimensions.width
                        )}
                      >
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
                                    key: 'otherUserId',
                                    value: listData?.user_id,
                                  });
                                  navigation.navigate('BottomTabNavigator', {
                                    screen: 'MeetRidersTab',
                                    params: {
                                      screen: 'OtherUsersProfileScreen',
                                    },
                                  });
                                } catch (err) {
                                  console.error(err);
                                }
                              }}
                              {...GlobalStyles.ButtonStyles(theme)['Button']
                                .props}
                              style={StyleSheet.applyWidth(
                                StyleSheet.compose(
                                  GlobalStyles.ButtonStyles(theme)['Button']
                                    .style,
                                  {
                                    backgroundColor:
                                      palettes['Trail Twin'][
                                        'Secondary Green #2 - Trail Twin'
                                      ],
                                    fontFamily: 'Inter_400Regular',
                                    fontSize: 14,
                                    height: 15,
                                    width: '100%',
                                  }
                                ),
                                dimensions.width
                              )}
                              title={'View Profile'}
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
                  );
                }}
                showsVerticalScrollIndicator={true}
                horizontal={false}
                inverted={false}
                showsHorizontalScrollIndicator={false}
                style={StyleSheet.applyWidth(
                  { flexDirection: 'column', gap: 0, justifyContent: 'center' },
                  dimensions.width
                )}
              />
            );
          }}
        </SupabaseUsersApi.FetchGetUsersGET>
      </SimpleStyleScrollView>
    </ScreenContainer>
  );
};

export default withTheme(MeetRidersScreen);
