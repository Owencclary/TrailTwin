import React from 'react';
import {
  Button,
  DatePicker,
  Icon,
  LoadingIndicator,
  MultiSelectPicker,
  Picker,
  ScreenContainer,
  SimpleStyleFlatList,
  SimpleStyleKeyboardAwareScrollView,
  Slider,
  TextInput,
  Touchable,
  withTheme,
} from '@draftbit/ui';
import { useIsFocused } from '@react-navigation/native';
import { ActivityIndicator, Image, Text, View } from 'react-native';
import { Fetch } from 'react-request';
import * as GlobalStyles from '../GlobalStyles.js';
import * as SupabaseEventsApi from '../apis/SupabaseEventsApi.js';
import * as GlobalVariables from '../config/GlobalVariableContext';
import * as base64decode from '../custom-files/base64decode';
import * as supabase from '../custom-files/supabase';
import checkForGroupRide from '../global-functions/checkForGroupRide';
import formatAmPm from '../global-functions/formatAmPm';
import formatHours from '../global-functions/formatHours';
import formatJSON from '../global-functions/formatJSON';
import validateInputs from '../global-functions/validateInputs';
import palettes from '../themes/palettes';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import imageSource from '../utils/imageSource';
import openImagePickerUtil from '../utils/openImagePicker';
import parseBoolean from '../utils/parseBoolean';
import showAlertUtil from '../utils/showAlert';
import useWindowDimensions from '../utils/useWindowDimensions';

const defaultProps = { editingEvent: true, id: 270 };

const EditEventScreen = props => {
  const { theme, navigation } = props;
  const dimensions = useWindowDimensions();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const setGlobalVariableValue = GlobalVariables.useSetValue();
  const [ampm, setAmpm] = React.useState('AM');
  const [attendeeSafetySelfie, setAttendeeSafetySelfie] = React.useState('');
  const [dateInput, setDateInput] = React.useState(new Date());
  const [descriptionInput, setDescriptionInput] = React.useState('');
  const [editingEvent, setEditingEvent] = React.useState('yes');
  const [eventPhotoUpload, setEventPhotoUpload] = React.useState('');
  const [eventTypeInput, setEventTypeInput] = React.useState('');
  const [isEventPhotoUpload, setIsEventPhotoUpload] = React.useState(false);
  const [maxPartySizeInput, setMaxPartySizeInput] = React.useState(15);
  const [partySizeInput, setPartySizeInput] = React.useState('');
  const [profilePhotoUpload, setProfilePhotoUpload] = React.useState('');
  const [rideNameInput, setRideNameInput] = React.useState('');
  const [rideTimeLengthInput, setRideTimeLengthInput] = React.useState(0);
  const [safetySelfie, setSafetySelfie] = React.useState('');
  const [skillLevelInput, setSkillLevelInput] = React.useState([]);
  const [startTimeFilterInput, setStartTimeFilterInput] = React.useState(0);
  const [startTimeInput, setStartTimeInput] = React.useState(11);
  const [tagsInput, setTagsInput] = React.useState([]);
  const [trailNameInput, setTrailNameInput] = React.useState('');
  const checkArrayBuffer = arrayBuffer => {
    // Ensure the arrayBuffer has data
    if (arrayBuffer.byteLength === 0) {
      console.error(
        'The arrayBuffer size is 0 bytes. The conversion may have failed.'
      );
      return 'File conversion failed, arrayBuffer size is 0 bytes.';
    }
    return { success: true };
  };

  const checkBase64Data = base64Data => {
    // Ensure base64 data is provided
    console.log('In edit screen base64 Data');
    if (!base64Data) {
      console.error('No base64 data provided');
      return { error: 'No base64 data provided' };
    }
    return { success: true };
  };

  const convertDateToCustomFormat = isoString => {
    // console.log("Date String:", isoString);
    // const date = new Date(isoString);
    // const year = date.getFullYear();
    // const month = String(date.getMonth() + 1).padStart(2, '0');
    // const day = String(date.getDate()).padStart(2, '0');
    // console.log(`${year}-${month}-${day}`);
    // return `${year}-${month}-${day}`;

    console.log('Date String:', isoString);

    const date = new Date(isoString);

    // Get the timezone offset in minutes and convert it to milliseconds
    const timezoneOffset = date.getTimezoneOffset() * 60000;

    // Adjust the date to the local timezone
    const localDate = new Date(date.getTime() - timezoneOffset);

    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, '0');
    const day = String(localDate.getDate()).padStart(2, '0');

    console.log(`${year}-${month}-${day}`);
    return `${year}-${month}-${day}`;
  };

  const convertImageNameToDbPath = imageName => {
    const fullImagePath = convertUserImagePathToLink(
      imageName,
      supabase.default.supabaseUrl
    );

    // Return the full image path
    return fullImagePath;
  };

  const convertTimeToCustomFormat = isoString => {
    // Type the code for the body of your function or hook here.
    // Functions can be triggered via Button/Touchable actions.
    // Hooks are run per ReactJS rules.

    /* String line breaks are accomplished with backticks ( example: `line one
line two` ) and will not work with special characters inside of quotes ( example: "line one line two" ) */
    const date = new Date(isoString);
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    // We set seconds to "00" as per the requirement
    const seconds = '00';
    return `${hours}:${minutes}:${seconds}`;
  };

  const convertUserImagePathToLink = (imagePath, supabaseUrl) => {
    const userImageDbLink = `${supabaseUrl}/storage/v1/object/public/safety_selfies/${imagePath}`;
    return userImageDbLink;
  };

  const decodeBase64ToArrayBuffer = base64String => {
    console.log(
      'TYPE OF base64decode.decode(base64String): ',
      typeof base64decode.decode(base64String)
    );
    return base64decode.decode(base64String);
  };

  const extractBase64Components = base64Data => {
    // Extract the base64 string and mime type
    const [prefix, base64String] = base64Data.split(',');
    const mimeType = prefix.match(/:(.*?);/)[1];
    console.log('MIME TYPE: ', mimeType);
    return { base64String, mimeType };
  };

  const generateImageName = () => {
    // Generate a unique image name
    const imgName = `${Math.random()
      .toString(36)
      .substring(2)}-${Date.now()}.jpg`;
    return imgName;
  };

  const uploadSelfieToBucket = async (base64Data, genImageName) => {
    try {
      // Check base64 data
      const base64Check = checkBase64Data(base64Data);
      if (base64Check.error) return base64Check.error;

      // Extract base64 components
      const { base64String, mimeType } = extractBase64Components(base64Data);

      // Generate image name and path
      const generatedImageName = genImageName; // generateImageName(); // Set to global variable
      // const imagePath = `safety_selfies/${imageName}`;
      console.log('IMAGE NAME: ', generatedImageName);
      // Decode base64 string to ArrayBuffer
      const arrayBuffer = decodeBase64ToArrayBuffer(base64String);

      // Check ArrayBuffer
      const arrayBufferCheck = checkArrayBuffer(arrayBuffer);
      if (arrayBufferCheck.error) return arrayBufferCheck.error;

      // Upload to Supabase
      const uploadResult = await uploadToSupabase(
        generatedImageName,
        arrayBuffer,
        mimeType
      );
      if (uploadResult.error) return uploadResult.error;

      // const fullImagePath = `${supabase.supabaseUrl}/storage/v1/object/public/${uploadResult.uploadData.path}`;
      // Variables.safteySelfiePath = fullImagePath;
      // return { imagePath: fullImagePath };
      // const fullImagePath = convertUserImagePathToLink(uploadResult.uploadData.path, supabase.default.supabaseUrl);
      // console.log("FULL IMAGE PATH FOR DB/upload.data.path: ", fullImagePath, uploadResult.uploadData.path);

      // // Return the full image path
      // return { imagePath: fullImagePath };
      return 'Upload to bucket success';
    } catch (error) {
      console.error('Error uploading file:', error);
      return `Error uploading file: ${error.message}`;
    }
  };

  const uploadToSupabase = async (imageName, arrayBuffer, mimeType) => {
    // Upload the arrayBuffer to Supabase
    const { data: uploadData, error: uploadError } =
      await supabase.default.storage
        .from('safety_selfies')
        .upload(imageName, arrayBuffer, {
          cacheControl: '3600',
          upsert: false,
          contentType: mimeType,
        });

    if (uploadError) {
      console.error('Upload failed:', uploadError);
      return `Upload failed: ${uploadError.message}`;
    }
    console.log('Upload successful!', uploadData.path);
    return { uploadData };
  };
  const supabaseEventsUpdateEventPATCH =
    SupabaseEventsApi.useUpdateEventPATCH();
  const supabaseEventsDeleteEventDELETE =
    SupabaseEventsApi.useDeleteEventDELETE();
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
      hasBottomSafeArea={false}
      hasSafeArea={false}
      hasTopSafeArea={false}
      scrollable={true}
      style={StyleSheet.applyWidth(
        {
          backgroundColor: [
            { minWidth: Breakpoints.Mobile, value: '"rgb(253, 253, 245)"' },
            {
              minWidth: Breakpoints.Mobile,
              value: Constants['backgroundColor'],
            },
          ],
        },
        dimensions.width
      )}
    >
      <SimpleStyleKeyboardAwareScrollView
        enableResetScrollToCoords={false}
        enableAutomaticScroll={true}
        enableOnAndroid={true}
        keyboardShouldPersistTaps={'always'}
        showsVerticalScrollIndicator={false}
        style={StyleSheet.applyWidth(
          { height: '100%', width: '100%' },
          dimensions.width
        )}
        viewIsInsideTabBar={false}
      >
        <View
          style={StyleSheet.applyWidth(
            { height: '100%', width: '100%' },
            dimensions.width
          )}
        >
          <SupabaseEventsApi.FetchGetSingleEventGET
            handlers={{
              onData: fetchData => {
                try {
                  setStartTimeInput(fetchData?.[0]?.start_time);
                  setMaxPartySizeInput(fetchData?.[0]?.max_party_size);
                  setRideTimeLengthInput('.ride_length');
                  setDateInput(fetchData?.[0]?.date);
                  setTagsInput(fetchData?.[0]?.tags);
                  setSkillLevelInput(fetchData?.[0]?.skill_level);
                  setEventTypeInput(fetchData?.[0]?.event_type);
                  setRideNameInput(fetchData?.[0]?.event_name);
                  setTrailNameInput(fetchData?.[0]?.trail_names);
                  setDescriptionInput(fetchData?.[0]?.event_description);
                  setGlobalVariableValue({
                    key: 'meetupLat',
                    value: fetchData?.[0]?.meetup_lat,
                  });
                  setGlobalVariableValue({
                    key: 'meetupLon',
                    value: fetchData?.[0]?.meetup_lon,
                  });
                } catch (err) {
                  console.error(err);
                }
              },
            }}
            id={props.route?.params?.id ?? defaultProps.id}
            select={'*'}
          >
            {({ loading, error, data, refetchGetSingleEvent }) => {
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
                  listKey={'60H9TxLP'}
                  nestedScrollEnabled={false}
                  numColumns={1}
                  onEndReachedThreshold={0.5}
                  renderItem={({ item, index }) => {
                    const listData = item;
                    return (
                      <View
                        style={StyleSheet.applyWidth(
                          {
                            gap: 48,
                            justifyContent: 'space-between',
                            paddingBottom: 128,
                            paddingLeft: 32,
                            paddingRight: 32,
                            paddingTop: 72,
                          },
                          dimensions.width
                        )}
                      >
                        {/* Ride Name */}
                        <View>
                          {/* Label */}
                          <Text
                            accessible={true}
                            selectable={false}
                            style={StyleSheet.applyWidth(
                              {
                                color: Constants['textColor'],
                                fontFamily: 'Inter_400Regular',
                                fontSize: 16,
                                opacity: 0.85,
                              },
                              dimensions.width
                            )}
                          >
                            {'Event Name'}
                          </Text>
                          {/* rideNameInput */}
                          <TextInput
                            autoCapitalize={'none'}
                            autoCorrect={true}
                            changeTextDelay={500}
                            onChangeText={newRideNameInputValue => {
                              try {
                                setRideNameInput(newRideNameInputValue);
                              } catch (err) {
                                console.error(err);
                              }
                            }}
                            placeholder={'Enter a value...'}
                            webShowOutline={true}
                            maxLength={64}
                            style={StyleSheet.applyWidth(
                              {
                                backgroundColor:
                                  palettes['Trail Twin']['White - Trail Twin'],
                                borderBottomWidth: 1,
                                borderColor: theme.colors.text.light,
                                borderLeftWidth: 1,
                                borderRadius: 12,
                                borderRightWidth: 1,
                                borderTopWidth: 1,
                                color: theme.colors.text.strong,
                                fontFamily: 'Inter_300Light',
                                height: 48,
                                marginTop: 12,
                                paddingBottom: 8,
                                paddingLeft: 20,
                                paddingRight: 8,
                                paddingTop: 8,
                              },
                              dimensions.width
                            )}
                            value={rideNameInput}
                          />
                        </View>
                        {/* Trail Names */}
                        <View>
                          {/* Label */}
                          <Text
                            accessible={true}
                            selectable={false}
                            style={StyleSheet.applyWidth(
                              {
                                color: Constants['textColor'],
                                fontFamily: 'Inter_400Regular',
                                fontSize: 16,
                                opacity: 0.85,
                              },
                              dimensions.width
                            )}
                          >
                            {'Trails'}
                          </Text>
                          {/* trailNameInput */}
                          <TextInput
                            autoCapitalize={'none'}
                            autoCorrect={true}
                            changeTextDelay={500}
                            onChangeText={newTrailNameInputValue => {
                              try {
                                setTrailNameInput(newTrailNameInputValue);
                              } catch (err) {
                                console.error(err);
                              }
                            }}
                            placeholder={'Enter a value...'}
                            webShowOutline={true}
                            maxLength={64}
                            style={StyleSheet.applyWidth(
                              {
                                backgroundColor:
                                  palettes['Trail Twin']['White - Trail Twin'],
                                borderBottomWidth: 1,
                                borderColor: theme.colors.text.light,
                                borderLeftWidth: 1,
                                borderRadius: 12,
                                borderRightWidth: 1,
                                borderTopWidth: 1,
                                color: theme.colors.text.strong,
                                fontFamily: 'Inter_300Light',
                                height: 48,
                                marginTop: 12,
                                paddingBottom: 8,
                                paddingLeft: 20,
                                paddingRight: 8,
                                paddingTop: 8,
                              },
                              dimensions.width
                            )}
                            value={trailNameInput}
                          />
                        </View>
                        {/* Meetup Location */}
                        <View
                          style={StyleSheet.applyWidth(
                            { marginBottom: 24 },
                            dimensions.width
                          )}
                        >
                          <View
                            style={StyleSheet.applyWidth(
                              {
                                alignItems: 'center',
                                flexDirection: 'row',
                                gap: 12,
                              },
                              dimensions.width
                            )}
                          >
                            {/* Label */}
                            <Text
                              accessible={true}
                              selectable={false}
                              style={StyleSheet.applyWidth(
                                {
                                  color: Constants['textColor'],
                                  fontFamily: 'Inter_400Regular',
                                  fontSize: 16,
                                  opacity: 0.85,
                                },
                                dimensions.width
                              )}
                            >
                              {'Meetup Location'}
                            </Text>
                          </View>
                          {/* Select Meetup Location */}
                          <>
                            {Constants['loading'] ? null : (
                              <Button
                                accessible={true}
                                iconPosition={'left'}
                                onPress={() => {
                                  try {
                                    navigation.navigate('RootNavigator');
                                  } catch (err) {
                                    console.error(err);
                                  }
                                }}
                                style={StyleSheet.applyWidth(
                                  {
                                    backgroundColor:
                                      palettes['Trail Twin'][
                                        'Secondary Green #2 - Trail Twin'
                                      ],
                                    borderRadius: 8,
                                    fontFamily: 'Inter_500Medium',
                                    fontSize: 14,
                                    height: 5,
                                    marginTop: 12,
                                    textAlign: 'center',
                                  },
                                  dimensions.width
                                )}
                                title={'Edit Meetup Location'}
                              />
                            )}
                          </>
                        </View>
                        {/* Event Photo */}
                        <View>
                          {/* Label */}
                          <Text
                            accessible={true}
                            selectable={false}
                            style={StyleSheet.applyWidth(
                              {
                                color: Constants['textColor'],
                                fontFamily: 'Inter_400Regular',
                                fontSize: 16,
                                opacity: 0.85,
                              },
                              dimensions.width
                            )}
                          >
                            {'Event Photo *'}
                          </Text>
                          {/* Event Photo Touchable */}
                          <Touchable
                            onPress={() => {
                              const handler = async () => {
                                try {
                                  const eventPhotoUpload =
                                    await openImagePickerUtil({
                                      mediaTypes: 'Images',
                                      allowsEditing: false,
                                      quality: 0.5,
                                      allowsMultipleSelection: false,
                                      outputBase64: true,
                                    });

                                  if (eventPhotoUpload) {
                                    console.log(
                                      'Image was captured'.toString()
                                    );
                                    setIsEventPhotoUpload(true);
                                    console.log(
                                      'event Photo upload is set to true'
                                    );
                                    setEventPhotoUpload(eventPhotoUpload);
                                  } else {
                                    console.log('Upload Cancelled');
                                  }

                                  console.log('End of upload action workflow');
                                } catch (err) {
                                  console.error(err);
                                }
                              };
                              handler();
                            }}
                            style={StyleSheet.applyWidth(
                              { marginTop: 10 },
                              dimensions.width
                            )}
                          >
                            {/* Uploaded Event Photo View */}
                            <View
                              style={StyleSheet.applyWidth(
                                {
                                  alignContent: 'center',
                                  alignItems: 'center',
                                  backgroundColor:
                                    palettes['Trail Twin'][
                                      'White - Trail Twin'
                                    ],
                                  borderBottomWidth: 1,
                                  borderColor: palettes['Brand Fire'].Light,
                                  borderLeftWidth: 1,
                                  borderRadius: 12,
                                  borderRightWidth: 1,
                                  borderStyle: 'solid',
                                  borderTopWidth: 1,
                                  height: 140,
                                  justifyContent: 'center',
                                },
                                dimensions.width
                              )}
                            >
                              {/* Event Photo Image */}
                              <>
                                {!isEventPhotoUpload ? null : (
                                  <Image
                                    resizeMode={'cover'}
                                    {...GlobalStyles.ImageStyles(theme)['Image']
                                      .props}
                                    source={imageSource(`${eventPhotoUpload}`)}
                                    style={StyleSheet.applyWidth(
                                      GlobalStyles.ImageStyles(theme)['Image']
                                        .style,
                                      dimensions.width
                                    )}
                                  />
                                )}
                              </>
                              <>
                                {isEventPhotoUpload ? null : (
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
                                          color:
                                            palettes.Brand['Secondary Text'],
                                          fontFamily: 'Inter_300Light',
                                          marginBottom: 8,
                                          textAlign: 'center',
                                        }
                                      ),
                                      dimensions.width
                                    )}
                                  >
                                    {'Upload a photo for the ride'}
                                  </Text>
                                )}
                              </>
                              <>
                                {isEventPhotoUpload ? null : (
                                  <Icon name={'AntDesign/camerao'} size={35} />
                                )}
                              </>
                            </View>
                          </Touchable>
                        </View>
                        {/* Ride Description */}
                        <View>
                          {/* title */}
                          <Text
                            accessible={true}
                            selectable={false}
                            style={StyleSheet.applyWidth(
                              {
                                color: Constants['textColor'],
                                fontFamily: 'Inter_400Regular',
                                fontSize: 16,
                                opacity: 0.85,
                              },
                              dimensions.width
                            )}
                          >
                            {'Event Description\n'}
                          </Text>
                          {/* descriptionInput */}
                          <TextInput
                            autoCorrect={true}
                            changeTextDelay={500}
                            multiline={true}
                            numberOfLines={4}
                            onChangeText={newDescriptionInputValue => {
                              try {
                                setDescriptionInput(newDescriptionInputValue);
                              } catch (err) {
                                console.error(err);
                              }
                            }}
                            placeholder={
                              "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."
                            }
                            textAlignVertical={'top'}
                            webShowOutline={true}
                            maxLength={300}
                            style={StyleSheet.applyWidth(
                              {
                                backgroundColor:
                                  palettes['Trail Twin']['White - Trail Twin'],
                                borderBottomWidth: 1,
                                borderColor: theme.colors.text.light,
                                borderLeftWidth: 1,
                                borderRadius: 12,
                                borderRightWidth: 1,
                                borderTopWidth: 1,
                                color: theme.colors.text.strong,
                                fontFamily: 'Inter_300Light',
                                height: 96,
                                marginTop: 12,
                                paddingBottom: 8,
                                paddingLeft: 20,
                                paddingRight: 20,
                                paddingTop: 12,
                              },
                              dimensions.width
                            )}
                            value={descriptionInput}
                          />
                        </View>
                        {/* Date */}
                        <View>
                          {/* Label */}
                          <Text
                            accessible={true}
                            selectable={false}
                            style={StyleSheet.applyWidth(
                              {
                                color: Constants['textColor'],
                                fontFamily: 'Inter_400Regular',
                                fontSize: 16,
                                opacity: 0.85,
                              },
                              dimensions.width
                            )}
                          >
                            {'Date'}
                          </Text>
                          {/* dateInput */}
                          <DatePicker
                            autoDismissKeyboard={true}
                            disabled={false}
                            hideLabel={false}
                            inline={false}
                            leftIconMode={'inset'}
                            mode={'date'}
                            onDateChange={newDateInputValue => {
                              console.log('dateInput ON_DATE_CHANGE Start');
                              let error = null;
                              try {
                                console.log(
                                  'Start ON_DATE_CHANGE:0 SET_VARIABLE'
                                );
                                setDateInput(newDateInputValue);
                                console.log(
                                  'Complete ON_DATE_CHANGE:0 SET_VARIABLE'
                                );
                              } catch (err) {
                                console.error(err);
                                error = err.message ?? err;
                              }
                              console.log(
                                'dateInput ON_DATE_CHANGE Complete',
                                error ? { error } : 'no error'
                              );
                            }}
                            date={dateInput}
                            format={'mm/dd/yyyy'}
                            label={'Enter date'}
                            style={StyleSheet.applyWidth(
                              {
                                backgroundColor:
                                  palettes['Trail Twin']['White - Trail Twin'],
                                borderColor: theme.colors.text.light,
                                borderRadius: 12,
                                color: theme.colors.text.strong,
                                fontFamily: 'Inter_300Light',
                                marginTop: 12,
                                paddingLeft: 5,
                                paddingRight: 5,
                              },
                              dimensions.width
                            )}
                            type={'solid'}
                          />
                        </View>
                        {/* Start time */}
                        <View>
                          <View
                            style={StyleSheet.applyWidth(
                              {
                                alignItems: 'center',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginBottom: 12,
                              },
                              dimensions.width
                            )}
                          >
                            {/* Start Time */}
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
                              {'Start Time'}
                            </Text>
                            {/* Time */}
                            <Text
                              accessible={true}
                              selectable={false}
                              style={StyleSheet.applyWidth(
                                {
                                  color: Constants['textColor'],
                                  fontFamily: 'Inter_400Regular',
                                  fontSize: 14,
                                },
                                dimensions.width
                              )}
                            >
                              {formatHours(startTimeInput)}{' '}
                              {formatAmPm(ampm, startTimeInput)}
                            </Text>
                          </View>
                          <Slider
                            onValueChange={newSliderValue => {
                              try {
                                setStartTimeInput(newSliderValue);
                              } catch (err) {
                                console.error(err);
                              }
                            }}
                            maximumTrackTintColor={
                              palettes.Brand['Secondary Grey']
                            }
                            maximumValue={23 ?? 60}
                            minimumTrackTintColor={
                              palettes.Brand['Secondary Grey']
                            }
                            minimumValue={0 ?? 1}
                            thumbTintColor={
                              palettes['Trail Twin'][
                                'Primary Green - Trail Twin'
                              ]
                            }
                            value={startTimeInput}
                          />
                        </View>
                        {/* Max Party Size */}
                        <View>
                          <View
                            style={StyleSheet.applyWidth(
                              {
                                alignItems: 'center',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginBottom: 12,
                              },
                              dimensions.width
                            )}
                          >
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
                              {'Max Party Size'}
                            </Text>

                            <Text
                              accessible={true}
                              selectable={false}
                              style={StyleSheet.applyWidth(
                                {
                                  color: Constants['textColor'],
                                  fontFamily: 'Inter_400Regular',
                                  fontSize: 14,
                                },
                                dimensions.width
                              )}
                            >
                              {maxPartySizeInput}
                              {' Riders'}
                            </Text>
                          </View>
                          <Slider
                            onValueChange={newSliderValue => {
                              try {
                                setMaxPartySizeInput(newSliderValue);
                              } catch (err) {
                                console.error(err);
                              }
                            }}
                            maximumTrackTintColor={
                              palettes.Brand['Secondary Grey']
                            }
                            maximumValue={50 ?? 60}
                            minimumTrackTintColor={
                              palettes['Trail Twin'][
                                'Primary Green - Trail Twin'
                              ]
                            }
                            minimumValue={0 ?? 1}
                            thumbTintColor={
                              palettes['Trail Twin'][
                                'Primary Green - Trail Twin'
                              ]
                            }
                            value={maxPartySizeInput}
                          />
                        </View>
                        {/* Event Type */}
                        <View
                          style={StyleSheet.applyWidth(
                            {
                              alignItems: 'stretch',
                              flex: 1,
                              justifyContent: 'space-evenly',
                            },
                            dimensions.width
                          )}
                        >
                          {/* Skill Level */}
                          <View
                            style={StyleSheet.applyWidth(
                              { position: 'relative' },
                              dimensions.width
                            )}
                          >
                            {/* Label */}
                            <Text
                              accessible={true}
                              selectable={false}
                              style={StyleSheet.applyWidth(
                                {
                                  color: Constants['textColor'],
                                  fontFamily: 'Inter_400Regular',
                                  fontSize: 16,
                                  marginBottom: 12,
                                  opacity: 0.85,
                                },
                                dimensions.width
                              )}
                            >
                              {'Ride Type'}
                            </Text>
                            <Picker
                              autoDismissKeyboard={true}
                              dropDownBorderColor={theme.colors.border.brand}
                              dropDownBorderRadius={8}
                              dropDownBorderWidth={1}
                              dropDownTextColor={theme.colors.text.strong}
                              iconSize={24}
                              leftIconMode={'inset'}
                              mode={'native'}
                              onValueChange={newPickerValue => {
                                try {
                                  setEventTypeInput(newPickerValue);
                                } catch (err) {
                                  console.error(err);
                                }
                              }}
                              placeholder={'Select an option'}
                              selectedIconColor={theme.colors.text.strong}
                              selectedIconName={'Feather/check'}
                              selectedIconSize={20}
                              type={'solid'}
                              dropDownBackgroundColor={
                                palettes['Trail Twin']['White - Trail Twin']
                              }
                              options={[
                                { label: 'Group Ride', value: 'Group Ride' },
                                { label: 'Trail Work', value: 'Trail Work' },
                                { label: 'Race', value: 'Race' },
                                { label: 'Bike Trip', value: 'Bike Trip' },
                                { label: 'Other', value: 'Other' },
                              ]}
                              style={StyleSheet.applyWidth(
                                {
                                  backgroundColor:
                                    palettes['Trail Twin'][
                                      'White - Trail Twin'
                                    ],
                                  color: theme.colors.text.strong,
                                  fontFamily: 'Inter_300Light',
                                  textTransform: 'lowercase',
                                },
                                dimensions.width
                              )}
                              value={eventTypeInput}
                            />
                          </View>
                        </View>
                        {/* Tags View */}
                        <View
                          style={StyleSheet.applyWidth(
                            {
                              alignItems: 'stretch',
                              flex: 1,
                              justifyContent: 'space-evenly',
                              zIndex: -1,
                            },
                            dimensions.width
                          )}
                        >
                          {/* Event Tags */}
                          <View
                            style={StyleSheet.applyWidth(
                              { position: 'relative' },
                              dimensions.width
                            )}
                          >
                            {/* Label */}
                            <Text
                              accessible={true}
                              selectable={false}
                              style={StyleSheet.applyWidth(
                                {
                                  color: Constants['textColor'],
                                  fontFamily: 'Inter_400Regular',
                                  fontSize: 16,
                                  opacity: 0.85,
                                },
                                dimensions.width
                              )}
                            >
                              {'Tags'}
                            </Text>
                            <MultiSelectPicker
                              autoDismissKeyboard={true}
                              dropDownBorderColor={theme.colors.border.brand}
                              dropDownBorderRadius={8}
                              dropDownBorderWidth={1}
                              dropDownTextColor={theme.colors.text.strong}
                              iconSize={24}
                              leftIconMode={'inset'}
                              onValueChange={newMultiSelectPickerValue => {
                                try {
                                  setTagsInput(newMultiSelectPickerValue);
                                } catch (err) {
                                  console.error(err);
                                }
                              }}
                              selectedIconColor={theme.colors.text.strong}
                              selectedIconName={'Feather/check'}
                              selectedIconSize={20}
                              type={'solid'}
                              dropDownBackgroundColor={
                                palettes['Trail Twin']['White - Trail Twin']
                              }
                              options={[
                                {
                                  label: 'Jump session',
                                  value: 'Jump session',
                                },
                                {
                                  label: 'Dirt Jumping',
                                  value: 'Dirt Jumping',
                                },
                                { label: 'Enduro', value: 'Enduro' },
                                { label: 'Freeride', value: 'Freeride' },
                                { label: 'Flow Trails', value: 'Flow Trails' },
                                { label: 'Tech Trails', value: 'Tech Trails' },
                                {
                                  label: 'Private Trails',
                                  value: 'Private Trails',
                                },
                                { label: 'Bmx', value: 'Bmx' },
                                { label: 'E-Bikes', value: 'E-Bikes' },
                                { label: 'Hard Tails', value: 'Hard Tails' },
                                {
                                  label: 'Full Suspensions',
                                  value: 'Full Suspensions',
                                },
                                {
                                  label: 'Beginner Friendly',
                                  value: 'Beginner Friendly',
                                },
                                {
                                  label: 'Training Ride',
                                  value: 'Training Ride',
                                },
                                { label: 'Coaching', value: 'Coaching' },
                                { label: 'No Coaching', value: 'No Coaching' },
                                { label: 'Scenic Ride', value: 'Scenic Ride' },
                                { label: 'Slow Climb', value: 'Slow Climb' },
                                { label: 'Fast Climb', value: 'Fast Climb' },
                                {
                                  label: 'Fitness Ride',
                                  value: 'Fitness Ride',
                                },
                                {
                                  label: 'First Aid Trained',
                                  value: 'First Aid Trained',
                                },
                                {
                                  label: 'Shuttle Service',
                                  value: 'Shuttle Service',
                                },
                                { label: 'Carpooling', value: 'Carpooling' },
                                { label: 'Bike Park', value: 'Bike Park' },
                                {
                                  label: 'Mixed Gender',
                                  value: 'Mixed Gender',
                                },
                                { label: 'Females', value: 'Females' },
                                { label: 'Males', value: 'Males' },
                                { label: 'LGBTQ+', value: 'LGTBQ+' },
                                {
                                  label: 'Volunteer Work',
                                  value: 'Volunteer Work',
                                },
                                { label: 'Paid Work', value: 'Paid Work' },
                                {
                                  label: 'Authorized Trail Work',
                                  value: 'Authorized Trail Work',
                                },
                                {
                                  label: 'Trail Sculpting',
                                  value: 'Trail Sculpting',
                                },
                                {
                                  label: 'Trail Digging',
                                  value: 'Trail Digging',
                                },
                                {
                                  label: 'Trail Maintenance',
                                  value: 'Trail Maintenance',
                                },
                                {
                                  label: 'Tools Provied',
                                  value: 'Tools Provided',
                                },
                                {
                                  label: 'Tools Not Provided',
                                  value: 'Tools Not Provided',
                                },
                                {
                                  label: 'Waiver Required',
                                  value: 'Waiver Required',
                                },
                                { label: 'Ages 18-25', value: 'Ages 18-25' },
                                { label: 'Ages 26-30', value: 'Ages 26-30' },
                                { label: 'Ages 30-40', value: 'Ages 30-40' },
                                { label: 'Ages 40-50', value: 'Ages 40-50' },
                                { label: 'Ages 50+', value: 'Ages 50+' },
                              ]}
                              placeholder={'Select options'}
                              rightIconName={'AntDesign/down'}
                              style={StyleSheet.applyWidth(
                                {
                                  backgroundColor: palettes.Brand.Surface,
                                  color: theme.colors.text.strong,
                                  fontFamily: 'Inter_300Light',
                                  marginTop: 12,
                                  position: 'relative',
                                },
                                dimensions.width
                              )}
                              value={tagsInput}
                            />
                          </View>
                        </View>
                        {/* Ride Skill Level */}
                        <>
                          {!checkForGroupRide(eventTypeInput) ? null : (
                            <View
                              style={StyleSheet.applyWidth(
                                {
                                  alignItems: 'stretch',
                                  flex: 1,
                                  justifyContent: 'space-evenly',
                                  zIndex: -2,
                                },
                                dimensions.width
                              )}
                            >
                              {/* Skill Level */}
                              <View
                                style={StyleSheet.applyWidth(
                                  { position: 'relative' },
                                  dimensions.width
                                )}
                              >
                                {/* Label */}
                                <Text
                                  accessible={true}
                                  selectable={false}
                                  style={StyleSheet.applyWidth(
                                    {
                                      color: theme.colors.text.strong,
                                      fontFamily: 'Inter_400Regular',
                                      fontSize: 16,
                                      marginBottom: 12,
                                      opacity: 0.85,
                                    },
                                    dimensions.width
                                  )}
                                >
                                  {'Skill Level'}
                                </Text>
                                <MultiSelectPicker
                                  autoDismissKeyboard={true}
                                  dropDownBorderColor={
                                    theme.colors.border.brand
                                  }
                                  dropDownBorderRadius={8}
                                  dropDownBorderWidth={1}
                                  dropDownTextColor={theme.colors.text.strong}
                                  iconSize={24}
                                  leftIconMode={'inset'}
                                  onValueChange={newMultiSelectPickerValue => {
                                    try {
                                      setSkillLevelInput(
                                        newMultiSelectPickerValue
                                      );
                                    } catch (err) {
                                      console.error(err);
                                    }
                                  }}
                                  selectedIconColor={theme.colors.text.strong}
                                  selectedIconName={'Feather/check'}
                                  selectedIconSize={20}
                                  type={'solid'}
                                  dropDownBackgroundColor={
                                    palettes['Trail Twin']['White - Trail Twin']
                                  }
                                  options={[
                                    {
                                      label: 'Any Skill Level',
                                      value: 'Any Skill Level',
                                    },
                                    { label: 'Beginner', value: 'Beginner' },
                                    {
                                      label: 'Intermediate',
                                      value: 'Intermediate',
                                    },
                                    { label: 'Advanced', value: 'Advanced' },
                                    { label: 'Pro', value: 'Pro' },
                                  ]}
                                  placeholder={'Select options'}
                                  rightIconName={'AntDesign/down'}
                                  style={StyleSheet.applyWidth(
                                    {
                                      backgroundColor:
                                        palettes['Trail Twin'][
                                          'White - Trail Twin'
                                        ],
                                      color: theme.colors.text.strong,
                                      fontFamily: 'Inter_300Light',
                                      position: 'relative',
                                    },
                                    dimensions.width
                                  )}
                                  value={formatJSON(skillLevelInput)}
                                />
                              </View>
                            </View>
                          )}
                        </>
                        {/* Confirm Button View */}
                        <View
                          style={StyleSheet.applyWidth(
                            {
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginTop: 24,
                              zIndex: -3,
                            },
                            dimensions.width
                          )}
                        >
                          {/* Update Event Button */}
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
                                      if (
                                        validateInputs(
                                          rideNameInput,
                                          trailNameInput,
                                          Constants['meetupLat'],
                                          Constants['meetupLon'],
                                          dateInput,
                                          startTimeInput,
                                          eventTypeInput,
                                          tagsInput
                                        )
                                      ) {
                                        (
                                          await supabaseEventsUpdateEventPATCH.mutateAsync(
                                            {
                                              evenDesc: descriptionInput,
                                              eventDate: dateInput,
                                              eventLat: Constants['meetupLat'],
                                              eventLon: Constants['meetupLon'],
                                              eventName: rideNameInput,
                                              eventPartySize: maxPartySizeInput,
                                              eventRideLength:
                                                rideTimeLengthInput,
                                              eventSkill: skillLevelInput,
                                              eventTags: tagsInput,
                                              eventTime: startTimeInput,
                                              eventTrails: trailNameInput,
                                              eventType: eventTypeInput,
                                              id: listData?.id,
                                            }
                                          )
                                        )?.json;
                                        navigation.navigate(
                                          'BottomTabNavigator',
                                          {
                                            screen: 'ProfileTab',
                                            params: {
                                              screen: 'UsersRidesScreen',
                                            },
                                          }
                                        );
                                      } else {
                                        showAlertUtil({
                                          title: undefined,
                                          message: 'Missing Event Info.',
                                          buttonText: 'Ok',
                                        });
                                      }
                                    } catch (err) {
                                      console.error(err);
                                    }
                                  };
                                  handler();
                                }}
                                style={StyleSheet.applyWidth(
                                  {
                                    backgroundColor:
                                      palettes['Trail Twin'][
                                        'Secondary Green #2 - Trail Twin'
                                      ],
                                    borderRadius: 8,
                                    fontFamily: 'Inter_500Medium',
                                    fontSize: 14,
                                    height: 5,
                                    textAlign: 'center',
                                    width: '100%',
                                  },
                                  dimensions.width
                                )}
                                title={'Confirm'}
                              />
                            )}
                          </>
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
                        {/* Delete Event View */}
                        <View
                          style={StyleSheet.applyWidth(
                            {
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginBottom: 128,
                              marginTop: 12,
                              zIndex: -3,
                            },
                            dimensions.width
                          )}
                        >
                          {/* Delete Event Button */}
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
                                      (
                                        await supabaseEventsDeleteEventDELETE.mutateAsync(
                                          { id: listData?.id }
                                        )
                                      )?.json;
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
                                  };
                                  handler();
                                }}
                                style={StyleSheet.applyWidth(
                                  {
                                    backgroundColor:
                                      palettes['Brand Fire'].Error,
                                    borderRadius: 8,
                                    fontFamily: 'Inter_500Medium',
                                    fontSize: 14,
                                    height: 5,
                                    textAlign: 'center',
                                    width: '100%',
                                  },
                                  dimensions.width
                                )}
                                title={'Delete Event'}
                              />
                            )}
                          </>
                        </View>
                      </View>
                    );
                  }}
                  showsHorizontalScrollIndicator={true}
                  showsVerticalScrollIndicator={true}
                />
              );
            }}
          </SupabaseEventsApi.FetchGetSingleEventGET>
        </View>
      </SimpleStyleKeyboardAwareScrollView>
    </ScreenContainer>
  );
};

export default withTheme(EditEventScreen);