import React from 'react';
import {
  Button,
  Icon,
  LoadingIndicator,
  ScreenContainer,
  SimpleStyleFlashList,
  SimpleStyleFlatList,
  SimpleStyleKeyboardAwareScrollView,
  Touchable,
  withTheme,
} from '@draftbit/ui';
import { useIsFocused } from '@react-navigation/native';
import { ActivityIndicator, Image, Text, View } from 'react-native';
import { Fetch } from 'react-request';
import * as GlobalStyles from '../GlobalStyles.js';
import * as EventPhotosApi from '../apis/EventPhotosApi.js';
import * as SupabaseEventsApi from '../apis/SupabaseEventsApi.js';
import * as GlobalVariables from '../config/GlobalVariableContext';
import Images from '../config/Images';
import checkForGroupRide from '../global-functions/checkForGroupRide';
import createEventStatus from '../global-functions/createEventStatus';
import filterEventList from '../global-functions/filterEventList';
import filterEventsWithBlockedUsers from '../global-functions/filterEventsWithBlockedUsers';
import filterEventsWithRadius from '../global-functions/filterEventsWithRadius';
import filterOutPreviousRides from '../global-functions/filterOutPreviousRides';
import formatAmPm from '../global-functions/formatAmPm';
import formatDate from '../global-functions/formatDate';
import formatHours from '../global-functions/formatHours';
import formatJSON from '../global-functions/formatJSON';
import foundEvents from '../global-functions/foundEvents';
import palettes from '../themes/palettes';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import imageSource from '../utils/imageSource';
import useWindowDimensions from '../utils/useWindowDimensions';

const ExploreRidesScreen = props => {
  const { theme, navigation } = props;
  const dimensions = useWindowDimensions();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const setGlobalVariableValue = GlobalVariables.useSetValue();
  const [ampm, setAmpm] = React.useState('');
  const [foundRides, setFoundRides] = React.useState(null);
  const [hostsEvents, setHostsEvents] = React.useState('');
  const [weather, setWeather] = React.useState([]);
  const supabaseEventsUpdateEventStatusPATCH =
    SupabaseEventsApi.useUpdateEventStatusPATCH();
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
      <SimpleStyleKeyboardAwareScrollView
        enableAutomaticScroll={false}
        enableOnAndroid={false}
        enableResetScrollToCoords={false}
        keyboardShouldPersistTaps={'never'}
        showsVerticalScrollIndicator={true}
        viewIsInsideTabBar={false}
        style={StyleSheet.applyWidth(
          {
            alignItems: 'center',
            paddingBottom: 32,
            paddingLeft: 32,
            paddingRight: 32,
            paddingTop: 32,
          },
          dimensions.width
        )}
      >
        {/* Rides Near You */}
        <View
          style={StyleSheet.applyWidth(
            {
              backgroundColor: palettes['Trail Twin']['Olive - Trail Twin'],
              height: 50,
              justifyContent: 'center',
              marginBottom: 32,
              width: '100%',
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
                { fontFamily: 'Inter_400Regular', fontSize: 22, marginLeft: 24 }
              ),
              dimensions.width
            )}
          >
            {'Rides Near You'}
          </Text>
        </View>

        <SupabaseEventsApi.FetchGetEvents$DescendingOrder$GET
          handlers={{
            onData: fetchData => {
              try {
                setFoundRides(
                  foundEvents(
                    filterEventsWithRadius(
                      filterOutPreviousRides(
                        filterEventList(
                          fetchData,
                          Constants['eventTypeFilter'],
                          Constants['tagsFilter'],
                          Constants['rideNameFilter'],
                          Constants['trailFilter'],
                          Constants['skillLevelFilter'],
                          Constants['minDateFilter'],
                          Constants['maxDateFilter'],
                          Constants['startTimeAfterFilter'],
                          Constants['startTimeBeforeFilter'],
                          Constants['rideLengthFilter']
                        )
                      ),
                      Constants['usersLocationLat'],
                      Constants['usersLocationLon'],
                      Constants['searchRadius']
                    )
                  )
                );
                console.log(foundRides, '< RIDES');
              } catch (err) {
                console.error(err);
              }
            },
          }}
          select={'*'}
        >
          {({ loading, error, data, refetchGetEvents$DescendingOrder$ }) => {
            const fetchData = data?.json;
            if (loading) {
              return <ActivityIndicator />;
            }

            if (error || data?.status < 200 || data?.status >= 300) {
              return <ActivityIndicator />;
            }

            return (
              <>
                {/* Found Rides */}
                <>
                  {foundRides ? null : (
                    <View
                      style={StyleSheet.applyWidth(
                        {
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: 32,
                          paddingRight: 24,
                          width: '100%',
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
                            {
                              color: [
                                { minWidth: Breakpoints.Mobile, value: null },
                                {
                                  minWidth: Breakpoints.Mobile,
                                  value: Constants['textColor'],
                                },
                              ],
                              fontFamily: 'Inter_400Regular',
                              fontSize: 18,
                              marginLeft: 24,
                            }
                          ),
                          dimensions.width
                        )}
                      >
                        {
                          'No rides found, try expanding search radius or clearing the filter.'
                        }
                      </Text>
                    </View>
                  )}
                </>
                <SimpleStyleFlatList
                  data={filterEventsWithBlockedUsers(
                    filterEventsWithRadius(
                      filterOutPreviousRides(
                        filterEventList(
                          fetchData,
                          Constants['eventTypeFilter'],
                          Constants['tagsFilter'],
                          Constants['rideNameFilter'],
                          Constants['trailFilter'],
                          Constants['skillLevelFilter'],
                          Constants['minDateFilter'],
                          Constants['maxDateFilter'],
                          Constants['startTimeAfterFilter'],
                          Constants['startTimeBeforeFilter'],
                          Constants['rideLengthFilter']
                        )
                      ),
                      Constants['usersLocationLat'],
                      Constants['usersLocationLon'],
                      Constants['searchRadius']
                    ),
                    Constants['blockedUsers']
                  )}
                  horizontal={false}
                  inverted={false}
                  keyExtractor={(listData, index) =>
                    listData?.id ??
                    listData?.uuid ??
                    index?.toString() ??
                    JSON.stringify(listData)
                  }
                  keyboardShouldPersistTaps={'never'}
                  listKey={'3SNp61l3'}
                  nestedScrollEnabled={false}
                  numColumns={1}
                  onEndReachedThreshold={0.5}
                  renderItem={({ item, index }) => {
                    const listData = item;
                    return (
                      <View
                        onLayout={event => {
                          const handler = async () => {
                            try {
                              (
                                await supabaseEventsUpdateEventStatusPATCH.mutateAsync(
                                  {
                                    event_status: createEventStatus(
                                      listData?.date
                                    ),
                                    id: listData?.id,
                                  }
                                )
                              )?.json;
                            } catch (err) {
                              console.error(err);
                            }
                          };
                          handler();
                        }}
                        style={StyleSheet.applyWidth(
                          {
                            alignContent: 'flex-start',
                            alignItems: 'flex-start',
                            backgroundColor: Constants['backgroundColor'],
                            borderColor: theme.colors.border.brand,
                            borderRadius: 12,
                            borderWidth: 0,
                            flexWrap: 'nowrap',
                            justifyContent: 'flex-start',
                            marginBottom: 36,
                            overflow: 'hidden',
                            paddingLeft: 10,
                            paddingRight: 10,
                            width: '100%',
                          },
                          dimensions.width
                        )}
                      >
                        <Touchable>
                          <Image
                            resizeMode={'cover'}
                            {...GlobalStyles.ImageStyles(theme)['Image'].props}
                            source={imageSource(`${listData?.event_photo}`)}
                            style={StyleSheet.applyWidth(
                              StyleSheet.compose(
                                GlobalStyles.ImageStyles(theme)['Image'].style,
                                {
                                  borderRadius: 12,
                                  height: 200,
                                  width: [
                                    {
                                      minWidth: Breakpoints.Mobile,
                                      value: '100%',
                                    },
                                    {
                                      minWidth: Breakpoints.Mobile,
                                      value: dimensions.width - 64,
                                    },
                                  ],
                                }
                              ),
                              dimensions.width
                            )}
                          />
                          <View
                            style={StyleSheet.applyWidth(
                              {
                                alignItems: 'flex-start',
                                alignSelf: 'auto',
                                marginTop: 12,
                              },
                              dimensions.width
                            )}
                          >
                            {/* Title View */}
                            <View
                              style={StyleSheet.applyWidth(
                                {
                                  alignContent: 'center',
                                  alignItems: 'flex-start',
                                  alignSelf: 'auto',
                                  flexDirection: 'column',
                                  gap: 0,
                                  justifyContent: 'flex-start',
                                  marginBottom: 6,
                                  position: 'relative',
                                  width: '100%',
                                },
                                dimensions.width
                              )}
                            >
                              <>
                                {!listData?.event_name ? null : (
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
                                    {listData?.event_name}
                                  </Text>
                                )}
                              </>
                            </View>
                            {/* Total Riders */}
                            <View
                              style={StyleSheet.applyWidth(
                                {
                                  alignItems: 'center',
                                  flexDirection: 'row',
                                  marginBottom: 3,
                                },
                                dimensions.width
                              )}
                            >
                              {/* Total Riders */}
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
                                  },
                                  dimensions.width
                                )}
                              >
                                {listData?.total_riders}
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
                                    fontSize: 16,
                                  },
                                  dimensions.width
                                )}
                              >
                                {formatDate(listData?.date)}
                                {', '}
                                {formatHours(listData?.start_time)}{' '}
                                {formatAmPm(ampm, listData?.start_time)}
                                {' - Partly Cloudy'}
                              </Text>
                              <Icon
                                color={Constants['textColor']}
                                name={'Ionicons/partly-sunny-outline'}
                                size={18}
                                style={StyleSheet.applyWidth(
                                  { marginLeft: 5, marginRight: 5 },
                                  dimensions.width
                                )}
                              />
                            </View>
                          </View>
                          {/* Button View */}
                          <View
                            style={StyleSheet.applyWidth(
                              {
                                alignContent: 'flex-start',
                                alignItems: 'flex-start',
                                justifyContent: 'flex-start',
                                marginBottom: 24,
                                marginTop: 12,
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
                                      navigation.navigate(
                                        'BottomTabNavigator',
                                        {
                                          screen: 'FindRidesTab',
                                          params: {
                                            screen: 'EventDetailsScreen',
                                            params: { event_id: listData?.id },
                                          },
                                        }
                                      );
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
                                        width: '100%',
                                      }
                                    ),
                                    dimensions.width
                                  )}
                                  title={'View Event'}
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
                        </Touchable>
                      </View>
                    );
                  }}
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  style={StyleSheet.applyWidth(
                    {
                      alignItems: 'center',
                      flexDirection: 'column',
                      maxWidth: '100%',
                      width: '100%',
                    },
                    dimensions.width
                  )}
                />
              </>
            );
          }}
        </SupabaseEventsApi.FetchGetEvents$DescendingOrder$GET>
      </SimpleStyleKeyboardAwareScrollView>
    </ScreenContainer>
  );
};

export default withTheme(ExploreRidesScreen);
