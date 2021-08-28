import { useHookstate } from '@hookstate/core';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Post } from '../../screens/Home';
import { defaultAvatar } from '../../screens/Profile';
import { user } from '../../state';
import globalStyles from '../../styles/global';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';

interface Props {
  data: Post;
  index: number;
  handlePostNavigate: (id: string) => void;
}

const FeedBlock: React.FC<Props> = ({ data, index, handlePostNavigate }) => {
  const userState = useHookstate(user);

  return (
    <TouchableOpacity
      onPress={() => handlePostNavigate(data._id)}
      style={[globalStyles.contentContainer]}
      key={index}
    >
      <View style={styles.headerContainer}>
        <View style={styles.authorContainer}>
          <Image
            style={styles.avatar}
            source={{
              uri: data.author ? data.author.avatar : defaultAvatar,
            }}
          />
          <Text style={styles.author}>
            {data.author ? data.author.username : 'Guest'}
          </Text>
          <Text>
            {data.author.username === userState.value?.username && (
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
            {moment(data.createdAt).fromNow()}
          </Text>
        </View>
      </View>
      <Text style={styles.body}>{data.title}</Text>
      <View style={styles.reactionContainer}>
        <Text style={styles.reaction}>
          {data.likedBy.length} {data.likedBy.length > 1 ? 'Likes' : 'Like'}
        </Text>
        <Text style={styles.reaction}>
          {data.comments ? data.comments.length : 0}{' '}
          {data.comments
            ? data.comments.length > 1
              ? 'Comments'
              : 'Comment'
            : 'Comment'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
  reactionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  reaction: {
    marginLeft: 10,
    fontSize: 10,
    fontWeight: '600',
  },
  timestampContainer: {},
  timestamp: {
    fontSize: 10,
  },
});

export default FeedBlock;
