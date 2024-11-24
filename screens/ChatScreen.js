import React from 'react';
import {
  Circle,
  Icon,
  ScreenContainer,
  SimpleStyleFlatList,
  SimpleStyleKeyboardAwareScrollView,
  SimpleStyleScrollView,
  TextInput,
  Touchable,
  withTheme,
} from '@draftbit/ui';
import { useIsFocused } from '@react-navigation/native';
import { ActivityIndicator, Image, Text, View } from 'react-native';
import { Fetch } from 'react-request';
import * as GlobalStyles from '../GlobalStyles.js';
import * as SupabaseChatsApi from '../apis/SupabaseChatsApi.js';
import * as SupabaseMessagesApi from '../apis/SupabaseMessagesApi.js';
import * as SupabaseUsersApi from '../apis/SupabaseUsersApi.js';
import * as GlobalVariables from '../config/GlobalVariableContext';
import getOtherUserId from '../global-functions/getOtherUserId';
import sortMessagesAscending from '../global-functions/sortMessagesAscending';
import palettes from '../themes/palettes';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import imageSource from '../utils/imageSource';
import useWindowDimensions from '../utils/useWindowDimensions';
import waitUtil from '../utils/wait';

const defaultProps = { id: 70 };

const ChatScreen = props => {
  const { theme, navigation } = props;
  const dimensions = useWindowDimensions();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const setGlobalVariableValue = GlobalVariables.useSetValue();
  const [textInputValue, setTextInputValue] = React.useState('');
  const [user_id1, setUser_id1] = React.useState(null);
  const [user_id2, setUser_id2] = React.useState(null);
  const supabaseMessagesSendMessagePOST =
    SupabaseMessagesApi.useSendMessagePOST();
  const scrollViewMwp0gJ5pRef = React.useRef();

  return (
    <ScreenContainer
      scrollable={false}
      hasSafeArea={true}
      hasTopSafeArea={true}
      style={StyleSheet.applyWidth(
        { backgroundColor: Constants['backgroundColor'] },
        dimensions.width
      )}
    >
      {/* Fetch Chat */}
      <SupabaseChatsApi.FetchGetSingleChatByIdGET
        id={props.route?.params?.id ?? defaultProps.id}
      >
        {({ loading, error, data, refetchGetSingleChatById }) => {
          const fetchChatData = data?.json;
          if (loading) {
            return <ActivityIndicator />;
          }

          if (error || data?.status < 200 || data?.status >= 300) {
            return <ActivityIndicator />;
          }

          return (
            <View>
              <View
                style={StyleSheet.applyWidth(
                  {
                    alignItems: 'center',
                    backgroundColor:
                      palettes['Trail Twin']['White - Trail Twin'],
                    borderBottomWidth: 1,
                    borderColor: Constants['dividerColor'],
                    flexDirection: 'row',
                    height: 100,
                    justifyContent: 'center',
                    paddingBottom: 48,
                    paddingTop: 48,
                    width: '100%',
                  },
                  dimensions.width
                )}
              >
                <View
                  style={StyleSheet.applyWidth(
                    {
                      flexDirection: 'row',
                      left: 0,
                      paddingLeft: 24,
                      position: 'absolute',
                    },
                    dimensions.width
                  )}
                >
                  <Touchable
                    onPress={() => {
                      try {
                        navigation.goBack();
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                  >
                    <Icon
                      size={24}
                      color={Constants['textColor']}
                      name={'AntDesign/left'}
                    />
                  </Touchable>
                </View>
                {/* View 2 */}
                <View
                  style={StyleSheet.applyWidth(
                    { height: 100, width: 100 },
                    dimensions.width
                  )}
                >
                  {/* Fetch Other Users Data */}
                  <SupabaseUsersApi.FetchGetUserByUniqueUserIdGET
                    select={'*'}
                    user_id={getOtherUserId(
                      Constants['user_id'],
                      fetchChatData
                    )}
                  >
                    {({
                      loading,
                      error,
                      data,
                      refetchGetUserByUniqueUserId,
                    }) => {
                      const fetchOtherUsersDataData = data?.json;
                      if (loading) {
                        return <ActivityIndicator />;
                      }

                      if (error || data?.status < 200 || data?.status >= 300) {
                        return <ActivityIndicator />;
                      }

                      return (
                        <SimpleStyleFlatList
                          data={fetchOtherUsersDataData}
                          horizontal={false}
                          inverted={false}
                          keyExtractor={(listData, index) =>
                            listData?.id ??
                            listData?.uuid ??
                            index?.toString() ??
                            JSON.stringify(listData)
                          }
                          keyboardShouldPersistTaps={'never'}
                          listKey={'FjPWEMqC'}
                          nestedScrollEnabled={false}
                          numColumns={1}
                          onEndReachedThreshold={0.5}
                          renderItem={({ item, index }) => {
                            const listData = item;
                            return (
                              <View
                                style={StyleSheet.applyWidth(
                                  {
                                    alignItems: 'center',
                                    backgroundColor:
                                      palettes['Trail Twin'][
                                        'White - Trail Twin'
                                      ],
                                    borderColor: theme.colors.border.brand,
                                    gap: 6,
                                    justifyContent: 'center',
                                    position: 'relative',
                                  },
                                  dimensions.width
                                )}
                              >
                                <Image
                                  resizeMode={'cover'}
                                  {...GlobalStyles.ImageStyles(theme)['Image']
                                    .props}
                                  source={imageSource(
                                    `${listData?.profile_photo}`
                                  )}
                                  style={StyleSheet.applyWidth(
                                    StyleSheet.compose(
                                      GlobalStyles.ImageStyles(theme)['Image']
                                        .style,
                                      {
                                        borderRadius: 100,
                                        height: 54,
                                        width: 54,
                                        zIndex: 1,
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
                                      }
                                    ),
                                    dimensions.width
                                  )}
                                >
                                  {listData?.name}
                                </Text>
                              </View>
                            );
                          }}
                          showsHorizontalScrollIndicator={true}
                          showsVerticalScrollIndicator={true}
                        />
                      );
                    }}
                  </SupabaseUsersApi.FetchGetUserByUniqueUserIdGET>
                </View>
              </View>
            </View>
          );
        }}
      </SupabaseChatsApi.FetchGetSingleChatByIdGET>
      {/* Keyboard Aware Scroll View 3 */}
      <SimpleStyleKeyboardAwareScrollView
        enableOnAndroid={false}
        enableResetScrollToCoords={false}
        keyboardShouldPersistTaps={'never'}
        showsVerticalScrollIndicator={true}
        viewIsInsideTabBar={false}
        enableAutomaticScroll={true}
        style={StyleSheet.applyWidth(
          {
            borderColor: theme.colors.border.brand,
            flex: 1,
            justifyContent: 'space-between',
          },
          dimensions.width
        )}
      >
        <SimpleStyleScrollView
          bounces={true}
          horizontal={false}
          keyboardShouldPersistTaps={'never'}
          nestedScrollEnabled={false}
          ref={scrollViewMwp0gJ5pRef}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          style={StyleSheet.applyWidth(
            {
              height: '87%',
              paddingLeft: 24,
              paddingRight: 24,
              paddingTop: 24,
              position: 'absolute',
              width: '100%',
            },
            dimensions.width
          )}
        >
          <SupabaseMessagesApi.FetchGetMessagesGET
            chat_id={props.route?.params?.id ?? defaultProps.id}
            refetchInterval={10000}
          >
            {({ loading, error, data, refetchGetMessages }) => {
              const fetchData = data?.json;
              if (loading) {
                return <ActivityIndicator />;
              }

              if (error || data?.status < 200 || data?.status >= 300) {
                return <ActivityIndicator />;
              }

              return (
                <SimpleStyleFlatList
                  data={sortMessagesAscending(fetchData)}
                  horizontal={false}
                  inverted={false}
                  keyExtractor={(listData, index) =>
                    listData?.id ??
                    listData?.uuid ??
                    index?.toString() ??
                    JSON.stringify(listData)
                  }
                  keyboardShouldPersistTaps={'never'}
                  listKey={'4ESE8x8l'}
                  nestedScrollEnabled={false}
                  numColumns={1}
                  onEndReachedThreshold={0.5}
                  renderItem={({ item, index }) => {
                    const listData = item;
                    return (
                      <Touchable
                        onPress={() => {
                          try {
                            if (Constants['user_id'] === listData?.sender_id) {
                            } else {
                              setGlobalVariableValue({
                                key: 'otherUserId',
                                value: listData?.sender_id,
                              });
                              navigation.navigate('MeetRidersTab');
                            }
                          } catch (err) {
                            console.error(err);
                          }
                        }}
                      >
                        {/* Frame */}
                        <View
                          style={StyleSheet.applyWidth(
                            {
                              alignItems: [
                                {
                                  minWidth: Breakpoints.Mobile,
                                  value: 'flex-start',
                                },
                                {
                                  minWidth: Breakpoints.Mobile,
                                  value:
                                    listData?.sender_id === Constants['user_id']
                                      ? 'flex-end'
                                      : 'flex-start',
                                },
                              ],
                              gap: 4,
                              marginBottom: 16,
                              position: 'relative',
                              width: '100%',
                            },
                            dimensions.width
                          )}
                        >
                          {/* Message Bubble Frame */}
                          <View
                            style={StyleSheet.applyWidth(
                              {
                                alignItems: 'center',
                                backgroundColor:
                                  palettes['Trail Twin'][
                                    'Secondary Green - Trail Twin'
                                  ],
                                borderBottomLeftRadius: 24,
                                borderBottomRightRadius: 24,
                                borderTopLeftRadius: 24,
                                borderTopRightRadius: 24,
                                gap: 0,
                                justifyContent: 'center',
                                paddingLeft: 16,
                                paddingRight: 16,
                                paddingTop: 16,
                              },
                              dimensions.width
                            )}
                          >
                            {/* Message */}
                            <Text
                              accessible={true}
                              selectable={false}
                              style={StyleSheet.applyWidth(
                                {
                                  color: Constants['textColor'],
                                  fontFamily: 'Inter_400Regular',
                                  fontSize: 16,
                                  lineHeight: 18,
                                },
                                dimensions.width
                              )}
                            >
                              {listData?.message}
                              {'\n'}
                            </Text>
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
          </SupabaseMessagesApi.FetchGetMessagesGET>
        </SimpleStyleScrollView>

        <View
          style={StyleSheet.applyWidth(
            {
              alignItems: 'center',
              backgroundColor: Constants['backgroundColor'],
              borderColor: Constants['dividerColor'],
              borderLeftWidth: 1,
              borderRightWidth: 1,
              borderTopLeftRadius: 32,
              borderTopRightRadius: 32,
              borderTopWidth: 1,
              bottom: 0,
              flexDirection: 'row',
              justifyContent: 'center',
              paddingLeft: 30,
              paddingRight: 30,
              position: 'absolute',
              zIndex: 1,
            },
            dimensions.width
          )}
        >
          {/* Flex Input */}
          <View
            style={StyleSheet.applyWidth(
              { flexGrow: 1, flexShrink: 0 },
              dimensions.width
            )}
          >
            <TextInput
              autoCapitalize={'none'}
              autoCorrect={true}
              changeTextDelay={500}
              onChangeText={newTextInputValue => {
                try {
                  setTextInputValue(newTextInputValue);
                } catch (err) {
                  console.error(err);
                }
              }}
              onFocus={() => {
                try {
                  scrollViewMwp0gJ5pRef.current?.scrollToEnd({
                    animated: true,
                  });
                } catch (err) {
                  console.error(err);
                }
              }}
              webShowOutline={true}
              placeholder={textInputValue.toString()}
              style={StyleSheet.applyWidth(
                {
                  borderBottomLeftRadius: 24,
                  borderBottomRightRadius: 24,
                  borderBottomWidth: 1,
                  borderColor: palettes['Brand Fire'].Divider,
                  borderLeftWidth: 1,
                  borderRightWidth: 1,
                  borderTopLeftRadius: 24,
                  borderTopRightRadius: 24,
                  borderTopWidth: 1,
                  color: palettes['Trail Twin']['White - Trail Twin'],
                  fontFamily: 'Inter_300Light',
                  marginLeft: 16,
                  marginRight: 16,
                  paddingBottom: 16,
                  paddingLeft: 16,
                  paddingRight: 16,
                  paddingTop: 16,
                },
                dimensions.width
              )}
              value={textInputValue}
            />
          </View>
          {/* Message Frame */}
          <View
            style={StyleSheet.applyWidth(
              {
                alignItems: 'center',
                alignSelf: 'auto',
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingBottom: 32,
                paddingTop: 32,
              },
              dimensions.width
            )}
          >
            <Touchable
              onPress={() => {
                const handler = async () => {
                  try {
                    (
                      await supabaseMessagesSendMessagePOST.mutateAsync({
                        chat_id: props.route?.params?.id ?? defaultProps.id,
                        message: textInputValue,
                        sender_id: Constants['user_id'],
                        sender_name: Constants['usersName'],
                      })
                    )?.json;
                    setTextInputValue('');
                    await waitUtil({ milliseconds: 500 });
                    scrollViewMwp0gJ5pRef.current?.scrollToEnd({
                      animated: true,
                    });
                  } catch (err) {
                    console.error(err);
                  }
                };
                handler();
              }}
            >
              <Circle
                size={48}
                style={StyleSheet.applyWidth(
                  {
                    backgroundColor:
                      palettes['Trail Twin']['Secondary Green #2 - Trail Twin'],
                    maxHeight: 36,
                    maxWidth: 36,
                  },
                  dimensions.width
                )}
              >
                <Icon
                  color={palettes['Trail Twin']['White - Trail Twin']}
                  name={'AntDesign/arrowup'}
                  size={24}
                />
              </Circle>
            </Touchable>
          </View>
        </View>
      </SimpleStyleKeyboardAwareScrollView>
    </ScreenContainer>
  );
};

export default withTheme(ChatScreen);
