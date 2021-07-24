import { useHookstate } from '@hookstate/core';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import PostService from '../services/posts';
import { user } from '../state';

interface Props {}

const NewPost = (props: Props) => {
  const [input, setInput] = useState('');
  const userState = useHookstate(user);
  const navigation = useNavigation();

  const handleCreatePost = async () => {
    if (input && userState.value) {
      PostService.createPost(userState.value._id, input).then((response) => {
        setInput('');
        navigation.navigate('Home');
      });
    } else {
      Alert.alert('You cannot post an empty post!');
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <TextInput
          onChangeText={setInput}
          value={input}
          style={styles.input}
          placeholder='Input some text here'
        />
        <Pressable onPress={handleCreatePost} style={styles.button}>
          <Text style={styles.buttonText}>Submit Post</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default NewPost;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  box: {
    backgroundColor: 'white',
    borderRadius: 4,
    padding: 10,
  },
  input: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#999',
    borderStyle: 'solid',
    backgroundColor: 'white',
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    marginBottom: 10,
  },
  button: {
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
});
