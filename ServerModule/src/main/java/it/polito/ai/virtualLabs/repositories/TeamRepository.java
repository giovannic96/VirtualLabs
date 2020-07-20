package it.polito.ai.virtualLabs.repositories;

import it.polito.ai.virtualLabs.entities.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {
    boolean existsByName(String courseName);
    boolean existsByNameAndCourseName(String teamName, String courseName);

    Optional<Team> findByName(String courseName);
}
