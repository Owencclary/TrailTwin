import React from 'react';
import {
  Button,
  Icon,
  ScreenContainer,
  Touchable,
  withTheme,
} from '@draftbit/ui';
import { Image, Text, View } from 'react-native';
import * as GlobalVariables from '../config/GlobalVariableContext';
import Images from '../config/Images';
import palettes from '../themes/palettes';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import imageSource from '../utils/imageSource';
import useWindowDimensions from '../utils/useWindowDimensions';

const PayWallScreen = props => {
  const { theme, navigation } = props;
  const dimensions = useWindowDimensions();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;

  return (
    <ScreenContainer
      scrollable={false}
      hasSafeArea={true}
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
            flexDirection: 'row',
            height: 48,
            marginTop: 12,
            paddingLeft: 16,
            paddingRight: 16,
          },
          dimensions.width
        )}
      >
        {/* Back Click */}
        <View
          style={StyleSheet.applyWidth(
            {
              alignItems: 'center',
              height: 48,
              justifyContent: 'center',
              width: 48,
            },
            dimensions.width
          )}
        ></View>
        {/* Screen Heading */}
        <Text
          accessible={true}
          selectable={false}
          style={StyleSheet.applyWidth(
            {
              color: theme.colors.text.strong,
              fontFamily: 'Inter_600SemiBold',
              fontSize: 20,
              marginLeft: 16,
            },
            dimensions.width
          )}
        >
          {'Upgrade to Premium 💫'}
        </Text>
      </View>

      <View
        style={StyleSheet.applyWidth(
          { flex: 1, paddingLeft: 20, paddingRight: 20, paddingTop: 20 },
          dimensions.width
        )}
      >
        {/* Title */}
        <Text
          accessible={true}
          selectable={false}
          style={StyleSheet.applyWidth(
            {
              color: palettes['Trail Twin']['Secondary Green #2 - Trail Twin'],
              fontFamily: 'Inter_500Medium',
              fontSize: 22,
            },
            dimensions.width
          )}
        >
          {'Premium Subscription'}
        </Text>
        {/* Sub title */}
        <Text
          accessible={true}
          selectable={false}
          style={StyleSheet.applyWidth(
            {
              color: theme.colors.text.strong,
              fontFamily: 'Inter_500Medium',
              fontSize: 15,
              lineHeight: 21,
              marginTop: 8,
            },
            dimensions.width
          )}
        >
          {
            'Gain access to weather insights, advanced filters to find the perfect trail, enhanced search features to find new friends, and a chat space to stay connected with friends.'
          }
        </Text>
        {/* Renews every */}
        <View
          style={StyleSheet.applyWidth({ marginTop: 20 }, dimensions.width)}
        >
          {/* heading */}
          <Text
            accessible={true}
            selectable={false}
            style={StyleSheet.applyWidth(
              {
                color: theme.colors.text.strong,
                fontFamily: 'Inter_500Medium',
                fontSize: 18,
                lineHeight: 21,
                marginTop: 8,
              },
              dimensions.width
            )}
          >
            {'Renew Every'}
          </Text>
          {/* Plans */}
          <View
            style={StyleSheet.applyWidth(
              {
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingTop: 16,
              },
              dimensions.width
            )}
          >
            {/* 5.99 */}
            <View
              style={StyleSheet.applyWidth(
                { flex: 1, marginLeft: 5, marginRight: 5 },
                dimensions.width
              )}
            >
              <Touchable>
                <View
                  style={StyleSheet.applyWidth(
                    {
                      alignItems: 'flex-start',
                      backgroundColor: theme.colors.border.brand,
                      borderBottomWidth: 2,
                      borderColor:
                        palettes['Trail Twin']['Secondary Green - Trail Twin'],
                      borderLeftWidth: 2,
                      borderRadius: 16,
                      borderRightWidth: 2,
                      borderTopWidth: 2,
                      height: 84,
                      justifyContent: 'center',
                      paddingLeft: 5,
                      paddingRight: 5,
                    },
                    dimensions.width
                  )}
                >
                  <Text
                    accessible={true}
                    selectable={false}
                    style={StyleSheet.applyWidth(
                      {
                        color:
                          palettes['Trail Twin'][
                            'Secondary Green #2 - Trail Twin'
                          ],
                        fontFamily: 'Inter_600SemiBold',
                        fontSize: 16,
                      },
                      dimensions.width
                    )}
                  >
                    {'USD $5.99'}
                  </Text>

                  <Text
                    accessible={true}
                    selectable={false}
                    style={StyleSheet.applyWidth(
                      {
                        color:
                          palettes['Trail Twin'][
                            'Secondary Green #2 - Trail Twin'
                          ],
                        fontFamily: 'Inter_400Regular',
                        fontSize: 14,
                        marginTop: 4,
                      },
                      dimensions.width
                    )}
                  >
                    {'Month'}
                  </Text>
                </View>
              </Touchable>
            </View>
          </View>
        </View>
        {/* What you get : */}
        <View
          style={StyleSheet.applyWidth({ marginTop: 20 }, dimensions.width)}
        >
          {/* heading */}
          <Text
            accessible={true}
            selectable={false}
            style={StyleSheet.applyWidth(
              {
                color: theme.colors.text.strong,
                fontFamily: 'Inter_500Medium',
                fontSize: 18,
                lineHeight: 21,
                marginTop: 8,
              },
              dimensions.width
            )}
          >
            {'What you get:'}
          </Text>

          <View
            style={StyleSheet.applyWidth(
              { flexDirection: 'row', justifyContent: 'space-between' },
              dimensions.width
            )}
          >
            {/* Search */}
            <Touchable>
              <View
                style={StyleSheet.applyWidth(
                  { alignItems: 'center', paddingTop: 16 },
                  dimensions.width
                )}
              >
                <Image
                  resizeMode={'cover'}
                  source={imageSource(Images['Subs1'])}
                  style={StyleSheet.applyWidth(
                    { height: 72, width: 72 },
                    dimensions.width
                  )}
                />
                <Text
                  accessible={true}
                  selectable={false}
                  style={StyleSheet.applyWidth(
                    { color: theme.colors.text.strong, marginTop: 10 },
                    dimensions.width
                  )}
                >
                  {'Search'}
                </Text>
              </View>
            </Touchable>
            {/* Weather */}
            <Touchable>
              <View
                style={StyleSheet.applyWidth(
                  { alignItems: 'center', paddingTop: 16 },
                  dimensions.width
                )}
              >
                <Image
                  resizeMode={'cover'}
                  source={imageSource(Images['Subs2'])}
                  style={StyleSheet.applyWidth(
                    { height: 72, width: 72 },
                    dimensions.width
                  )}
                />
                <Text
                  accessible={true}
                  selectable={false}
                  style={StyleSheet.applyWidth(
                    { color: theme.colors.text.strong, marginTop: 10 },
                    dimensions.width
                  )}
                >
                  {'Weather'}
                </Text>
              </View>
            </Touchable>
            {/* Filter & Sort */}
            <Touchable>
              <View
                style={StyleSheet.applyWidth(
                  { alignItems: 'center', paddingTop: 16 },
                  dimensions.width
                )}
              >
                <Image
                  resizeMode={'cover'}
                  source={imageSource(Images['Subs3'])}
                  style={StyleSheet.applyWidth(
                    { height: 72, width: 72 },
                    dimensions.width
                  )}
                />
                <Text
                  accessible={true}
                  selectable={false}
                  style={StyleSheet.applyWidth(
                    { color: theme.colors.text.strong, marginTop: 10 },
                    dimensions.width
                  )}
                >
                  {'Filter & Sort'}
                </Text>
              </View>
            </Touchable>
            {/* Chats */}
            <Touchable>
              <View
                style={StyleSheet.applyWidth(
                  { alignItems: 'center', paddingTop: 16 },
                  dimensions.width
                )}
              >
                <Image
                  resizeMode={'cover'}
                  source={imageSource(Images['Sub4'])}
                  style={StyleSheet.applyWidth(
                    { height: 72, width: 72 },
                    dimensions.width
                  )}
                />
                <Text
                  accessible={true}
                  selectable={false}
                  style={StyleSheet.applyWidth(
                    { color: theme.colors.text.strong, marginTop: 10 },
                    dimensions.width
                  )}
                >
                  {'Chats'}
                </Text>
              </View>
            </Touchable>
          </View>
        </View>
      </View>
      {/* Subscribe */}
      <Button
        accessible={true}
        iconPosition={'left'}
        style={StyleSheet.applyWidth(
          {
            backgroundColor:
              palettes['Trail Twin']['Primary Green - Trail Twin'],
            borderRadius: 100,
            fontFamily: 'Inter_500Medium',
            fontSize: 15,
            height: 58,
            marginBottom: 20,
            marginLeft: 20,
            marginRight: 20,
            marginTop: 20,
            textAlign: 'center',
          },
          dimensions.width
        )}
        title={'Subscribe for USD $5.99 /month'}
      />
    </ScreenContainer>
  );
};

export default withTheme(PayWallScreen);
