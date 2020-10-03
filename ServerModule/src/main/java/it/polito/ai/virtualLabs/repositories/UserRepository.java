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

    Optional<User> findByUsernameAndRegisteredTrue(String username);

    boolean existsByUsername(String username);

    @Query("SELECT s FROM Student s WHERE s.registered = true")
    List<Student> findAllStudents();

    @Query("SELECT p FROM Professor p WHERE p.registered = true")
    List<Professor> findAllProfessors();

    @Query("SELECT s FROM Student s WHERE s.id = :studentId")
    Optional<Student> findStudentById(String studentId);

    @Query("SELECT s FROM Student s WHERE s.username = :email")
    Optional<Student> findStudentByUsername(String email);

    @Query("SELECT p FROM Professor p WHERE p.id = :professorId")
    Optional<Professor> findProfessorById(String professorId);

    @Query("SELECT p FROM Professor p WHERE p.username = :email")
    Optional<Professor> findProfessorByUsername(String email);

    @Query("SELECT s FROM Student s WHERE s.id = :studentId")
    Student getStudentById(String studentId);

    @Query("SELECT s FROM Student s WHERE s.username = :email")
    Student getStudentByUsername(String email);

    @Query("SELECT p FROM Professor p WHERE p.id = :professorId")
    Professor getProfessorById(String professorId);

    @Query("SELECT p FROM Professor p WHERE p.username = :email")
    Professor getProfessorByUsername(String email);

    @Query("SELECT CASE WHEN COUNT(s)>0 THEN TRUE ELSE FALSE END FROM Student s WHERE s.id = :studentId")
    boolean studentExistsById(String studentId);

    @Query("SELECT CASE WHEN COUNT(s)>0 THEN TRUE ELSE FALSE END FROM Student s WHERE s.username = :email")
    boolean studentExistsByUsername(String email);

    @Query("SELECT CASE WHEN COUNT(p)>0 THEN TRUE ELSE FALSE END FROM Professor p WHERE p.id = :professorId")
    boolean professorExistsById(String professorId);

    @Query("SELECT CASE WHEN COUNT(p)>0 THEN TRUE ELSE FALSE END FROM Professor p WHERE p.username = :email")
    boolean professorExistsByUsername(String email);

    @Query("SELECT s FROM Student s WHERE s.registered = true AND s.id NOT IN (SELECT s.id FROM Course c INNER JOIN c.students s WHERE c.name=:courseName)")
    List<Student> getStudentsNotInCourse(String courseName);
}
