import React from 'react';
import {
  Circle,
  Divider,
  Icon,
  ScreenContainer,
  SectionHeader,
  SimpleStyleFlatList,
  SimpleStyleScrollView,
  SimpleStyleSectionList,
  TextInput,
  Touchable,
  withTheme,
} from '@draftbit/ui';
import { useIsFocused } from '@react-navigation/native';
import { ActivityIndicator, Image, Text, View } from 'react-native';
import { Fetch } from 'react-request';
import * as GlobalStyles from '../GlobalStyles.js';
import * as SupabaseChatsApi from '../apis/SupabaseChatsApi.js';
import * as SupabaseEventsApi from '../apis/SupabaseEventsApi.js';
import * as SupabaseMessagesApi from '../apis/SupabaseMessagesApi.js';
import * as GlobalVariables from '../config/GlobalVariableContext';
import HandleChatNameDisplay from '../global-functions/HandleChatNameDisplay';
import filterBlockedUserChats from '../global-functions/filterBlockedUserChats';
import filterChatsByUserId from '../global-functions/filterChatsByUserId';
import filterEventsByUserId from '../global-functions/filterEventsByUserId';
import hasData from '../global-functions/hasData';
import mostRecentMessage from '../global-functions/mostRecentMessage';
import unreadMessages from '../global-functions/unreadMessages';
import palettes from '../themes/palettes';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import imageSource from '../utils/imageSource';
import useWindowDimensions from '../utils/useWindowDimensions';

const InboxScreen = props => {
  const { theme, navigation } = props;
  const dimensions = useWindowDimensions();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const [chatSearchKeyword, setChatSearchKeyword] = React.useState('');
  const [chatType, setChatType] = React.useState('events');
  const [inboxScreen, setInboxScreen] = React.useState('events');
  const [openSearch, setOpenSearch] = React.useState(false);
  const [switchValue, setSwitchValue] = React.useState(false);
  const [textInputValue, setTextInputValue] = React.useState('');

  return (
    <ScreenContainer
      scrollable={false}
      hasSafeArea={false}
      hasTopSafeArea={false}
      style={StyleSheet.applyWidth(
        { backgroundColor: Constants['backgroundColor'], height: '100%' },
        dimensions.width
      )}
    >
      <View style={StyleSheet.applyWidth({ paddingTop: 72 }, dimensions.width)}>
        {/* Chat Nav */}
        <View
          style={StyleSheet.applyWidth(
            {
              alignItems: 'center',
              backgroundColor: [
                {
                  minWidth: Breakpoints.Mobile,
                  value: palettes['Trail Twin']['Background - Trail Twin'],
                },
                {
                  minWidth: Breakpoints.Mobile,
                  value: Constants['backgroundColor'],
                },
              ],
              borderBottomWidth: 1,
              borderColor: Constants['dividerColor'],
              flexDirection: 'row',
              justifyContent: 'space-around',
              paddingTop: 6,
            },
            dimensions.width
          )}
        >
          {/* Event Chats */}
          <View
            style={StyleSheet.applyWidth(
              {
                alignItems: 'center',
                flexDirection: 'row',
                height: 50,
                justifyContent: 'center',
                width: 150,
              },
              dimensions.width
            )}
          >
            {/* Touchable 2 */}
            <Touchable
              onPress={() => {
                try {
                  setInboxScreen(true);
                } catch (err) {
                  console.error(err);
                }
              }}
              style={StyleSheet.applyWidth(
                { height: '100%', width: '100%' },
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
                      alignSelf: 'center',
                      color: [
                        { minWidth: Breakpoints.Mobile, value: null },
                        {
                          minWidth: Breakpoints.Mobile,
                          value: Constants['textColor'],
                        },
                      ],
                      fontFamily: 'Inter_400Regular',
                      fontSize: 16,
                      marginTop: 14,
                    }
                  ),
                  dimensions.width
                )}
              >
                {'Event Chats'}
              </Text>
            </Touchable>
          </View>
          {/* Friend Chats */}
          <View
            style={StyleSheet.applyWidth(
              {
                alignItems: 'center',
                flexDirection: 'row',
                height: 50,
                justifyContent: 'center',
                width: 150,
              },
              dimensions.width
            )}
          >
            {/* Touchable 2 */}
            <Touchable
              onPress={() => {
                try {
                  setInboxScreen(false);
                } catch (err) {
                  console.error(err);
                }
              }}
              style={StyleSheet.applyWidth(
                { height: '100%', width: '100%' },
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
                      alignSelf: 'center',
                      color: [
                        { minWidth: Breakpoints.Mobile, value: null },
                        {
                          minWidth: Breakpoints.Mobile,
                          value: Constants['textColor'],
                        },
                      ],
                      fontFamily: 'Inter_400Regular',
                      fontSize: 16,
                      marginTop: 14,
                    }
                  ),
                  dimensions.width
                )}
              >
                {'Friends'}
              </Text>
            </Touchable>
          </View>
        </View>
      </View>
      <>
        {!inboxScreen ? null : (
          <SimpleStyleScrollView
            bounces={true}
            horizontal={false}
            keyboardShouldPersistTaps={'never'}
            nestedScrollEnabled={false}
            showsHorizontalScrollIndicator={true}
            showsVerticalScrollIndicator={true}
            style={StyleSheet.applyWidth({ marginTop: 12 }, dimensions.width)}
          >
            {/* Get Users Events */}
            <SupabaseEventsApi.FetchGetEvents$DescendingOrder$GET select={'*'}>
              {({
                loading,
                error,
                data,
                refetchGetEvents$DescendingOrder$,
              }) => {
                const getUsersEventsData = data?.json;
                if (loading) {
                  return <ActivityIndicator />;
                }

                if (error || data?.status < 200 || data?.status >= 300) {
                  return <ActivityIndicator />;
                }

                return (
                  <>
                    <SimpleStyleSectionList
                      data={filterEventsByUserId(
                        getUsersEventsData,
                        Constants['user_id']
                      )}
                      estimatedItemSize={50}
                      horizontal={false}
                      inverted={false}
                      keyExtractor={(sectionListData, index) =>
                        sectionListData?.id ??
                        sectionListData?.uuid ??
                        index?.toString() ??
                        JSON.stringify(sectionListData)
                      }
                      keyboardShouldPersistTaps={'never'}
                      listComponent={'FlatList'}
                      listKey={'UfHL4sRI'}
                      nestedScrollEnabled={false}
                      numColumns={1}
                      onEndReachedThreshold={0.5}
                      renderItem={({ item, section, index }) => {
                        const sectionListData = item;
                        return (
                          <>
                            <SectionHeader
                              style={StyleSheet.applyWidth(
                                {
                                  backgroundColor:
                                    palettes['Trail Twin'][
                                      'Olive - Trail Twin'
                                    ],
                                  height: 50,
                                  justifyContent: 'center',
                                  marginBottom: 16,
                                  marginTop: 16,
                                  width: '100%',
                                },
                                dimensions.width
                              )}
                            >
                              <Text
                                accessible={true}
                                selectable={false}
                                {...GlobalStyles.TextStyles(theme)['Text 2']
                                  .props}
                                selectionColor={
                                  palettes['Trail Twin'][
                                    'Primary Green - Trail Twin'
                                  ]
                                }
                                style={StyleSheet.applyWidth(
                                  StyleSheet.compose(
                                    GlobalStyles.TextStyles(theme)['Text 2']
                                      .style,
                                    {
                                      fontFamily: 'Inter_400Regular',
                                      fontSize: 22,
                                      marginLeft: 24,
                                    }
                                  ),
                                  dimensions.width
                                )}
                              >
                                {section}
                                {' Rides'}
                              </Text>
                            </SectionHeader>
                            {/* Chat */}
                            <Touchable
                              onPress={() => {
                                try {
                                  console.log('<^ .id Keypath of event chat');
                                  navigation.navigate('RideChatScreen');
                                } catch (err) {
                                  console.error(err);
                                }
                              }}
                            >
                              <View
                                style={StyleSheet.applyWidth(
                                  {
                                    alignItems: 'center',
                                    backgroundColor:
                                      Constants['backgroundColor'],
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    paddingBottom: 0,
                                    paddingLeft: 36,
                                    paddingRight: 36,
                                    paddingTop: 0,
                                  },
                                  dimensions.width
                                )}
                              >
                                {/* Image */}
                                <View
                                  style={StyleSheet.applyWidth(
                                    { justifyContent: 'center' },
                                    dimensions.width
                                  )}
                                >
                                  {/* Event image */}
                                  <Image
                                    resizeMode={'cover'}
                                    source={imageSource(
                                      `${sectionListData?.event_photo}`
                                    )}
                                    style={StyleSheet.applyWidth(
                                      {
                                        borderRadius: 100,
                                        height: 58,
                                        width: 58,
                                      },
                                      dimensions.width
                                    )}
                                  />
                                </View>
                                {/* Name and Message */}
                                <View
                                  style={StyleSheet.applyWidth(
                                    {
                                      alignItems: 'center',
                                      flex: 1,
                                      flexDirection: 'row',
                                      justifyContent: 'space-between',
                                      marginLeft: 16,
                                    },
                                    dimensions.width
                                  )}
                                >
                                  <View
                                    style={StyleSheet.applyWidth(
                                      {
                                        alignItems: 'flex-start',
                                        flexDirection: 'column',
                                        justifyContent: 'space-around',
                                      },
                                      dimensions.width
                                    )}
                                  >
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
                                      {/* Name ~ */}
                                      <Text
                                        accessible={true}
                                        selectable={false}
                                        style={StyleSheet.applyWidth(
                                          {
                                            color: Constants['textColor'],
                                            fontFamily: 'Inter_400Regular',
                                            fontSize: 16,
                                            lineHeight: 20,
                                            opacity: 1,
                                          },
                                          dimensions.width
                                        )}
                                      >
                                        {sectionListData?.event_name}
                                      </Text>
                                    </View>

                                    <SupabaseMessagesApi.FetchGetMessagesGET>
                                      {({
                                        loading,
                                        error,
                                        data,
                                        refetchGetMessages,
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
                                          <>
                                            {/* Message ~ */}
                                            <Text
                                              accessible={true}
                                              selectable={false}
                                              numberOfLines={1}
                                              style={StyleSheet.applyWidth(
                                                {
                                                  color: Constants['textColor'],
                                                  fontFamily: 'Inter_300Light',
                                                  fontSize: 12,
                                                  lineHeight: 20,
                                                  marginTop: 8,
                                                  opacity: 0.5,
                                                },
                                                dimensions.width
                                              )}
                                            >
                                              {mostRecentMessage(fetchData)}
                                            </Text>
                                            <>
                                              {unreadMessages(
                                                fetchData
                                              ) ? null : (
                                                <Circle
                                                  size={8}
                                                  style={StyleSheet.applyWidth(
                                                    {
                                                      backgroundColor:
                                                        palettes['Trail Twin'][
                                                          'Primary Green - Trail Twin'
                                                        ],
                                                      bottom: 18,
                                                      justifyContent: 'center',
                                                      left: -95,
                                                      minWidth: 12,
                                                      position: 'absolute',
                                                    },
                                                    dimensions.width
                                                  )}
                                                />
                                              )}
                                            </>
                                          </>
                                        );
                                      }}
                                    </SupabaseMessagesApi.FetchGetMessagesGET>
                                  </View>

                                  <View
                                    style={StyleSheet.applyWidth(
                                      {
                                        alignItems: 'center',
                                        alignSelf: 'auto',
                                        flexDirection: 'row',
                                        gap: 8,
                                      },
                                      dimensions.width
                                    )}
                                  >
                                    <Icon name={'AntDesign/right'} size={14} />
                                  </View>
                                </View>
                              </View>
                              <Divider
                                {...GlobalStyles.DividerStyles(theme)['Divider']
                                  .props}
                                color={Constants['dividerColor']}
                                style={StyleSheet.applyWidth(
                                  StyleSheet.compose(
                                    GlobalStyles.DividerStyles(theme)['Divider']
                                      .style,
                                    { marginBottom: 12, marginTop: 12 }
                                  ),
                                  dimensions.width
                                )}
                              />
                            </Touchable>
                          </>
                        );
                      }}
                      showsHorizontalScrollIndicator={true}
                      showsVerticalScrollIndicator={true}
                      stickyHeader={false}
                      stickyHeaderHiddenOnScroll={false}
                      sectionKey={'event_status'}
                      style={StyleSheet.applyWidth(
                        { paddingLeft: 32, paddingRight: 32 },
                        dimensions.width
                      )}
                    />
                    {/* No Rides Joined Text */}
                    <>
                      {hasData(
                        filterEventsByUserId(
                          getUsersEventsData,
                          Constants['user_id']
                        )
                      ) ? null : (
                        <View
                          style={StyleSheet.applyWidth(
                            {
                              alignItems: 'center',
                              flexDirection: 'column',
                              justifyContent: 'center',
                              marginTop: 64,
                            },
                            dimensions.width
                          )}
                        >
                          <>
                            {hasData(undefined) ? null : (
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
                                      fontFamily: 'Inter_400Regular',
                                      fontSize: 18,
                                    }
                                  ),
                                  dimensions.width
                                )}
                              >
                                {'No rides joined yet'}
                              </Text>
                            )}
                          </>
                        </View>
                      )}
                    </>
                  </>
                );
              }}
            </SupabaseEventsApi.FetchGetEvents$DescendingOrder$GET>
          </SimpleStyleScrollView>
        )}
      </>
      {/* Scroll View 2 */}
      <>
        {inboxScreen ? null : (
          <SimpleStyleScrollView
            bounces={true}
            horizontal={false}
            keyboardShouldPersistTaps={'never'}
            nestedScrollEnabled={false}
            showsHorizontalScrollIndicator={true}
            showsVerticalScrollIndicator={true}
            style={StyleSheet.applyWidth({ marginTop: 12 }, dimensions.width)}
          >
            {/* Get Users Chats */}
            <SupabaseChatsApi.FetchGetChatsGET
              handlers={{
                onData: getUsersChatsData => {
                  try {
                    /* 'Set Variable' action requires configuration: choose a variable */
                  } catch (err) {
                    console.error(err);
                  }
                },
              }}
              select={'*'}
            >
              {({ loading, error, data, refetchGetChats }) => {
                const getUsersChatsData = data?.json;
                if (loading) {
                  return <ActivityIndicator />;
                }

                if (error || data?.status < 200 || data?.status >= 300) {
                  return <ActivityIndicator />;
                }

                return (
                  <>
                    <SimpleStyleFlatList
                      data={filterBlockedUserChats(
                        filterChatsByUserId(
                          getUsersChatsData,
                          Constants['user_id']
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
                      listKey={'B6vpfWFE'}
                      nestedScrollEnabled={false}
                      numColumns={1}
                      onEndReachedThreshold={0.5}
                      renderItem={({ item, index }) => {
                        const listData = item;
                        return (
                          <>
                            {/* Chat */}
                            <Touchable
                              onPress={() => {
                                try {
                                  navigation.navigate('ChatScreen', {
                                    id: listData?.id,
                                  });
                                } catch (err) {
                                  console.error(err);
                                }
                              }}
                            >
                              <View
                                style={StyleSheet.applyWidth(
                                  {
                                    alignItems: 'center',
                                    backgroundColor:
                                      palettes['Trail Twin'][
                                        'Background - Trail Twin'
                                      ],
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    paddingLeft: 32,
                                    paddingRight: 32,
                                  },
                                  dimensions.width
                                )}
                              >
                                {/* Image */}
                                <View
                                  style={StyleSheet.applyWidth(
                                    { justifyContent: 'center' },
                                    dimensions.width
                                  )}
                                >
                                  <Circle
                                    size={8}
                                    style={StyleSheet.applyWidth(
                                      {
                                        minWidth: 12,
                                        position: 'absolute',
                                        right: 0,
                                        top: 0,
                                        zIndex: 1,
                                      },
                                      dimensions.width
                                    )}
                                  />
                                  {/* User image */}
                                  <Image
                                    resizeMode={'cover'}
                                    source={imageSource(
                                      `${listData?.profile_photo}`
                                    )}
                                    style={StyleSheet.applyWidth(
                                      {
                                        borderRadius: 100,
                                        height: 58,
                                        width: 58,
                                      },
                                      dimensions.width
                                    )}
                                  />
                                </View>
                                {/* Name and Message */}
                                <View
                                  style={StyleSheet.applyWidth(
                                    {
                                      alignItems: 'center',
                                      flex: 1,
                                      flexDirection: 'row',
                                      justifyContent: 'space-between',
                                      marginLeft: 16,
                                    },
                                    dimensions.width
                                  )}
                                >
                                  <View
                                    style={StyleSheet.applyWidth(
                                      {
                                        alignItems: 'flex-start',
                                        flexDirection: 'column',
                                        justifyContent: 'space-around',
                                      },
                                      dimensions.width
                                    )}
                                  >
                                    {/* Name ~ */}
                                    <Text
                                      accessible={true}
                                      selectable={false}
                                      style={StyleSheet.applyWidth(
                                        {
                                          color: theme.colors.text.strong,
                                          fontFamily: 'Inter_400Regular',
                                          fontSize: 16,
                                          lineHeight: 20,
                                          opacity: 1,
                                        },
                                        dimensions.width
                                      )}
                                    >
                                      {HandleChatNameDisplay(
                                        Constants['usersName'],
                                        listData?.chat_name
                                      )}
                                    </Text>
                                    {/* Fetch 2 */}
                                    <SupabaseMessagesApi.FetchGetMessagesGET
                                      chat_id={listData?.id}
                                    >
                                      {({
                                        loading,
                                        error,
                                        data,
                                        refetchGetMessages,
                                      }) => {
                                        const fetch2Data = data?.json;
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
                                          <>
                                            {/* Message ~ */}
                                            <Text
                                              accessible={true}
                                              selectable={false}
                                              numberOfLines={1}
                                              style={StyleSheet.applyWidth(
                                                {
                                                  color:
                                                    theme.colors.text.strong,
                                                  fontFamily: 'Inter_300Light',
                                                  fontSize: 12,
                                                  lineHeight: 20,
                                                  marginTop: 8,
                                                  opacity: 0.5,
                                                },
                                                dimensions.width
                                              )}
                                            >
                                              {mostRecentMessage(fetch2Data)}
                                            </Text>
                                            <>
                                              {!unreadMessages(
                                                fetch2Data
                                              ) ? null : (
                                                <Circle
                                                  size={8}
                                                  style={StyleSheet.applyWidth(
                                                    {
                                                      backgroundColor:
                                                        palettes['Trail Twin'][
                                                          'Primary Green - Trail Twin'
                                                        ],
                                                      bottom: 18,
                                                      justifyContent: 'center',
                                                      left: -93,
                                                      minWidth: 12,
                                                      position: 'absolute',
                                                    },
                                                    dimensions.width
                                                  )}
                                                />
                                              )}
                                            </>
                                          </>
                                        );
                                      }}
                                    </SupabaseMessagesApi.FetchGetMessagesGET>
                                  </View>

                                  <View
                                    style={StyleSheet.applyWidth(
                                      {
                                        alignItems: 'center',
                                        alignSelf: 'auto',
                                        flexDirection: 'row',
                                        gap: 8,
                                      },
                                      dimensions.width
                                    )}
                                  >
                                    <Icon name={'AntDesign/right'} size={14} />
                                  </View>
                                </View>
                              </View>
                              <Divider
                                {...GlobalStyles.DividerStyles(theme)['Divider']
                                  .props}
                                color={Constants['dividerColor']}
                                style={StyleSheet.applyWidth(
                                  StyleSheet.compose(
                                    GlobalStyles.DividerStyles(theme)['Divider']
                                      .style,
                                    { marginBottom: 12, marginTop: 12 }
                                  ),
                                  dimensions.width
                                )}
                              />
                            </Touchable>
                          </>
                        );
                      }}
                      showsHorizontalScrollIndicator={true}
                      showsVerticalScrollIndicator={true}
                    />
                    {/* No Friends Added Text */}
                    <>
                      {hasData(
                        filterChatsByUserId(
                          getUsersChatsData,
                          Constants['user_id']
                        )
                      ) ? null : (
                        <View
                          style={StyleSheet.applyWidth(
                            {
                              alignItems: 'center',
                              flexDirection: 'column',
                              justifyContent: 'center',
                              marginTop: 64,
                            },
                            dimensions.width
                          )}
                        >
                          <>
                            {hasData(
                              filterChatsByUserId(
                                getUsersChatsData,
                                Constants['user_id']
                              )
                            ) ? null : (
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
                                      fontFamily: 'Inter_400Regular',
                                      fontSize: 18,
                                    }
                                  ),
                                  dimensions.width
                                )}
                              >
                                {'No Friends Added Yet'}
                              </Text>
                            )}
                          </>
                        </View>
                      )}
                    </>
                  </>
                );
              }}
            </SupabaseChatsApi.FetchGetChatsGET>
          </SimpleStyleScrollView>
        )}
      </>
    </ScreenContainer>
  );
};

export default withTheme(InboxScreen);
