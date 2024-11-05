package org.sid.cinemajee.Repository;

import org.sid.cinemajee.Entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    @Query("SELECT r FROM Reservation r JOIN FETCH r.movie WHERE r.user.id = :userId")
    List<Reservation> findByUserIdWithDetails(@Param("userId") Long userId);
}
