import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';
import {
  Button,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { fetchAllPosts } from '../services/posts';
import globalStyles from '../styles/global';

interface Props {}

export interface Post {
  title: string;
  author: string;
  _id: string;
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
          <Text style={styles.author}>Author: {value.author}</Text>
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
  author: {
    fontSize: 12,
  },
  body: {
    fontSize: 16,
    marginTop: 10,
  },
});

export default HomeScreen;
