import { NavigationProp, RouteProp } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
import { useNavigation } from '@react-navigation/native';
import { defaultAvatar } from './Profile';

type ParamsList = { FeedDetail: { postId: string } };

interface Props {
  route: RouteProp<ParamsList, 'FeedDetail'>;
}

interface PostDetails extends Post {
  authorName: string;
  authorAvatar: string;
}

export interface Comment {
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
  const [input, setInput] = useState('');

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
          userState.value._id,
          postId,
          commentId,
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
    }
  };

  useEffect(() => {
    fetchData();
  }, [postId]);

  const handlePostComment = async () => {
    if (input && userState.value && post) {
      PostService.postComment(userState.value?._id, input, post._id).then(
        (response) => {
          const newPost = response.data;
          setPost(newPost);
          setInput('');
        },
      );
    } else {
      Alert.alert('You cannot post an empty comment!');
    }
  };

  const navigation = useNavigation();

  const handleDelete = async () => {
    const confirm = Alert.alert(
      'Delete Post',
      'Are you sure you want to delete?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const response = await PostService.handleDeletePost(postId);
            if (response.data) {
              navigation.navigate('Home');
            }
          },
        },
      ],
    );
  };

  const handleDeleteComment = async (commentId: string) => {
    const confirm = Alert.alert(
      'Delete Comment',
      'Are you sure you want to delete?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const response = await PostService.handleDeleteComment(
              commentId,
              postId,
            );
            if (response.data) {
              fetchData();
            }
          },
        },
      ],
    );
  };

  const redirectToUserProfile = (userName?: string) => {
    if (userName) {
      // navigation.navigate('Profile', {
      //   screen: 'Profile',
      //   params: {
      //     username: userName,
      //   },
      // });
      navigation.navigate('Profile', {
        username: userName,
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={[globalStyles.contentContainer]}>
        <View style={styles.header}>
          <Pressable
            onPress={() => redirectToUserProfile(post?.authorName)}
            style={styles.commentHeader}
          >
            <Image
              style={styles.avatar}
              source={{ uri: post?.authorAvatar || defaultAvatar }}
            />
            <Text style={styles.authorName}>{post?.authorName}</Text>
          </Pressable>
          <Text style={styles.timestamp}>
            {moment(post?.createdAt).fromNow()}
          </Text>
        </View>
        <Text>{post?.title}</Text>
        <View style={styles.actionContainer}>
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
          {post?.authorName === user.value?.username ? (
            <Pressable onPress={handleDelete} style={styles.deleteButton}>
              <Ionicons style={styles.deleteIcon} size={15} name='trash' />
              <Text style={styles.likeText}>Delete</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
      <View style={[globalStyles.contentContainer]}>
        <Text>Comments</Text>
        {post?.comments.map((v, i) => (
          <View
            style={[
              styles.commentContainer,
              {
                borderBottomWidth: i === post.comments.length - 1 ? 0 : 1,
              },
            ]}
            key={i}
          >
            <View style={styles.commentHeader}>
              <Pressable
                onPress={() => redirectToUserProfile(v.authorName)}
                style={styles.commentAuthor}
              >
                <Image
                  style={[styles.avatar, { marginRight: 10 }]}
                  source={{ uri: v.authorAvatar || defaultAvatar }}
                />
                <Text style={{ fontWeight: '600' }}>{v.authorName}</Text>
              </Pressable>
              <Text style={styles.timestamp}>
                Posted on {moment(v.createdAt).fromNow()}
              </Text>
            </View>
            <Text key={i}>{v.text}</Text>
            <View style={styles.actionContainer}>
              <Pressable
                onPress={() => handleLikeComment(v.commentId, i)}
                style={styles.likeContainer}
              >
                <Ionicons
                  name={
                    userState.value && v.likedBy.includes(userState.value._id)
                      ? 'heart-sharp'
                      : 'heart-outline'
                  }
                  color={
                    userState.value && v.likedBy.includes(userState.value._id)
                      ? 'red'
                      : 'black'
                  }
                  size={15}
                />
                <Text
                  style={[
                    styles.likeText,
                    {
                      color:
                        userState.value &&
                        v.likedBy.includes(userState.value._id)
                          ? 'red'
                          : 'black',
                    },
                  ]}
                >
                  Like
                </Text>
              </Pressable>
              {v.authorName === user.value?.username ? (
                <Pressable
                  onPress={() => handleDeleteComment(v.commentId)}
                  style={styles.deleteButton}
                >
                  <Ionicons style={styles.deleteIcon} size={15} name='trash' />
                  <Text style={styles.likeText}>Delete</Text>
                </Pressable>
              ) : null}
            </View>
          </View>
        ))}
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          onChangeText={setInput}
          value={input}
          style={styles.input}
          placeholder='Input your comment here'
        />
        <Pressable style={styles.button} onPress={handlePostComment}>
          <Text style={styles.buttonText}>Post Comment</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default FeedDetailScreen;

const styles = StyleSheet.create({
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  deleteButton: { flexDirection: 'row', alignItems: 'center' },
  deleteIcon: { marginRight: 2 },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  input: {
    width: '70%',
    padding: 8,
    borderWidth: 1,
    borderColor: '#999',
    borderStyle: 'solid',
    backgroundColor: 'white',
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    borderRightWidth: 0,
  },
  button: {
    width: '30%',
    padding: 8,
    backgroundColor: 'green',
    textAlign: 'center',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
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
