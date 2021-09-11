import { useHookstate } from '@hookstate/core';
import { Camera } from 'expo-camera';
import React, { useState } from 'react';
import {
  ActionSheetIOS,
  Button,
  Dimensions,
  Pressable,
  StyleSheet,
  TextInput,
} from 'react-native';
import { Image, View } from 'react-native';
import { Text } from 'react-native';
import { user } from '../state';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import { Picker } from '@react-native-picker/picker';
import { ScrollView } from 'react-native-gesture-handler';

interface Props {}

const EditProfileScreen = (props: Props) => {
  const userState = useHookstate(user);
  const [usernameInput, setUsernameInput] = useState(userState.value?.username);
  const [bio, setBio] = useState(userState.value?.bio);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<
    boolean | null
  >(null);
  const [hasAlbumPermission, setHasAlbumPermission] = useState<boolean | null>(
    null,
  );

  const [date, setDate] = useState(userState.value?.dob || new Date());
  const [show, setShow] = useState(false);

  const [gender, setGender] = useState(null);
  const [showGender, setShowGender] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(true);
    setDate(currentDate);
  };

  const handleShowPicker = () => {
    setShow(true);
  };

  const getCameraPermission = async () => {
    const { status } = await Camera.requestPermissionsAsync();
    if (status === 'granted') {
      setHasCameraPermission(true);
    }
  };
  const getAlbumPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status === 'granted') {
      setHasAlbumPermission(true);
    }
  };

  const pickImage = async () => {
    const result: ImagePicker.ImagePickerResult =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 3],
        quality: 1,
      });

    if (!result.cancelled) {
      setAvatarPreview(result.uri);
      console.log(result);
    }
  };

  const onAvatarPress = () =>
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancel', 'Take a Photo', 'From Photo Library'],
        cancelButtonIndex: 0,
      },
      async (buttonIndex: number) => {
        if (buttonIndex === 0) {
          // cancel action
        } else if (buttonIndex === 1) {
          if (!hasCameraPermission) {
            await getCameraPermission();
          } else {
            // Take the picture
          }
        } else if (buttonIndex === 2) {
          if (!hasAlbumPermission) {
            await getAlbumPermission();
          }

          await pickImage();
        }
      },
    );

  const isUsernameChanged = usernameInput !== userState.value?.username;

  const handleUserProfileSave = () => {};

  return (
    <ScrollView style={style.container} contentContainerStyle={{ flexGrow: 1 }}>
      <View style={style.avatarContainer}>
        <Pressable onPress={onAvatarPress}>
          <Image
            style={style.avatar}
            source={{ uri: avatarPreview || userState.value?.avatar }}
          />
        </Pressable>
      </View>
      <View style={style.profileInfoContainer}>
        <Text style={style.label}>Username:</Text>
        <TextInput
          onChangeText={setUsernameInput}
          value={usernameInput}
          style={style.input}
        />
      </View>
      <View style={style.profileInfoContainer}>
        <Text style={style.label}>Bio:</Text>
        <TextInput onChangeText={setBio} value={bio} style={style.input} />
      </View>
      <View style={style.profileInfoContainer}>
        <Text style={style.label}>Date of birth:</Text>
        <Pressable onPress={() => setShow(true)}>
          <Text style={style.inputText}>
            {dayjs(date).format('MMMM DD, YYYY')}
          </Text>
        </Pressable>
      </View>
      <View style={style.profileInfoContainer}>
        <Text style={style.label}>Gender:</Text>

        <Pressable onPress={() => setShowGender(true)}>
          <Text style={style.inputText}>
            {gender === 0 ? 'Female' : 'Male'}
          </Text>
        </Pressable>
        {showGender && (
          <Picker
            selectedValue={gender}
            onValueChange={(itemValue, itemIndex) => {
              setGender(itemValue);
              setShowGender(false);
            }}
          >
            <Picker.Item label='Male' value={1} />
            <Picker.Item label='Female' value={0} />
          </Picker>
        )}
      </View>

      {show && (
        <>
          <DateTimePicker
            testID='dateTimePicker'
            value={date}
            mode='date'
            is24Hour={true}
            display='spinner'
            onChange={onChange}
          />
          <Button onPress={() => setShow(false)} title='Select' />
        </>
      )}
      <Pressable
        onPress={handleUserProfileSave}
        disabled={!isUsernameChanged}
        style={[
          style.button,
          isUsernameChanged ? {} : { backgroundColor: '#999' },
        ]}
      >
        <Text style={style.buttonText}>Save Profile Info</Text>
      </Pressable>
    </ScrollView>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  avatarContainer: {
    alignItems: 'center',
    paddingTop: 10,
  },
  avatar: {
    height: 160,
    width: 160,
    borderRadius: 80,
  },
  profileInfoContainer: {
    marginTop: 10,
  },
  label: {
    marginBottom: 5,
    marginLeft: 10,
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
  },
  inputText: { backgroundColor: '#fff', padding: 10 },
  button: {
    backgroundColor: 'green',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 4,
    width: Dimensions.get('screen').width - 20,
    alignSelf: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
  },
  buttonText: {
    color: 'white',
  },
});

export default EditProfileScreen;
