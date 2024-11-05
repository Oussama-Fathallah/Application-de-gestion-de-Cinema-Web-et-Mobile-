package org.sid.cinemajee.Controller;

import org.sid.cinemajee.Entity.Category;

import org.sid.cinemajee.Repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin("*")
@RestController
@RequestMapping("/category") 
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping("/all")
    public ResponseEntity<List<Category>> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        return ResponseEntity.ok(categories); // Return list of categories with HTTP 200 OK
    }

    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable Long id) {
        return categoryRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

//    @PostMapping("/add") 
//    public ResponseEntity<String> createCategory(@RequestBody Category category) {
//        Category savedCategory = categoryRepository.save(category);
//        return ResponseEntity.ok("id= " + savedCategory.getId() + " name= " + savedCategory.getName() + " Bien ajoutée !!");
//    }
    
    @PostMapping("/add") 
    public ResponseEntity<String> createCategory(@RequestBody Category category) {
        List<Category> existingCategories = categoryRepository.findByName(category.getName());
        if (!existingCategories.isEmpty()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("A category with the name '" + category.getName() + "' already exists.");
        }
        
        Category savedCategory = categoryRepository.save(category);
        return ResponseEntity.ok("Category with ID " + savedCategory.getId() + " and name '" + savedCategory.getName() + "' has been successfully added.");
    }


    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateCategory(@PathVariable Long id, @RequestBody Category categoryDetails) {
        return categoryRepository.findById(id)
                .map(existingCategory -> {
                    existingCategory.setName(categoryDetails.getName());
                    // Further updates can be made here
                    categoryRepository.save(existingCategory);
                    return ResponseEntity.ok("id= " + existingCategory.getId() + " name= " + existingCategory.getName() + " Bien modifiée !!");
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteCategory(@PathVariable Long id) {
        return categoryRepository.findById(id)
                .map(category -> {
                    categoryRepository.delete(category);
                    return ResponseEntity.ok("id= " + category.getId() + " name= " + category.getName() + " Bien supprimée !!");
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
