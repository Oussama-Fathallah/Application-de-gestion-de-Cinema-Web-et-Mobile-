import React, { useEffect, useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  Text,
  Image,
  SectionList,
  FlatList,
  Pressable,
} from 'react-native';
import Greeting from '../components/Greeting';

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const HomeScreen = ({ navigation, route }) => {
  const { userId } = route.params;
  const [sections, setSections] = useState([]);
  console.log(userId);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://192.168.1.102:8080/movies");
        const movies = await response.json();
        const categoryMap = new Map();
        movies.forEach((movie) => {
          movie.categories.forEach((category) => {
            const existing = categoryMap.get(category.name) || [];
            categoryMap.set(category.name, [...existing, movie]);
          });
        });
        const newSections = Array.from(categoryMap, ([title, data]) => ({
          title, 
          data: shuffleArray([...data]) // Shuffle movies in each category
        }));
        setSections(newSections);
      } catch (error) {
        alert(error);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#18171C" />
      <Greeting />
      <SectionList
        showsVerticalScrollIndicator={false}
        sections={sections}
        renderItem={({ item }) => {
          return null;
        }}
        renderSectionHeader={({ section }) => (
          <>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <FlatList
              data={section.data}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => navigation.navigate("MovieDetails", { id: item.id })}
                  style={{ marginRight: 7 }}>
                  <Image
                    style={styles.featuredMovie}
                    source={{ uri: item.cover }}
                  />
                </Pressable>
              )}
              keyExtractor={(item) => `movie-${item.id}`}
            />
          </>
        )}
        keyExtractor={(item, index) => `section-${index}-${item.id}`}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#18171C",
  },
  sectionTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  featuredMovie: {
    height: 260,
    width: 197,
    borderRadius: 8,
  },
});
