import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Pressable
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from "@expo/vector-icons";

// Generate the next 7 days for booking
const days = [];
const today = new Date();
const dayOfMonth = today.getDate();
for (let i = 0; i < 7; i++) {
  const nextDay = new Date(today);
  nextDay.setDate(dayOfMonth + i);
  days.push({
    date: nextDay.getDate(),
    dayOfWeek: nextDay.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
  });
}

const benefits = [
  { id: 'benefit1', text: 'Limited number of people', icon: 'people' },
  { id: 'benefit2', text: '4K Ultra HD screens', icon: 'tv' },
  { id: 'benefit3', text: 'Dolby Atmos sound', icon: 'volume-high' },
];


const BookScreen = ({ route }) => {
  const { id, cover, userId } = route.params;
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [selectedTimeIndex, setSelectedTimeIndex] = useState(0);
  const [selectedSeatType, setSelectedSeatType] = useState('Standard');
  const [ticketCount, setTicketCount] = useState(1);


  const navigation = useNavigation();


  const handleTicketCountChange = (newCount) => {
    if (newCount >= 1 && newCount <= 10) { // Assuming the max number of tickets per purchase is 10
      setTicketCount(newCount);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Date and Time */}
      <View style={styles.dateTime}>
        <Text style={styles.header}>Choose Date and Time</Text>
      </View>

      <View style={styles.datePickerContainer}>
        {days.map((day, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dateButton,
              selectedDateIndex === index && styles.selectedButton,
            ]}
            onPress={() => setSelectedDateIndex(index)}
          >
            <View style={styles.dayText}>
              <Text style={[styles.dateText, selectedDateIndex === index && styles.selectedText]}>{day.dayOfWeek}</Text>
            </View>
            <View>
              <Text style={[styles.dateText, selectedDateIndex === index && styles.selectedText]}>{day.date}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.timePickerContainer}>
        {['11:30', '14:30', '17:30'].map((time, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.timePickerButton,
              selectedTimeIndex === index && styles.selectedButton,
            ]}
            onPress={() => setSelectedTimeIndex(index)}
          >
            <Text style={[styles.timeText, selectedTimeIndex === index && styles.selectedText]}>{time}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Seat Type */}
      <View style={styles.dateTime}>
        <Text style={styles.header}>Choose Seat Type</Text>
      </View>

      <View style={styles.timePickerContainer}>
        {['Standard', 'VIP', 'Orchestre'].map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.timePickerButton,
              selectedSeatType === type && styles.selectedButton,
            ]}
            onPress={() => setSelectedSeatType(type)}
          >
            <Text style={[styles.seatTypeText, selectedSeatType === type && styles.selectedText,]}>{type}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.ticketCounterContainer}>
        <Text style={styles.header}>Choose Ticket Number</Text>
        <View style={styles.ticketStepperContainer}>
          <TouchableOpacity
            style={styles.stepperButton}
            onPress={() => handleTicketCountChange(ticketCount - 1)}
            disabled={ticketCount <= 1}
          >
            <Text style={styles.stepperButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.ticketCountText}>{ticketCount}</Text>
          <TouchableOpacity
            style={styles.stepperButton}
            onPress={() => handleTicketCountChange(ticketCount + 1)}
            disabled={ticketCount >= 10}
          >
            <Text style={styles.stepperButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.benefitsContainer}>
        <Text style={styles.header}>Available in halls</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.benefitsScrollView}
          contentContainerStyle={styles.benefitsContentContainer}
        >
          {benefits.map((benefit) => (
            <View key={benefit.id} style={styles.benefitItem}>
              <Ionicons name={benefit.icon} size={24} color="#F7BB0D" style={styles.benefitIcon} />
              <Text style={styles.benefitText}>{benefit.text}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <Pressable 
        style={styles.butTicketButton} 
        onPress={() => {
          const selectedDay = days[selectedDateIndex];
          const fullDate = new Date(today.getFullYear(), today.getMonth(), selectedDay.date);
          const formattedDate = fullDate.toLocaleDateString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric'
          }).replace(/ /g, ' ');

          navigation.navigate("PaymentInfo", {
            id: id,
            userId: userId,
            cover: cover,
            date: formattedDate,
            time: ['11:30', '14:30', '17:30'][selectedTimeIndex],
            seatType: selectedSeatType,
            ticketCount: ticketCount,
            userId: userId,
          });
        }}
      >
        <Text style={styles.buttonText}>Next</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default BookScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#18171C',
    alignItems: 'center',
  },
  dateTime: {
    alignSelf: 'flex-start',
    marginVertical: 10,
    marginHorizontal: 10,
  },
  header: {
    color: '#F7BB0D',
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '70%',
    marginVertical: 20,
  },
  selectedText: {
    color: '#18171C', 
  },
  dayText: {
    paddingHorizontal: 2,
  },
  dateButton: {
    alignItems: 'center',
    borderRadius: 8,
    padding: 5,
    borderWidth: 1,
    borderColor: 'gray',
    marginHorizontal: 3,

  },
  timePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '80%',
    marginVertical: 20,
  },
  timePickerButton: {
    paddingHorizontal: 10,
    borderRadius: 8,
    padding: 5,
    borderWidth: 1,
    borderColor: 'gray',
  },
  seatTypeText: {
    color: 'white',
    fontSize: 16,
    paddingHorizontal: 10,
    fontWeight: 'bold',
  },
  timeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    paddingHorizontal: 10,
  },
  dateText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  buttonText: {
    color: '#18171C',
    fontSize: 18,
    fontWeight: '600',
  },
  butTicketButton: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#F7BB0D',
    paddingHorizontal: 20,
    paddingVertical: 12.5,
    marginBottom: 10,
    width: '80%',
    borderRadius: 12,
  },
  selectedButton: {
    backgroundColor: '#F7BB0D',
    borderColor: '#F7BB0D',
  },
  ticketCounterContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginVertical: 20,
  },
  ticketStepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '50%',
    marginTop: 10,
  },
  stepperButton: {
    backgroundColor: '#F7BB0D',
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  stepperButtonText: {
    color: '#18171C',
    fontSize: 24,
    fontWeight: 'bold',
  },
  ticketCountText: {
    color: 'white',
    fontSize: 24,
    marginHorizontal: 20,
  },
  benefitsContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
    
  },
  benefitsScrollView: {
    marginLeft: 10,
    marginVertical: 10,
  },
  benefitItem: {
    backgroundColor: '#232228', // Or any other color suitable for your design
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitText: {
    marginTop: 10,
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
});
