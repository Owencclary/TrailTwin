import React from 'react';
import {
  Button,
  Divider,
  Icon,
  Link,
  SimpleStyleFlatList,
  Touchable,
  withTheme,
} from '@draftbit/ui';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import { Fetch } from 'react-request';
import * as GlobalStyles from '../GlobalStyles.js';
import * as SupabaseAttendeesApi from '../apis/SupabaseAttendeesApi.js';
import * as SupabaseEventsApi from '../apis/SupabaseEventsApi.js';
import * as SupabaseUsersApi from '../apis/SupabaseUsersApi.js';
import * as UserPhotosApi from '../apis/UserPhotosApi.js';
import * as GlobalVariables from '../config/GlobalVariableContext';
import addAttendee from '../global-functions/addAttendee';
import checkEventStatus from '../global-functions/checkEventStatus';
import checkForGroupRide from '../global-functions/checkForGroupRide';
import formatAmPm from '../global-functions/formatAmPm';
import formatDate from '../global-functions/formatDate';
import formatHours from '../global-functions/formatHours';
import formatJSON from '../global-functions/formatJSON';
import formatString from '../global-functions/formatString';
import formatTotalRiders from '../global-functions/formatTotalRiders';
import isUserInArray from '../global-functions/isUserInArray';
import removeAttendee from '../global-functions/removeAttendee';
import palettes from '../themes/palettes';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import imageSource from '../utils/imageSource';
import openShareUtil from '../utils/openShare';
import showAlertUtil from '../utils/showAlert';
import useWindowDimensions from '../utils/useWindowDimensions';

const defaultProps = { event_id: 280 };

const EventDetailsCardBlock = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const navigation = useNavigation();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const setGlobalVariableValue = GlobalVariables.useSetValue();
  const [ampm, setAmpm] = React.useState(null);
  const [previousEvent, setPreviousEvent] = React.useState('');
  const [usersEvent, setUsersEvent] = React.useState(false);
  const [refreshingpT1qlZe6, setRefreshingpT1qlZe6] = React.useState(false);
  const addUserIdToJson = (userIds, userId) => {
    if (!userIds.includes(userId)) {
      userIds.push(userId);
    }
    return userIds;
  };

  const extractTrailNames = events => {
    return events.map(event => event.trail_names);
  };
  const supabaseEventsUpdateAttendeesPUT =
    SupabaseEventsApi.useUpdateAttendeesPUT();
  const supabaseAttendeesCreateAttendeePOST =
    SupabaseAttendeesApi.useCreateAttendeePOST();
  const supabaseAttendeesRemoveAttendeeDELETE =
    SupabaseAttendeesApi.useRemoveAttendeeDELETE();
  React.useEffect(() => {
    try {
      setGlobalVariableValue({
        key: 'loading',
        value: false,
      });
    } catch (err) {
      console.error(err);
    }
  }, []);

  return (
    <SupabaseEventsApi.FetchGetSingleEventGET
      handlers={{
        onData: fetchData => {
          try {
            console.log(
              fetchData && fetchData[0].attendee_ids,
              '< ATTENDEEIDS'
            );
            if (fetchData?.[0]?.host_id === Constants['user_id']) {
              setUsersEvent(true);
            } else {
              setUsersEvent(null);
            }
          } catch (err) {
            console.error(err);
          }
        },
      }}
      id={props.event_id ?? defaultProps.event_id}
      select={'*'}
    >
      {({ loading, error, data, refetchGetSingleEvent }) => {
        const fetchData = data?.json;
        if (loading) {
          return <ActivityIndicator />;
        }

        if (error || data?.status < 200 || data?.status >= 300) {
          return <ActivityIndicator />;
        }

        return (
          <>
            {/* List 2 */}
            <SimpleStyleFlatList
              data={fetchData}
              horizontal={false}
              inverted={false}
              keyExtractor={(list2Data, index) =>
                list2Data?.id ??
                list2Data?.uuid ??
                index?.toString() ??
                JSON.stringify(list2Data)
              }
              keyboardShouldPersistTaps={'never'}
              listKey={'Qlzrfr4S'}
              nestedScrollEnabled={false}
              numColumns={1}
              onEndReachedThreshold={0.5}
              renderItem={({ item, index }) => {
                const list2Data = item;
                return (
                  <>
                    {/* Event Details */}
                    <View
                      style={StyleSheet.applyWidth(
                        {
                          alignItems: 'center',
                          backgroundColor: Constants['backgroundColor'],
                        },
                        dimensions.width
                      )}
                    >
                      {/* Image View */}
                      <View
                        style={StyleSheet.applyWidth(
                          { height: 300, width: '100%', zIndex: 1 },
                          dimensions.width
                        )}
                      >
                        {/* Event Photo Background */}
                        <ImageBackground
                          resizeMode={'cover'}
                          source={imageSource(
                            `${fetchData && fetchData[0].event_photo}`
                          )}
                          style={StyleSheet.applyWidth(
                            { borderRadius: 8, height: '100%', width: '100%' },
                            dimensions.width
                          )}
                        />
                        {/* Your Hosted Ride View */}
                        <>
                          {!usersEvent ? null : (
                            <View
                              style={StyleSheet.applyWidth(
                                {
                                  backgroundColor:
                                    palettes.App.Peoplebit_Orange,
                                  borderBottomRightRadius: 6,
                                  borderTopRightRadius: 6,
                                  position: 'absolute',
                                  top: 72,
                                  zIndex: 1,
                                },
                                dimensions.width
                              )}
                            >
                              <Text
                                accessible={true}
                                selectable={false}
                                {...GlobalStyles.TextStyles(theme)['Text 2']
                                  .props}
                                style={StyleSheet.applyWidth(
                                  StyleSheet.compose(
                                    GlobalStyles.TextStyles(theme)['Text 2']
                                      .style,
                                    {
                                      color: [
                                        {
                                          minWidth: Breakpoints.Mobile,
                                          value: null,
                                        },
                                        {
                                          minWidth: Breakpoints.Mobile,
                                          value: Constants['textColor'],
                                        },
                                      ],
                                      fontFamily: 'Inter_400Regular',
                                      fontSize: 16,
                                      paddingBottom: 6,
                                      paddingLeft: 6,
                                      paddingRight: 6,
                                      paddingTop: 6,
                                    }
                                  ),
                                  dimensions.width
                                )}
                              >
                                {'Your Hosted Ride'}
                              </Text>
                            </View>
                          )}
                        </>
                      </View>
                      {/* Event Desc and Details View */}
                      <View
                        style={StyleSheet.applyWidth(
                          {
                            alignItems: 'flex-start',
                            flexDirection: 'column',
                            paddingLeft: 32,
                            paddingRight: 32,
                            width: '100%',
                          },
                          dimensions.width
                        )}
                      >
                        {/* Details View */}
                        <View
                          style={StyleSheet.applyWidth(
                            {
                              alignItems: 'flex-start',
                              alignSelf: 'center',
                              marginTop: 32,
                              width: '100%',
                            },
                            dimensions.width
                          )}
                        >
                          {/* Title and Riders View 2 */}
                          <View
                            style={StyleSheet.applyWidth(
                              {
                                alignContent: 'center',
                                alignItems: 'stretch',
                                alignSelf: 'auto',
                                flexDirection: 'row',
                                gap: 6,
                                justifyContent: 'space-between',
                                marginBottom: 12,
                                position: 'relative',
                                width: '100%',
                              },
                              dimensions.width
                            )}
                          >
                            <View>
                              <Text
                                accessible={true}
                                selectable={false}
                                {...GlobalStyles.TextStyles(theme)['Text']
                                  .props}
                                style={StyleSheet.applyWidth(
                                  StyleSheet.compose(
                                    GlobalStyles.TextStyles(theme)['Text']
                                      .style,
                                    {
                                      color: [
                                        {
                                          minWidth: Breakpoints.Mobile,
                                          value: null,
                                        },
                                        {
                                          minWidth: Breakpoints.Mobile,
                                          value: Constants['textColor'],
                                        },
                                      ],
                                      fontFamily: 'Inter_500Medium',
                                      fontSize: 24,
                                    }
                                  ),
                                  dimensions.width
                                )}
                              >
                                {fetchData?.[0]?.event_name}
                              </Text>
                            </View>
                          </View>
                        </View>
                        {/* Weather View */}
                        <View
                          style={StyleSheet.applyWidth(
                            {
                              alignItems: 'center',
                              flexDirection: 'row',
                              gap: 0,
                              justifyContent: 'flex-start',
                              marginBottom: 12,
                              width: '100%',
                            },
                            dimensions.width
                          )}
                        >
                          <Icon
                            color={Constants['textColor']}
                            name={'Ionicons/partly-sunny-outline'}
                            size={24}
                            style={StyleSheet.applyWidth(
                              { marginRight: 8 },
                              dimensions.width
                            )}
                          />
                          {/* Weather Text */}
                          <Text
                            accessible={true}
                            selectable={false}
                            ellipsizeMode={'tail'}
                            numberOfLines={2}
                            style={StyleSheet.applyWidth(
                              {
                                color: Constants['textColor'],
                                fontFamily: 'Inter_300Light',
                                fontSize: 14,
                                lineHeight: 24,
                              },
                              dimensions.width
                            )}
                          >
                            {'Partly Cloudy'}
                          </Text>
                        </View>
                        {/* Riders View */}
                        <View
                          style={StyleSheet.applyWidth(
                            {
                              alignItems: 'center',
                              flexDirection: 'row',
                              justifyContent: 'flex-start',
                              marginBottom: 12,
                              position: 'relative',
                            },
                            dimensions.width
                          )}
                        >
                          {/* Riders Text */}
                          <Text
                            accessible={true}
                            selectable={false}
                            ellipsizeMode={'tail'}
                            numberOfLines={2}
                            style={StyleSheet.applyWidth(
                              {
                                color: Constants['textColor'],
                                fontFamily: 'Inter_300Light',
                                fontSize: 14,
                                lineHeight: 24,
                              },
                              dimensions.width
                            )}
                          >
                            {list2Data?.total_riders}
                            {' Riders'}
                          </Text>
                        </View>
                        {/* Date View */}
                        <View
                          style={StyleSheet.applyWidth(
                            {
                              alignItems: 'center',
                              flexDirection: 'row',
                              gap: 0,
                              justifyContent: 'flex-start',
                              width: '100%',
                            },
                            dimensions.width
                          )}
                        >
                          {/* Date Text */}
                          <Text
                            accessible={true}
                            selectable={false}
                            ellipsizeMode={'tail'}
                            numberOfLines={2}
                            style={StyleSheet.applyWidth(
                              {
                                color: Constants['textColor'],
                                fontFamily: 'Inter_300Light',
                                fontSize: 14,
                                lineHeight: 24,
                              },
                              dimensions.width
                            )}
                          >
                            {formatDate(fetchData?.[0]?.date)}
                            {', '}
                            {formatHours(list2Data?.start_time)}{' '}
                            {formatAmPm(ampm, list2Data?.start_time)}
                          </Text>
                        </View>
                        {/* Divider 3 */}
                        <Divider
                          {...GlobalStyles.DividerStyles(theme)['Divider']
                            .props}
                          color={Constants['dividerColor']}
                          style={StyleSheet.applyWidth(
                            StyleSheet.compose(
                              GlobalStyles.DividerStyles(theme)['Divider']
                                .style,
                              { marginBottom: 32, marginTop: 32, width: '100%' }
                            ),
                            dimensions.width
                          )}
                        />
                        {/* Skill and Ride Type */}
                        <View
                          style={StyleSheet.applyWidth(
                            {
                              alignItems: 'center',
                              flexDirection: 'row',
                              marginBottom: 12,
                            },
                            dimensions.width
                          )}
                        >
                          {/* Tags Icon */}
                          <Icon
                            color={Constants['textColor']}
                            name={
                              'MaterialCommunityIcons/format-list-bulleted-type'
                            }
                            size={24}
                            style={StyleSheet.applyWidth(
                              { marginRight: 8 },
                              dimensions.width
                            )}
                          />
                          <View
                            style={StyleSheet.applyWidth(
                              { flexDirection: 'row' },
                              dimensions.width
                            )}
                          >
                            {/* Skill and Ride Type */}
                            <Text
                              accessible={true}
                              selectable={false}
                              ellipsizeMode={'tail'}
                              numberOfLines={2}
                              style={StyleSheet.applyWidth(
                                {
                                  color: Constants['textColor'],
                                  fontFamily: 'Inter_400Regular',
                                  fontSize: 16,
                                  lineHeight: 24,
                                },
                                dimensions.width
                              )}
                            >
                              {list2Data?.event_type}
                            </Text>
                            {/* Skill and Ride Type */}
                            <>
                              {!checkForGroupRide(
                                list2Data?.event_type
                              ) ? null : (
                                <Text
                                  accessible={true}
                                  selectable={false}
                                  ellipsizeMode={'tail'}
                                  numberOfLines={2}
                                  style={StyleSheet.applyWidth(
                                    {
                                      color: Constants['textColor'],
                                      fontFamily: 'Inter_400Regular',
                                      fontSize: 16,
                                      lineHeight: 24,
                                    },
                                    dimensions.width
                                  )}
                                >
                                  {' - '}
                                  {formatJSON(list2Data?.skill_level)}
                                </Text>
                              )}
                            </>
                          </View>
                        </View>
                        {/* Trails with icon */}
                        <View
                          style={StyleSheet.applyWidth(
                            {
                              alignItems: 'center',
                              flexDirection: 'row',
                              flexWrap: 'nowrap',
                              gap: 0,
                              justifyContent: 'flex-start',
                              marginBottom: 12,
                              width: '100%',
                            },
                            dimensions.width
                          )}
                        >
                          <View
                            style={StyleSheet.applyWidth(
                              {
                                alignItems: 'center',
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                              },
                              dimensions.width
                            )}
                          >
                            {/* Trails Icon */}
                            <Icon
                              color={Constants['textColor']}
                              name={'Ionicons/trail-sign-outline'}
                              size={24}
                              style={StyleSheet.applyWidth(
                                { marginRight: 8 },
                                dimensions.width
                              )}
                            />
                            {/* trails */}
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
                              {'Trails: '}
                              {list2Data?.trail_names}
                            </Text>
                          </View>
                        </View>
                        {/* Tags View 4 */}
                        <View
                          style={StyleSheet.applyWidth(
                            {
                              alignItems: 'center',
                              flexDirection: 'row',
                              flexWrap: 'nowrap',
                            },
                            dimensions.width
                          )}
                        >
                          {/* Tags Icon */}
                          <Icon
                            color={Constants['textColor']}
                            name={'AntDesign/tagso'}
                            size={24}
                            style={StyleSheet.applyWidth(
                              { marginRight: 8 },
                              dimensions.width
                            )}
                          />
                          {/* Tags Text */}
                          <Text
                            accessible={true}
                            selectable={false}
                            style={StyleSheet.applyWidth(
                              {
                                color: Constants['textColor'],
                                fontFamily: 'Inter_400Regular',
                                fontSize: 16,
                                marginRight: 48,
                                textAlign: 'left',
                              },
                              dimensions.width
                            )}
                          >
                            {formatString(list2Data?.tags)}
                          </Text>
                        </View>
                        {/* Divider 2 */}
                        <>
                          {checkEventStatus('[0].event_status') ? null : (
                            <Divider
                              {...GlobalStyles.DividerStyles(theme)['Divider']
                                .props}
                              color={Constants['dividerColor']}
                              style={StyleSheet.applyWidth(
                                StyleSheet.compose(
                                  GlobalStyles.DividerStyles(theme)['Divider']
                                    .style,
                                  {
                                    marginBottom: 64,
                                    marginTop: 32,
                                    width: '100%',
                                  }
                                ),
                                dimensions.width
                              )}
                            />
                          )}
                        </>
                        {/* Check Host Display */}
                        <>
                          {usersEvent ? null : (
                            <View
                              style={StyleSheet.applyWidth(
                                { marginBottom: 32, width: '100%' },
                                dimensions.width
                              )}
                            >
                              {/* Check Status Display */}
                              <>
                                {checkEventStatus('[0].event_status') ? null : (
                                  <View
                                    style={StyleSheet.applyWidth(
                                      {
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '100%',
                                      },
                                      dimensions.width
                                    )}
                                  >
                                    {/* Check Join Status */}
                                    <>
                                      {isUserInArray(
                                        list2Data?.attendee_ids,
                                        Constants['user_id']
                                      ) ? null : (
                                        <View
                                          style={StyleSheet.applyWidth(
                                            {
                                              alignItems: 'center',
                                              justifyContent: 'center',
                                              width: '100%',
                                            },
                                            dimensions.width
                                          )}
                                        >
                                          {/* Join Button */}
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
                                                      (
                                                        await supabaseEventsUpdateAttendeesPUT.mutateAsync(
                                                          {
                                                            attendeeIds:
                                                              addAttendee(
                                                                fetchData,
                                                                Constants[
                                                                  'user_id'
                                                                ]
                                                              ),
                                                            id: list2Data?.id,
                                                            totalRiders:
                                                              list2Data?.total_riders +
                                                              1,
                                                          }
                                                        )
                                                      )?.json;
                                                      (
                                                        await supabaseAttendeesCreateAttendeePOST.mutateAsync(
                                                          {
                                                            event_id:
                                                              list2Data?.id,
                                                            user_id:
                                                              Constants[
                                                                'user_id'
                                                              ],
                                                          }
                                                        )
                                                      )?.json;

                                                      showAlertUtil({
                                                        title: 'Success!',
                                                        message:
                                                          'You have successfully joined!',
                                                        buttonText: 'Ok',
                                                      });

                                                      navigation.navigate(
                                                        'BottomTabNavigator',
                                                        {
                                                          screen:
                                                            'FindRidesTab',
                                                          params: {
                                                            screen:
                                                              'EventDetailsScreen',
                                                            params: {
                                                              event_id:
                                                                list2Data?.id,
                                                            },
                                                          },
                                                        }
                                                      );
                                                    } catch (err) {
                                                      console.error(err);
                                                    }
                                                  };
                                                  handler();
                                                }}
                                                {...GlobalStyles.ButtonStyles(
                                                  theme
                                                )['Button'].props}
                                                style={StyleSheet.applyWidth(
                                                  StyleSheet.compose(
                                                    GlobalStyles.ButtonStyles(
                                                      theme
                                                    )['Button'].style,
                                                    {
                                                      backgroundColor:
                                                        palettes['Trail Twin'][
                                                          'Secondary Green #2 - Trail Twin'
                                                        ],
                                                      fontFamily:
                                                        'Inter_400Regular',
                                                      fontSize: 14,
                                                      height: 30,
                                                      width: '100%',
                                                    }
                                                  ),
                                                  dimensions.width
                                                )}
                                                title={'Join'}
                                              />
                                            )}
                                          </>
                                        </View>
                                      )}
                                    </>
                                  </View>
                                )}
                              </>
                            </View>
                          )}
                        </>
                        {/* Check Host Display 2 */}
                        <>
                          {!usersEvent ? null : (
                            <View
                              style={StyleSheet.applyWidth(
                                { marginBottom: 32, width: '100%' },
                                dimensions.width
                              )}
                            >
                              {/* Check Status Display */}
                              <>
                                {checkEventStatus('[0].event_status') ? null : (
                                  <View
                                    style={StyleSheet.applyWidth(
                                      {
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '100%',
                                      },
                                      dimensions.width
                                    )}
                                  >
                                    {/* Edit Event */}
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
                                              navigation.navigate(
                                                'BottomTabNavigator',
                                                {
                                                  screen: 'ProfileTab',
                                                  params: {
                                                    screen: 'EditEventScreen',
                                                    params: {
                                                      id: list2Data?.id,
                                                      editingEvent: true,
                                                    },
                                                  },
                                                }
                                              );
                                            } catch (err) {
                                              console.error(err);
                                            }
                                          }}
                                          {...GlobalStyles.ButtonStyles(theme)[
                                            'Button'
                                          ].props}
                                          style={StyleSheet.applyWidth(
                                            StyleSheet.compose(
                                              GlobalStyles.ButtonStyles(theme)[
                                                'Button'
                                              ].style,
                                              {
                                                backgroundColor:
                                                  palettes['Trail Twin'][
                                                    'Secondary Green #2 - Trail Twin'
                                                  ],
                                                fontFamily: 'Inter_400Regular',
                                                fontSize: 14,
                                                height: 30,
                                                width: '100%',
                                              }
                                            ),
                                            dimensions.width
                                          )}
                                          title={'Edit Event'}
                                        />
                                      )}
                                    </>
                                  </View>
                                )}
                              </>
                            </View>
                          )}
                        </>
                        {/* Check Join Status 2 */}
                        <>
                          {!isUserInArray(
                            list2Data?.attendee_ids,
                            Constants['user_id']
                          ) ? null : (
                            <View
                              style={StyleSheet.applyWidth(
                                {
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  marginBottom: 32,
                                  width: '100%',
                                },
                                dimensions.width
                              )}
                            >
                              {/* Leave Ride */}
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
                                          (
                                            await supabaseEventsUpdateAttendeesPUT.mutateAsync(
                                              {
                                                attendeeIds: removeAttendee(
                                                  fetchData,
                                                  Constants['user_id']
                                                ),
                                                id: list2Data?.id,
                                                totalRiders:
                                                  list2Data?.total_riders - 1,
                                              }
                                            )
                                          )?.json;
                                          (
                                            await supabaseAttendeesRemoveAttendeeDELETE.mutateAsync(
                                              { user_id: Constants['user_id'] }
                                            )
                                          )?.json;

                                          showAlertUtil({
                                            title: 'Success!',
                                            message: 'You have left the ride',
                                            buttonText: 'Ok',
                                          });

                                          navigation.goBack();
                                        } catch (err) {
                                          console.error(err);
                                        }
                                      };
                                      handler();
                                    }}
                                    {...GlobalStyles.ButtonStyles(theme)[
                                      'Button'
                                    ].props}
                                    style={StyleSheet.applyWidth(
                                      StyleSheet.compose(
                                        GlobalStyles.ButtonStyles(theme)[
                                          'Button'
                                        ].style,
                                        {
                                          backgroundColor:
                                            palettes.App.Peoplebit_Salmon_Red,
                                          fontFamily: 'Inter_400Regular',
                                          fontSize: 14,
                                          height: 30,
                                          width: '100%',
                                        }
                                      ),
                                      dimensions.width
                                    )}
                                    title={'Leave Ride'}
                                  />
                                )}
                              </>
                            </View>
                          )}
                        </>
                        {/* Share Button View */}
                        <>
                          {checkEventStatus('[0].event_status') ? null : (
                            <View
                              style={StyleSheet.applyWidth(
                                { width: '100%' },
                                dimensions.width
                              )}
                            >
                              {/* Share Button */}
                              <Button
                                accessible={true}
                                iconPosition={'left'}
                                onPress={() => {
                                  const handler = async () => {
                                    try {
                                      await openShareUtil(
                                        `Come join ${
                                          list2Data?.event_name
                                        } on ${formatDate(
                                          list2Data?.date
                                        )} at ${
                                          list2Data?.start_time
                                        } ${formatAmPm(
                                          ampm,
                                          list2Data?.start_time
                                        )}`
                                      );
                                    } catch (err) {
                                      console.error(err);
                                    }
                                  };
                                  handler();
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
                                      height: 30,
                                    }
                                  ),
                                  dimensions.width
                                )}
                                title={'Share'}
                              />
                            </View>
                          )}
                        </>
                        {/* Divider 4 */}
                        <Divider
                          color={theme.colors.border.brand}
                          {...GlobalStyles.DividerStyles(theme)['Divider']
                            .props}
                          style={StyleSheet.applyWidth(
                            StyleSheet.compose(
                              GlobalStyles.DividerStyles(theme)['Divider']
                                .style,
                              { marginBottom: 32, marginTop: 64, width: '100%' }
                            ),
                            dimensions.width
                          )}
                        />
                        {/* User */}
                        <View
                          style={StyleSheet.applyWidth(
                            {
                              alignItems: 'center',
                              flexDirection: 'row',
                              justifyContent: 'flex-start',
                              width: '100%',
                            },
                            dimensions.width
                          )}
                        >
                          <SupabaseUsersApi.FetchGetUserByUniqueUserIdGET
                            select={'*'}
                            user_id={list2Data?.host_id}
                          >
                            {({
                              loading,
                              error,
                              data,
                              refetchGetUserByUniqueUserId,
                            }) => {
                              const fetchData = data?.json;
                              if (loading) {
                                return <ActivityIndicator />;
                              }

                              if (
                                error ||
                                data?.status < 200 ||
                                data?.status >= 300
                              ) {
                                return <ActivityIndicator />;
                              }

                              return (
                                <SimpleStyleFlatList
                                  data={fetchData}
                                  horizontal={false}
                                  inverted={false}
                                  keyExtractor={(listData, index) =>
                                    listData?.id ??
                                    listData?.uuid ??
                                    index?.toString() ??
                                    JSON.stringify(listData)
                                  }
                                  keyboardShouldPersistTaps={'never'}
                                  listKey={JSON.stringify(fetchData)}
                                  nestedScrollEnabled={false}
                                  numColumns={1}
                                  onEndReachedThreshold={0.5}
                                  renderItem={({ item, index }) => {
                                    const listData = item;
                                    return (
                                      <Touchable
                                        onPress={() => {
                                          try {
                                            setGlobalVariableValue({
                                              key: 'otherUserId',
                                              value: fetchData?.[0]?.user_id,
                                            });
                                            navigation.navigate(
                                              'BottomTabNavigator'
                                            );
                                          } catch (err) {
                                            console.error(err);
                                          }
                                        }}
                                      >
                                        {/* Details */}
                                        <View
                                          style={StyleSheet.applyWidth(
                                            {
                                              alignItems: 'center',
                                              borderColor:
                                                theme.colors.border.brand,
                                              borderRadius: 12,
                                              flexDirection: 'row',
                                              paddingBottom: 16,
                                              paddingTop: 16,
                                              width: '100%',
                                            },
                                            dimensions.width
                                          )}
                                        >
                                          {/* Host Photo */}
                                          <Image
                                            resizeMode={'cover'}
                                            source={imageSource(`${listData?.profile_photo}
`)}
                                            style={StyleSheet.applyWidth(
                                              {
                                                borderRadius: 100,
                                                height: 80,
                                                width: 80,
                                              },
                                              dimensions.width
                                            )}
                                          />
                                          <View>
                                            <Text
                                              accessible={true}
                                              selectable={false}
                                              style={StyleSheet.applyWidth(
                                                {
                                                  color:
                                                    theme.colors.text.strong,
                                                  fontFamily: 'Inter_500Medium',
                                                  fontSize: 18,
                                                  marginLeft: 16,
                                                },
                                                dimensions.width
                                              )}
                                            >
                                              {'Organized by'}
                                            </Text>

                                            <View
                                              style={StyleSheet.applyWidth(
                                                {
                                                  alignItems: 'center',
                                                  flexDirection: 'row',
                                                  gap: 8,
                                                  justifyContent: 'flex-start',
                                                  marginTop: 8,
                                                },
                                                dimensions.width
                                              )}
                                            >
                                              {/* Host Name */}
                                              <Text
                                                accessible={true}
                                                selectable={false}
                                                style={StyleSheet.applyWidth(
                                                  {
                                                    color:
                                                      theme.colors.text.strong,
                                                    fontFamily:
                                                      'Inter_400Regular',
                                                    fontSize: 14,
                                                    marginLeft: 16,
                                                  },
                                                  dimensions.width
                                                )}
                                              >
                                                {fetchData?.[0]?.name}
                                                {','}
                                              </Text>
                                              {/* Host age */}
                                              <Text
                                                accessible={true}
                                                selectable={false}
                                                {...GlobalStyles.TextStyles(
                                                  theme
                                                )['Text'].props}
                                                style={StyleSheet.applyWidth(
                                                  StyleSheet.compose(
                                                    GlobalStyles.TextStyles(
                                                      theme
                                                    )['Text'].style,
                                                    {
                                                      color:
                                                        palettes.Brand[
                                                          'Secondary Text'
                                                        ],
                                                      fontFamily:
                                                        'Inter_400Regular',
                                                      fontSize: 14,
                                                    }
                                                  ),
                                                  dimensions.width
                                                )}
                                              >
                                                {fetchData?.[0]?.age}
                                              </Text>
                                            </View>
                                          </View>
                                        </View>
                                      </Touchable>
                                    );
                                  }}
                                  showsHorizontalScrollIndicator={true}
                                  showsVerticalScrollIndicator={true}
                                />
                              );
                            }}
                          </SupabaseUsersApi.FetchGetUserByUniqueUserIdGET>
                        </View>
                        <Divider
                          color={theme.colors.border.brand}
                          {...GlobalStyles.DividerStyles(theme)['Divider']
                            .props}
                          style={StyleSheet.applyWidth(
                            StyleSheet.compose(
                              GlobalStyles.DividerStyles(theme)['Divider']
                                .style,
                              { marginTop: 24, width: '100%' }
                            ),
                            dimensions.width
                          )}
                        />
                      </View>
                    </View>
                    {/* Ridders Attending Title */}
                    <View
                      style={StyleSheet.applyWidth(
                        {
                          backgroundColor:
                            palettes['Trail Twin']['Background - Trail Twin'],
                          marginLeft: 48,
                          marginTop: 32,
                        },
                        dimensions.width
                      )}
                    >
                      <Text
                        accessible={true}
                        selectable={false}
                        {...GlobalStyles.TextStyles(theme)['Text 2'].props}
                        style={StyleSheet.applyWidth(
                          StyleSheet.compose(
                            GlobalStyles.TextStyles(theme)['Text 2'].style,
                            { fontFamily: 'Inter_500Medium', fontSize: 18 }
                          ),
                          dimensions.width
                        )}
                      >
                        {'Riders Attending'}
                      </Text>
                    </View>
                    {/* Attendees List */}
                    <View
                      style={StyleSheet.applyWidth(
                        { alignItems: 'center', marginTop: 32 },
                        dimensions.width
                      )}
                    >
                      <SupabaseAttendeesApi.FetchGetUsersByEventIDGET
                        event_id={props.event_id ?? defaultProps.event_id}
                        select={'*'}
                      >
                        {({
                          loading,
                          error,
                          data,
                          refetchGetUsersByEventID,
                        }) => {
                          const fetchData = data?.json;
                          if (loading) {
                            return <ActivityIndicator />;
                          }

                          if (
                            error ||
                            data?.status < 200 ||
                            data?.status >= 300
                          ) {
                            return <ActivityIndicator />;
                          }

                          return (
                            <SimpleStyleFlatList
                              data={fetchData}
                              keyExtractor={(listData, index) =>
                                listData?.id ??
                                listData?.uuid ??
                                index?.toString() ??
                                JSON.stringify(listData)
                              }
                              keyboardShouldPersistTaps={'never'}
                              listKey={JSON.stringify(fetchData)}
                              nestedScrollEnabled={false}
                              onEndReachedThreshold={0.5}
                              refreshControl={
                                <RefreshControl
                                  refreshing={refreshingpT1qlZe6}
                                  onRefresh={() => {
                                    const handler = async () => {
                                      try {
                                        setRefreshingpT1qlZe6(true);
                                        await refetchGetAttendeesByEventId();
                                        setRefreshingpT1qlZe6(false);
                                      } catch (err) {
                                        console.error(err);
                                        setRefreshingpT1qlZe6(false);
                                      }
                                    };
                                    handler();
                                  }}
                                />
                              }
                              renderItem={({ item, index }) => {
                                const listData = item;
                                return (
                                  <SupabaseUsersApi.FetchGetUserByUniqueUserIdGET
                                    select={'*'}
                                    user_id={listData?.user_id}
                                  >
                                    {({
                                      loading,
                                      error,
                                      data,
                                      refetchGetUserByUniqueUserId,
                                    }) => {
                                      const fetchData = data?.json;
                                      if (loading) {
                                        return <ActivityIndicator />;
                                      }

                                      if (
                                        error ||
                                        data?.status < 200 ||
                                        data?.status >= 300
                                      ) {
                                        return <ActivityIndicator />;
                                      }

                                      return (
                                        <SimpleStyleFlatList
                                          data={fetchData}
                                          horizontal={false}
                                          inverted={false}
                                          keyExtractor={(listData, index) =>
                                            listData?.id ??
                                            listData?.uuid ??
                                            index?.toString() ??
                                            JSON.stringify(listData)
                                          }
                                          keyboardShouldPersistTaps={'never'}
                                          listKey={JSON.stringify(fetchData)}
                                          nestedScrollEnabled={false}
                                          numColumns={1}
                                          onEndReachedThreshold={0.5}
                                          renderItem={({ item, index }) => {
                                            const listData = item;
                                            return (
                                              <>
                                                {/* User Record */}
                                                <Touchable
                                                  onPress={() => {
                                                    try {
                                                      setGlobalVariableValue({
                                                        key: 'otherUserId',
                                                        value:
                                                          fetchData?.[0]
                                                            ?.user_id,
                                                      });
                                                      navigation.navigate(
                                                        'BottomTabNavigator'
                                                      );
                                                    } catch (err) {
                                                      console.error(err);
                                                    }
                                                  }}
                                                >
                                                  {/* Image and Name View */}
                                                  <View
                                                    style={StyleSheet.applyWidth(
                                                      {
                                                        alignItems: 'center',
                                                        backgroundColor:
                                                          '"rgb(253, 253, 245)"',
                                                        borderColor:
                                                          theme.colors.border
                                                            .brand,
                                                        borderRadius: 12,
                                                        marginLeft: 24,
                                                        marginRight: 24,
                                                        maxWidth: 120,
                                                        paddingBottom: 12,
                                                        paddingLeft: 16,
                                                        paddingRight: 16,
                                                        paddingTop: 12,
                                                      },
                                                      dimensions.width
                                                    )}
                                                  >
                                                    {/* User Image View */}
                                                    <View>
                                                      {/* User image */}
                                                      <Image
                                                        resizeMode={'cover'}
                                                        source={imageSource(
                                                          `${listData?.profile_photo}`
                                                        )}
                                                        style={StyleSheet.applyWidth(
                                                          {
                                                            borderRadius: 100,
                                                            height: 92,
                                                            width: 92,
                                                          },
                                                          dimensions.width
                                                        )}
                                                      />
                                                    </View>
                                                    {/* Name and Age View */}
                                                    <View
                                                      style={StyleSheet.applyWidth(
                                                        {
                                                          alignItems: 'center',
                                                          flexDirection: 'row',
                                                          flexWrap: 'wrap',
                                                          gap: 8,
                                                          justifyContent:
                                                            'flex-start',
                                                          marginTop: 6,
                                                          maxHeight: 110,
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
                                                            alignSelf: 'center',
                                                            color:
                                                              theme.colors.text
                                                                .strong,
                                                            fontFamily:
                                                              'Inter_400Regular',
                                                            fontSize: 14,
                                                            lineHeight: 20,
                                                            textAlign: 'left',
                                                          },
                                                          dimensions.width
                                                        )}
                                                      >
                                                        {fetchData?.[0]?.name}
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
                                                            color:
                                                              palettes.Brand[
                                                                'Secondary Text'
                                                              ],
                                                            fontFamily:
                                                              'Inter_400Regular',
                                                            fontSize: 14,
                                                            lineHeight: 20,
                                                            textAlign: 'center',
                                                          },
                                                          dimensions.width
                                                        )}
                                                      >
                                                        {fetchData?.[0]?.age}
                                                      </Text>
                                                    </View>
                                                  </View>
                                                </Touchable>
                                              </>
                                            );
                                          }}
                                          showsHorizontalScrollIndicator={true}
                                          showsVerticalScrollIndicator={true}
                                        />
                                      );
                                    }}
                                  </SupabaseUsersApi.FetchGetUserByUniqueUserIdGET>
                                );
                              }}
                              horizontal={false}
                              inverted={false}
                              numColumns={2}
                              showsHorizontalScrollIndicator={true}
                              showsVerticalScrollIndicator={true}
                              style={StyleSheet.applyWidth(
                                {
                                  alignContent: 'flex-start',
                                  alignItems: 'stretch',
                                  flexDirection: 'row',
                                  flexWrap: 'wrap',
                                  gap: 32,
                                  justifyContent: 'space-around',
                                },
                                dimensions.width
                              )}
                            />
                          );
                        }}
                      </SupabaseAttendeesApi.FetchGetUsersByEventIDGET>
                    </View>
                  </>
                );
              }}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
            />
          </>
        );
      }}
    </SupabaseEventsApi.FetchGetSingleEventGET>
  );
};

export default withTheme(EventDetailsCardBlock);
