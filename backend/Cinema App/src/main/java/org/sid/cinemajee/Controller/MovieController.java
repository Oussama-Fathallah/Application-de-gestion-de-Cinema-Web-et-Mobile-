package org.sid.cinemajee.Controller;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.sid.cinemajee.Entity.Category;
import org.sid.cinemajee.Entity.Movie;
import org.sid.cinemajee.Repository.CategoryRepository;
import org.sid.cinemajee.Repository.MovieRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@RestController
public class MovieController {
	@Autowired
    private MovieRepository movieRepository;
	@Autowired
    private CategoryRepository categoryRepository;

	@PostMapping("/save/movie")
	public ResponseEntity<?> saveMovie(@RequestBody Movie movie) {

	    List<Movie> existingMovies = movieRepository.findByTitle(movie.getTitle());
	    if (!existingMovies.isEmpty()) {
	        return ResponseEntity.status(HttpStatus.CONFLICT).body("A movie with the same title already exists.");
    }

	    Set<Category> managedCategories = new HashSet<>();
	    for (Category category : movie.getCategories()) {
	        // Retrieve all categories that match the given name
        List<Category> existingCategories = categoryRepository.findByName(category.getName());

	        if (existingCategories.isEmpty()) {

	            Category newCategory = new Category();
	            newCategory.setName(category.getName());
	            managedCategories.add(categoryRepository.save(newCategory));
	        } else {
	            managedCategories.add(existingCategories.get(0));
	        }
	    }

	    movie.setCategories(managedCategories);
	    Movie savedMovie = movieRepository.save(movie);
	    return ResponseEntity.ok(savedMovie);
	}

	/*@PostMapping("/save/movie")
	public ResponseEntity<?> saveMovie(@RequestBody Movie movie) {
    
    // Check if the movie with the same title already exists
		List<Movie> existingMovies = movieRepository.findByTitle(movie.getTitle());
		if (!existingMovies.isEmpty()) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body("A movie with the same title already exists.");
    }

		Set<Category> managedCategories = new HashSet<>();
    // Assume movie.getCategories() now provides Category objects with only IDs filled
    	for (Category category : movie.getCategories()) {
    			Category existingCategory = categoryRepository.findById(category.getId())
    					.orElseThrow(() -> new RuntimeException("Category not found with id: " + category.getId()));
    			managedCategories.add(existingCategory);
    }

    	movie.setCategories(managedCategories);
    	Movie savedMovie = movieRepository.save(movie);
    		return ResponseEntity.ok(savedMovie);
    }
    */
    @GetMapping("/movies")
    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }
    @GetMapping(value = "/movies/{id}")
    public Movie getMovieById(@PathVariable("id") Long id) {
        return movieRepository.findById(id).orElse(null); 
    }

    @GetMapping("/search/movie/{title}")
    public List<Movie> getMovieByTitle(@PathVariable String title) {
        return movieRepository.findByTitleContaining(title);
    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteMovie(@PathVariable Long id) {
        return movieRepository.findById(id)
            .map(movie -> {
                movieRepository.delete(movie);
                return ResponseEntity.ok().build();  // Successfully deleted
            })
            .orElseGet(() -> ResponseEntity.notFound().build());  // Movie not found
    }
    @PutMapping("/edit/movie/{id}")
    public ResponseEntity<?> editMovie(@PathVariable Long id, @RequestBody Movie updatedMovie) {
        try {
            Movie movie = movieRepository.findById(id).orElse(null);
            if (movie == null) {
                return ResponseEntity.notFound().build();
            }

            // Update movie fields with new values
            movie.setTitle(updatedMovie.getTitle());
            movie.setDescription(updatedMovie.getDescription());
            movie.setDuration(updatedMovie.getDuration());
            movie.setReleaseDate(updatedMovie.getReleaseDate());
            movie.setRating(updatedMovie.getRating());
            movie.setMinAge(updatedMovie.getMinAge());
            movie.setDirector(updatedMovie.getDirector());
            movie.setCover(updatedMovie.getCover());
            movie.setTrailer(updatedMovie.getTrailer());

            // Manage associated categories
            Set<Category> managedCategories = new HashSet<>();
            Set<Category> updatedCategories = updatedMovie.getCategories();
            if (updatedCategories != null && !updatedCategories.isEmpty()) {
                for (Category updatedCategory : updatedCategories) {
                    Category managedCategory = null;
                    if (updatedCategory.getId() != null) {
                        managedCategory = categoryRepository.findById(updatedCategory.getId()).orElse(null);
                    } else if (updatedCategory.getName() != null) {
                        managedCategory = categoryRepository.findByName(updatedCategory.getName()).stream().findFirst().orElse(null);
                    }
                    if (managedCategory == null) {
                        managedCategory = categoryRepository.save(updatedCategory);
                    }
                    managedCategories.add(managedCategory);
                }
            }

            // Update movie categories
            movie.setCategories(managedCategories);

            // Save movie changes
            Movie savedMovie = movieRepository.save(movie);

            return ResponseEntity.ok(savedMovie);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Failed to edit movie: " + e.getMessage());
        }
    }

    @GetMapping("/search/category/{name}") 
    public List<Category> getCategoryByName(@PathVariable String name) {
        return categoryRepository.findByName(name);
    }
}
