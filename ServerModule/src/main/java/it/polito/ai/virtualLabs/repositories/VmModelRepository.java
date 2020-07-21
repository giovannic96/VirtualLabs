package it.polito.ai.virtualLabs.repositories;

import it.polito.ai.virtualLabs.entities.VmModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VmModelRepository extends JpaRepository<VmModel, Long> {

    boolean existsByCourseName(String courseName);
}
