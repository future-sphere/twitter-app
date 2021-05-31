import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { Button, Text, View } from 'react-native';

interface Props {}

const Profile = (props: Props) => {
  const navigation = useNavigation();
  return (
    <View>
      <Text>This is Profile</Text>
      <Button
        title='Go to Home'
        onPress={() => {
          navigation.navigate('Home');
        }}
      />
    </View>
  );
};

export default Profile;
