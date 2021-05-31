import { NavigationProp, RouteProp } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';
import { Button, Image, StyleSheet, Text, View } from 'react-native';
import { fetchPostById } from '../services/posts';
import globalStyles from '../styles/global';
import { Post } from './Home';

type ParamsList = { FeedDetail: { postId: string } };

interface Props {
  route: RouteProp<ParamsList, 'FeedDetail'>;
}

interface PostDetails extends Post {
  authorName: string;
  authorAvatar: string;
}

const FeedDetailScreen = (props: Props) => {
  const route = props.route;
  const postId = route.params.postId;

  const [post, setPost] = useState<PostDetails | null>(null);

  const fetchData = async () => {
    const response = await fetchPostById(postId);
    if (response.data) {
      setPost(response.data);
    }
  };

  useEffect(() => {
    fetchData();
  }, [postId]);

  return (
    <View style={styles.container}>
      <View style={[globalStyles.contentContainer]}>
        <View style={styles.header}>
          <Image style={styles.avatar} source={{ uri: post?.authorAvatar }} />
          <Text style={styles.authorName}>{post?.authorName}</Text>
        </View>
        <Text>{post?.title}</Text>
      </View>
      <View style={[globalStyles.contentContainer]}>
        <Text>Comments</Text>
      </View>
    </View>
  );
};

export default FeedDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 5,
  },
  avatar: {
    height: 30,
    width: 30,
    borderRadius: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  authorName: {
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '600',
  },
});
