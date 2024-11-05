import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View, Image, ActivityIndicator, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [hasSearched, setHasSearched] = useState(false); // Track if a search has been performed
  const navigation = useNavigation();

  useEffect(() => {
    if (searchQuery.length > 1) { // Only fetch if the query length is greater than 2
      setHasSearched(true);
      fetchMovies(searchQuery);
    }
  }, [searchQuery]); // Effect runs on change in searchQuery

  const fetchMovies = async (title) => {
    setIsLoading(true);
    setStatusMessage(''); // Clear previous status messages
    try {
      const response = await fetch(`http://192.168.1.102:8080/search/movie/${title}`);
      const data = await response.json();
      if (data.length === 0) {
        setStatusMessage('No movies found with that title.');
        setMovies([]);
      } else {
        setMovies(data);
      }
    } catch (error) {
      console.error('Failed to fetch movies:', error);
      setStatusMessage('Failed to fetch movies.');
      setMovies([]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.movieItem}>
      <Pressable onPress={() => navigation.navigate("MovieDetails", { id: item.id })}>
        <Image
          style={styles.featuredMovie}
          source={{ uri: item.cover }}
        />
      </Pressable>
      <Text style={styles.movieTitle}>{item.title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="Search for a movie"
        placeholderTextColor="gray"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {isLoading ? (
        <View style={styles.centeredContent}>
          <ActivityIndicator size="large" color="#F7BB0D" />
        </View>
      ) : hasSearched ? (
        movies.length === 0 && statusMessage ? (
          <View style={styles.centeredContent}>
            <Text style={styles.statusMessage}>{statusMessage}</Text>
          </View>
        ) : (
          <FlatList
            data={movies}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            numColumns={2}
            contentContainerStyle={styles.movieContainer}
            showsVerticalScrollIndicator={false}
          />
        )
      ) : (
        // Display this message when no search has been performed yet
        <View style={styles.centeredContent}>
          <Text style={styles.statusMessage}>Enter a movie title to begin your search.</Text>
        </View>
      )}
    </View>
  );
}

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#18171C',
    padding: 10,
  },
  search: {
    backgroundColor: "#28262F",
    borderRadius: 8,
    paddingVertical: 7,
    width: "95%",
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 20,
    paddingLeft: 20,
    fontSize: 14,
    color: "white",
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusMessage: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  movieContainer: {
    paddingBottom: 10,
  },
  movieItem: {
    flex: 1,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredMovie: {
    height: 260,
    width: 197,
    borderRadius: 8,
    marginRight: 7,
  },
  movieTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
  }
});
