import { useState } from '@hookstate/core';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { Image } from 'react-native';
import { Button, Text, View, StyleSheet } from 'react-native';
import { token, user } from '../state';

interface Props {}

export const defaultAvatar =
  'https://external-preview.redd.it/4PE-nlL_PdMD5PrFNLnjurHQ1QKPnCvg368LTDnfM-M.png?auto=webp&s=ff4c3fbc1cce1a1856cff36b5d2a40a6d02cc1c3';

const Profile = (props: Props) => {
  const navigation = useNavigation();
  const userState = useState(user);
  return (
    <View>
      <View style={styles.tab}>
        <Image
          style={styles.avatar}
          source={{ uri: userState.value?.avatar || defaultAvatar }}
        />
        <View>
          <Text style={styles.tabText}>{userState.value?.username}</Text>
          <Text style={styles.tabText}>
            {userState.value?.friends.length} Friends
          </Text>
        </View>
      </View>
      <Button
        title='Logout'
        onPress={() => {
          token.set(null);
          user.set(null);
          AsyncStorage.removeItem('token');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    height: 100,
    width: 100,
    marginRight: 20,
    borderRadius: 75,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
  },
  tabText: {
    fontSize: 18,
    textTransform: 'capitalize',
  },
});

export default Profile;
