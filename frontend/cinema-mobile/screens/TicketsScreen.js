import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, View, TouchableOpacity, Image, SafeAreaView, FlatList, ActivityIndicator  } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import QRCode from 'react-native-qrcode-svg';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return date.toLocaleDateString('en-GB', options);
};

// Function to format the time string
const formatTime = (timeString) => {
  const time = new Date(`1970-01-01T${timeString}`);
  const options = { hour: '2-digit', minute: '2-digit' };
  return time.toLocaleTimeString('en-US', options);
};

const Item = ({ reservation, onPress }) => (
  <TouchableOpacity style={styles.item} onPress={() => onPress(reservation)}>
    <Image source={{ uri: reservation.movie.cover }} style={styles.cover} />
    <View style={styles.info}>
      <Text style={styles.title}>{reservation.movie.title}</Text>
      <View style={styles.timeAndAge}>
        <Text style={styles.details}>{formatDate(reservation.projectionDate)}</Text>
        <Ionicons name="ellipse" size={5} color="#F7BB0D" style={{marginHorizontal: 10}}/>
        <Text style={styles.details}>{formatTime(reservation.projectionTime)}</Text>
        <Ionicons name="ellipse" size={5} color="#F7BB0D" style={{marginHorizontal: 10}}/>
        <Text style={styles.details}>PG-{reservation.movie.minAge}</Text>
      </View>
      <Text style={styles.details}>
        <Ionicons name="star" size={13} color="#F7BB0D" style={{marginHorizontal: 10}}/> {reservation.movie.rating}/10
      </Text>
    </View>
    <View style={styles.qrCodeIcon}>
      <Ionicons name="qr-code-outline" size={30} color="#F7BB0D" />
    </View>
  </TouchableOpacity>
);

const TicketsScreen = ({route}) => {
  const { userId } = route.params;
  console.log(userId);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  

  const openModal = (reservation) => {
    setSelectedReservation(reservation);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    setLoading(true);
    fetch(`http://192.168.1.102:8080/api/reservations/user/${userId}`) // Assuming user ID is 1 for example purposes
      .then((response) => response.json())
      .then((data) => setReservations(data))
      .catch((error) => alert("Failed to fetch reservations: " + error));
      setLoading(false);
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.centeredView]}>
        <ActivityIndicator size="large" color="#F7BB0D" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerText}>Tickets</Text>
      {loading ? (
        <View style={[styles.container, styles.centeredView]}>
          <ActivityIndicator size="large" color="#F7BB0D" />
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={reservations}
          renderItem={({ item }) => <Item reservation={item} onPress={openModal} />}
          keyExtractor={item => item.id.toString()}
        />
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {selectedReservation && (
              <>
                <Image source={{ uri: selectedReservation.movie.cover }} style={styles.modalCover} />
                <Text style={styles.modalTitle}>{selectedReservation.movie.title}</Text>
                <View style={styles.modalTicketInfos}>
                  <View style={styles.modalDateAndCost}>
                    <Text style={styles.modalText}><Text style={styles.modalTextTitle}>Date:</Text> {formatDate(selectedReservation.projectionDate)}</Text>
                    <Text style={styles.modalText}><Text style={styles.modalTextTitle}>Cost:</Text> {selectedReservation.price} $</Text>
                  </View>
                  <View style={styles.modalDateAndCost}>
                    <Text style={styles.modalText}><Text style={styles.modalTextTitle}>Time:</Text> {formatTime(selectedReservation.projectionTime)}</Text>
                    <Text style={styles.modalText}><Text style={styles.modalTextTitle}>Type:</Text> {selectedReservation.seatType}</Text>
                  </View>
                </View>
                <Text style={styles.modalText}><Text style={styles.modalTextTitle}>Number of Tickets: </Text> {selectedReservation.numberOfTickets}</Text>
                <QRCode value={JSON.stringify({
                      id: selectedReservation.id,
                      title: selectedReservation.movie.title,
                      date: selectedReservation.projectionDate,
                      time: selectedReservation.projectionTime,
                      price: selectedReservation.price,
                      seatType: selectedReservation.seatType,
                      numberOfTickets: selectedReservation.numberOfTickets
                    })} 
                    size={125} 
                    style={styles.qrCode}
                    backgroundColor='transparent'
                    color='white'
                />
                <TouchableOpacity
                  style={[styles.button, styles.buttonClose]}
                  onPress={closeModal}
                >
                  <Text style={styles.textStyle}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#18171C'
  },
  headerText: {
    color: "#F7BB0D",
    fontWeight: 'bold',
    fontSize: 35,
    paddingTop: 30,
    paddingBottom: 10,
    paddingLeft: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#28262F',

  },
  item: {
    flexDirection: 'row',
    margin: 10,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#232226',
  },
  cover: {
    width: 120,
    height: 170,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    marginRight: 10,
  },
  modalCover:{
    alignSelf: 'center',
    width: 120,
    height: 150,
    borderRadius: 10,
    marginRight: 10,
  },
  timeAndAge:{
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  info: {
    flex: 1,
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  details: {
    color: "white",
    fontSize: 14,
  },
  qrCodeIcon:{
    marginRight: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    width: "80%",
    alignItems: "center",
    margin: 10,
    backgroundColor: "#474f54",
    borderRadius: 20,
    paddingHorizontal: 35,
    paddingVertical: 15,
    shadowColor: "white",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity:  4,
    shadowRadius: 5,
    elevation: 50
  },
  modalTitle: {
    color: 'white',
    alignSelf: 'center',
    marginBottom: 15,
    fontSize: 24,
    fontWeight: 'bold'
  },
  modalTicketInfos:{
    alignSelf: 'flex-start',
    justifyContent: 'space-between',
    width: "100%",
    flexDirection: 'row',
  },
  modalDateAndCost:{
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  modalText: {
    color: 'white',
    marginBottom: 15,  
    fontSize: 16,
  },
  modalTextTitle:{
    fontSize: 18,
    fontWeight: 'bold'
  },
  qrCode:{
    borderRadius: 10,
    marginVertical: 20,
    
  },
  button: {
    borderRadius: 20,
    margin: 10,
    padding: 10,
    elevation: 2
  },
  buttonClose: {
    backgroundColor: "#F7BB0D",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  }
});

export default TicketsScreen;
