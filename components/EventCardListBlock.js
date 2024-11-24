import React from 'react';
import {
  Button,
  Icon,
  LoadingIndicator,
  SimpleStyleFlashList,
  SimpleStyleFlatList,
  Touchable,
  withTheme,
} from '@draftbit/ui';
import { useIsFocused, useNavigation } from '@react-navigation/native';
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

const EventCardListBlock = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const navigation = useNavigation();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const setGlobalVariableValue = GlobalVariables.useSetValue();
  const [ampm, setAmpm] = React.useState('');
  const [foundRides, setFoundRides] = React.useState('');
  const [weather, setWeather] = React.useState([]);
  // Filters events based on the search query
  const filterEvents = (Variables, setGlobalVariableValue, data) => {
    // Function to filter and sort data based on input term
    // function filterAndSortData(inputTerm) {
    const filteredData = data.filter(item => {
      // Modify conditions according to your search criteria
      console.log(data);
      return item.address
        .toLowerCase()
        .includes(Variables.searchAndFilterQuery.toLowerCase());
    });

    //set screen variable 'search_is_empty' default to 'false'
    // setSearch_is_empty(false);

    // // Check if the filtered data is empty
    // if (filteredData.length === 0) {
    //   setSearch_is_empty(true);
    // }

    // Sort the filtered data (if needed)
    // Example: sorting by first name
    filteredData.sort((a, b) => {
      if (a.address < b.address) return -1;
      if (a.address > b.address) return 1;
      return 0;
    });

    return filteredData;
  };

  const reverseArray = data => {
    return data.reverse();
  };
  const supabaseEventsUpdateEventStatusPATCH =
    SupabaseEventsApi.useUpdateEventStatusPATCH();

  return (
    <SupabaseEventsApi.FetchGetEvents$DescendingOrder$GET select={'*'}>
      {({ loading, error, data, refetchGetEvents$DescendingOrder$ }) => {
        const fetchData = data?.json;
        if (loading) {
          return <ActivityIndicator />;
        }

        if (error || data?.status < 200 || data?.status >= 300) {
          return <ActivityIndicator />;
        }

        return (
          <View>
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
              {({
                loading,
                error,
                data,
                refetchGetEvents$DescendingOrder$,
              }) => {
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
                      data={filterEventsWithRadius(
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
                      listKey={'3GJvBLdh'}
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
                                backgroundColor:
                                  palettes['Trail Twin'][
                                    'Background - Trail Twin'
                                  ],
                                borderColor: theme.colors.border.brand,
                                borderRadius: 12,
                                borderWidth: 0,
                                flexWrap: 'nowrap',
                                justifyContent: 'flex-start',
                                marginBottom: 36,
                                overflow: 'hidden',
                                width: '100%',
                              },
                              dimensions.width
                            )}
                          >
                            <Touchable>
                              <Image
                                resizeMode={'cover'}
                                {...GlobalStyles.ImageStyles(theme)['Image']
                                  .props}
                                source={imageSource(`${listData?.event_photo}`)}
                                style={StyleSheet.applyWidth(
                                  StyleSheet.compose(
                                    GlobalStyles.ImageStyles(theme)['Image']
                                      .style,
                                    {
                                      borderRadius: 12,
                                      height: 300,
                                      width: '100%',
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
                                        {...GlobalStyles.TextStyles(theme)[
                                          'Text'
                                        ].props}
                                        style={StyleSheet.applyWidth(
                                          StyleSheet.compose(
                                            GlobalStyles.TextStyles(theme)[
                                              'Text'
                                            ].style,
                                            {
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
                                {/* Skill and Ride Type 2 */}
                                <View
                                  style={StyleSheet.applyWidth(
                                    {
                                      alignItems: 'center',
                                      flexDirection: 'row',
                                      marginBottom: 4,
                                      maxWidth: '100%',
                                    },
                                    dimensions.width
                                  )}
                                >
                                  <View
                                    style={StyleSheet.applyWidth(
                                      { flexDirection: 'row' },
                                      dimensions.width
                                    )}
                                  >
                                    {/* Ride Type */}
                                    <Text
                                      accessible={true}
                                      selectable={false}
                                      ellipsizeMode={'tail'}
                                      numberOfLines={2}
                                      style={StyleSheet.applyWidth(
                                        {
                                          color:
                                            palettes.Brand['Secondary Text'],
                                          fontFamily: 'Inter_400Regular',
                                          fontSize: 16,
                                        },
                                        dimensions.width
                                      )}
                                    >
                                      {listData?.event_type}
                                    </Text>
                                    {/* Skill */}
                                    <>
                                      {!checkForGroupRide(
                                        listData?.event_type
                                      ) ? null : (
                                        <Text
                                          accessible={true}
                                          selectable={false}
                                          ellipsizeMode={'tail'}
                                          numberOfLines={2}
                                          style={StyleSheet.applyWidth(
                                            {
                                              color:
                                                palettes.Brand[
                                                  'Secondary Text'
                                                ],
                                              fontFamily: 'Inter_400Regular',
                                              fontSize: 16,
                                            },
                                            dimensions.width
                                          )}
                                        >
                                          {' - '}
                                          {formatJSON(listData?.skill_level)}
                                        </Text>
                                      )}
                                    </>
                                  </View>
                                </View>
                                {/* Trail View */}
                                <View
                                  style={StyleSheet.applyWidth(
                                    {
                                      alignItems: 'center',
                                      flexDirection: 'row',
                                      marginBottom: 4,
                                    },
                                    dimensions.width
                                  )}
                                >
                                  {/* Trails Text */}
                                  <Text
                                    accessible={true}
                                    selectable={false}
                                    ellipsizeMode={'tail'}
                                    numberOfLines={2}
                                    style={StyleSheet.applyWidth(
                                      {
                                        color: palettes.Brand['Secondary Text'],
                                        fontFamily: 'Inter_400Regular',
                                        fontSize: 16,
                                      },
                                      dimensions.width
                                    )}
                                  >
                                    {'Trails: '}
                                    {listData?.trail_names}
                                  </Text>
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
                                        color: palettes.Brand['Secondary Text'],
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
                                        color: palettes.Brand['Secondary Text'],
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
                                                params: {
                                                  event_id: listData?.id,
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
          </View>
        );
      }}
    </SupabaseEventsApi.FetchGetEvents$DescendingOrder$GET>
  );
};

export default withTheme(EventCardListBlock);