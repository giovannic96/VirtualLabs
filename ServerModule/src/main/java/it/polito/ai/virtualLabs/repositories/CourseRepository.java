package it.polito.ai.virtualLabs.repositories;

import it.polito.ai.virtualLabs.entities.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseRepository extends JpaRepository<Course, String> {

}
