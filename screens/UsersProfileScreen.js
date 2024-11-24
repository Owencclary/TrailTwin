import React from 'react';
import {
  Button,
  Divider,
  Icon,
  LoadingIndicator,
  ScreenContainer,
  SimpleStyleFlatList,
  SimpleStyleScrollView,
  Touchable,
  withTheme,
} from '@draftbit/ui';
import { useIsFocused } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Text,
  View,
} from 'react-native';
import { Fetch } from 'react-request';
import * as GlobalStyles from '../GlobalStyles.js';
import * as SupabaseUsersApi from '../apis/SupabaseUsersApi.js';
import * as GlobalVariables from '../config/GlobalVariableContext';
import formatJSON from '../global-functions/formatJSON';
import palettes from '../themes/palettes';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import imageSource from '../utils/imageSource';
import openShareUtil from '../utils/openShare';
import useWindowDimensions from '../utils/useWindowDimensions';
import waitUtil from '../utils/wait';

const UsersProfileScreen = props => {
  const { theme, navigation } = props;
  const dimensions = useWindowDimensions();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const setGlobalVariableValue = GlobalVariables.useSetValue();
  const [Interests, setInterests] = React.useState([
    'Festivals',
    'Travel',
    'Plant-based',
    'Movies',
    'Road Trips',
  ]);
  const [UserDetailsModal, setUserDetailsModal] = React.useState(false);
  const [loginEmail, setLoginEmail] = React.useState('');
  const [loginPassword, setLoginPassword] = React.useState('');
  const [moreButtonsView, setMoreButtonsView] = React.useState('');
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
      <SupabaseUsersApi.FetchGetUserByUniqueUserIdGET
        select={'*'}
        user_id={Constants['user_id']}
      >
        {({ loading, error, data, refetchGetUserByUniqueUserId }) => {
          const fetchData = data?.json;
          if (loading) {
            return <ActivityIndicator />;
          }

          if (error || data?.status < 200 || data?.status >= 300) {
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
              listKey={'ugZGmDj5'}
              nestedScrollEnabled={false}
              numColumns={1}
              onEndReachedThreshold={0.5}
              renderItem={({ item, index }) => {
                const listData = item;
                return (
                  <SimpleStyleScrollView
                    bounces={true}
                    horizontal={false}
                    keyboardShouldPersistTaps={'never'}
                    nestedScrollEnabled={false}
                    showsHorizontalScrollIndicator={true}
                    showsVerticalScrollIndicator={false}
                  >
                    {/* View 2 */}
                    <View
                      onLayout={event => {
                        const handler = async () => {
                          try {
                            await waitUtil({ milliseconds: 2000 });
                            await refetchGetUserByUniqueUserId();
                          } catch (err) {
                            console.error(err);
                          }
                        };
                        handler();
                      }}
                      style={StyleSheet.applyWidth(
                        {
                          backgroundColor: Constants['backgroundColor'],
                          height: '100%',
                          width: '100%',
                        },
                        dimensions.width
                      )}
                    >
                      {/* Image */}
                      <ImageBackground
                        resizeMode={'cover'}
                        source={imageSource(`${listData?.background_photo}`)}
                        style={StyleSheet.applyWidth(
                          {
                            height: 500,
                            justifyContent: 'flex-end',
                            width: '100%',
                          },
                          dimensions.width
                        )}
                      >
                        {/* Icon View */}
                        <>
                          {moreButtonsView ? null : (
                            <View
                              style={StyleSheet.applyWidth(
                                {
                                  alignItems: 'center',
                                  gap: 12,
                                  justifyContent: 'center',
                                  marginRight: 32,
                                  marginTop: 64,
                                  position: 'absolute',
                                  right: 0,
                                  top: 0,
                                },
                                dimensions.width
                              )}
                            >
                              <>
                                {moreButtonsView ? null : (
                                  <Button
                                    accessible={true}
                                    onPress={() => {
                                      try {
                                        setMoreButtonsView(true);
                                      } catch (err) {
                                        console.error(err);
                                      }
                                    }}
                                    {...GlobalStyles.ButtonStyles(theme)[
                                      'Button'
                                    ].props}
                                    icon={'Entypo/dots-three-horizontal'}
                                    iconPosition={'left'}
                                    style={StyleSheet.applyWidth(
                                      StyleSheet.compose(
                                        GlobalStyles.ButtonStyles(theme)[
                                          'Button'
                                        ].style,
                                        {
                                          backgroundColor: [
                                            {
                                              minWidth: Breakpoints.Mobile,
                                              value: null,
                                            },
                                            {
                                              minWidth: Breakpoints.Mobile,
                                              value:
                                                Constants['backgroundColor'],
                                            },
                                          ],
                                          color: Constants['textColor'],
                                          paddingRight: 5,
                                          paddingTop: 2,
                                        }
                                      ),
                                      dimensions.width
                                    )}
                                    title={' '}
                                  />
                                )}
                              </>
                            </View>
                          )}
                        </>
                      </ImageBackground>

                      <View
                        style={StyleSheet.applyWidth(
                          {
                            alignSelf: 'auto',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginBottom: 64,
                          },
                          dimensions.width
                        )}
                      >
                        {/* Details */}
                        <View
                          style={StyleSheet.applyWidth(
                            {
                              backgroundColor: Constants['backgroundColor'],
                              flex: 1,
                              justifyContent: 'flex-start',
                              marginTop: 48,
                              paddingLeft: 32,
                              paddingRight: 32,
                            },
                            dimensions.width
                          )}
                        >
                          {/* Profile Photo and Name */}
                          <View
                            style={StyleSheet.applyWidth(
                              {
                                alignSelf: 'auto',
                                flexDirection: 'row',
                                gap: 24,
                                justifyContent: 'flex-start',
                                marginBottom: 32,
                                width: '100%',
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
                                  { borderRadius: 100, height: 90, width: 90 },
                                  dimensions.width
                                )}
                              />
                            </View>
                            {/* Name and Age View */}
                            <View
                              style={StyleSheet.applyWidth(
                                {
                                  alignItems: 'flex-start',
                                  flexDirection: 'column',
                                  flexWrap: 'wrap',
                                  gap: 8,
                                  justifyContent: 'center',
                                  maxHeight: 110,
                                },
                                dimensions.width
                              )}
                            >
                              <View
                                style={StyleSheet.applyWidth(
                                  {
                                    alignItems: 'center',
                                    alignSelf: 'auto',
                                    flexDirection: 'row',
                                    justifyContent: 'flex-start',
                                  },
                                  dimensions.width
                                )}
                              >
                                {/* Name Text */}
                                <Text
                                  accessible={true}
                                  selectable={false}
                                  numberOfLines={1}
                                  style={StyleSheet.applyWidth(
                                    {
                                      alignSelf: 'auto',
                                      color: Constants['textColor'],
                                      fontFamily: 'Inter_500Medium',
                                      fontSize: 22,
                                      marginRight: 8,
                                      textAlign: 'left',
                                    },
                                    dimensions.width
                                  )}
                                >
                                  {listData?.name}
                                  {', '}
                                </Text>
                                {/* Age Text */}
                                <Text
                                  accessible={true}
                                  selectable={false}
                                  numberOfLines={1}
                                  style={StyleSheet.applyWidth(
                                    {
                                      alignSelf: 'auto',
                                      color: Constants['textColor'],
                                      fontFamily: 'Inter_400Regular',
                                      fontSize: 22,
                                      textAlign: 'auto',
                                    },
                                    dimensions.width
                                  )}
                                >
                                  {listData?.age}
                                </Text>
                              </View>
                              {/* Location */}
                              <Text
                                accessible={true}
                                selectable={false}
                                style={StyleSheet.applyWidth(
                                  {
                                    color: Constants['textColor'],
                                    fontFamily: 'Inter_400Regular',
                                    fontSize: 16,
                                    marginTop: 2,
                                  },
                                  dimensions.width
                                )}
                              >
                                {listData?.location}
                              </Text>
                            </View>
                          </View>
                          {/* Social Options */}
                          <View
                            style={StyleSheet.applyWidth(
                              {
                                alignItems: 'center',
                                flexDirection: 'row',
                                gap: 64,
                                justifyContent: 'flex-start',
                              },
                              dimensions.width
                            )}
                          >
                            <>
                              {!listData?.instagram ? null : (
                                <Touchable
                                  onPress={() => {
                                    try {
                                      Linking.openURL(
                                        `https://www.instagram.com/${listData?.instagram}/`
                                      );
                                    } catch (err) {
                                      console.error(err);
                                    }
                                  }}
                                >
                                  <Icon
                                    size={24}
                                    color={Constants['textColor']}
                                    name={'AntDesign/instagram'}
                                  />
                                </Touchable>
                              )}
                            </>
                            <>
                              {!listData?.youtube ? null : (
                                <Touchable
                                  onPress={() => {
                                    try {
                                      Linking.openURL(
                                        `https://www.youtube.com/@${listData?.youtube}`
                                      );
                                    } catch (err) {
                                      console.error(err);
                                    }
                                  }}
                                >
                                  <Icon
                                    size={24}
                                    color={Constants['textColor']}
                                    name={'AntDesign/youtube'}
                                  />
                                </Touchable>
                              )}
                            </>
                            <>
                              {!listData?.tiktok ? null : (
                                <Touchable
                                  onPress={() => {
                                    try {
                                      Linking.openURL(
                                        `https://www.tiktok.com/@${listData?.tiktok}?lang=en`
                                      );
                                    } catch (err) {
                                      console.error(err);
                                    }
                                  }}
                                >
                                  <Icon
                                    size={24}
                                    color={Constants['textColor']}
                                    name={'Ionicons/logo-tiktok'}
                                  />
                                </Touchable>
                              )}
                            </>
                          </View>
                          {/* Divider 3 */}
                          <Divider
                            {...GlobalStyles.DividerStyles(theme)['Divider']
                              .props}
                            color={
                              Constants['dividerColor'] ??
                              palettes.App['Custom Color 3']
                            }
                            style={StyleSheet.applyWidth(
                              StyleSheet.compose(
                                GlobalStyles.DividerStyles(theme)['Divider']
                                  .style,
                                {
                                  marginBottom: 32,
                                  marginTop: 32,
                                  width: '100%',
                                }
                              ),
                              dimensions.width
                            )}
                          />
                          {/* Bike View */}
                          <View
                            style={StyleSheet.applyWidth(
                              {
                                alignItems: 'center',
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                marginBottom: 16,
                              },
                              dimensions.width
                            )}
                          >
                            {/* Bike View */}
                            <Icon
                              color={Constants['textColor']}
                              name={'MaterialIcons/pedal-bike'}
                              size={22}
                              style={StyleSheet.applyWidth(
                                { marginRight: 8 },
                                dimensions.width
                              )}
                            />
                            {/* Bike Text */}
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
                              {'Bike: '}
                              {listData?.bike}
                            </Text>
                          </View>
                          {/* SKill View */}
                          <View
                            style={StyleSheet.applyWidth(
                              {
                                alignItems: 'center',
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                marginBottom: 16,
                              },
                              dimensions.width
                            )}
                          >
                            {/* skill level */}
                            <Icon
                              color={Constants['textColor']}
                              name={
                                'MaterialCommunityIcons/format-list-bulleted-type'
                              }
                              size={22}
                              style={StyleSheet.applyWidth(
                                { marginRight: 8 },
                                dimensions.width
                              )}
                            />
                            {/* skill level */}
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
                              {'Skill Level: '}
                              {listData?.skill_level}{' '}
                            </Text>
                          </View>
                          {/* style */}
                          <View
                            style={StyleSheet.applyWidth(
                              {
                                alignItems: 'center',
                                flexDirection: 'row',
                                flexWrap: 'nowrap',
                                marginBottom: 16,
                              },
                              dimensions.width
                            )}
                          >
                            {/* styles */}
                            <Icon
                              color={Constants['textColor']}
                              name={'MaterialCommunityIcons/bike-fast'}
                              size={22}
                              style={StyleSheet.applyWidth(
                                { marginRight: 8 },
                                dimensions.width
                              )}
                            />
                            {/* Styles */}
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
                              {'Riding Style: '}
                              {formatJSON(listData?.riding_style)}
                            </Text>
                          </View>
                          {/* Looking for */}
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
                            {/* Looking For Icon */}
                            <Icon
                              color={Constants['textColor']}
                              name={'AntDesign/search1'}
                              size={22}
                              style={StyleSheet.applyWidth(
                                { marginRight: 8 },
                                dimensions.width
                              )}
                            />
                            {/* Looking forText */}
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
                              {'Looking for: '}
                              {formatJSON(listData?.looking_for)}
                            </Text>
                          </View>
                          {/* Divider 4 */}
                          <Divider
                            {...GlobalStyles.DividerStyles(theme)['Divider']
                              .props}
                            color={Constants['dividerColor']}
                            style={StyleSheet.applyWidth(
                              StyleSheet.compose(
                                GlobalStyles.DividerStyles(theme)['Divider']
                                  .style,
                                {
                                  marginBottom: 32,
                                  marginTop: 32,
                                  width: '100%',
                                }
                              ),
                              dimensions.width
                            )}
                          />
                          {/* About */}
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
                            {fetchData?.[0]?.bio}
                          </Text>
                          {/* Divider 5 */}
                          <Divider
                            {...GlobalStyles.DividerStyles(theme)['Divider']
                              .props}
                            color={Constants['dividerColor']}
                            style={StyleSheet.applyWidth(
                              StyleSheet.compose(
                                GlobalStyles.DividerStyles(theme)['Divider']
                                  .style,
                                {
                                  marginBottom: 32,
                                  marginTop: 32,
                                  width: '100%',
                                }
                              ),
                              dimensions.width
                            )}
                          />
                          {/* Button View 2 */}
                          <View
                            style={StyleSheet.applyWidth(
                              {
                                flexDirection: 'row',
                                justifyContent: 'space-around',
                                marginBottom: 16,
                                width: '100%',
                              },
                              dimensions.width
                            )}
                          >
                            {/* My Rides */}
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
                                            screen: 'UsersRidesScreen',
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
                                        fontSize: 12,
                                        height: 15,
                                        width: '100%',
                                      }
                                    ),
                                    dimensions.width
                                  )}
                                  title={'My Rides'}
                                />
                              )}
                            </>
                          </View>
                          {/* Button View 3 */}
                          <View
                            style={StyleSheet.applyWidth(
                              {
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                width: '100%',
                              },
                              dimensions.width
                            )}
                          >
                            {/* Edit Profile */}
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
                                            screen: 'EditProfileScreen',
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
                                        fontSize: 12,
                                        height: 15,
                                        width: '48%',
                                      }
                                    ),
                                    dimensions.width
                                  )}
                                  title={'Edit Profile'}
                                />
                              )}
                            </>
                            {/* Settings */}
                            <Button
                              accessible={true}
                              iconPosition={'left'}
                              onPress={() => {
                                try {
                                  navigation.navigate('SettingsScreen');
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
                                    fontSize: 12,
                                    width: '48%',
                                  }
                                ),
                                dimensions.width
                              )}
                              title={'Settings'}
                            />
                          </View>
                        </View>
                        {/* Loading View */}
                        <View>
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
                    </View>
                    <>
                      {!moreButtonsView ? null : (
                        <View
                          style={StyleSheet.applyWidth(
                            {
                              alignItems: 'center',
                              position: 'absolute',
                              top: 200,
                              width: '100%',
                            },
                            dimensions.width
                          )}
                        >
                          {/* Buttons Pop Up */}
                          <View
                            style={StyleSheet.applyWidth(
                              {
                                alignItems: 'center',
                                backgroundColor:
                                  palettes['Trail Twin']['White - Trail Twin'],
                                borderColor: theme.colors.border.brand,
                                borderRadius: 12,
                                borderWidth: 1,
                                gap: 12,
                                justifyContent: 'center',
                                paddingBottom: 16,
                                paddingLeft: 16,
                                paddingRight: 16,
                                paddingTop: 16,
                                position: 'relative',
                                zIndex: 2,
                              },
                              dimensions.width
                            )}
                          >
                            {/* Share Profile */}
                            <Button
                              accessible={true}
                              iconPosition={'left'}
                              onPress={() => {
                                const handler = async () => {
                                  try {
                                    await openShareUtil(
                                      'Check out this profile'
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
                                    width: 200,
                                  }
                                ),
                                dimensions.width
                              )}
                              title={'Share Profile'}
                            />
                            {/* Edit Background photo */}
                            <Button
                              accessible={true}
                              iconPosition={'left'}
                              onPress={() => {
                                try {
                                  navigation.navigate(
                                    'EditBackgroundPhotoScreen'
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
                                    width: 200,
                                  }
                                ),
                                dimensions.width
                              )}
                              title={'Edit Background Photo'}
                            />
                            {/* Logout */}
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
                                      navigation.navigate('LoginScreen');
                                      setGlobalVariableValue({
                                        key: 'AUTHORIZATION_HEADER',
                                        value: null,
                                      });
                                      setGlobalVariableValue({
                                        key: 'user_id',
                                        value: null,
                                      });
                                      setGlobalVariableValue({
                                        key: 'usersName',
                                        value: null,
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
                                          palettes.App.Peoplebit_Salmon_Red,
                                        fontFamily: 'Inter_400Regular',
                                        fontSize: 12,
                                        height: 15,
                                        width: 200,
                                      }
                                    ),
                                    dimensions.width
                                  )}
                                  title={'Logout'}
                                />
                              )}
                            </>
                            <Touchable
                              onPress={() => {
                                try {
                                  setMoreButtonsView(null);
                                } catch (err) {
                                  console.error(err);
                                }
                              }}
                              style={StyleSheet.applyWidth(
                                { marginBottom: 12, marginTop: 12 },
                                dimensions.width
                              )}
                            >
                              <Text
                                accessible={true}
                                selectable={false}
                                {...GlobalStyles.TextStyles(theme)['Text 2']
                                  .props}
                                style={StyleSheet.applyWidth(
                                  GlobalStyles.TextStyles(theme)['Text 2']
                                    .style,
                                  dimensions.width
                                )}
                              >
                                {'Close'}
                              </Text>
                            </Touchable>
                          </View>
                        </View>
                      )}
                    </>
                  </SimpleStyleScrollView>
                );
              }}
              showsHorizontalScrollIndicator={true}
              showsVerticalScrollIndicator={true}
            />
          );
        }}
      </SupabaseUsersApi.FetchGetUserByUniqueUserIdGET>
    </ScreenContainer>
  );
};

export default withTheme(UsersProfileScreen);
