import { useHookstate } from '@hookstate/core';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/core';
import { RouteProp } from '@react-navigation/native';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { Image, Pressable } from 'react-native';
import { Button, Text, View, StyleSheet } from 'react-native';
import { addFriend } from '../services/friends';
import { getUserByUsername } from '../services/users';
import { token, user } from '../state';
import { Ionicons } from '@expo/vector-icons';

type ParamsList = { Profile: { username: string } };

interface Props {
  route: RouteProp<ParamsList, 'Profile'>;
}

export const defaultAvatar =
  'https://external-preview.redd.it/4PE-nlL_PdMD5PrFNLnjurHQ1QKPnCvg368LTDnfM-M.png?auto=webp&s=ff4c3fbc1cce1a1856cff36b5d2a40a6d02cc1c3';

const Profile = (props: Props) => {
  const navigation = useNavigation();
  const userState = useHookstate(user);
  const route = props.route;
  const username = route.params?.username;
  const [profileUser, setProfileUser] = useState(userState.value);
  const [addedFriend, setAddedFriend] = useState(
    userState.value?.friends.includes(profileUser?._id as string),
  );

  console.log(userState?.value);

  const isOwnProfile = username ? username === userState.value?.username : true;

  useEffect(() => {
    if (username) {
      fetchUserByProfile();
    }
  }, [username]);

  const fetchUserByProfile = () => {
    getUserByUsername(username).then((response) => {
      setProfileUser(response.data);
    });
  };

  const handleAddFriend = async () => {
    if (userState.value?._id && profileUser?._id) {
      const result = await addFriend(userState.value._id, profileUser._id);
      if (result.data.success) {
        fetchUserByProfile();
        setAddedFriend(true);
      }
    }
  };

  return (
    <View>
      <View style={styles.tab}>
        <View style={styles.profileInfo}>
          <Image
            style={styles.avatar}
            source={{ uri: profileUser?.avatar || defaultAvatar }}
          />
          <View>
            <Text style={styles.tabText}>{profileUser?.username}</Text>
            <Text style={styles.tabText}>
              {profileUser && profileUser.friends
                ? profileUser.friends.length
                : 0}{' '}
              Friends
            </Text>
          </View>
        </View>
        <View>
          {!isOwnProfile && !addedFriend ? (
            <Pressable onPress={handleAddFriend} style={styles.addFriendButton}>
              <Text style={styles.addFriendButtonText}>Add Friend</Text>
            </Pressable>
          ) : null}
          {addedFriend ? (
            <View style={styles.friendStatus}>
              <Text>Friended</Text>
              <Ionicons name='checkmark' color='green' size={20} />
            </View>
          ) : null}
        </View>
      </View>
      {isOwnProfile ? (
        <Button
          title='Logout'
          onPress={() => {
            token.set(null);
            user.set(null);
            AsyncStorage.removeItem('token');
          }}
        />
      ) : null}
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
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  friendStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addFriendButton: {
    backgroundColor: 'green',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  addFriendButtonText: {
    color: 'white',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#fff',
  },
  tabText: {
    fontSize: 18,
    textTransform: 'capitalize',
  },
});

export default Profile;
