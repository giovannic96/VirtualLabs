package it.polito.ai.virtualLabs.repositories;

import it.polito.ai.virtualLabs.entities.Version;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VersionRepository extends JpaRepository<Version, Long> {

}
