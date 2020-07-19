package it.polito.ai.virtualLabs.repositories;

import it.polito.ai.virtualLabs.entities.Vm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VmRepository extends JpaRepository<Vm, Long> {

}
