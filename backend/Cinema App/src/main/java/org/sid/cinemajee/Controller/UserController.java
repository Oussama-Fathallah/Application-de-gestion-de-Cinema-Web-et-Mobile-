package org.sid.cinemajee.Controller;

import java.util.List;
import java.util.Optional;

import org.sid.cinemajee.Entity.User;
import org.sid.cinemajee.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@RequestBody User user) {
        // Vérifiez si l'utilisateur existe déjà dans la base de données
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body("Email already exists");
        }

        // Tenter d'enregistrer l'utilisateur dans la base de données
        try {
            User savedUser = userRepository.save(user);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(savedUser);
        } catch (Exception e) {
            // Gérer l'exception en cas d'erreur lors de l'enregistrement
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while saving the user");
        }
    }
    
    @GetMapping("/test")
    public List<User>getUsers() {
        return userRepository.findAll();
        }

       
    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody User user) {
        // Récupérez l'utilisateur de la base de données en utilisant l'e-mail
        User existingUser = userRepository.findByEmail(user.getEmail());

        // Vérifiez si l'utilisateur existe et si le mot de passe correspond
        if (existingUser != null && existingUser.getPassword().equals(user.getPassword())) {
            return new ResponseEntity<>(existingUser, HttpStatus.OK);
        } else {
            // Si les informations de connexion sont incorrectes, renvoyez une réponse avec un code d'erreur
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED); // Exemple : non autorisé
        }
    }
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> user = userRepository.findById(id);
        return user.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
