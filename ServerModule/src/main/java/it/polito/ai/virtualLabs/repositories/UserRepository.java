package it.polito.ai.virtualLabs.repositories;

import it.polito.ai.virtualLabs.entities.Professor;
import it.polito.ai.virtualLabs.entities.Student;
import it.polito.ai.virtualLabs.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByUsername(String username);

    @Query("FROM Student")
    List<Student> findAllStudents();

    @Query("FROM Professor")
    List<Professor> findAllProfessors();

    @Query("SELECT s FROM Student s WHERE s.id = :studentId")
    Optional<Student> findStudentById(String studentId);

    @Query("SELECT s FROM Student s WHERE s.id = :studentId")
    Student getStudentById(String studentId);

    @Query("SELECT p FROM Professor p WHERE p.id = :professorId")
    Optional<Professor> findProfessorById(String professorId);

    @Query("SELECT p FROM Professor p WHERE p.id = :professorId")
    Professor getProfessorById(String professorId);

    @Query("SELECT COUNT(s) FROM Student s WHERE s.id = :studentId")
    boolean studentExistsById(String studentId);

    @Query("SELECT COUNT(p) FROM Professor p WHERE p.id = :professorId")
    boolean professorExistsById(String professorId);
}
