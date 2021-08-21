import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { getUserByUsername, getUsersByIdList } from '../services/users';
import { User } from './Home';
import { defaultAvatar } from './Profile';
import { Ionicons } from '@expo/vector-icons';
import { removeFriend } from '../services/friends';

interface Props {}

const Friends = (props: Props) => {
  const [friends, setFriends] = useState<User[]>([]);
  const [user, setUser] = useState<User | null>(null);

  const fetchFriends = async () => {
    if (user) {
      const friendsIdList = user.friends;
      getUsersByIdList(friendsIdList).then((response) => {
        setFriends(response.data);
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchFriends();
    }
  }, [user]);

  useEffect(() => {
    AsyncStorage.getItem('user').then((user) => {
      if (user) {
        console.log('i am here with user');
        const deserializedUser = JSON.parse(user);
        setUser(deserializedUser);
      }
    });
  }, []);

  const handleRemoveFriend = (friendId: string) => {
    const confirm = Alert.alert(
      'Delete Friend',
      'Are you sure you want to delete?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            if (user?._id) {
              removeFriend(user._id, friendId).then((response) => {
                if (response.data.success) {
                  fetchFriends();
                }
              });
            }
          },
        },
      ],
    );
  };

  return (
    <ScrollView style={styles.container}>
      {friends.map((v, i) => (
        <View style={styles.friendPill} key={i}>
          <View style={styles.infoContainer}>
            <Image
              source={{ uri: v.avatar || defaultAvatar }}
              style={styles.avatar}
            />
            <Text style={styles.username}>{v.username}</Text>
          </View>
          <Pressable onPress={() => handleRemoveFriend(v._id)}>
            <Ionicons name='close-circle' color='red' size={28} />
          </Pressable>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 6,
    paddingHorizontal: 10,
  },
  friendPill: {
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatar: {
    height: 30,
    width: 30,
    borderRadius: 15,
  },
  username: {
    fontSize: 18,
    marginLeft: 10,
    textTransform: 'capitalize',
    fontWeight: '600',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
});

export default Friends;
