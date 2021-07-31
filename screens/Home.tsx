import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { fetchAllPosts } from '../services/posts';
import globalStyles from '../styles/global';
import moment from 'moment';
import { useHookstate } from '@hookstate/core';
import { user } from '../state';
import { Ionicons } from '@expo/vector-icons';
import { defaultAvatar } from './Profile';

interface Props {}

export interface User {
  email: string;
  phone: string;
  username: string;
  avatar: string;
  gender: number;
}

export interface Post {
  title: string;
  author: User;
  _id: string;
  createdAt: string;
}

const HomeScreen = (props: Props) => {
  const navigation = useNavigation();

  const [posts, setPosts] = useState<Post[]>([]);

  const [loading, setLoading] = useState(false);
  const userState = useHookstate(user);

  const fetchData = async () => {
    setLoading(true);
    const response = await fetchAllPosts();
    if (response.data) {
      setPosts(response.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={fetchData} />
      }
      style={styles.container}
    >
      {posts.map((value, index) => (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('FeedDetail', {
              postId: value._id,
            });
          }}
          style={[globalStyles.contentContainer]}
          key={index}
        >
          <View style={styles.headerContainer}>
            <View style={styles.authorContainer}>
              <Image
                style={styles.avatar}
                source={{ uri: value.author.avatar || defaultAvatar }}
              />
              <Text style={styles.author}>{value.author.username} </Text>
              <Text>
                {value.author.username === userState.value?.username && (
                  <Ionicons
                    name='flame-outline'
                    size={15}
                    color='#ff00ff'
                  ></Ionicons>
                )}
              </Text>
            </View>
            <View style={styles.timestampContainer}>
              <Text style={styles.timestamp}>
                {moment(value.createdAt).fromNow()}
              </Text>
            </View>
          </View>
          <Text style={styles.body}>{value.title}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 5,
  },
  timestampContainer: {},
  timestamp: {
    fontSize: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  author: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  authorContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  body: {
    fontSize: 16,
    marginTop: 10,
  },
  avatar: {
    height: 20,
    width: 20,
    borderRadius: 15,
  },
});

export default HomeScreen;
