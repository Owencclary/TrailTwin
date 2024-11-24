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
  StatusBar,
  Text,
  View,
} from 'react-native';
import { Fetch } from 'react-request';
import * as GlobalStyles from '../GlobalStyles.js';
import * as SupabaseChatsApi from '../apis/SupabaseChatsApi.js';
import * as SupabaseFlaggedContentApi from '../apis/SupabaseFlaggedContentApi.js';
import * as SupabaseUsersApi from '../apis/SupabaseUsersApi.js';
import * as GlobalVariables from '../config/GlobalVariableContext';
import addBlockedUser from '../global-functions/addBlockedUser';
import chatExists from '../global-functions/chatExists';
import createArray from '../global-functions/createArray';
import formatJSON from '../global-functions/formatJSON';
import getRecentChatId from '../global-functions/getRecentChatId';
import palettes from '../themes/palettes';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import imageSource from '../utils/imageSource';
import openShareUtil from '../utils/openShare';
import showAlertUtil from '../utils/showAlert';
import useWindowDimensions from '../utils/useWindowDimensions';

const OtherUsersProfileScreen = props => {
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
  const [chats, setChats] = React.useState([]);
  const [displayImageArray, setDisplayImageArray] = React.useState('');
  const [displayImageIndex, setDisplayImageIndex] = React.useState(0);
  const [existingChat, setExistingChat] = React.useState(null);
  const [friendDisplayPhoto, setFriendDisplayPhoto] = React.useState('');
  const [moreButtonsView, setMoreButtonsView] = React.useState(null);
  const decrement = index => {
    return index - 1;
  };

  const getLastId = data => {
    if (data.length === 0) {
      return null; // Handle empty array
    }
    return data[data.length - 1].id;
  };

  const increment = index => {
    return index + 1;
  };
  const supabaseChatsCreateChatPOST = SupabaseChatsApi.useCreateChatPOST();
  const supabaseUsersUpdateBlockedUsersPATCH =
    SupabaseUsersApi.useUpdateBlockedUsersPATCH();
  const supabaseFlaggedContentAddFlaggedContentPOST =
    SupabaseFlaggedContentApi.useAddFlaggedContentPOST();
  const isFocused = useIsFocused();
  React.useEffect(() => {
    const handler = async () => {
      try {
        if (!isFocused) {
          return;
        }
        setGlobalVariableValue({
          key: 'loading',
          value: false,
        });
        const chatsRes = (
          await SupabaseChatsApi.getChatsGET(Constants, { select: '*' })
        )?.json;
        setChats(chatsRes);

        const entry = StatusBar.pushStackEntry?.({ barStyle: 'light-content' });
        return () => StatusBar.popStackEntry?.(entry);
      } catch (err) {
        console.error(err);
      }
    };
    handler();
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
      <SimpleStyleScrollView
        bounces={true}
        horizontal={false}
        keyboardShouldPersistTaps={'never'}
        nestedScrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={StyleSheet.applyWidth(
          {
            backgroundColor: palettes['Trail Twin']['Background - Trail Twin'],
          },
          dimensions.width
        )}
      >
        <SupabaseUsersApi.FetchGetUserByUniqueUserIdGET
          handlers={{
            onData: fetchData => {
              const handler = async () => {
                try {
                  const chats = (
                    await SupabaseChatsApi.getChatsGET(Constants, {
                      select: '*',
                    })
                  )?.json;
                  setExistingChat(
                    chatExists(
                      chats,
                      Constants['user_id'],
                      Constants['otherUserId']
                    )
                  );
                  console.log(existingChat, '< EXISTS');
                } catch (err) {
                  console.error(err);
                }
              };
              handler();
            },
          }}
          select={'*'}
          user_id={Constants['otherUserId']}
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
                listKey={'qdtPvJ4f'}
                nestedScrollEnabled={false}
                numColumns={1}
                onEndReachedThreshold={0.5}
                renderItem={({ item, index }) => {
                  const listData = item;
                  return (
                    <>
                      {/* View 2 */}
                      <View
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
                                      iconPosition={'left'}
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
                              backgroundColor: Constants['backgroundColor'],
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                              marginBottom: 64,
                              paddingLeft: 32,
                              paddingRight: 32,
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
                              },
                              dimensions.width
                            )}
                          >
                            {/* Profile Photo and Name */}
                            <View
                              style={StyleSheet.applyWidth(
                                {
                                  alignSelf: 'auto',
                                  backgroundColor: [
                                    {
                                      minWidth: Breakpoints.Mobile,
                                      value: theme.colors.background.brand,
                                    },
                                    {
                                      minWidth: Breakpoints.Mobile,
                                      value: Constants['backgroundColor'],
                                    },
                                  ],
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
                                <>
                                  {!(
                                    fetchData && fetchData[0].profile_photo
                                  ) ? null : (
                                    <Image
                                      resizeMode={'cover'}
                                      source={imageSource(
                                        `${listData?.profile_photo}`
                                      )}
                                      style={StyleSheet.applyWidth(
                                        {
                                          borderRadius: 100,
                                          height: 90,
                                          width: 90,
                                        },
                                        dimensions.width
                                      )}
                                    />
                                  )}
                                </>
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
                                    {fetchData?.[0]?.name}
                                    {', '}
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
                                        fontFamily: 'Inter_400Regular',
                                        fontSize: 22,
                                        textAlign: 'center',
                                      },
                                      dimensions.width
                                    )}
                                  >
                                    {fetchData?.[0]?.age}
                                  </Text>
                                </View>
                                {/* View 2 */}
                                <View
                                  style={StyleSheet.applyWidth(
                                    {
                                      alignItems: 'center',
                                      flexDirection: 'row',
                                      justifyContent: 'space-between',
                                      width: '100%',
                                    },
                                    dimensions.width
                                  )}
                                >
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
                                    {fetchData?.[0]?.location}
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
                                <Touchable
                                  onPress={() => {
                                    try {
                                      Linking.openURL(
                                        'https://www.instagram.com//'
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

                                <Touchable
                                  onPress={() => {
                                    try {
                                      Linking.openURL(
                                        'https://www.youtube.com/@'
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

                                <Touchable
                                  onPress={() => {
                                    try {
                                      Linking.openURL(
                                        'https://www.tiktok.com/@?lang=en'
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
                              </View>
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
                            {/* Bike View */}
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
                              {/* Bike View */}
                              <Icon
                                color={Constants['textColor']}
                                name={'MaterialIcons/directions-bike'}
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
                                {fetchData?.[0]?.bike}
                              </Text>
                            </View>
                            {/* SKill View */}
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
                              {/* Experience Icon */}
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
                              {/* Experience Text */}
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
                                {fetchData?.[0]?.skill_level}{' '}
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
                              {/* Experience Icon */}
                              <Icon
                                color={Constants['textColor']}
                                name={'MaterialCommunityIcons/bike-fast'}
                                size={22}
                                style={StyleSheet.applyWidth(
                                  { marginRight: 8 },
                                  dimensions.width
                                )}
                              />
                              {/* Experience Text */}
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
                                {formatJSON(fetchData?.[0]?.riding_style)}
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
                              {/* Experience Icon */}
                              <Icon
                                color={Constants['textColor']}
                                name={'AntDesign/search1'}
                                size={22}
                                style={StyleSheet.applyWidth(
                                  { marginRight: 8 },
                                  dimensions.width
                                )}
                              />
                              {/* Experience Text */}
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
                                {formatJSON(fetchData?.[0]?.looking_for)}
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
                                  {
                                    marginBottom: 32,
                                    marginTop: 32,
                                    width: '100%',
                                  }
                                ),
                                dimensions.width
                              )}
                            />
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
                                  }
                                ),
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
                          </View>
                          {/* Loading View */}
                          <View
                            style={StyleSheet.applyWidth(
                              {
                                alignItems: 'center',
                                justifyContent: 'center',
                              },
                              dimensions.width
                            )}
                          >
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
                          {/* Button View */}
                          <View
                            style={StyleSheet.applyWidth(
                              {
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginBottom: 16,
                                width: '100%',
                              },
                              dimensions.width
                            )}
                          >
                            {/* Button 3 */}
                            <>
                              {Constants['loading'] ? null : (
                                <Button
                                  accessible={true}
                                  iconPosition={'left'}
                                  onPress={() => {
                                    try {
                                      navigation.navigate(
                                        'OtherUsersRidesScreen'
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
                                        width: '100%',
                                      }
                                    ),
                                    dimensions.width
                                  )}
                                  title={'Users Rides'}
                                />
                              )}
                            </>
                          </View>
                          {/* Conditional Display If Chat Exists */}
                          <>
                            {existingChat ? null : (
                              <View
                                style={StyleSheet.applyWidth(
                                  { alignItems: 'center', width: '100%' },
                                  dimensions.width
                                )}
                              >
                                {/* Button 2 */}
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
                                            const chatCreationResult = (
                                              await supabaseChatsCreateChatPOST.mutateAsync(
                                                {
                                                  chatName: createArray(
                                                    Constants['usersName'],
                                                    fetchData?.[0]?.name
                                                  ),
                                                  user_ids: createArray(
                                                    Constants['user_id'],
                                                    Constants['otherUserId']
                                                  ),
                                                }
                                              )
                                            )?.json;
                                            const chats = (
                                              await SupabaseChatsApi.getChatsGET(
                                                Constants,
                                                { select: '*' }
                                              )
                                            )?.json;
                                            console.log(chats);
                                            navigation.navigate('ChatScreen', {
                                              id: getRecentChatId(
                                                chats,
                                                Constants['user_id']
                                              ),
                                            });
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
                                              palettes['Trail Twin'][
                                                'Secondary Green #2 - Trail Twin'
                                              ],
                                            fontFamily: 'Inter_400Regular',
                                            fontSize: 12,
                                            width: '100%',
                                          }
                                        ),
                                        dimensions.width
                                      )}
                                      title={'Add friend'}
                                    />
                                  )}
                                </>
                              </View>
                            )}
                          </>
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
                                    palettes['Trail Twin'][
                                      'White - Trail Twin'
                                    ],
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
                              {/* Block */}
                              <Button
                                accessible={true}
                                iconPosition={'left'}
                                onPress={() => {
                                  const handler = async () => {
                                    try {
                                      showAlertUtil({
                                        title: 'User Blocked',
                                        message:
                                          'Open settings to manage blocked users.',
                                        buttonText: 'Ok',
                                      });

                                      const userData = (
                                        await SupabaseUsersApi.getUserByUniqueUserIdGET(
                                          Constants,
                                          {
                                            select: '*',
                                            user_id: Constants['user_id'],
                                          }
                                        )
                                      )?.json;
                                      (
                                        await supabaseUsersUpdateBlockedUsersPATCH.mutateAsync(
                                          {
                                            blocked_users: addBlockedUser(
                                              userData,
                                              Constants['otherUserId']
                                            ),
                                            user_id: Constants['user_id'],
                                          }
                                        )
                                      )?.json;
                                      navigation.navigate(
                                        'BottomTabNavigator',
                                        {
                                          screen: 'MeetRidersTab',
                                          params: {
                                            screen: 'MeetRidersScreen',
                                          },
                                        }
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
                                        palettes.App.Peoplebit_Salmon_Red,
                                      width: 200,
                                    }
                                  ),
                                  dimensions.width
                                )}
                                title={'Block'}
                              />
                              {/* Report */}
                              <Button
                                accessible={true}
                                iconPosition={'left'}
                                onPress={() => {
                                  const handler = async () => {
                                    try {
                                      (
                                        await supabaseFlaggedContentAddFlaggedContentPOST.mutateAsync(
                                          {
                                            contentId: Constants['otherUserId'],
                                            contentType: 'user',
                                          }
                                        )
                                      )?.json;

                                      showAlertUtil({
                                        title: undefined,
                                        message: 'Profile Reported',
                                        buttonText: 'Ok',
                                      });

                                      setMoreButtonsView(null);
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
                                        palettes.App.Peoplebit_Salmon_Red,
                                      width: 200,
                                    }
                                  ),
                                  dimensions.width
                                )}
                                title={'Report'}
                              />
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
                    </>
                  );
                }}
                showsHorizontalScrollIndicator={true}
                showsVerticalScrollIndicator={true}
              />
            );
          }}
        </SupabaseUsersApi.FetchGetUserByUniqueUserIdGET>
      </SimpleStyleScrollView>
    </ScreenContainer>
  );
};

export default withTheme(OtherUsersProfileScreen);
