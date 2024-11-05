import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';

const ProfilScreen = ({route}) => {
  const { userId } = route.params;
  console.log(userId);
  const [user, setUser] = useState(null);

  const navigation = useNavigation();


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://192.168.1.102:8080/api/users/${userId}`);
        const userData = await response.json();
        if (response.ok) {
          setUser(userData);
        } else {
          throw new Error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchUser();
  }, []);

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <View style={styles.userInfoCard}>
            <Ionicons name={'person-circle'} size={120} color={'#FFFFFF'} />
            <Text style={styles.nameText}>{user.name}</Text>
            <View style={styles.emailContainer}>
              <Ionicons name={'mail'} size={24} color={'#F7BB0D'} />
              <Text style={styles.emailText}>{user.email}</Text>
            </View>
            <View style={styles.emailContainer}>
              <Ionicons name={'call'} size={24} color={'#F7BB0D'} />
              <Text style={styles.emailText}>{user.phone}</Text>
            </View>
            
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.replace('Login')}>
            <Ionicons name={'log-out-outline'} size={24} color={'#FF6347'} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </>
      ) : (
        <ActivityIndicator size="large" color="#F7BB0D" />
      )}
      
    </View>
  );
};

export default ProfilScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: "#18171C",
  },
  userInfoCard: {
    backgroundColor: '#252529',
    borderRadius: 20,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
    alignItems: 'center',
    marginBottom: 50,
  },
  nameText: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#FFFFFF',
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  emailText: {
    marginLeft: 10,
    fontSize: 18,
    color: '#BBBBBB',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    backgroundColor: '#333333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  logoutText: {
    marginLeft: 10,
    fontSize: 18,
    color: '#FF6347',
  },
});
