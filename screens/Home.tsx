import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';
import {
  Button,
  Image,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { fetchAllPosts } from '../services/posts';
import globalStyles from '../styles/global';
import moment from 'moment';

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

  const fetchData = async () => {
    const response = await fetchAllPosts();
    if (response.data) {
      setPosts(response.data);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
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
                source={{ uri: value.author.avatar }}
              />
              <Text style={styles.author}>{value.author.username}</Text>
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
    </View>
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
