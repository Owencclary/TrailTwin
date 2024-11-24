import React from 'react';
import { Icon, Touchable, useTheme } from '@draftbit/ui';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { I18nManager, Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { systemWeights } from 'react-native-typography';
import LinkingConfiguration from './LinkingConfiguration';
import * as GlobalVariables from './config/GlobalVariableContext';
import checkForMaxEvents from './global-functions/checkForMaxEvents';
import filterEventList from './global-functions/filterEventList';
import getUserLat from './global-functions/getUserLat';
import getUserLon from './global-functions/getUserLon';
import posthogEventCaptureSetPersonId from './global-functions/posthogEventCaptureSetPersonId';
import BackgroundPhotoUploadScreen from './screens/BackgroundPhotoUploadScreen';
import BlockedUsersScreen from './screens/BlockedUsersScreen';
import ChatScreen from './screens/ChatScreen';
import CreateEventScreen from './screens/CreateEventScreen';
import EditBackgroundPhotoScreen from './screens/EditBackgroundPhotoScreen';
import EditEventScreen from './screens/EditEventScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import EventDetailsScreen from './screens/EventDetailsScreen';
import ExploreRidesScreen from './screens/ExploreRidesScreen';
import FAQScreen from './screens/FAQScreen';
import FilterRidersScreen from './screens/FilterRidersScreen';
import FilterRidesScreen from './screens/FilterRidesScreen';
import FindRidesScreen from './screens/FindRidesScreen';
import InboxScreen from './screens/InboxScreen';
import LoginScreen from './screens/LoginScreen';
import MeetRidersScreen from './screens/MeetRidersScreen';
import MeetRidersSocialMediaTestScreen from './screens/MeetRidersSocialMediaTestScreen';
import OtherUsersProfileScreen from './screens/OtherUsersProfileScreen';
import OtherUsersRidesScreen from './screens/OtherUsersRidesScreen';
import PayWallScreen from './screens/PayWallScreen';
import PickAMeetupLocationScreen from './screens/PickAMeetupLocationScreen';
import RideChatScreen from './screens/RideChatScreen';
import SettingsScreen from './screens/SettingsScreen';
import SetupProfileScreen from './screens/SetupProfileScreen';
import SignUpScreen from './screens/SignUpScreen';
import TermsOfServiceScreen from './screens/TermsOfServiceScreen';
import UsersProfileScreen from './screens/UsersProfileScreen';
import UsersRidesScreen from './screens/UsersRidesScreen';
import palettes from './themes/palettes';
import Breakpoints from './utils/Breakpoints';
import openShareUtil from './utils/openShare';
import parseBoolean from './utils/parseBoolean';
import showAlertUtil from './utils/showAlert';
import useWindowDimensions from './utils/useWindowDimensions';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function DefaultAndroidBackIcon({ tintColor }) {
  return (
    <View style={[styles.headerContainer, styles.headerContainerLeft]}>
      <Icon
        name="AntDesign/arrowleft"
        size={24}
        color={tintColor}
        style={[styles.headerIcon, styles.headerIconLeft]}
      />
    </View>
  );
}

function DefaultDrawerIcon({ tintColor, navigation }) {
  return (
    <Touchable
      onPress={() => navigation.toggleDrawer()}
      style={[styles.headerContainer, styles.headerContainerLeft]}
    >
      <Icon
        name="EvilIcons/navicon"
        size={27}
        color={tintColor}
        style={[styles.headerIcon, styles.headerIconLeft]}
      />
    </Touchable>
  );
}

function FindRidesTab({ navigation }) {
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', e => {
      e.preventDefault();

      navigation.navigate('BottomTabNavigator', {
        screen: 'FindRidesTab',
        params: { screen: 'FindRidesScreen' },
      });
    });

    return unsubscribe;
  }, [navigation]);

  const theme = useTheme();

  const Constants = GlobalVariables.useValues();
  const setGlobalVariableValue = GlobalVariables.useSetValue();

  return (
    <Stack.Navigator
      initialRouteName="FindRidesScreen"
      presentation="modal"
      tabPressToInitialScreen={true}
      screenOptions={({ navigation }) => ({
        animationEnabled: false,
        cardStyle: { flex: 1 },
        headerBackImage:
          Platform.OS === 'android' ? DefaultAndroidBackIcon : null,
      })}
    >
      <Stack.Screen
        name="CreateEventScreen"
        component={CreateEventScreen}
        options={({ navigation }) => ({
          headerLeft: ({ tintColor, canGoBack }) =>
            canGoBack ? (
              <Touchable
                style={[styles.headerContainer, styles.headerContainerLeft]}
                onPress={() => {
                  try {
                    navigation.goBack();
                  } catch (err) {
                    console.error(err);
                  }
                }}
              >
                <Icon
                  name="Ionicons/chevron-back"
                  size={Platform.OS === 'ios' ? 21 : 24}
                  color={tintColor}
                  style={[styles.headerIcon, styles.headerIconLeft]}
                />
                <View style={styles.headerLabelWrapper}>
                  <Text style={[styles.headerLabel]}>Back</Text>
                </View>
              </Touchable>
            ) : null,
          headerStyle: {
            backgroundColor: theme.colors.background.brand,
            borderBottomColor: theme.colors.border.brand,
          },
          headerTitle: 'Schedule a Ride',
          headerTitleAlign: 'center',
          headerTitleStyle: { fontFamily: 'Inter_500Medium', fontSize: 18 },
          title: 'Create Event',
        })}
      />
      <Stack.Screen
        name="ExploreRidesScreen"
        component={ExploreRidesScreen}
        options={({ navigation }) => ({
          headerLeft: ({ tintColor, canGoBack }) =>
            canGoBack ? (
              <Touchable
                style={[styles.headerContainer, styles.headerContainerLeft]}
                onPress={() => {
                  try {
                    navigation.goBack();
                  } catch (err) {
                    console.error(err);
                  }
                }}
              >
                <Icon
                  name="AntDesign/left"
                  size={Platform.OS === 'ios' ? 21 : 24}
                  color={tintColor}
                  style={[styles.headerIcon, styles.headerIconLeft]}
                />
                <View style={styles.headerLabelWrapper}>
                  <Text style={[styles.headerLabel]}>Back</Text>
                </View>
              </Touchable>
            ) : null,
          headerStyle: {
            backgroundColor: theme.colors.background.brand,
            borderBottomColor: 'transparent',
          },
          headerTitleStyle: { fontFamily: 'Inter_500Medium', fontSize: 16 },
          title: 'Explore Rides',
        })}
      />
      <Stack.Screen
        name="EventDetailsScreen"
        component={EventDetailsScreen}
        options={({ navigation }) => ({
          headerLeft: ({ tintColor, canGoBack }) =>
            canGoBack ? (
              <Touchable
                style={[styles.headerContainer, styles.headerContainerLeft]}
                onPress={() => {
                  try {
                    navigation.goBack();
                  } catch (err) {
                    console.error(err);
                  }
                }}
              >
                <Icon
                  name="AntDesign/left"
                  size={Platform.OS === 'ios' ? 21 : 24}
                  color={tintColor}
                  style={[styles.headerIcon, styles.headerIconLeft]}
                />
                <View style={styles.headerLabelWrapper}>
                  <Text style={[styles.headerLabel]}>Back</Text>
                </View>
              </Touchable>
            ) : null,
          headerRight: ({ tintColor }) => (
            <Touchable
              style={[styles.headerContainer, styles.headerContainerRight]}
              onPress={() => {
                const handler = async () => {
                  try {
                    await openShareUtil(
                      'https://www.reddit.com/r/MTB/s/NJQKnZ4M71'
                    );
                  } catch (err) {
                    console.error(err);
                  }
                };
                handler();
              }}
            >
              <Icon
                name=""
                size={Platform.OS === 'ios' ? 21 : 24}
                color={tintColor}
                style={[styles.headerIcon, styles.headerIconRight]}
              />
            </Touchable>
          ),
          headerStyle: {
            backgroundColor: theme.colors.background.brand,
            borderBottomColor: theme.colors.border.brand,
          },
          headerTitleStyle: { fontFamily: 'Inter_500Medium', fontSize: 18 },
          title: 'Event Details',
        })}
      />
      <Stack.Screen
        name="FilterRidesScreen"
        component={FilterRidesScreen}
        options={({ navigation }) => ({
          headerLeft: ({ tintColor, canGoBack }) =>
            canGoBack ? (
              <Touchable
                style={[styles.headerContainer, styles.headerContainerLeft]}
                onPress={() => {
                  try {
                    navigation.goBack();
                  } catch (err) {
                    console.error(err);
                  }
                }}
              >
                <Icon
                  name="AntDesign/left"
                  size={Platform.OS === 'ios' ? 21 : 24}
                  color={tintColor}
                  style={[styles.headerIcon, styles.headerIconLeft]}
                />
                <View style={styles.headerLabelWrapper}>
                  <Text style={[styles.headerLabel]}>Back</Text>
                </View>
              </Touchable>
            ) : null,
          headerStyle: { backgroundColor: theme.colors.background.brand },
          headerTitle: 'Filter Events',
          headerTitleAlign: 'center',
          headerTitleStyle: { fontFamily: 'Inter_500Medium', fontSize: 18 },
          title: 'Filter Rides Screen',
        })}
      />
      <Stack.Screen
        name="FindRidesScreen"
        component={FindRidesScreen}
        options={({ navigation }) => ({
          headerShown: false,
          headerTitle: 'Event Map',
          headerTitleAlign: 'center',
          headerTitleStyle: { fontFamily: 'Inter_500Medium', fontSize: 20 },
          title: 'Find Rides',
        })}
      />
    </Stack.Navigator>
  );
}

function MeetRidersTab({ navigation }) {
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', e => {
      e.preventDefault();

      navigation.navigate('BottomTabNavigator', {
        screen: 'MeetRidersTab',
        params: { screen: 'MeetRidersScreen' },
      });
    });

    return unsubscribe;
  }, [navigation]);

  const theme = useTheme();

  const Constants = GlobalVariables.useValues();

  return (
    <Stack.Navigator
      initialRouteName="MeetRidersScreen"
      tabPressToInitialScreen={true}
      screenOptions={({ navigation }) => ({
        cardStyle: { flex: 1 },
        headerBackImage:
          Platform.OS === 'android' ? DefaultAndroidBackIcon : null,
      })}
    >
      <Stack.Screen
        name="OtherUsersProfileScreen"
        component={OtherUsersProfileScreen}
        options={({ navigation }) => ({
          headerLeft: ({ tintColor, canGoBack }) =>
            canGoBack ? (
              <Touchable
                style={[styles.headerContainer, styles.headerContainerLeft]}
                onPress={() => {
                  try {
                    navigation.goBack();
                  } catch (err) {
                    console.error(err);
                  }
                }}
              >
                <Icon
                  name="AntDesign/left"
                  size={Platform.OS === 'ios' ? 21 : 24}
                  color={theme.colors.text.strong}
                  style={[styles.headerIcon, styles.headerIconLeft]}
                />
                <View style={styles.headerLabelWrapper}>
                  <Text
                    style={[
                      styles.headerLabel,
                      { color: theme.colors.text.strong },
                    ]}
                  >
                    Back
                  </Text>
                </View>
              </Touchable>
            ) : null,
          headerStyle: {
            backgroundColor: theme.colors.background.brand,
            borderBottomColor: 'transparent',
          },
          headerTitle: 'User Profile',
          headerTitleStyle: { fontFamily: 'Inter_500Medium', fontSize: 16 },
          title: "Other User's Profile",
        })}
      />
      <Stack.Screen
        name="MeetRidersScreen"
        component={MeetRidersScreen}
        options={({ navigation }) => ({
          headerRight: ({ tintColor }) => (
            <Touchable
              style={[styles.headerContainer, styles.headerContainerRight]}
              onPress={() => {
                try {
                  navigation.navigate('BottomTabNavigator', {
                    screen: 'MeetRidersTab',
                    params: { screen: 'FilterRidersScreen' },
                  });
                } catch (err) {
                  console.error(err);
                }
              }}
            >
              <View style={styles.headerLabelWrapper}>
                <Text style={[styles.headerLabel]}>Filter</Text>
              </View>
              <Icon
                name="Ionicons/options-outline"
                size={Platform.OS === 'ios' ? 21 : 24}
                color={tintColor}
                style={[styles.headerIcon, styles.headerIconRight]}
              />
            </Touchable>
          ),
          headerTitleStyle: { fontFamily: 'Inter_400Regular', fontSize: 16 },
          title: 'Meet Riders',
        })}
      />
      <Stack.Screen
        name="FilterRidersScreen"
        component={FilterRidersScreen}
        options={({ navigation }) => ({
          headerLeft: ({ tintColor, canGoBack }) =>
            canGoBack ? (
              <Touchable
                style={[styles.headerContainer, styles.headerContainerLeft]}
                onPress={() => {
                  try {
                    navigation.goBack();
                  } catch (err) {
                    console.error(err);
                  }
                }}
              >
                <Icon
                  name="AntDesign/left"
                  size={Platform.OS === 'ios' ? 21 : 24}
                  color={tintColor}
                  style={[styles.headerIcon, styles.headerIconLeft]}
                />
                <View style={styles.headerLabelWrapper}>
                  <Text style={[styles.headerLabel]}>Back</Text>
                </View>
              </Touchable>
            ) : null,
          title: 'Filter Riders Screen',
        })}
      />
    </Stack.Navigator>
  );
}

function ProfileTab({ navigation }) {
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', e => {
      e.preventDefault();

      navigation.navigate('BottomTabNavigator', {
        screen: 'ProfileTab',
        params: { screen: 'UsersProfileScreen' },
      });
    });

    return unsubscribe;
  }, [navigation]);

  const theme = useTheme();

  const Constants = GlobalVariables.useValues();

  return (
    <Stack.Navigator
      initialRouteName="UsersProfileScreen"
      tabPressToInitialScreen={true}
      screenOptions={({ navigation }) => ({
        animationEnabled: false,
        cardStyle: { flex: 1 },
        headerBackImage:
          Platform.OS === 'android' ? DefaultAndroidBackIcon : null,
      })}
    >
      <Stack.Screen
        name="UsersProfileScreen"
        component={UsersProfileScreen}
        options={({ navigation }) => ({
          headerShown: false,
          headerStyle: {
            backgroundColor: theme.colors.background.brand,
            borderBottomColor: 'transparent',
          },
          headerTitle: 'My Profile',
          headerTitleStyle: { fontFamily: 'Inter_500Medium', fontSize: 16 },
          title: 'Users Profile',
        })}
      />
      <Stack.Screen
        name="EditProfileScreen"
        component={EditProfileScreen}
        options={({ navigation }) => ({
          headerShown: false,
          title: 'Edit Profile',
        })}
      />
      <Stack.Screen
        name="UsersRidesScreen"
        component={UsersRidesScreen}
        options={({ navigation }) => ({
          headerLeft: ({ tintColor, canGoBack }) =>
            canGoBack ? (
              <Touchable
                style={[styles.headerContainer, styles.headerContainerLeft]}
                onPress={() => {
                  try {
                    navigation.goBack();
                  } catch (err) {
                    console.error(err);
                  }
                }}
              >
                <Icon
                  name="AntDesign/left"
                  size={Platform.OS === 'ios' ? 21 : 24}
                  color={tintColor}
                  style={[styles.headerIcon, styles.headerIconLeft]}
                />
                <View style={styles.headerLabelWrapper}>
                  <Text style={[styles.headerLabel]}>Back</Text>
                </View>
              </Touchable>
            ) : null,
          title: 'Users Rides',
        })}
      />
      <Stack.Screen
        name="EditEventScreen"
        component={EditEventScreen}
        options={({ navigation }) => ({
          headerLeft: ({ tintColor, canGoBack }) =>
            canGoBack ? (
              <Touchable
                style={[styles.headerContainer, styles.headerContainerLeft]}
                onPress={() => {
                  try {
                    navigation.goBack();
                  } catch (err) {
                    console.error(err);
                  }
                }}
              >
                <Icon
                  name="AntDesign/left"
                  size={Platform.OS === 'ios' ? 21 : 24}
                  color={tintColor}
                  style={[styles.headerIcon, styles.headerIconLeft]}
                />
                <View style={styles.headerLabelWrapper}>
                  <Text style={[styles.headerLabel]}>Back</Text>
                </View>
              </Touchable>
            ) : null,
          title: 'Edit Event',
        })}
      />
    </Stack.Navigator>
  );
}

function BottomTabNavigator() {
  const theme = useTheme();

  const Constants = GlobalVariables.useValues();

  const tabBarOrDrawerIcons = {
    InboxScreen: 'AntDesign/mail',
    MeetRidersTab: 'Ionicons/people-outline',
    FindRidesTab: 'MaterialCommunityIcons/bike',
    ProfileTab: 'Ionicons/person-outline',
    InboxScreen: '',
  };

  return (
    <Tab.Navigator
      initialRouteName="FindRidesTab"
      backBehavior="history"
      screenOptions={({ navigation }) => ({
        headerShown: false,
        headerTitleAlign: 'center',
        headerTitleStyle: { fontFamily: 'Inter_400Regular', fontSize: 12 },
        tabBarActiveBackgroundColor: theme.colors.background.brand,
        tabBarActiveTintColor:
          palettes['Trail Twin']['Primary Green - Trail Twin'],
        tabBarInactiveTintColor: theme.colors.text.strong,
        tabBarLabelPosition: 'below-icon',
        tabBarLabelStyle: { fontFamily: 'Inter_400Regular', fontSize: 12 },
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: theme.colors.background.brand,
          borderTopColor: 'transparent',
        },
      })}
    >
      <Tab.Screen
        name="InboxScreen"
        component={InboxScreen}
        options={({ navigation }) => ({
          headerShown: false,
          headerTitle: 'Inbox',
          headerTitleStyle: { fontFamily: 'Inter_500Medium', fontSize: 20 },
          tabBarIcon: ({ focused, color }) => (
            <Icon
              name="AntDesign/mail"
              size={22}
              color={
                focused
                  ? palettes['Trail Twin']['Primary Green - Trail Twin']
                  : theme.colors.text.strong
              }
            />
          ),
          tabBarLabel: 'Inbox',
          title: 'Inbox Screen',
        })}
      />
      <Tab.Screen
        name="MeetRidersTab"
        component={MeetRidersTab}
        options={({ navigation }) => ({
          tabBarIcon: ({ focused, color }) => (
            <Icon
              name="Ionicons/people-outline"
              size={22}
              color={
                focused
                  ? palettes['Trail Twin']['Primary Green - Trail Twin']
                  : theme.colors.text.strong
              }
            />
          ),
          tabBarLabel: 'Meet Riders',
          title: 'Meet Riders Tab',
        })}
      />
      <Tab.Screen
        name="FindRidesTab"
        component={FindRidesTab}
        options={({ navigation }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color }) => (
            <Icon
              name="MaterialCommunityIcons/bike"
              size={22}
              color={
                focused
                  ? palettes['Trail Twin']['Primary Green - Trail Twin']
                  : theme.colors.text.strong
              }
            />
          ),
          tabBarLabel: 'Find Rides',
          title: 'Find Rides Tab',
        })}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileTab}
        options={({ navigation }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color }) => (
            <Icon
              name="Ionicons/person-outline"
              size={22}
              color={
                focused
                  ? palettes['Trail Twin']['Primary Green - Trail Twin']
                  : theme.colors.text.strong
              }
            />
          ),
          tabBarLabel: 'Profile',
          title: 'Profile Tab',
        })}
      />
    </Tab.Navigator>
  );
}

export default function RootAppNavigator() {
  const theme = useTheme();

  const Constants = GlobalVariables.useValues();
  const setGlobalVariableValue = GlobalVariables.useSetValue();

  return (
    <NavigationContainer
      theme={{
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: '#fdfdf5ff',
        },
      }}
      linking={LinkingConfiguration}
    >
      <Stack.Navigator
        initialRouteName="LoginScreen"
        screenOptions={({ navigation }) => ({
          cardStyle: { flex: 1 },
          headerBackImage:
            Platform.OS === 'android' ? DefaultAndroidBackIcon : null,
          headerTitleStyle: { fontFamily: 'Inter_500Medium', fontSize: 16 },
        })}
      >
        <Stack.Screen
          name="SignUpScreen"
          component={SignUpScreen}
          options={({ navigation }) => ({
            headerShown: false,
            title: 'Sign up',
          })}
        />
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={({ navigation }) => ({
            headerShown: false,
            title: 'Login',
          })}
        />
        <Stack.Screen
          name="FindRidesScreen"
          component={FindRidesScreen}
          options={({ navigation }) => ({
            title: 'Find Rides',
          })}
        />
        <Stack.Screen
          name="PickAMeetupLocationScreen"
          component={PickAMeetupLocationScreen}
          options={({ navigation }) => ({
            headerLeft: ({ tintColor, canGoBack }) =>
              canGoBack ? (
                <Touchable
                  style={[styles.headerContainer, styles.headerContainerLeft]}
                  onPress={() => {
                    try {
                      navigation.goBack();
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                >
                  <Icon
                    name="AntDesign/left"
                    size={Platform.OS === 'ios' ? 21 : 24}
                    color={theme.colors.text.strong}
                    style={[styles.headerIcon, styles.headerIconLeft]}
                  />
                  <View style={styles.headerLabelWrapper}>
                    <Text
                      style={[
                        styles.headerLabel,
                        { color: theme.colors.text.strong },
                      ]}
                    >
                      Back
                    </Text>
                  </View>
                </Touchable>
              ) : null,
            headerStyle: {
              backgroundColor:
                palettes['Trail Twin']['Background - Trail Twin'],
              borderBottomColor: theme.colors.border.brand,
            },
            headerTintColor: palettes['Trail Twin']['Black - Trail Twin'],
            headerTitleStyle: { fontFamily: 'Inter_500Medium', fontSize: 16 },
            title: 'Pick a Meetup Location',
          })}
        />
        <Stack.Screen
          name="EditProfileScreen"
          component={EditProfileScreen}
          options={({ navigation }) => ({
            headerShown: false,
            title: 'Edit Profile',
          })}
        />
        <Stack.Screen
          name="ChatScreen"
          component={ChatScreen}
          options={({ navigation }) => ({
            cardStyle: {
              backgroundColor:
                palettes['Trail Twin']['Background - Trail Twin'],
            },
            headerShown: false,
            headerTitleStyle: { fontFamily: 'Inter_500Medium', fontSize: 20 },
            title: 'Chat',
          })}
        />
        <Stack.Screen
          name="RideChatScreen"
          component={RideChatScreen}
          options={({ navigation }) => ({
            headerShown: false,
            title: 'Ride Chat',
          })}
        />
        <Stack.Screen
          name="OtherUsersRidesScreen"
          component={OtherUsersRidesScreen}
          options={({ navigation }) => ({
            headerLeft: ({ tintColor, canGoBack }) =>
              canGoBack ? (
                <Touchable
                  style={[styles.headerContainer, styles.headerContainerLeft]}
                  onPress={() => {
                    try {
                      navigation.goBack();
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                >
                  <Icon
                    name="AntDesign/left"
                    size={Platform.OS === 'ios' ? 21 : 24}
                    color={tintColor}
                    style={[styles.headerIcon, styles.headerIconLeft]}
                  />
                  <View style={styles.headerLabelWrapper}>
                    <Text style={[styles.headerLabel]}>Back</Text>
                  </View>
                </Touchable>
              ) : null,
            title: 'Other Users Rides',
          })}
        />
        <Stack.Screen
          name="PayWallScreen"
          component={PayWallScreen}
          options={({ navigation }) => ({
            title: 'Pay Wall Screen',
          })}
        />
        <Stack.Screen
          name="SetupProfileScreen"
          component={SetupProfileScreen}
          options={({ navigation }) => ({
            headerShown: false,
            title: 'Setup Profile',
          })}
        />
        <Stack.Screen
          name="BackgroundPhotoUploadScreen"
          component={BackgroundPhotoUploadScreen}
          options={({ navigation }) => ({
            headerShown: false,
            title: 'Background Photo Upload',
          })}
        />
        <Stack.Screen
          name="EditBackgroundPhotoScreen"
          component={EditBackgroundPhotoScreen}
          options={({ navigation }) => ({
            headerLeft: ({ tintColor, canGoBack }) =>
              canGoBack ? (
                <Touchable
                  style={[styles.headerContainer, styles.headerContainerLeft]}
                  onPress={() => {
                    try {
                      navigation.goBack();
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                >
                  <Icon
                    name="AntDesign/left"
                    size={Platform.OS === 'ios' ? 21 : 24}
                    color={tintColor}
                    style={[styles.headerIcon, styles.headerIconLeft]}
                  />
                  <View style={styles.headerLabelWrapper}>
                    <Text style={[styles.headerLabel]}>Back</Text>
                  </View>
                </Touchable>
              ) : null,
            title: 'Edit Background Photo',
          })}
        />
        <Stack.Screen
          name="SettingsScreen"
          component={SettingsScreen}
          options={({ navigation }) => ({
            headerLeft: ({ tintColor, canGoBack }) =>
              canGoBack ? (
                <Touchable
                  style={[styles.headerContainer, styles.headerContainerLeft]}
                  onPress={() => {
                    try {
                      navigation.goBack();
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                >
                  <Icon
                    name="AntDesign/left"
                    size={Platform.OS === 'ios' ? 21 : 24}
                    color={tintColor}
                    style={[styles.headerIcon, styles.headerIconLeft]}
                  />
                  <View style={styles.headerLabelWrapper}>
                    <Text style={[styles.headerLabel]}>Back</Text>
                  </View>
                </Touchable>
              ) : null,
            headerTitle: 'Settings',
            title: 'Settings',
          })}
        />
        <Stack.Screen
          name="BlockedUsersScreen"
          component={BlockedUsersScreen}
          options={({ navigation }) => ({
            headerLeft: ({ tintColor, canGoBack }) =>
              canGoBack ? (
                <Touchable
                  style={[styles.headerContainer, styles.headerContainerLeft]}
                  onPress={() => {
                    try {
                      navigation.goBack();
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                >
                  <Icon
                    name="AntDesign/left"
                    size={Platform.OS === 'ios' ? 21 : 24}
                    color={tintColor}
                    style={[styles.headerIcon, styles.headerIconLeft]}
                  />
                  <View style={styles.headerLabelWrapper}>
                    <Text style={[styles.headerLabel]}>Back</Text>
                  </View>
                </Touchable>
              ) : null,
            title: 'Blocked Users',
          })}
        />
        <Stack.Screen
          name="TermsOfServiceScreen"
          component={TermsOfServiceScreen}
          options={({ navigation }) => ({
            title: 'Terms of Service',
          })}
        />
        <Stack.Screen
          name="MeetRidersSocialMediaTestScreen"
          component={MeetRidersSocialMediaTestScreen}
          options={({ navigation }) => ({
            title: 'Meet Riders Social Media Test',
          })}
        />
        <Stack.Screen
          name="FAQScreen"
          component={FAQScreen}
          options={({ navigation }) => ({
            headerLeft: ({ tintColor, canGoBack }) =>
              canGoBack ? (
                <Touchable
                  style={[styles.headerContainer, styles.headerContainerLeft]}
                  onPress={() => {
                    try {
                      navigation.goBack();
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                >
                  <Icon
                    name="AntDesign/left"
                    size={Platform.OS === 'ios' ? 21 : 24}
                    color={tintColor}
                    style={[styles.headerIcon, styles.headerIconLeft]}
                  />
                  <View style={styles.headerLabelWrapper}>
                    <Text style={[styles.headerLabel]}>Back</Text>
                  </View>
                </Touchable>
              ) : null,
            headerTitle: 'Frequently Asked Questions',
            headerTitleAlign: 'center',
            headerTitleAllowFontScaling: true,
            title: 'FAQ',
          })}
        />
        <Stack.Screen
          name="BottomTabNavigator"
          component={BottomTabNavigator}
          options={({ navigation }) => ({
            headerShown: false,
            title: 'Bottom Tab Navigator',
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    ...Platform.select({
      ios: null,
      default: {
        marginVertical: 3,
        marginHorizontal: 11,
      },
    }),
  },
  headerContainerLeft: Platform.select({ ios: { marginLeft: 8 } }),
  headerContainerRight: Platform.select({ ios: { marginRight: 8 } }),
  headerIcon: Platform.select({
    ios: {
      marginVertical: 12,
      resizeMode: 'contain',
      transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
    },
    default: {
      margin: 3,
      resizeMode: 'contain',
      transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
    },
  }),
  headerIconLeft: Platform.select({ ios: { marginRight: 6 } }),
  headerIconRight: Platform.select({ ios: { marginLeft: 6 } }),
  headerLabel: { fontSize: 17, letterSpacing: 0.35 },
  headerLabelWrapper: { flexDirection: 'row', alignItems: 'flex-start' },
});
