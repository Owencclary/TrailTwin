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
import * as Linking from 'expo-linking';
import { ActivityIndicator, Text, View } from 'react-native';
import { Fetch } from 'react-request';
import * as GlobalStyles from '../GlobalStyles.js';
import * as SupabaseEventsApi from '../apis/SupabaseEventsApi.js';
import * as SupabaseMessagesApi from '../apis/SupabaseMessagesApi.js';
import * as GlobalVariables from '../config/GlobalVariableContext';
import sortMessagesAscending from '../global-functions/sortMessagesAscending';
import palettes from '../themes/palettes';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import useWindowDimensions from '../utils/useWindowDimensions';
import waitUtil from '../utils/wait';

const defaultProps = { id: 270 };

const RideChatScreen = props => {
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
  const isFocused = useIsFocused();
  React.useEffect(() => {
    try {
      if (!isFocused) {
        return;
      }
      console.log(Constants['usersName'], '< NAme');
    } catch (err) {
      console.error(err);
    }
  }, [isFocused]);
  const scrollViewK3qlocQvRef = React.useRef();

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
      {/* Fetch Event Info */}
      <SupabaseEventsApi.FetchGetSingleEventGET
        id={props.route?.params?.id ?? defaultProps.id}
        select={'*'}
      >
        {({ loading, error, data, refetchGetSingleEvent }) => {
          const fetchEventInfoData = data?.json;
          if (loading) {
            return <ActivityIndicator />;
          }

          if (error || data?.status < 200 || data?.status >= 300) {
            return <ActivityIndicator />;
          }

          return (
            <>
              {/* Navigation Frame 2 */}
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
                    paddingLeft: 32,
                    paddingRight: 32,
                    paddingTop: 24,
                  },
                  dimensions.width
                )}
              >
                {/* Touchable 3 */}
                <Touchable
                  onPress={() => {
                    try {
                      navigation.goBack();
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                >
                  {/* Info Icon */}
                  <Icon
                    color={Constants['textColor']}
                    name={'AntDesign/left'}
                    size={24}
                  />
                </Touchable>

                <Touchable
                  onPress={() => {
                    try {
                      navigation.navigate('BottomTabNavigator', {
                        screen: 'FindRidesTab',
                        params: {
                          screen: 'EventDetailsScreen',
                          params: { event_id: fetchEventInfoData?.[0]?.id },
                        },
                      });
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                >
                  {/* Title */}
                  <Text
                    accessible={true}
                    selectable={false}
                    style={StyleSheet.applyWidth(
                      {
                        color: Constants['textColor'],
                        fontFamily: 'Inter_500Medium',
                        fontSize: 18,
                        textAlign: 'left',
                        textDecorationLine: 'none',
                      },
                      dimensions.width
                    )}
                  >
                    {fetchEventInfoData?.[0]?.event_name}
                  </Text>
                </Touchable>
                {/* Touchable 2 */}
                <Touchable
                  onPress={() => {
                    try {
                      Linking.openURL(
                        `https://www.google.com/maps?q=${fetchEventInfoData?.[0]?.meetup_lat},${fetchEventInfoData?.[0]?.meetup_lon}`
                      );
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                >
                  {/* Directions Icon  */}
                  <Icon
                    color={Constants['textColor']}
                    name={'Feather/map-pin'}
                    size={24}
                  />
                </Touchable>
              </View>
            </>
          );
        }}
      </SupabaseEventsApi.FetchGetSingleEventGET>
      {/* Keyboard Aware Scroll View 3 2 */}
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
          ref={scrollViewK3qlocQvRef}
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
            refetchInterval={1000}
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
                  listKey={'JnmcPG1R'}
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
                              navigation.navigate('RootNavigator');
                            } else {
                              setGlobalVariableValue({
                                key: 'otherUserId',
                                value: listData?.sender_id,
                              });
                              navigation.navigate('BottomTabNavigator');
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
                          {/* View 2 */}
                          <View>
                            {/* Name */}
                            <>
                              {(
                                listData?.sender_id === Constants['user_id']
                                  ? undefined
                                  : undefined
                              ) ? null : (
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
                                        fontFamily: 'Inter_400Regular',
                                        fontSize: 16,
                                        marginBottom: 6,
                                        textAlign: 'left',
                                      }
                                    ),
                                    dimensions.width
                                  )}
                                >
                                  {listData?.sender_name}
                                </Text>
                              )}
                            </>
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
                                    color: 'theme.colors.communityTrueOption',
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
              width: '100%',
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
                  scrollViewK3qlocQvRef.current?.scrollToEnd({
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
                  backgroundColor: palettes['Trail Twin']['White - Trail Twin'],
                  borderBottomLeftRadius: 24,
                  borderBottomRightRadius: 24,
                  borderBottomWidth: 1,
                  borderColor: palettes['Brand Fire'].Divider,
                  borderLeftWidth: 1,
                  borderRightWidth: 1,
                  borderTopLeftRadius: 24,
                  borderTopRightRadius: 24,
                  borderTopWidth: 1,
                  color: theme.colors.text.strong,
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
                    scrollViewK3qlocQvRef.current?.scrollToEnd({
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

export default withTheme(RideChatScreen);
