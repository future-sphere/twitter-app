import { useNavigation } from '@react-navigation/core';
import { AxiosError } from 'axios';
import React, { useState } from 'react';
import { Alert } from 'react-native';
import { Text, View, StyleSheet, TextInput, Pressable } from 'react-native';
import { getUserByToken, loginUser } from '../services/users';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { token, user } from '../state';
import { useEffect } from 'react';

interface Props {}

// create a state to record both username and password input
// handle those input in a function like handleInputChange
// attach that function to both TextInput component
// leave the handleSubmit empty for now, when you're done, fill out the survey

const LoginScreen = (props: Props) => {
  const navigation = useNavigation();
  const handleSubmit = () => {
    console.log('Logging in', form);
    if (form.password && form.username) {
      const username = form.username.toLowerCase();
      loginUser({ username, password: form.password })
        .then((response) => afterLogin(response.data))
        .catch((error: AxiosError) => {
          Alert.alert(
            'There was an error during register:',
            error.response?.data
          );
        });
    } else {
      Alert.alert('Please enter both username and password before continue');
    }
  };

  // data is actually just token
  const afterLogin = async (data: string) => {
    await AsyncStorage.setItem('token', data);
    const response = await getUserByToken(data);
    user.set(response.data);
    token.set(data);
  };

  useEffect(() => {
    AsyncStorage.getItem('token').then((response) => {
      if (response) {
        afterLogin(response);
      }
    });
  }, []);

  const [form, setForm] = useState<{ username?: string; password?: string }>(
    {}
  );
  const handleInputChange = (key: string, value: string) => {
    const nextForm: { [key: string]: string } = { ...form };
    nextForm[key] = value;
    setForm(nextForm);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Twitter Login</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Username:</Text>
        <TextInput
          onTextInput={(e) => {
            handleInputChange(
              'username',
              e.nativeEvent.previousText + e.nativeEvent.text
            );
          }}
          style={styles.input}
          placeholder='Enter your username'
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password:</Text>
        <TextInput
          onTextInput={(e) => {
            handleInputChange(
              'password',
              e.nativeEvent.previousText + e.nativeEvent.text
            );
          }}
          style={styles.input}
          placeholder='Enter your password'
        />
      </View>
      <Pressable
        onPress={() => navigation.navigate('Signup')}
        style={styles.link}
      >
        <Text>Don't have an account?</Text>
      </Pressable>
      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
  },
  header: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '900',
  },
  input: {
    borderColor: '#999',
    borderWidth: 1,
    borderRadius: 8,
    width: '100%',
    height: 40,
    padding: 12,
    marginTop: 5,
    fontSize: 18,
  },
  label: {
    fontSize: 22,
    textAlign: 'left',
    marginBottom: 5,
  },
  inputContainer: {
    marginVertical: 20,
    width: '100%',
  },
  buttonContainer: {
    alignItems: 'center',
    width: '100%',
  },
  button: {
    textAlign: 'center',
    width: 150,
    backgroundColor: 'cornflowerblue',
    paddingVertical: 12,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  link: {
    marginTop: 10,
    marginBottom: 20,
  },
});

export default LoginScreen;
