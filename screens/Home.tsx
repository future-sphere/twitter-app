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
import { defaultAvatar } from './Profile';
import { Comment } from './FeedDetail';
import FeedBlock from '../components/FeedBlock';

interface Props {}

export interface User {
  email: string;
  phone: string;
  username: string;
  avatar: string;
  gender: number;
  _id: string;
  friends: string[];
}

export interface Post {
  title: string;
  author: User;
  _id: string;
  createdAt: string;
  likedBy: string[];
  comments: Comment[];
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

  const handlePostNavigate = (id: string) => {
    navigation.navigate('FeedDetail', {
      postId: id,
    });
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={fetchData} />
      }
      style={styles.container}
    >
      {posts.map((value, index) => (
        <FeedBlock
          data={value}
          index={index}
          key={index}
          handlePostNavigate={handlePostNavigate}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 5,
  },
});

export default HomeScreen;
