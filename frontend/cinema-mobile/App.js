import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { StripeProvider } from '@stripe/stripe-react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import SearchScreen from "./screens/SearchScreen";
import TicketsScreen from "./screens/TicketsScreen";
import ProfilScreen from "./screens/ProfilScreen";
import MovieScreen from "./screens/MovieScreen";
import BookScreen from "./screens/BookScreen";
import PaymentScreen from "./screens/PaymentScreen";

const publishableKey = "pk_test_51P6JdE09YXY9riuTtwoel6ypg4GYkBee1CpkdmAt4ADvjDdSoNy7xTw6B5mth84BBYVFt0opwN5L3Rxrxp8EI1Ub00565bikyU";
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack({route}) {
  const { userId } = route.params;
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeMain" component={HomeScreen} options={{ headerShown: false }} initialParams={{userId: userId }}/>
      <Stack.Screen name="MovieDetails" component={MovieScreen} options={{
        headerStyle: { backgroundColor: '#18171C' },
        headerTintColor: '#F7BB0D',
        headerTitle: "Movie Description",
        headerTitleAlign: 'center',
      }} />
      <Stack.Screen name="BookingTickets" component={BookScreen} options={{
        headerStyle: { backgroundColor: '#18171C' },
        headerTintColor: '#F7BB0D',
        headerTitle: "Movie Tickets",
        headerTitleAlign: 'center',
      }} 
      initialParams={{userId: userId }}
      />
      <Stack.Screen name="PaymentInfo" component={PaymentScreen} options={{
        headerStyle: { backgroundColor: '#18171C' },
        headerTintColor: '#F7BB0D',
        headerTitle: "Payment Information",
        headerTitleAlign: 'center',
      }} 
      initialParams={{userId: userId }}
      />
    </Stack.Navigator>
  );
}

function SearchStack({route}) {
  const { userId } = route.params;
  return (
    <Stack.Navigator>
      <Stack.Screen name="SearchMain" component={SearchScreen} options={{ headerShown: false }} initialParams={{userId: userId }}/>
      <Stack.Screen name="MovieSearchDetails" component={MovieScreen} options={{
        headerStyle: { backgroundColor: '#18171C' },
        headerTintColor: '#F7BB0D',
        headerTitle: "Movie Description",
        headerTitleAlign: 'center',
      }} />
      <Stack.Screen name="BookingTickets" component={BookScreen} options={{
        headerStyle: { backgroundColor: '#18171C' },
        headerTintColor: '#F7BB0D',
        headerTitle: "Movie Tickets",
        headerTitleAlign: 'center',
      }} 
      initialParams={{userId: userId }}
      />
      <Stack.Screen name="PaymentInfo" component={PaymentScreen} options={{
        headerStyle: { backgroundColor: '#18171C' },
        headerTintColor: '#F7BB0D',
        headerTitle: "Payment Information",
        headerTitleAlign: 'center',
      }} 
      initialParams={{userId: userId }}
      />
      
      
    </Stack.Navigator>
  );
}

function HomeTabNavigator({route}) {
  const { userId } = route.params;
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Search") {
            iconName = focused ? "search" : "search-outline";
          } else if (route.name === "Tickets") {
            iconName = focused ? "ticket" : "ticket-outline";
          } else if (route.name === "Profil") {
            iconName = focused ? "person" : "person-outline";
          }
          return <Ionicons name={iconName} size={26} color={color} />;
        },
        tabBarActiveTintColor: "#F7BB0D",
        tabBarInactiveTintColor: "gray",
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#18171C',
          borderTopWidth: 0.5,
          borderTopColor: '#404040',  // subtle color difference for the border
          elevation: 0,
          shadowOpacity: 0,  // Removing shadow on Android
          height: 50  // Standard height for better usability
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} options={{ headerShown: false }} initialParams={{userId: userId }}/>
      <Tab.Screen name="Search" component={SearchStack} options={{ headerShown: false }} initialParams={{userId: userId }}/>
      <Tab.Screen name="Tickets" component={TicketsScreen} options={{ headerShown: false }} initialParams={{userId: userId }}/>
      <Tab.Screen name="Profil" component={ProfilScreen} options={{
        headerStyle: { backgroundColor: '#18171C' },
        headerTintColor: '#F7BB0D',
        headerTitle: "Profil Informations",
        headerTitleAlign: 'center',
      }} 
      initialParams={{userId: userId }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <StripeProvider publishableKey={publishableKey}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
          <Stack.Screen name="HomeNavigator" component={HomeTabNavigator} options={{ headerShown: false, gestureEnabled: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </StripeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "gray",
    alignItems: "center",
    justifyContent: "center",
  },
});
