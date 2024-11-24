import React from 'react';
import {
  IconButton,
  ScreenContainer,
  SimpleStyleFlatList,
  SimpleStyleScrollView,
  withTheme,
} from '@draftbit/ui';
import { useIsFocused } from '@react-navigation/native';
import { ActivityIndicator, Text, View } from 'react-native';
import { Fetch } from 'react-request';
import * as GlobalStyles from '../GlobalStyles.js';
import * as SupabaseUsersApi from '../apis/SupabaseUsersApi.js';
import * as GlobalVariables from '../config/GlobalVariableContext';
import removeBlockedUser from '../global-functions/removeBlockedUser';
import palettes from '../themes/palettes';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import useWindowDimensions from '../utils/useWindowDimensions';

const BlockedUsersScreen = props => {
  const { theme, navigation } = props;
  const dimensions = useWindowDimensions();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const supabaseUsersUpdateBlockedUsersPATCH =
    SupabaseUsersApi.useUpdateBlockedUsersPATCH();

  return (
    <ScreenContainer
      hasSafeArea={false}
      scrollable={false}
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
        showsHorizontalScrollIndicator={true}
        showsVerticalScrollIndicator={true}
        style={StyleSheet.applyWidth(
          {
            alignItems: 'center',
            paddingBottom: 48,
            paddingLeft: 32,
            paddingRight: 32,
            paddingTop: 48,
          },
          dimensions.width
        )}
      >
        <SupabaseUsersApi.FetchGetUserDetailGET
          detail={'blocked_users'}
          user_id={'232d2749-589b-4276-8bd9-edb920102130'}
        >
          {({ loading, error, data, refetchGetUserDetail }) => {
            const fetchData = data?.json;
            if (loading) {
              return <ActivityIndicator />;
            }

            if (error || data?.status < 200 || data?.status >= 300) {
              return <ActivityIndicator />;
            }

            return (
              <>
                <SimpleStyleFlatList
                  data={fetchData && fetchData[0].blocked_users}
                  horizontal={false}
                  inverted={false}
                  keyExtractor={(listData, index) =>
                    listData?.id ??
                    listData?.uuid ??
                    index?.toString() ??
                    JSON.stringify(listData)
                  }
                  keyboardShouldPersistTaps={'never'}
                  listKey={'fpRkCvkS'}
                  nestedScrollEnabled={false}
                  numColumns={1}
                  onEndReachedThreshold={0.5}
                  renderItem={({ item, index }) => {
                    const listData = item;
                    return (
                      <SupabaseUsersApi.FetchGetUserByUniqueUserIdGET
                        select={'*'}
                        user_id={listData}
                      >
                        {({
                          loading,
                          error,
                          data,
                          refetchGetUserByUniqueUserId,
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
                              listKey={JSON.stringify(fetchData)}
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
                                        flexDirection: 'row',
                                        gap: 24,
                                        justifyContent: 'space-between',
                                        marginBottom: 16,
                                      },
                                      dimensions.width
                                    )}
                                  >
                                    <Text
                                      accessible={true}
                                      selectable={false}
                                      {...GlobalStyles.TextStyles(theme)[
                                        'Text 2'
                                      ].props}
                                      style={StyleSheet.applyWidth(
                                        GlobalStyles.TextStyles(theme)['Text 2']
                                          .style,
                                        dimensions.width
                                      )}
                                    >
                                      {fetchData?.[0]?.name}
                                    </Text>
                                    <IconButton
                                      onPress={() => {
                                        const handler = async () => {
                                          try {
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
                                                  blocked_users:
                                                    removeBlockedUser(
                                                      userData,
                                                      listData?.user_id
                                                    ),
                                                  user_id: Constants['user_id'],
                                                }
                                              )
                                            )?.json;
                                            navigation.navigate(
                                              'BlockedUsersScreen'
                                            );
                                          } catch (err) {
                                            console.error(err);
                                          }
                                        };
                                        handler();
                                      }}
                                      color={palettes.App.Peoplebit_Salmon_Red}
                                      icon={'AntDesign/minuscircleo'}
                                      size={22}
                                    />
                                  </View>
                                );
                              }}
                              showsHorizontalScrollIndicator={true}
                              showsVerticalScrollIndicator={true}
                            />
                          );
                        }}
                      </SupabaseUsersApi.FetchGetUserByUniqueUserIdGET>
                    );
                  }}
                  showsHorizontalScrollIndicator={true}
                  showsVerticalScrollIndicator={true}
                />
                <>
                  {fetchData && fetchData[0].blocked_users ? null : (
                    <View>
                      <Text
                        accessible={true}
                        selectable={false}
                        {...GlobalStyles.TextStyles(theme)['Text 2'].props}
                        style={StyleSheet.applyWidth(
                          StyleSheet.compose(
                            GlobalStyles.TextStyles(theme)['Text 2'].style,
                            { fontFamily: 'Inter_400Regular', fontSize: 16 }
                          ),
                          dimensions.width
                        )}
                      >
                        {'No Blocked Users Found'}
                      </Text>
                    </View>
                  )}
                </>
              </>
            );
          }}
        </SupabaseUsersApi.FetchGetUserDetailGET>
      </SimpleStyleScrollView>
    </ScreenContainer>
  );
};

export default withTheme(BlockedUsersScreen);
