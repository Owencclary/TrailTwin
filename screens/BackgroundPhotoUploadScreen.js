import React from 'react';
import {
  Button,
  Icon,
  LoadingIndicator,
  ScreenContainer,
  SimpleStyleKeyboardAwareScrollView,
  Touchable,
  withTheme,
} from '@draftbit/ui';
import { useIsFocused } from '@react-navigation/native';
import { ActivityIndicator, Image, Text, View } from 'react-native';
import { Fetch } from 'react-request';
import * as GlobalStyles from '../GlobalStyles.js';
import * as SupabaseUsersApi from '../apis/SupabaseUsersApi.js';
import * as GlobalVariables from '../config/GlobalVariableContext';
import * as base64decode from '../custom-files/base64decode';
import * as supabase from '../custom-files/supabase';
import convertImageNameToDbPath from '../global-functions/convertImageNameToDbPath';
import generateImageName from '../global-functions/generateImageName';
import uploadImageToBucket from '../global-functions/uploadImageToBucket';
import palettes from '../themes/palettes';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import imageSource from '../utils/imageSource';
import openImagePickerUtil from '../utils/openImagePicker';
import parseBoolean from '../utils/parseBoolean';
import useWindowDimensions from '../utils/useWindowDimensions';
import waitUtil from '../utils/wait';

const BackgroundPhotoUploadScreen = props => {
  const { theme, navigation } = props;
  const dimensions = useWindowDimensions();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const setGlobalVariableValue = GlobalVariables.useSetValue();
  const [ampm, setAmpm] = React.useState('AM');
  const [attendeeAgeInputV1, setAttendeeAgeInputV1] = React.useState(0);
  const [attendeeSafetySelfie, setAttendeeSafetySelfie] = React.useState('');
  const [backgroundPhotoUpload, setBackgroundPhotoUpload] = React.useState('');
  const [backgroundPhotos, setBackgroundPhotos] = React.useState([
    'https://ctiafgkrjympwdsviiew.supabase.co/storage/v1/object/public/photos/profile_photos/background/mtb_biker1.jpg',
    'https://ctiafgkrjympwdsviiew.supabase.co/storage/v1/object/public/photos/profile_photos/background/mtb_biker2.jpg',
    'https://ctiafgkrjympwdsviiew.supabase.co/storage/v1/object/public/photos/profile_photos/background/mtb_biker3.jpg',
    'https://ctiafgkrjympwdsviiew.supabase.co/storage/v1/object/public/photos/profile_photos/background/mtb_biker4.jpg',
    'https://ctiafgkrjympwdsviiew.supabase.co/storage/v1/object/public/photos/profile_photos/background/mtb_biker5.jpg',
    'https://ctiafgkrjympwdsviiew.supabase.co/storage/v1/object/public/photos/profile_photos/background/mtb_biker6.jpg',
  ]);
  const [displayPhotoUpload, setDisplayPhotoUpload] = React.useState('');
  const [isAttendeeSafetySelfie, setIsAttendeeSafetySelfie] =
    React.useState(false);
  const [isBackgroundPhotoUpload, setIsBackgroundPhotoUpload] =
    React.useState(false);
  const [isProfilePhotoUpload, setIsProfilePhotoUpload] = React.useState(false);
  const [joinAttendeeNameInputV1, setJoinAttendeeNameInputV1] =
    React.useState('');
  const [multiSelectPickerValue, setMultiSelectPickerValue] = React.useState(
    []
  );
  const [profilePhotoUpload, setProfilePhotoUpload] = React.useState('');
  const [ridingStyleInput, setRidingStyleInput] = React.useState([]);
  const [safetySelfie, setSafetySelfie] = React.useState('');
  const [skillLevelInput, setSkillLevelInput] = React.useState([]);
  const [startTimeInput, setStartTimeInput] = React.useState(11);
  const [userAgeInput, setUserAgeInput] = React.useState(0);
  const [userBikeInput, setUserBikeInput] = React.useState('');
  const [userBioInput, setUserBioInput] = React.useState('');
  const [userLocationInput, setUserLocationInput] = React.useState('');
  const [userLookingForInput, setUserLookingForInput] = React.useState('');
  const [userNameInput, setUserNameInput] = React.useState('');
  const base64ToBlob = (base64, mimeType) => {
    const byteCharacters = atob(base64); // Decode Base64 string
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  };

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
    console.log('In correct check for base64');
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

  const extractBase64Info = dataUrl => {
    const mimeType = dataUrl.match(
      /data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/
    )[1];
    const base64Data = dataUrl.split(',')[1]; // Split to get Base64 data
    return { mimeType, base64Data };
  };

  const photoUpload = async (userId, profilePhotoFile) => {
    const formData = new FormData();

    // Append the profile photo as a file
    formData.append('profile_photo', profilePhotoFile);

    try {
      // Log the final URL to verify it's correct
      const url = `https://x8ki-letl-twmt.n7.xano.io/api:ZNE4kd-w/user_photos/${userId}`;
      console.log('Uploading to:', url);

      // Send the request to Xano API
      const response = await fetch(url, {
        method: 'POST', // Ensure the correct method is used
        body: formData,
        headers: {
          Authorization: 'Bearer your-authorization-token', // Ensure your token is correct
        },
      });

      const result = await response.json();

      if (response.ok) {
        console.log('Profile photo uploaded successfully:', result);
        return result;
      } else {
        console.error('Failed to upload profile photo:', result);
      }
    } catch (error) {
      console.error('Error uploading profile photo:', error);
    }
  };

  const uploadPhotoToBucket = async (base64Data, genImageName) => {
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
  const supabaseUsersUpdateBackgroundPhotoPATCH =
    SupabaseUsersApi.useUpdateBackgroundPhotoPATCH();
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
      hasTopSafeArea={true}
      scrollable={true}
      style={StyleSheet.applyWidth(
        {
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
        <SupabaseUsersApi.FetchGetUserByUniqueUserIdGET
          handlers={{
            onData: fetchData => {
              try {
                setUserNameInput(fetchData?.[0]?.name);
                setUserAgeInput(fetchData?.[0]?.age);
                setUserLocationInput(fetchData?.[0]?.location);
                setUserLookingForInput(fetchData?.[0]?.looking_for);
                setRidingStyleInput(fetchData?.[0]?.riding_style);
                setSkillLevelInput(fetchData?.[0]?.skill_level);
                setUserBioInput(fetchData?.[0]?.bio);
                setUserBikeInput(fetchData?.[0]?.bike);
              } catch (err) {
                console.error(err);
              }
            },
          }}
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
              <View
                style={StyleSheet.applyWidth(
                  {
                    gap: 32,
                    height: '100%',
                    justifyContent: 'flex-start',
                    paddingLeft: 32,
                    paddingRight: 32,
                    paddingTop: 72,
                    width: '100%',
                  },
                  dimensions.width
                )}
              >
                {/* Background Photo View */}
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
                    {'Background Photo'}
                  </Text>
                  {/* Background Photo Touchable */}
                  <Touchable
                    onPress={() => {
                      const handler = async () => {
                        console.log(
                          'Background Photo Touchable ON_PRESS Start'
                        );
                        let error = null;
                        try {
                          console.log('Start ON_PRESS:0 OPEN_IMAGE_PICKER');
                          const bgPhotosUpload = await openImagePickerUtil({
                            mediaTypes: 'Images',
                            allowsEditing: false,
                            quality: 0.5,
                            allowsMultipleSelection: false,
                            outputBase64: true,
                          });
                          console.log('Complete ON_PRESS:0 OPEN_IMAGE_PICKER', {
                            bgPhotosUpload,
                          });
                          console.log('Start ON_PRESS:1 IF');
                          if (bgPhotosUpload) {
                            console.log(bgPhotosUpload, '<^ Uploaded photos');
                            setIsBackgroundPhotoUpload(true);
                            console.log('background phot is set to true');
                            setBackgroundPhotoUpload(bgPhotosUpload);
                          } else {
                            console.log('Upload Cancelled');
                          }
                          console.log('Complete ON_PRESS:1 IF');
                          console.log('Start ON_PRESS:2 CONSOLE_LOG');
                          console.log(
                            'End of upload action workflow',
                            backgroundPhotoUpload
                          );
                          console.log('Complete ON_PRESS:2 CONSOLE_LOG');
                        } catch (err) {
                          console.error(err);
                          error = err.message ?? err;
                        }
                        console.log(
                          'Background Photo Touchable ON_PRESS Complete',
                          error ? { error } : 'no error'
                        );
                      };
                      handler();
                    }}
                    style={StyleSheet.applyWidth(
                      { marginTop: 10 },
                      dimensions.width
                    )}
                  >
                    {/* Uploaded Selfie */}
                    <View
                      style={StyleSheet.applyWidth(
                        {
                          alignContent: 'center',
                          alignItems: 'center',
                          backgroundColor:
                            palettes['Trail Twin']['White - Trail Twin'],
                          borderBottomWidth: 1,
                          borderColor: Constants['dividerColor'],
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
                      {/* backgroundPhoto */}
                      <>
                        {!isBackgroundPhotoUpload ? null : (
                          <Image
                            resizeMode={'cover'}
                            {...GlobalStyles.ImageStyles(theme)['Image'].props}
                            source={imageSource(`${backgroundPhotoUpload}`)}
                            style={StyleSheet.applyWidth(
                              GlobalStyles.ImageStyles(theme)['Image'].style,
                              dimensions.width
                            )}
                          />
                        )}
                      </>
                      <>
                        {isBackgroundPhotoUpload ? null : (
                          <Text
                            accessible={true}
                            selectable={false}
                            {...GlobalStyles.TextStyles(theme)['Text'].props}
                            style={StyleSheet.applyWidth(
                              StyleSheet.compose(
                                GlobalStyles.TextStyles(theme)['Text'].style,
                                {
                                  color: palettes.Brand['Secondary Text'],
                                  fontFamily: 'Inter_300Light',
                                  marginBottom: 8,
                                  textAlign: 'center',
                                }
                              ),
                              dimensions.width
                            )}
                          >
                            {'Upload profile background photo'}
                          </Text>
                        )}
                      </>
                      <>
                        {isBackgroundPhotoUpload ? null : (
                          <Icon name={'AntDesign/camerao'} size={35} />
                        )}
                      </>
                    </View>
                  </Touchable>
                </View>
                {/* Confirm Button View */}
                <View
                  style={StyleSheet.applyWidth(
                    {
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: -3,
                    },
                    dimensions.width
                  )}
                >
                  {/* Upload Background Photo */}
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
                              const generatedImageName = generateImageName();
                              const convertedImageName =
                                convertImageNameToDbPath(
                                  generatedImageName,
                                  'profile_photos/background'
                                );
                              console.log(backgroundPhotoUpload);
                              const res =
                                await supabaseUsersUpdateBackgroundPhotoPATCH.mutateAsync(
                                  {
                                    backgroundPhoto: convertedImageName,
                                    user_id: Constants['user_id'],
                                  }
                                );
                              await uploadImageToBucket(
                                backgroundPhotoUpload,
                                generatedImageName,
                                'profile_photos/background'
                              );
                              await waitUtil({ milliseconds: 500 });
                              navigation.navigate('TermsOfServiceScreen');
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
                        title={'Confirm '}
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
              </View>
            );
          }}
        </SupabaseUsersApi.FetchGetUserByUniqueUserIdGET>
      </SimpleStyleKeyboardAwareScrollView>
    </ScreenContainer>
  );
};

export default withTheme(BackgroundPhotoUploadScreen);
