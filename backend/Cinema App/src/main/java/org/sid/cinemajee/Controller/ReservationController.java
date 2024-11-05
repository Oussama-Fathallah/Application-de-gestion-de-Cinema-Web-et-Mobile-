package org.sid.cinemajee.Controller;

import org.sid.cinemajee.Entity.Reservation;
import org.sid.cinemajee.Entity.Movie;
import org.sid.cinemajee.Entity.User;
import org.sid.cinemajee.Repository.ReservationRepository;
import org.sid.cinemajee.Repository.MovieRepository;
import org.sid.cinemajee.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MovieRepository movieRepository;

    @PostMapping
    public ResponseEntity<?> createReservation(@RequestBody Reservation reservation,
                                               @RequestParam("userId") Long userId,
                                               @RequestParam("movieId") Long movieId) {
        try {
            // Fetch the user and movie from their repositories
            User user = userRepository.findById(userId).orElse(null);
            Movie movie = movieRepository.findById(movieId).orElse(null);

            if (user == null || movie == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("User or Movie not found");
            }

            // Set the user and movie to the reservation
            reservation.setUser(user);
            reservation.setMovie(movie);
            reservation.setProjectionDate(reservation.getProjectionDate()); 
            reservation.setProjectionTime(reservation.getProjectionTime()); 
            //reservation.setType(reservation.getType());
            reservation.setSeatType(reservation.getSeatType()); 

            // Save the new reservation
            Reservation savedReservation = reservationRepository.save(reservation);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedReservation);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating reservation: " + e.getMessage());
        }
    }
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getReservationsByUserId(@PathVariable Long userId) {
        List<Reservation> reservations = reservationRepository.findByUserIdWithDetails(userId);
        if (reservations.isEmpty()) {
            // Return an empty array as ResponseEntity with HTTP status 200 (OK)
            return ResponseEntity.ok().body(new ArrayList<>());
        }
        return ResponseEntity.ok(reservations);
    }
}
