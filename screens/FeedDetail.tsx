import { NavigationProp, RouteProp } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import PostService, {
  fetchPostById,
  handleLikePost,
  handleUnLikePost,
} from '../services/posts';
import globalStyles from '../styles/global';
import { Post } from './Home';
import { Ionicons } from '@expo/vector-icons';
import { useHookstate } from '@hookstate/core';
import { user } from '../state';
import moment from 'moment';

type ParamsList = { FeedDetail: { postId: string } };

interface Props {
  route: RouteProp<ParamsList, 'FeedDetail'>;
}

interface PostDetails extends Post {
  authorName: string;
  authorAvatar: string;
  likedBy: string[];
  comments: Comment[];
}

interface Comment {
  authorAvatar: string;
  authorName: string;
  text: string;
  createdAt: string;
  likedBy: string[];
  commentId: string;
}

const FeedDetailScreen = (props: Props) => {
  const route = props.route;
  const postId = route.params.postId;
  const userState = useHookstate(user);
  const [hasLiked, setHasLiked] = useState(false);
  const [post, setPost] = useState<PostDetails | null>(null);

  const fetchData = async () => {
    const response = await fetchPostById(postId);
    if (response.data) {
      setPost(response.data);
    }
  };

  useEffect(() => {
    if (
      userState.value?._id &&
      post &&
      post.likedBy &&
      post.likedBy.includes(userState.value._id)
    ) {
      setHasLiked(true);
    }
  }, [userState, post]);

  const handleLike = async () => {
    if (userState.value) {
      try {
        await handleLikePost(userState.value?._id, postId);
        setHasLiked(true);
      } catch (error) {
        console.log(error);
      }
    } else {
      Alert.alert('You need to log in to like this post.');
    }
  };

  const handleUnlike = async () => {
    if (userState.value) {
      try {
        await handleUnLikePost(userState.value?._id, postId);
        setHasLiked(false);
      } catch (error) {
        console.log(error);
      }
    } else {
      Alert.alert('You need to log in to unlike this post.');
    }
  };

  const handleLikeComment = async (commentId: string, commentIndex: number) => {
    if (userState.value) {
      try {
        const response = await PostService.handleLikeComment(
          userState.value?._id,
          postId,
          commentId
        );
        setHasLiked(false);
        const nextPost = { ...post };
        if (nextPost.comments) {
          nextPost.comments[commentIndex].likedBy.push(userState.value._id);
        }
        setPost(nextPost);

        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    } else {
      Alert.alert('You need to log in to unlike this post.');
    }
  };

  useEffect(() => {
    fetchData();
  }, [postId]);

  return (
    <View style={styles.container}>
      <View style={[globalStyles.contentContainer]}>
        <View style={styles.header}>
          <View style={styles.commentHeader}>
            <Image style={styles.avatar} source={{ uri: post?.authorAvatar }} />
            <Text style={styles.authorName}>{post?.authorName}</Text>
          </View>
          <Text style={styles.timestamp}>
            {moment(post?.createdAt).fromNow()}
          </Text>
        </View>
        <Text>{post?.title}</Text>
        <Pressable
          onPress={() => {
            if (hasLiked) {
              handleUnlike();
            } else {
              handleLike();
            }
          }}
          style={styles.likeContainer}
        >
          <Ionicons
            name={hasLiked ? 'heart-sharp' : 'heart-outline'}
            color={hasLiked ? 'red' : 'black'}
            size={15}
          />
          <Text
            style={[
              styles.likeText,
              {
                color: hasLiked ? 'red' : 'black',
              },
            ]}
          >
            Like
          </Text>
        </Pressable>
      </View>
      <View style={[globalStyles.contentContainer]}>
        <Text>Comments</Text>
        {userState.value
          ? post?.comments.map((v, i) => (
              <View style={styles.commentContainer} key={i}>
                <View style={styles.commentHeader}>
                  <View style={styles.commentAuthor}>
                    <Image
                      style={[styles.avatar, { marginRight: 10 }]}
                      source={{ uri: v.authorAvatar }}
                    />
                    <Text style={{ fontWeight: '600' }}>{v.authorName}</Text>
                  </View>
                  <Text style={styles.timestamp}>
                    Posted on {moment(v.createdAt).fromNow()}
                  </Text>
                </View>
                <Text key={i}>{v.text}</Text>
                <Pressable
                  onPress={() => handleLikeComment(v.commentId, i)}
                  style={styles.likeContainer}
                >
                  <Ionicons
                    name={
                      v.likedBy.includes(userState.value._id)
                        ? 'heart-sharp'
                        : 'heart-outline'
                    }
                    color={
                      v.likedBy.includes(userState.value._id) ? 'red' : 'black'
                    }
                    size={15}
                  />
                  <Text
                    style={[
                      styles.likeText,
                      {
                        color: v.likedBy.includes(userState.value._id)
                          ? 'red'
                          : 'black',
                      },
                    ]}
                  >
                    Like
                  </Text>
                </Pressable>
              </View>
            ))
          : null}
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
  timestamp: {
    fontSize: 10,
    color: '#666',
  },
  commentContainer: {
    marginVertical: 10,
    borderBottomColor: '#999',
    borderBottomWidth: 1,
    paddingBottom: 15,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  commentAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    height: 30,
    width: 30,
    borderRadius: 15,
  },
  likeContainer: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeText: {
    fontSize: 12,
    lineHeight: 18,
    marginLeft: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  authorName: {
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '600',
  },
});
