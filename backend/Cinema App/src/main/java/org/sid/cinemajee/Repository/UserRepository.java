package org.sid.cinemajee.Repository;


import org.sid.cinemajee.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource
public interface UserRepository extends JpaRepository<User,Long> {

	boolean existsByEmail(String email);

	User findByEmail(String email);

}