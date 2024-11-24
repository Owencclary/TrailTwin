import React from 'react';
import { MapCallout, MapCircle, MapMarker, MapView } from '@draftbit/maps';
import {
  Button,
  Icon,
  LoadingIndicator,
  ScreenContainer,
  Touchable,
  withTheme,
} from '@draftbit/ui';
import { useIsFocused } from '@react-navigation/native';
import { ActivityIndicator, Text, View } from 'react-native';
import { Fetch } from 'react-request';
import * as GlobalStyles from '../GlobalStyles.js';
import * as SupabaseEventsApi from '../apis/SupabaseEventsApi.js';
import * as SupabaseUsersApi from '../apis/SupabaseUsersApi.js';
import * as GlobalVariables from '../config/GlobalVariableContext';
import Images from '../config/Images';
import checkForGroupRide from '../global-functions/checkForGroupRide';
import filterEventList from '../global-functions/filterEventList';
import filterEventsWithBlockedUsers from '../global-functions/filterEventsWithBlockedUsers';
import filterEventsWithRadius from '../global-functions/filterEventsWithRadius';
import filterOutPreviousRides from '../global-functions/filterOutPreviousRides';
import formatAmPm from '../global-functions/formatAmPm';
import formatDate from '../global-functions/formatDate';
import formatHours from '../global-functions/formatHours';
import formatJSON from '../global-functions/formatJSON';
import foundEvents from '../global-functions/foundEvents';
import getUserLat from '../global-functions/getUserLat';
import getUserLon from '../global-functions/getUserLon';
import palettes from '../themes/palettes';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import getLocationUtil from '../utils/getLocation';
import imageSource from '../utils/imageSource';
import useWindowDimensions from '../utils/useWindowDimensions';

const FindRidesScreen = props => {
  const { theme, navigation } = props;
  const dimensions = useWindowDimensions();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const setGlobalVariableValue = GlobalVariables.useSetValue();
  const [ampm, setAmpm] = React.useState('');
  const [foundRides, setFoundRides] = React.useState(null);
  const [weather, setWeather] = React.useState([]);
  const getIds = events => {
    const ids = events.map(event => event.id);
    return ids;
  };

  const getLat = event => {
    // return event.map(event => event.meetup_lat);
    const latitude = event.meetup_lat;
    return latitude;
  };

  const getLats = events => {
    const latitudes = events.map(event => event.meetup_lat);
    return latitudes;
  };

  const getLon = event => {
    // return event.map(event => event.meetup_lon);
    const longitude = event.meetup_lon;
    return longitude;
  };

  const getLons = events => {
    const longitudes = events.map(event => event.meetup_lon);
    return longitudes;
  };

  const getName = event => {
    return event.event_name;
  };

  const getNames = events => {
    const names = events.map(event => event.event_name || 'Unnamed Event');
    console.log('Event Names:', names);
    return names;
  };
  const isFocused = useIsFocused();
  React.useEffect(() => {
    const handler = async () => {
      try {
        if (!isFocused) {
          return;
        }
        setGlobalVariableValue({
          key: 'loading',
          value: null,
        });
        const usersData = (
          await SupabaseUsersApi.getUserByUniqueUserIdGET(Constants, {
            select: '*',
            user_id: Constants['user_id'],
          })
        )?.json;
        if ((usersData && usersData[0].map_style) === 'darkMode') {
          setGlobalVariableValue({
            key: 'mapStyle',
            value: [
              { stylers: [{ color: '#212121' }], elementType: 'geometry' },
              { stylers: [{ visibility: 'off' }], elementType: 'labels.icon' },
              {
                stylers: [{ color: '#757575' }],
                elementType: 'labels.text.fill',
              },
              {
                stylers: [{ color: '#212121' }],
                elementType: 'labels.text.stroke',
              },
              {
                stylers: [{ color: '#757575' }],
                elementType: 'geometry',
                featureType: 'administrative',
              },
              {
                stylers: [{ color: '#9e9e9e' }],
                elementType: 'labels.text.fill',
                featureType: 'administrative.country',
              },
              {
                stylers: [{ visibility: 'off' }],
                featureType: 'administrative.land_parcel',
              },
              {
                stylers: [{ visibility: 'off' }],
                elementType: 'labels',
                featureType: 'administrative.land_parcel',
              },
              {
                stylers: [{ color: '#bdbdbd' }],
                elementType: 'labels.text.fill',
                featureType: 'administrative.locality',
              },
              {
                stylers: [{ visibility: 'off' }],
                elementType: 'labels.text',
                featureType: 'poi',
              },
              {
                stylers: [{ color: '#757575' }],
                elementType: 'labels.text.fill',
                featureType: 'poi',
              },
              {
                stylers: [{ color: '#181818' }],
                elementType: 'geometry',
                featureType: 'poi.park',
              },
              {
                stylers: [{ color: '#616161' }],
                elementType: 'labels.text.fill',
                featureType: 'poi.park',
              },
              {
                stylers: [{ color: '#1b1b1b' }],
                elementType: 'labels.text.stroke',
                featureType: 'poi.park',
              },
              {
                stylers: [{ color: '#2c2c2c' }],
                elementType: 'geometry.fill',
                featureType: 'road',
              },
              {
                stylers: [{ color: '#8a8a8a' }],
                elementType: 'labels.text.fill',
                featureType: 'road',
              },
              {
                stylers: [{ color: '#373737' }],
                elementType: 'geometry',
                featureType: 'road.arterial',
              },
              {
                stylers: [{ color: '#3c3c3c' }],
                elementType: 'geometry',
                featureType: 'road.highway',
              },
              {
                stylers: [{ color: '#4e4e4e' }],
                elementType: 'geometry',
                featureType: 'road.highway.controlled_access',
              },
              {
                stylers: [{ visibility: 'off' }],
                elementType: 'labels',
                featureType: 'road.local',
              },
              {
                stylers: [{ color: '#616161' }],
                elementType: 'labels.text.fill',
                featureType: 'road.local',
              },
              {
                stylers: [{ color: '#757575' }],
                elementType: 'labels.text.fill',
                featureType: 'transit',
              },
              {
                stylers: [{ color: '#000000' }],
                elementType: 'geometry',
                featureType: 'water',
              },
              {
                stylers: [{ color: '#3d3d3d' }],
                elementType: 'labels.text.fill',
                featureType: 'water',
              },
            ],
          });
        } else {
          if ((usersData && usersData[0].map_style) === 'midnight') {
            setGlobalVariableValue({
              key: 'mapStyle',
              value: [
                { stylers: [{ color: '#242f3e' }], elementType: 'geometry' },
                {
                  stylers: [{ color: '#746855' }],
                  elementType: 'labels.text.fill',
                },
                {
                  stylers: [{ color: '#242f3e' }],
                  elementType: 'labels.text.stroke',
                },
                {
                  stylers: [{ visibility: 'off' }],
                  elementType: 'labels',
                  featureType: 'administrative.land_parcel',
                },
                {
                  stylers: [{ color: '#d59563' }],
                  elementType: 'labels.text.fill',
                  featureType: 'administrative.locality',
                },
                {
                  stylers: [{ visibility: 'off' }],
                  elementType: 'labels.text',
                  featureType: 'poi',
                },
                {
                  stylers: [{ color: '#d59563' }],
                  elementType: 'labels.text.fill',
                  featureType: 'poi',
                },
                {
                  stylers: [{ color: '#263c3f' }],
                  elementType: 'geometry',
                  featureType: 'poi.park',
                },
                {
                  stylers: [{ color: '#6b9a76' }],
                  elementType: 'labels.text.fill',
                  featureType: 'poi.park',
                },
                {
                  stylers: [{ color: '#38414e' }],
                  elementType: 'geometry',
                  featureType: 'road',
                },
                {
                  stylers: [{ color: '#212a37' }],
                  elementType: 'geometry.stroke',
                  featureType: 'road',
                },
                {
                  stylers: [{ color: '#9ca5b3' }],
                  elementType: 'labels.text.fill',
                  featureType: 'road',
                },
                {
                  stylers: [{ color: '#746855' }],
                  elementType: 'geometry',
                  featureType: 'road.highway',
                },
                {
                  stylers: [{ color: '#1f2835' }],
                  elementType: 'geometry.stroke',
                  featureType: 'road.highway',
                },
                {
                  stylers: [{ color: '#f3d19c' }],
                  elementType: 'labels.text.fill',
                  featureType: 'road.highway',
                },
                {
                  stylers: [{ visibility: 'off' }],
                  elementType: 'labels',
                  featureType: 'road.local',
                },
                {
                  stylers: [{ color: '#2f3948' }],
                  elementType: 'geometry',
                  featureType: 'transit',
                },
                {
                  stylers: [{ color: '#d59563' }],
                  elementType: 'labels.text.fill',
                  featureType: 'transit.station',
                },
                {
                  stylers: [{ color: '#17263c' }],
                  elementType: 'geometry',
                  featureType: 'water',
                },
                {
                  stylers: [{ color: '#515c6d' }],
                  elementType: 'labels.text.fill',
                  featureType: 'water',
                },
                {
                  stylers: [{ color: '#17263c' }],
                  elementType: 'labels.text.stroke',
                  featureType: 'water',
                },
              ],
            });
          } else {
            if ((usersData && usersData[0].map_style) === 'aubergine') {
              setGlobalVariableValue({
                key: 'mapStyle',
                value: [
                  { stylers: [{ color: '#1d2c4d' }], elementType: 'geometry' },
                  {
                    stylers: [{ color: '#8ec3b9' }],
                    elementType: 'labels.text.fill',
                  },
                  {
                    stylers: [{ color: '#1a3646' }],
                    elementType: 'labels.text.stroke',
                  },
                  {
                    stylers: [{ color: '#4b6878' }],
                    elementType: 'geometry.stroke',
                    featureType: 'administrative.country',
                  },
                  {
                    stylers: [{ visibility: 'off' }],
                    elementType: 'labels',
                    featureType: 'administrative.land_parcel',
                  },
                  {
                    stylers: [{ color: '#64779e' }],
                    elementType: 'labels.text.fill',
                    featureType: 'administrative.land_parcel',
                  },
                  {
                    stylers: [{ color: '#4b6878' }],
                    elementType: 'geometry.stroke',
                    featureType: 'administrative.province',
                  },
                  {
                    stylers: [{ color: '#334e87' }],
                    elementType: 'geometry.stroke',
                    featureType: 'landscape.man_made',
                  },
                  {
                    stylers: [{ color: '#023e58' }],
                    elementType: 'geometry',
                    featureType: 'landscape.natural',
                  },
                  {
                    stylers: [{ color: '#283d6a' }],
                    elementType: 'geometry',
                    featureType: 'poi',
                  },
                  {
                    stylers: [{ visibility: 'off' }],
                    elementType: 'labels.text',
                    featureType: 'poi',
                  },
                  {
                    stylers: [{ color: '#6f9ba5' }],
                    elementType: 'labels.text.fill',
                    featureType: 'poi',
                  },
                  {
                    stylers: [{ color: '#1d2c4d' }],
                    elementType: 'labels.text.stroke',
                    featureType: 'poi',
                  },
                  {
                    stylers: [{ color: '#023e58' }],
                    elementType: 'geometry.fill',
                    featureType: 'poi.park',
                  },
                  {
                    stylers: [{ color: '#3C7680' }],
                    elementType: 'labels.text.fill',
                    featureType: 'poi.park',
                  },
                  {
                    stylers: [{ color: '#304a7d' }],
                    elementType: 'geometry',
                    featureType: 'road',
                  },
                  {
                    stylers: [{ color: '#98a5be' }],
                    elementType: 'labels.text.fill',
                    featureType: 'road',
                  },
                  {
                    stylers: [{ color: '#1d2c4d' }],
                    elementType: 'labels.text.stroke',
                    featureType: 'road',
                  },
                  {
                    stylers: [{ color: '#2c6675' }],
                    elementType: 'geometry',
                    featureType: 'road.highway',
                  },
                  {
                    stylers: [{ color: '#255763' }],
                    elementType: 'geometry.stroke',
                    featureType: 'road.highway',
                  },
                  {
                    stylers: [{ color: '#b0d5ce' }],
                    elementType: 'labels.text.fill',
                    featureType: 'road.highway',
                  },
                  {
                    stylers: [{ color: '#023e58' }],
                    elementType: 'labels.text.stroke',
                    featureType: 'road.highway',
                  },
                  {
                    stylers: [{ visibility: 'off' }],
                    elementType: 'labels',
                    featureType: 'road.local',
                  },
                  {
                    stylers: [{ color: '#98a5be' }],
                    elementType: 'labels.text.fill',
                    featureType: 'transit',
                  },
                  {
                    stylers: [{ color: '#1d2c4d' }],
                    elementType: 'labels.text.stroke',
                    featureType: 'transit',
                  },
                  {
                    stylers: [{ color: '#283d6a' }],
                    elementType: 'geometry.fill',
                    featureType: 'transit.line',
                  },
                  {
                    stylers: [{ color: '#3a4762' }],
                    elementType: 'geometry',
                    featureType: 'transit.station',
                  },
                  {
                    stylers: [{ color: '#0e1626' }],
                    elementType: 'geometry',
                    featureType: 'water',
                  },
                  {
                    stylers: [{ color: '#4e6d70' }],
                    elementType: 'labels.text.fill',
                    featureType: 'water',
                  },
                ],
              });
            } else {
              if ((usersData && usersData[0].map_style) === 'silver') {
                setGlobalVariableValue({
                  key: 'mapStyle',
                  value: [
                    {
                      stylers: [{ color: '#f5f5f5' }],
                      elementType: 'geometry',
                    },
                    {
                      stylers: [{ visibility: 'off' }],
                      elementType: 'labels.icon',
                    },
                    {
                      stylers: [{ color: '#616161' }],
                      elementType: 'labels.text.fill',
                    },
                    {
                      stylers: [{ color: '#f5f5f5' }],
                      elementType: 'labels.text.stroke',
                    },
                    {
                      stylers: [{ visibility: 'off' }],
                      elementType: 'labels',
                      featureType: 'administrative.land_parcel',
                    },
                    {
                      stylers: [{ color: '#bdbdbd' }],
                      elementType: 'labels.text.fill',
                      featureType: 'administrative.land_parcel',
                    },
                    {
                      stylers: [{ color: '#eeeeee' }],
                      elementType: 'geometry',
                      featureType: 'poi',
                    },
                    {
                      stylers: [{ visibility: 'off' }],
                      elementType: 'labels.text',
                      featureType: 'poi',
                    },
                    {
                      stylers: [{ color: '#757575' }],
                      elementType: 'labels.text.fill',
                      featureType: 'poi',
                    },
                    {
                      stylers: [{ color: '#e5e5e5' }],
                      elementType: 'geometry',
                      featureType: 'poi.park',
                    },
                    {
                      stylers: [{ color: '#9e9e9e' }],
                      elementType: 'labels.text.fill',
                      featureType: 'poi.park',
                    },
                    {
                      stylers: [{ color: '#ffffff' }],
                      elementType: 'geometry',
                      featureType: 'road',
                    },
                    {
                      stylers: [{ color: '#757575' }],
                      elementType: 'labels.text.fill',
                      featureType: 'road.arterial',
                    },
                    {
                      stylers: [{ color: '#dadada' }],
                      elementType: 'geometry',
                      featureType: 'road.highway',
                    },
                    {
                      stylers: [{ color: '#616161' }],
                      elementType: 'labels.text.fill',
                      featureType: 'road.highway',
                    },
                    {
                      stylers: [{ visibility: 'off' }],
                      elementType: 'labels',
                      featureType: 'road.local',
                    },
                    {
                      stylers: [{ color: '#9e9e9e' }],
                      elementType: 'labels.text.fill',
                      featureType: 'road.local',
                    },
                    {
                      stylers: [{ color: '#e5e5e5' }],
                      elementType: 'geometry',
                      featureType: 'transit.line',
                    },
                    {
                      stylers: [{ color: '#eeeeee' }],
                      elementType: 'geometry',
                      featureType: 'transit.station',
                    },
                    {
                      stylers: [{ color: '#c9c9c9' }],
                      elementType: 'geometry',
                      featureType: 'water',
                    },
                    {
                      stylers: [{ color: '#9e9e9e' }],
                      elementType: 'labels.text.fill',
                      featureType: 'water',
                    },
                  ],
                });
              } else {
                if ((usersData && usersData[0].map_style) === 'lush') {
                  setGlobalVariableValue({
                    key: 'mapStyle',
                    value: [
                      {
                        stylers: [{ visibility: 'off' }],
                        elementType: 'labels',
                        featureType: 'administrative.land_parcel',
                      },
                      {
                        stylers: [{ visibility: 'off' }],
                        elementType: 'labels.text',
                        featureType: 'poi',
                      },
                      {
                        stylers: [{ visibility: 'off' }],
                        elementType: 'labels',
                        featureType: 'road.local',
                      },
                    ],
                  });
                } else {
                  setGlobalVariableValue({
                    key: 'mapStyle',
                    value: [
                      {
                        stylers: [{ color: '#ebe3cd' }],
                        elementType: 'geometry',
                      },
                      {
                        stylers: [{ color: '#523735' }],
                        elementType: 'labels.text.fill',
                      },
                      {
                        stylers: [{ color: '#f5f1e6' }],
                        elementType: 'labels.text.stroke',
                      },
                      {
                        stylers: [{ color: '#c9b2a6' }],
                        elementType: 'geometry.stroke',
                        featureType: 'administrative',
                      },
                      {
                        stylers: [{ color: '#dcd2be' }],
                        elementType: 'geometry.stroke',
                        featureType: 'administrative.land_parcel',
                      },
                      {
                        stylers: [{ visibility: 'off' }],
                        elementType: 'labels',
                        featureType: 'administrative.land_parcel',
                      },
                      {
                        stylers: [{ color: '#ae9e90' }],
                        elementType: 'labels.text.fill',
                        featureType: 'administrative.land_parcel',
                      },
                      {
                        stylers: [{ color: '#dfd2ae' }],
                        elementType: 'geometry',
                        featureType: 'landscape.natural',
                      },
                      {
                        stylers: [{ color: '#dfd2ae' }],
                        elementType: 'geometry',
                        featureType: 'poi',
                      },
                      {
                        stylers: [{ visibility: 'off' }],
                        elementType: 'labels.text',
                        featureType: 'poi',
                      },
                      {
                        stylers: [{ color: '#93817c' }],
                        elementType: 'labels.text.fill',
                        featureType: 'poi',
                      },
                      {
                        stylers: [{ color: '#a5b076' }],
                        elementType: 'geometry.fill',
                        featureType: 'poi.park',
                      },
                      {
                        stylers: [{ color: '#447530' }],
                        elementType: 'labels.text.fill',
                        featureType: 'poi.park',
                      },
                      {
                        stylers: [{ color: '#f5f1e6' }],
                        elementType: 'geometry',
                        featureType: 'road',
                      },
                      {
                        stylers: [{ color: '#fdfcf8' }],
                        elementType: 'geometry',
                        featureType: 'road.arterial',
                      },
                      {
                        stylers: [{ color: '#f8c967' }],
                        elementType: 'geometry',
                        featureType: 'road.highway',
                      },
                      {
                        stylers: [{ color: '#e9bc62' }],
                        elementType: 'geometry.stroke',
                        featureType: 'road.highway',
                      },
                      {
                        stylers: [{ color: '#e98d58' }],
                        elementType: 'geometry',
                        featureType: 'road.highway.controlled_access',
                      },
                      {
                        stylers: [{ color: '#db8555' }],
                        elementType: 'geometry.stroke',
                        featureType: 'road.highway.controlled_access',
                      },
                      {
                        stylers: [{ visibility: 'off' }],
                        elementType: 'labels',
                        featureType: 'road.local',
                      },
                      {
                        stylers: [{ color: '#806b63' }],
                        elementType: 'labels.text.fill',
                        featureType: 'road.local',
                      },
                      {
                        stylers: [{ color: '#dfd2ae' }],
                        elementType: 'geometry',
                        featureType: 'transit.line',
                      },
                      {
                        stylers: [{ color: '#8f7d77' }],
                        elementType: 'labels.text.fill',
                        featureType: 'transit.line',
                      },
                      {
                        stylers: [{ color: '#ebe3cd' }],
                        elementType: 'labels.text.stroke',
                        featureType: 'transit.line',
                      },
                      {
                        stylers: [{ color: '#dfd2ae' }],
                        elementType: 'geometry',
                        featureType: 'transit.station',
                      },
                      {
                        stylers: [{ color: '#b9d3c2' }],
                        elementType: 'geometry.fill',
                        featureType: 'water',
                      },
                      {
                        stylers: [{ color: '#92998d' }],
                        elementType: 'labels.text.fill',
                        featureType: 'water',
                      },
                    ],
                  });
                }
              }
            }
          }
        }

        const data = await getLocationUtil({ accuracy: 'Highest' });
        /* hidden 'Set Variable' action */
        /* hidden 'Set Variable' action */
        setGlobalVariableValue({
          key: 'usersLocationLat',
          value: getUserLat(data),
        });
        setGlobalVariableValue({
          key: 'usersLocationLon',
          value: getUserLon(data),
        });
        if (Constants['user_id'] === null) {
          navigation.navigate('LoginScreen');
        } else {
          setGlobalVariableValue({
            key: 'usersName',
            value: usersData && usersData[0].name,
          });
          setGlobalVariableValue({
            key: 'blockedUsers',
            value: usersData && usersData[0].blocked_users,
          });
          if ((usersData && usersData[0].dark_mode) === true) {
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
        }
      } catch (err) {
        console.error(err);
      }
    };
    handler();
  }, [isFocused]);

  return (
    <ScreenContainer
      scrollable={false}
      hasLeftSafeArea={false}
      hasRightSafeArea={false}
      hasSafeArea={true}
      hasTopSafeArea={true}
      style={StyleSheet.applyWidth(
        { backgroundColor: Constants['backgroundColor'] },
        dimensions.width
      )}
    >
      {/* Header */}
      <View
        style={StyleSheet.applyWidth(
          {
            alignItems: 'center',
            backgroundColor: Constants['backgroundColor'],
            borderBottomWidth: 1,
            borderColor: Constants['dividerColor'],
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingBottom: 24,
            paddingLeft: 48,
            paddingRight: 48,
            paddingTop: 24,
            width: '100%',
            zIndex: 1,
          },
          dimensions.width
        )}
      >
        {/* Filter View 2 */}
        <View
          style={StyleSheet.applyWidth(
            { alignItems: 'flex-start' },
            dimensions.width
          )}
        >
          <Touchable
            onPress={() => {
              try {
                navigation.navigate('BottomTabNavigator', {
                  screen: 'FindRidesTab',
                  params: { screen: 'CreateEventScreen' },
                });
              } catch (err) {
                console.error(err);
              }
            }}
          >
            <View
              style={StyleSheet.applyWidth(
                { alignItems: 'center', gap: 4 },
                dimensions.width
              )}
            >
              <Icon
                color={Constants['textColor']}
                name={'AntDesign/plus'}
                size={24}
              />
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
                      fontSize: 12,
                    }
                  ),
                  dimensions.width
                )}
              >
                {'Create'}
              </Text>
            </View>
          </Touchable>
        </View>

        <View
          style={StyleSheet.applyWidth(
            { alignItems: 'center', flex: 1 },
            dimensions.width
          )}
        >
          {/* Event Map Text */}
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
                  fontSize: 18,
                }
              ),
              dimensions.width
            )}
          >
            {'Find Rides'}
          </Text>
        </View>
        {/* Filter View */}
        <View
          style={StyleSheet.applyWidth(
            { alignItems: 'flex-end' },
            dimensions.width
          )}
        >
          <Touchable
            onPress={() => {
              try {
                navigation.navigate('BottomTabNavigator', {
                  screen: 'FindRidesTab',
                  params: { screen: 'FilterRidesScreen' },
                });
              } catch (err) {
                console.error(err);
              }
            }}
          >
            <View
              style={StyleSheet.applyWidth(
                { alignItems: 'center', gap: 4 },
                dimensions.width
              )}
            >
              <Icon
                color={Constants['textColor']}
                name={'Ionicons/options-outline'}
                size={24}
              />
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
                      fontSize: 12,
                    }
                  ),
                  dimensions.width
                )}
              >
                {'Filter'}
              </Text>
            </View>
          </Touchable>
        </View>
      </View>
      {/* Fetch 2 */}
      <SupabaseEventsApi.FetchGetEvents$DescendingOrder$GET
        handlers={{
          onData: fetch2Data => {
            try {
              setFoundRides(
                foundEvents(
                  filterEventsWithRadius(
                    filterOutPreviousRides(
                      filterEventList(
                        fetch2Data,
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
            } catch (err) {
              console.error(err);
            }
          },
        }}
        select={'*'}
      >
        {({ loading, error, data, refetchGetEvents$DescendingOrder$ }) => {
          const fetch2Data = data?.json;
          if (loading) {
            return <ActivityIndicator />;
          }

          if (error || data?.status < 200 || data?.status >= 300) {
            return <ActivityIndicator />;
          }

          return (
            <>
              <MapView
                apiKey={'AIzaSyBzktToWosjNgrrUawZnbslB9NSXSXCkwo'}
                autoClusterMarkers={false}
                autoClusterMarkersDistanceMeters={10000}
                keyExtractor={(mapViewData, index) =>
                  mapViewData?.id ??
                  mapViewData?.uuid ??
                  index?.toString() ??
                  JSON.stringify(mapViewData)
                }
                listKey={'pZIsNgeb'}
                loadingEnabled={true}
                markersData={filterEventsWithBlockedUsers(
                  filterEventList(
                    filterOutPreviousRides(fetch2Data),
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
                  ),
                  Constants['blockedUsers']
                )}
                moveOnMarkerPress={true}
                renderItem={({ item, index }) => {
                  const mapViewData = item;
                  return (
                    <>
                      <MapMarker
                        androidUseDefaultIconImplementation={false}
                        flat={false}
                        pinImageSize={50}
                        tracksViewChanges={true}
                        latitude={getLat(mapViewData)}
                        longitude={getLon(mapViewData)}
                        pinImage={imageSource(Images['location2'])}
                      >
                        <MapCallout
                          onPress={() => {
                            try {
                              navigation.navigate('BottomTabNavigator', {
                                screen: 'FindRidesTab',
                                params: {
                                  screen: 'EventDetailsScreen',
                                  params: { event_id: mapViewData?.id },
                                },
                              });
                            } catch (err) {
                              console.error(err);
                            }
                          }}
                          showTooltip={true}
                          style={StyleSheet.applyWidth(
                            { opacity: 1 },
                            dimensions.width
                          )}
                        >
                          <View
                            style={StyleSheet.applyWidth(
                              {
                                alignItems: 'center',
                                backgroundColor: Constants['backgroundColor'],
                                height: 132,
                                justifyContent: 'center',
                                position: 'relative',
                                width: 200,
                              },
                              dimensions.width
                            )}
                          >
                            <View
                              style={StyleSheet.applyWidth(
                                {
                                  alignItems: 'center',
                                  alignSelf: 'center',
                                  marginBottom: 8,
                                  width: '100%',
                                },
                                dimensions.width
                              )}
                            >
                              {/* Title View */}
                              <View
                                style={StyleSheet.applyWidth(
                                  {
                                    alignContent: 'center',
                                    alignItems: 'center',
                                    alignSelf: 'auto',
                                    flexDirection: 'row',
                                    gap: 0,
                                    justifyContent: 'center',
                                    marginBottom: 2,
                                    position: 'relative',
                                    width: '100%',
                                  },
                                  dimensions.width
                                )}
                              >
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
                                        fontSize: 18,
                                      }
                                    ),
                                    dimensions.width
                                  )}
                                >
                                  {mapViewData?.event_name}
                                </Text>
                              </View>
                              {/* Skill and Ride Type 2 */}
                              <View
                                style={StyleSheet.applyWidth(
                                  {
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
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
                                        color: Constants['textColor'],
                                        fontFamily: 'Inter_400Regular',
                                        fontSize: 12,
                                        lineHeight: 24,
                                      },
                                      dimensions.width
                                    )}
                                  >
                                    {mapViewData?.event_type}
                                    {' - '}
                                    {mapViewData?.total_riders}
                                    {' Riders'}
                                  </Text>
                                  {/* Skill */}
                                  <>
                                    {checkForGroupRide(
                                      mapViewData?.event_type
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
                                            fontSize: 12,
                                            lineHeight: 24,
                                          },
                                          dimensions.width
                                        )}
                                      >
                                        {' - '}
                                        {formatJSON(mapViewData?.skill_level)}
                                      </Text>
                                    )}
                                  </>
                                </View>
                              </View>
                              {/* Date View */}
                              <View
                                style={StyleSheet.applyWidth(
                                  {
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    gap: 0,
                                    justifyContent: 'center',
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
                                      fontSize: 12,
                                    },
                                    dimensions.width
                                  )}
                                >
                                  {formatDate(mapViewData?.date)}
                                  {', '}
                                  {formatHours(mapViewData?.start_time)}{' '}
                                  {formatAmPm(ampm, mapViewData?.start_time)}
                                </Text>
                              </View>
                            </View>
                            {/* View Event */}
                            <Button
                              accessible={true}
                              iconPosition={'left'}
                              onPress={() => {
                                try {
                                  setGlobalVariableValue({
                                    key: 'loading',
                                    value: true,
                                  });
                                  navigation.navigate('BottomTabNavigator', {
                                    screen: 'FindRidesTab',
                                    params: {
                                      screen: 'EventDetailsScreen',
                                      params: { event_id: mapViewData?.id },
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
                                    height: 5,
                                    position: 'relative',
                                    width: 152,
                                  }
                                ),
                                dimensions.width
                              )}
                              title={'View Event'}
                            />
                            {/* Loading Indicator 2 */}
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
                        </MapCallout>
                      </MapMarker>
                    </>
                  );
                }}
                zoomEnabled={true}
                {...GlobalStyles.MapViewStyles(theme)['Map View'].props}
                customMapStyle={Constants['mapStyle']}
                followsUserLocation={true}
                latitude={Constants['usersLocationLat']}
                loadingBackgroundColor={
                  palettes['Trail Twin']['Background - Trail Twin']
                }
                loadingIndicatorColor={
                  palettes['Trail Twin']['Primary Green - Trail Twin']
                }
                longitude={Constants['usersLocationLon']}
                mapType={'standard'}
                provider={'google'}
                rotateEnabled={false}
                scrollEnabled={true}
                showsCompass={false}
                showsPointsOfInterest={false}
                showsUserLocation={true}
                style={StyleSheet.applyWidth(
                  GlobalStyles.MapViewStyles(theme)['Map View'].style,
                  dimensions.width
                )}
                zoom={9}
              />
            </>
          );
        }}
      </SupabaseEventsApi.FetchGetEvents$DescendingOrder$GET>
      {/* Button View */}
      <View
        style={StyleSheet.applyWidth(
          {
            alignItems: 'center',
            backgroundColor: Constants['backgroundColor'],
            borderBottomWidth: 0,
            borderColor: Constants['dividerColor'],
            borderLeftWidth: 1,
            borderRightWidth: 1,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            borderTopWidth: 1,
            borderWidth: 1,
            bottom: 0,
            flexDirection: 'column',
            justifyContent: 'center',
            left: 0,
            paddingBottom: 8,
            paddingLeft: 54,
            paddingRight: 54,
            paddingTop: 32,
            position: 'absolute',
            right: 0,
            zIndex: 1,
          },
          dimensions.width
        )}
      >
        {/* View Rides */}
        <Button
          accessible={true}
          iconPosition={'left'}
          onPress={() => {
            try {
              setGlobalVariableValue({
                key: 'loading',
                value: true,
              });
              navigation.navigate('BottomTabNavigator', {
                screen: 'FindRidesTab',
                params: { screen: 'ExploreRidesScreen' },
              });
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
                  palettes['Trail Twin']['Secondary Green #2 - Trail Twin'],
                fontFamily: 'Inter_400Regular',
                fontSize: 14,
                height: 5,
                marginBottom: 24,
                marginTop: 24,
                width: '100%',
              }
            ),
            dimensions.width
          )}
          title={'View List of Rides'}
        />
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
    </ScreenContainer>
  );
};

export default withTheme(FindRidesScreen);
