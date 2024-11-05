import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Image, ScrollView, TouchableOpacity, Dimensions, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from "@expo/vector-icons";
import YoutubePlayer from "react-native-youtube-iframe";
import { useNavigation } from '@react-navigation/native';

const getVideoId = (trailerUrl) => {
  const match = trailerUrl.match(/(?:\/embed\/)([^/]+)(?:\/?)/);
  return match ? match[1] : null;
};

const formatDuration = (duration) => {
  const hours = Math.floor(duration / 60);
  const minutes = Math.round(duration % 60); // Round minutes to handle any decimal part
  return `${hours}h ${minutes}m`; // Format could be adjusted as needed
};

const MovieScreen = ({ route }) => {
  const { id } = route.params;
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [playing, setPlaying] = useState(false);
  const [videoId, setVideoId] = useState(null);

  const navigation = useNavigation();

  const onStateChange = useCallback((state) => {
    if (state === "ended") {
      setPlaying(false);
      Alert.alert("video has finished playing!");
    }
  }, []);



  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch(`http://192.168.1.102:8080/movies/${id}`);
        if (!response.ok) {
          throw new Error('Movie not found');
        }
        const data = await response.json();
        setMovie(data);
        // Extract video ID from the trailer URL and set it
        const trailerVideoId = getVideoId(data.trailer);
        setVideoId(trailerVideoId);
      } catch (err) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  if (loading) {
    return (
      <View style={{alignItems: 'center', flex: 1, backgroundColor: "#18171C", justifyContent: 'center'}}>
        <ActivityIndicator size="large" color={"#F7BB0D"} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {movie ? (
        <ScrollView style={styles.container}>
        <View style={styles.imageContainer}>
          <LinearGradient
              colors={['transparent', '#18171C']}
              style={styles.gradient}
            />
          <Image source={{uri: movie.cover}} style={styles.featuredMovie} resizeMode='cover'/>
          <LinearGradient
            colors={['transparent', '#18171C']}
            style={styles.gradient}
          />
          <View style={styles.movieTitleRating}>
            <View>
              <Text style={styles.movieTitleText}>{movie.title}</Text>
              <View style={styles.categories}>
                {movie.categories.map((category, index) => (
                  <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ color: 'white', marginRight: 5, fontWeight: '300' }}>{"  "+category.name }</Text>
                    {index !== movie.categories.length - 1 && <Ionicons name={'ellipse'} size={5} color={'#F7BB0D'} />}
                  </View>
                ))}
              </View>
            </View>
            
            <View style={{backgroundColor: '#F7BB0D', padding:10, borderRadius: 10}}>
              <Text style={styles.rating}><Text style={{fontWeight: 'bold', fontSize: 20}}>{movie.rating}</Text>/10</Text>
            </View>
          </View>
          
        </View>
        <View style={styles.movieShortInf}>
          <View style={styles.movieInf}>
            <Ionicons name={'person-outline'} size={16} color={'#F7BB0D'} />
            <Text style={{color: 'white', fontSize: 14, marginHorizontal: 5}}>{movie.minAge}<Text style={{fontSize: 10}}>+</Text></Text>
          </View>
          <View style={styles.movieInf}>
            <Ionicons name={'calendar-outline'} size={16} color={'#F7BB0D'} />
            <Text style={{color: 'white', fontSize: 14, marginHorizontal: 5}}>
            {movie.releaseDate.split('-')[2]}
          </Text>
          </View>
          <View style={styles.movieInf}>
            <Ionicons name={'hourglass-outline'} size={16} color={'#F7BB0D'} />
            <Text style={{color: 'white', fontSize: 14, marginHorizontal: 5}}>{formatDuration(movie.duration)}</Text>
          </View>
        </View>
        <View style={styles.movieDescr}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={{color: 'white', }}>{movie.description}</Text>
        </View>
        <View style={styles.movieDirector}>
          <Text style={styles.sectionTitle}>Director: </Text>
          <Text style={{color: 'white', fontSize: 16}}>{movie.director}</Text>
        </View>
        <View style={styles.movieTrailer}>
          <Text style={styles.trailerTitle}>Trailer </Text>
          <YoutubePlayer
            height={300}
            play={playing}
            videoId={videoId} // Use the extracted videoId here
            onChangeState={onStateChange}
          />
        </View>
        <Pressable style={styles.butTicketButton} onPress={()=>navigation.navigate("BookingTickets", {id: id, cover: movie.cover,})}>
          <Text style={{color: '#18171C', fontSize: 18, fontWeight: '600'}}>Buy Tickets</Text>
        </Pressable>
        </ScrollView>
      ) : (
        <Text>No movie found.</Text>
      )}
    </View>
  );
};

export default MovieScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#18171C",
  },
  imageContainer: {
    position: 'relative',
    height: 260,
    width: '100%',
  },
  featuredMovie: {
    height: '100%',
    width: '100%',
    position: 'absolute',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '75%',
  },
  movieTitleRating: {
    marginHorizontal: 20,
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute', 
    bottom: 0, 
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  movieTitleText: { 
    color: 'white',
    fontSize: 30, 
    fontWeight: 'bold',
  },
  categories:{
    flexDirection: 'row',
    alignItems: 'center'
  },
  rating: {
    color: '#18171C',
    fontSize: 11,
  },
  movieShortInf: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', 
    marginHorizontal: 20,
  },
  movieInf:{
    flexDirection: 'row',
    backgroundColor: '#28262F',
    paddingHorizontal: 20,
    paddingVertical: 7,
    borderRadius: 8
  },
  movieDescr:{
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 5,
  },
  sectionTitle: {
    color: "#F7BB0D",
    fontSize: 20,
    fontWeight: "bold",

  },
  movieDirector:{
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 5,
  },
  movieTrailer:{
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 5,
  },
  trailerTitle:{
    color: "#F7BB0D",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  butTicketButton:{
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    alignSelf: "center",
    backgroundColor: '#F7BB0D',
    paddingHorizontal: 20,
    paddingVertical: 12.5,
    marginBottom: 10,
    width: '80%',
    borderRadius: 12,
  }
  
});
