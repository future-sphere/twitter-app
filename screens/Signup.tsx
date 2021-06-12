import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { Text, View, StyleSheet, TextInput, Pressable } from 'react-native';

interface Props {}

const SignupScreen = (props: Props) => {
  const navigation = useNavigation();
  const handleSubmit = () => {
    console.log('Signing up');
  };
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Twitter Signup</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Username:</Text>
        <TextInput style={styles.input} placeholder='Enter your username' />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password:</Text>
        <TextInput style={styles.input} placeholder='Enter your password' />
      </View>
      <Pressable
        onPress={() => navigation.navigate('Login')}
        style={styles.link}
      >
        <Text>Already have an account?</Text>
      </Pressable>
      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Sign up</Text>
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

export default SignupScreen;
