import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert, StatusBar } from 'react-native';
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');  
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleLogin = () => {
    axios.post('http://192.168.1.102:8080/api/users/login', {
      email: email,
      password: password
    })
    .then(response => {
      if (response.status === 200) {
        Alert.alert("Login Successful", "Welcome, " + response.data.name + "!");
        navigation.replace("HomeNavigator", {userId: response.data.id});
        console.log(response.data.id);
      } else {
        Alert.alert("Login Failed", "Please check your credentials.");
      }
    })
    .catch(error => {
      // Handle errors
      if (error.response) {
        Alert.alert("Login Failed", error.response.data || "Please check your credentials.");
      } else if (error.request) {
        Alert.alert("Network Error", "No response from server");
      } else {
        Alert.alert("Error", "Login request could not be made: " + error.message);
      }
    });
  };
  

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <StatusBar barStyle='default'/>
            <View style={styles.card}>
                <Image
                    source={require('../assets/icon.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.header}>Sign in to continue</Text>
                <Text style={styles.subHeader}>
                    Don't have an account yet?
                    {' '}
                    <Text style={styles.link} onPress={() => navigation.navigate('Signup')}> Sign up</Text>
                </Text>
                <Text style={styles.orStyle}>Or</Text>
                <View style={styles.form}>
                  
                    <TextInput 
                        style={styles.input} 
                        placeholder="Email" 
                        keyboardType="email-address"
                        textContentType="emailAddress"
                        placeholderTextColor="#666" 
                        value={email}
                        onChangeText={setEmail}
                    />
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.input}
                        placeholder="Password"
                        secureTextEntry={!passwordVisible}
                        textContentType="password"
                        placeholderTextColor="#666"
                        autoCapitalize='none'
                        value={password}
                        onChangeText={setPassword}
                      />
                      <TouchableOpacity
                        style={styles.icon}
                        onPress={() => setPasswordVisible(!passwordVisible)}
                      >
                        <Ionicons name={passwordVisible ? "eye-off" : "eye"} size={24} color="#F7BB0D" />
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
                        <Text style={styles.signInButtonText}>Sign in</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  container: {
      flexGrow: 1,
      justifyContent: 'center',
      padding: 20,
      backgroundColor: '#f9f9f9',
  },
  card: {
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
  },
  logo: {
      width: 100,
      height: 100,
      alignSelf: 'center',
      marginTop: 20,
      marginBottom: 20,
  },
  header: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#333',
      textAlign: 'center',
  },
  subHeader: {
      marginTop: 10,
      fontSize: 14,
      color: '#666',
      textAlign: 'center',
  },
  link: {
      color: '#F7BB0D',
      fontWeight: 'bold',
  },
  orStyle: {
      alignSelf: 'center',
      color: '#aaa',
      marginTop: 20,
      marginBottom: 20,
  },
  form: {
      width: '100%',
  },
  
  input: {
      flex: 1,
      height: 50,
      borderWidth: 1,
      borderColor: '#ddd',
      padding: 10,
      borderRadius: 5,
      marginBottom: 10,
      fontSize: 16,
      
  },
  inputContainer: {
    flexDirection: 'row',
    borderColor: '#ccc',
    paddingBottom: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  signInButton: {
      padding: 10,
      backgroundColor: '#F7BB0D',
      borderRadius: 5,
  },
  signInButtonText: {
      color: 'white',
      textAlign: 'center',
      fontWeight: 'bold',
  },
  icon: {
    position: 'absolute',
    right: 10,
    paddingBottom: 10,
  }
});
