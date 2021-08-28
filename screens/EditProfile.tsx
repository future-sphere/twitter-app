import { useHookstate } from '@hookstate/core';
import React from 'react';
import { ActionSheetIOS, Pressable, StyleSheet } from 'react-native';
import { Image, View } from 'react-native';
import { Text } from 'react-native';
import { user } from '../state';

interface Props {}

const EditProfileScreen = (props: Props) => {
  const userState = useHookstate(user);

  const onAvatarPress = () =>
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancel', 'Take a Photo', 'From Photo Library'],
        cancelButtonIndex: 0,
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          // cancel action
        } else if (buttonIndex === 1) {
        } else if (buttonIndex === 2) {
        }
      },
    );

  return (
    <View style={style.container}>
      <Pressable onPress={onAvatarPress}>
        <Image style={style.avatar} source={{ uri: userState.value?.avatar }} />
      </Pressable>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 10,
  },
  avatar: {
    height: 160,
    width: 160,
    borderRadius: 80,
  },
});

export default EditProfileScreen;
