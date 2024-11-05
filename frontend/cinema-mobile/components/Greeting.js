import React from 'react';
import { Text, StyleSheet, View } from 'react-native';

const Greeting = () => {
  const hour = new Date().getHours();
  let greeting;

  if (hour < 12) {
    greeting = 'Good Morning,';
  } else if (hour < 18) {
    greeting = 'Good Afternoon,';
  } else {
    greeting = 'Good Evening,';
  }

  return (
    <View style={styles.container}>
        <Text style={styles.greeting}>{greeting}</Text>
        <Text style={styles.invite}>Book your favorite movie here...</Text>
    </View>);
};

export default Greeting;
const styles = StyleSheet.create({
  container:{
    marginBottom: 30,
  },
    greeting: {
      color: "#F7BB0D",
      fontSize: 30,
      fontWeight: 'bold',
    },
    invite: {
      color: 'white',
      fontSize: 16,
      fontWeight: "300",
    }
})