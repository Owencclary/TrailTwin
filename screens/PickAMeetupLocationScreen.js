import React from 'react';
import { MapMarker, MapView } from '@draftbit/maps';
import {
  Button,
  LoadingIndicator,
  ScreenContainer,
  withTheme,
} from '@draftbit/ui';
import { useIsFocused } from '@react-navigation/native';
import { View } from 'react-native';
import * as GlobalStyles from '../GlobalStyles.js';
import * as GlobalVariables from '../config/GlobalVariableContext';
import Images from '../config/Images';
import palettes from '../themes/palettes';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import imageSource from '../utils/imageSource';
import showAlertUtil from '../utils/showAlert';
import useWindowDimensions from '../utils/useWindowDimensions';

const defaultProps = { editingEvent: null, editingEventId: null };

const PickAMeetupLocationScreen = props => {
  const { theme, navigation } = props;
  const dimensions = useWindowDimensions();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const setGlobalVariableValue = GlobalVariables.useSetValue();
  const [pinLat, setPinLat] = React.useState(0);
  const [pinLon, setPinLon] = React.useState(0);
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
      setPinLat(Constants['usersLocationLat']);
      setPinLon(Constants['usersLocationLon']);
    } catch (err) {
      console.error(err);
    }
  }, [isFocused]);

  return (
    <ScreenContainer
      hasSafeArea={false}
      scrollable={false}
      hasLeftSafeArea={false}
      hasRightSafeArea={false}
      hasTopSafeArea={false}
      style={StyleSheet.applyWidth(
        { backgroundColor: Constants['backgroundColor'] },
        dimensions.width
      )}
    >
      <MapView
        apiKey={'AIzaSyBzktToWosjNgrrUawZnbslB9NSXSXCkwo'}
        autoClusterMarkers={false}
        autoClusterMarkersDistanceMeters={10000}
        loadingEnabled={true}
        moveOnMarkerPress={true}
        onPress={(latitude, longitude) => {
          try {
            setPinLat(latitude);
            setPinLon(longitude);
          } catch (err) {
            console.error(err);
          }
        }}
        scrollEnabled={true}
        showsCompass={false}
        zoomEnabled={true}
        {...GlobalStyles.MapViewStyles(theme)['Map View'].props}
        customMapStyle={[
          { stylers: [{ color: '#ebe3cd' }], elementType: 'geometry' },
          { stylers: [{ color: '#523735' }], elementType: 'labels.text.fill' },
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
        ]}
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
        showsPointsOfInterest={false}
        showsUserLocation={true}
        style={StyleSheet.applyWidth(
          GlobalStyles.MapViewStyles(theme)['Map View'].style,
          dimensions.width
        )}
        zoom={9}
      >
        <MapMarker
          androidUseDefaultIconImplementation={false}
          tracksViewChanges={true}
          flat={false}
          latitude={pinLat}
          longitude={pinLon}
          pinColor={palettes['Trail Twin']['Pin Color - Trail twin']}
          pinImage={imageSource(Images['location2'])}
          pinImageSize={50}
        />
      </MapView>
      {/* Button */}
      <View
        style={StyleSheet.applyWidth(
          {
            alignItems: 'center',
            backgroundColor: palettes['Trail Twin']['Background - Trail Twin'],
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
            paddingBottom: 72,
            paddingLeft: 32,
            paddingRight: 32,
            paddingTop: 24,
            position: 'absolute',
            right: 0,
            zIndex: 1,
          },
          dimensions.width
        )}
      >
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
                key: 'meetupLat',
                value: pinLat,
              });
              setGlobalVariableValue({
                key: 'meetupLon',
                value: pinLon,
              });

              showAlertUtil({
                title: undefined,
                message: 'Meetup Spot Selected',
                buttonText: undefined,
              });

              if (
                props.route?.params?.editingEvent ??
                defaultProps.editingEvent
              ) {
                navigation.navigate('BottomTabNavigator', {
                  screen: 'ProfileTab',
                  params: { screen: 'EditEventScreen' },
                });
              } else {
                navigation.navigate('BottomTabNavigator', {
                  screen: 'FindRidesTab',
                  params: { screen: 'CreateEventScreen' },
                });
              }
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
                marginTop: 32,
                width: '100%',
              }
            ),
            dimensions.width
          )}
          title={'Select Location'}
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

export default withTheme(PickAMeetupLocationScreen);
