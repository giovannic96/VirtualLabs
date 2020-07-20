package it.polito.ai.virtualLabs.services;

import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanBuilder;
import it.polito.ai.virtualLabs.dtos.*;
import it.polito.ai.virtualLabs.entities.*;
import it.polito.ai.virtualLabs.repositories.*;
import it.polito.ai.virtualLabs.services.exceptions.course.CourseNotEnabledException;
import it.polito.ai.virtualLabs.services.exceptions.course.CourseNotFoundException;
import it.polito.ai.virtualLabs.services.exceptions.file.ParsingFileException;
import it.polito.ai.virtualLabs.services.exceptions.student.StudentAlreadyTeamedUpException;
import it.polito.ai.virtualLabs.services.exceptions.student.StudentNotEnrolledException;
import it.polito.ai.virtualLabs.services.exceptions.student.StudentNotFoundException;
import it.polito.ai.virtualLabs.services.exceptions.team.TeamConstraintsNotSatisfiedException;
import it.polito.ai.virtualLabs.services.exceptions.team.TeamNotFoundException;
import it.polito.ai.virtualLabs.services.exceptions.team.TeamProposalNotFoundException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.io.Reader;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
@Transactional
public class TeamServiceImpl implements TeamService {

    private static final int PROPOSAL_EXPIRATION_DAYS = 3;

    // Queste sono da esempio per usarle dopo
    // @PreAuthorize("hasAnyRole('ROLE_PROFESSOR','ROLE_ADMIN')")
    // @PreAuthorize("hasRole('ROLE_ADMIN')")

    @Autowired
    AssignmentRepository assignmentRepository;
    @Autowired
    CourseRepository courseRepository;
    @Autowired
    ReportRepository reportRepository;
    @Autowired
    TeamProposalRepository teamProposalRepository;
    @Autowired
    TeamRepository teamRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    UserRepository studentRepository;
    @Autowired
    VersionRepository versionRepository;
    @Autowired
    VmModelRepository vmModelRepository;
    @Autowired
    VmRepository vmRepository;


    @Autowired
    TeamService teamService;
    @Autowired
    NotificationService notificationService;
    @Autowired
    ModelMapper modelMapper;

    @Override
    public boolean addCourse(CourseDTO course) {
        if(courseRepository.existsById(course.getName()))
            return false;
        Course c = modelMapper.map(course, Course.class);
        courseRepository.saveAndFlush(c);
        return true;
    }

    @Override
    public Optional<CourseDTO> getCourse(String name) {
        if (!courseRepository.existsById(name))
            return Optional.empty();
        return courseRepository.findById(name)
                .map(c -> modelMapper.map(c, CourseDTO.class));
    }

    @Override
    public List<CourseDTO> getAllCourses() {
        return courseRepository.findAll()
                .stream()
                .map(c -> modelMapper.map(c, CourseDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public boolean addStudent(StudentDTO student) {
        if(userRepository.existsById(student.getId()))
            return false;
        Student s = modelMapper.map(student, Student.class);
        userRepository.saveAndFlush(s);
        return true;
    }

    @Override
    public Optional<StudentDTO> getStudent(String studentId) {

        if (!studentId.startsWith("s") || !userRepository.existsById(studentId))
            return Optional.empty();

        System.out.println(userRepository.findById(studentId).getClass());
        return userRepository.findStudentById(studentId)
                .map(s -> modelMapper.map(s, StudentDTO.class));
    }

    @Override
    public List<StudentDTO> getAllStudents() {
        return userRepository.findAllStudents()
                .stream()
                .map(s -> modelMapper.map(s, StudentDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public boolean addProfessor(ProfessorDTO professor) {
        if(userRepository.existsById(professor.getId()))
            return false;
        Professor p = modelMapper.map(professor, Professor.class);
        userRepository.saveAndFlush(p);
        return true;
    }

    @Override
    public Optional<ProfessorDTO> getProfessor(String professorId) {
        if (!professorId.startsWith("d") || !userRepository.existsById(professorId))
            return Optional.empty();
        return userRepository.findProfessorById(professorId)
                .map(p -> modelMapper.map(p, ProfessorDTO.class));
    }

    @Override
    public List<ProfessorDTO> getAllProfessors() {
        return userRepository.findAllProfessors()
                .stream()
                .map(p -> modelMapper.map(p, ProfessorDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public boolean addTeam(TeamDTO team) {
        return false;
    }

    @Override
    public Optional<TeamDTO> getTeam(String teamName) {
        return Optional.empty();
    }

    @Override
    public List<TeamDTO> getAllTeams() {
        return null;
    }

    @Override
    public List<StudentDTO> getEnrolledStudents(String courseName) {
        if(!courseRepository.existsById(courseName))
            throw new CourseNotFoundException("Il corso di '" + courseName + "' non è stato trovato");

        return courseRepository.getOne(courseName).getStudents()
                .stream()
                .map(s -> modelMapper.map(s, StudentDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public boolean addStudentToCourse(String studentId, String courseName) {
        if(!courseRepository.existsById(courseName))
            throw new CourseNotFoundException("Il corso di '" + courseName + "' non è stato trovato");
        if(!userRepository.existsById(studentId))
            throw new StudentNotFoundException("Lo studente con id '" + studentId + "' non è stato trovato");

        Course course = courseRepository.getOne(courseName);
        Optional<Student> student = course.getStudents()
                .stream()
                .filter(s -> s.getId().equals(studentId))
                .findFirst();
        if(student.isPresent())
            return false;
        else {
            Student s = userRepository.findStudentById(studentId).get();
            course.addStudent(s);
            return true;
        }
    }

    @Override
    public void enableCourse(String courseName) {
        if(!courseRepository.existsById(courseName))
            throw new CourseNotFoundException("Il corso di '" + courseName + "' non è stato trovato");
        Course c = courseRepository.getOne(courseName);
        c.setEnabled(true);
    }

    @Override
    public void disableCourse(String courseName) {
        if(!courseRepository.existsById(courseName))
            throw new CourseNotFoundException("Il corso di '" + courseName + "' non è stato trovato");
        Course c = courseRepository.getOne(courseName);
        c.setEnabled(false);
    }

    @Override
    public List<Boolean> addAllStudents(List<StudentDTO> students) {
        List<Boolean> retList = new ArrayList<>();
        for(StudentDTO s : students) {
            retList.add(addStudent(s));
        }
        return retList;
    }

    @Override
    public List<Boolean> addAllProfessors(List<ProfessorDTO> professors) {
        List<Boolean> retList = new ArrayList<>();
        for(ProfessorDTO p : professors) {
            retList.add(addProfessor(p));
        }
        return retList;
    }

    @Override
    public List<Boolean> enrollAllStudents(List<String> studentIds, String courseName) {
        List<Boolean> retList = new ArrayList<>();
        for(String id : studentIds) {
            retList.add(addStudentToCourse(id, courseName));
        }
        return retList;
    }

    //TODO: da testare
    @Override
    public List<Boolean> addAndEnroll(Reader r, String courseName) {
        List<StudentDTO> students;
        try {
            // create csv bean reader
            CsvToBean<StudentDTO> csvToBean = new CsvToBeanBuilder(r)
                    .withType(UserDTO.class)
                    .withIgnoreLeadingWhiteSpace(true)
                    .build();
            // convert `CsvToBean` object to list of students
            students = csvToBean.parse();
        } catch(Exception ex) {
           throw new ParsingFileException("Errore durante il parsing del file");
        }

        List<Boolean> retList = new ArrayList<Boolean>();
        for(StudentDTO s : students) {
            boolean added = addStudent(s);
            boolean enrolled = addStudentToCourse(s.getId(), courseName);
            retList.add(added || enrolled);
        }
        return retList;
    }

    @Override
    public List<CourseDTO> getCoursesForStudent(String studentId) {
        if (!userRepository.existsById(studentId))
            throw new StudentNotFoundException("Lo studente con id '" + studentId + "' non è stato trovato");
        /*
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        userDetails.getAuthorities().forEach(role -> {
            if(role.getAuthority().equals("ROLE_STUDENT")) {
                Optional<User> user = userRepository.findByUsername(userDetails.getUsername());
                if(user.isPresent()) {
                    String id = user.get().getId();
                    if(!studentId.equals(id)) {
                        throw new StudentPrivacyException("Lo studente con id '" + studentId + "' non ha i permessi per visualizzare queste info");
                    }
                }
            }
        });*/
        Student student = userRepository.findStudentById(studentId).get();
        return student.getCourses()
                .stream()
                .map(c -> modelMapper.map(c, CourseDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<TeamDTO> getTeamsForStudent(String studentId) {
        if(!userRepository.existsById(studentId))
            throw new StudentNotFoundException("Lo studente con id '" + studentId + "' non è stato trovato");
        /*
        UserDetails userDetails = (UserDetails)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        userDetails.getAuthorities().forEach(role -> {
            if(role.getAuthority().equals("ROLE_STUDENT")) {
                Optional<User> user = userRepository.findByUsername(userDetails.getUsername());
                if(user.isPresent()) {
                    String id = user.get().getId();
                    if(!studentId.equals(id)) {
                        throw new StudentPrivacyException("Lo studente con id '" + studentId + "' non ha i permessi per visualizzare queste info");
                    }
                }
            }
        });*/
        Student student = userRepository.findStudentById(studentId).get();
        return student.getTeams()
                .stream()
                .map(t -> modelMapper.map(t, TeamDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<StudentDTO> getTeamMembers(Long teamId) {
        if(!teamRepository.existsById(teamId))
            throw new TeamNotFoundException("Il team con id '" + teamId + "' non è stato trovato");

        return teamRepository
                .getOne(teamId)
                .getStudents()
                .stream()
                .map(s -> modelMapper.map(s, StudentDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    //TODO: da controllare
    public TeamProposalDTO proposeTeam(String courseId, String teamName, List<String> memberIds) {
        if(!courseRepository.existsById(courseId))
            throw new CourseNotFoundException("Il corso di '" + courseId + "' non è stato trovato");

        Course course = courseRepository.getOne(courseId);
        if(!course.isEnabled())
            throw new CourseNotEnabledException("Il corso di '" + courseId + "' non è abilitato");

        List<String> distinctMembersIds = memberIds.stream().distinct().collect(Collectors.toList());
        if(distinctMembersIds.size() < course.getMinTeamSize() && distinctMembersIds.size() > course.getMaxTeamSize())
            throw new TeamConstraintsNotSatisfiedException("Il team '" + teamName + "' non rispetta i vincoli di cardinalità");

        List<Student> students = new ArrayList<>();
        for(String memberId : distinctMembersIds) {
            if(!userRepository.existsById(memberId))
                throw new StudentNotFoundException("Lo studente con id '" + memberId + "' non è stato trovato");

            Student student = userRepository.findStudentById(memberId).get();
            if(!student.getCourses().contains(course))
                throw new StudentNotEnrolledException("Lo studente con id '" + memberId + "' non è iscritto al corso '" + "' " + courseId);

            List<Team> studentTeams = student.getTeams();
            for(Team t : studentTeams) {
                if(t.getCourse().getName().equals(courseId))
                    throw new StudentAlreadyTeamedUpException("Lo studente con id '" + memberId + "' fa già parte del gruppo '" + t.getName() + "'");
            }
            students.add(student); //this will be part of the team (if all the controls are verified)
        }
        // Create new team proposal
        TeamProposal proposal = new TeamProposal();
        proposal.setStatus(TeamProposal.TeamProposalStatus.PENDING);
        proposal.setCourse(course);
        proposal.setStudents(students);
        proposal.setExpiryDate(LocalDateTime.now().plusDays(PROPOSAL_EXPIRATION_DAYS));

        //IMPORTANTE: se uso 'new' (come abbiamo fatto prima con Team) ho bisogno della save(), mentre se modifico
        // qualcosa di già esistente nel db, la update è fatta in automatico grazie a @Transactional.
        //Questo perchè se durante la transazione si crea un oggetto marcato con @Entity tramite new, l’ORM non lo sta
        // ancora tracciando: per questo motivo c’è il metodo save() che aggiunge semplicemente l’istanza che gli
        // passiamo alle entity tracciate.
        teamProposalRepository.saveAndFlush(proposal);
        for(Student s : students) {
            s.addTeamProposal(proposal);
        }

        return modelMapper.map(proposal, TeamProposalDTO.class);
    }

    @Override
    public TeamDTO createTeam(Long teamProposalId) {
        if(!teamProposalRepository.existsById(teamProposalId))
            throw new TeamProposalNotFoundException("La proposta con id '"+ teamProposalId +"' non è stata trovata");

        TeamProposal teamProposal = teamProposalRepository.getOne(teamProposalId);

        String courseName = teamProposal.getCourse().getName();
        if(!courseRepository.existsById(courseName))
            throw new CourseNotFoundException("Il corso di '" + courseName + "' non è stato trovato");


        Course course = courseRepository.getOne(courseName);
        if(!course.isEnabled())
            throw new CourseNotEnabledException("Il corso di '" + courseName + "' non è abilitato");

        List<String> distinctMembersIds = teamProposal.getStudents().stream().map(Student::getId).distinct().collect(Collectors.toList());
        if(distinctMembersIds.size() < course.getMinTeamSize() && distinctMembersIds.size() > course.getMaxTeamSize())
            throw new TeamConstraintsNotSatisfiedException("Il team '" + teamProposal.getTeamName() + "' non rispetta i vincoli di cardinalità");

        List<Student> studentsToAdd = new ArrayList<>();
        for(String memberId : distinctMembersIds) {
            if(!userRepository.existsById(memberId))
                throw new StudentNotFoundException("Lo studente con id '" + memberId + "' non è stato trovato");

            Student student = userRepository.findStudentById(memberId).get();
            if(!student.getCourses().contains(course))
                throw new StudentNotEnrolledException("Lo studente con id '" + memberId + "' non è iscritto al corso '" + courseName + "'");

            List<Team> studentTeams = student.getTeams();
            for(Team t : studentTeams) {
                if(t.getCourse().getName().equals(courseName))
                    throw new StudentAlreadyTeamedUpException("Lo studente con id '" + memberId + "' fa già parte del gruppo '" + t.getName() + "'");
            }
            studentsToAdd.add(student); //this will be part of the team (if all the controls are verified)
        }
        // Create new team proposal
        Team team = new Team();
        team.setName(teamProposal.getTeamName());
        team.setCourse(course);

        teamRepository.saveAndFlush(team);
        for(Student s : studentsToAdd) {
            s.addToTeam(team);
        }

        return modelMapper.map(team, TeamDTO.class);
    }

    @Override
    public List<TeamDTO> getTeamsForCourse(String courseName) {
        if(!courseRepository.existsById(courseName))
            throw new CourseNotFoundException("Il corso '" + courseName + "' non è stato trovato");
        /*
        UserDetails userDetails = (UserDetails)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        userDetails.getAuthorities().forEach(role -> {
            if(role.getAuthority().equals("ROLE_STUDENT")) {
                Optional<User> user = userRepository.findByUsername(userDetails.getUsername());
                user.ifPresent(value -> {
                    Student student = (Student)value;
                    student.getCourses().forEach(course -> {
                        if (!courseName.equals(course.getName())) {
                            throw new StudentPrivacyException("Lo studente non ha i permessi per visualizzare le info relative al corso " + courseName);
                        }
                    });
                });
            }
        });*/
        return courseRepository
                .getOne(courseName)
                .getTeams()
                .stream()
                .map(t -> modelMapper.map(t, TeamDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<StudentDTO> getStudentsInTeams(String courseName) {
        if(!courseRepository.existsById(courseName))
            throw new CourseNotFoundException("Il corso '" + courseName + "' non è stato trovato");
        return courseRepository
                .getStudentsInTeams(courseName)
                .stream()
                .map(s -> modelMapper.map(s, StudentDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<StudentDTO> getAvailableStudents(String courseName) {
        if(!courseRepository.existsById(courseName))
            throw new CourseNotFoundException("Il corso '" + courseName + "' non è stato trovato");
        return courseRepository
                .getStudentsNotInTeams(courseName)
                .stream()
                .map(s -> modelMapper.map(s, StudentDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public void changeTeamProposalStatus(Long teamProposalId, TeamProposal.TeamProposalStatus newStatus) {
        if(!teamProposalRepository.existsById(teamProposalId))
            throw new TeamNotFoundException("Il team con id " + teamProposalId + " non esiste");
        teamProposalRepository.getOne(teamProposalId).setStatus(newStatus);
    }

    @Override
    public void deleteTeam(Long teamId) {
        if(!teamRepository.existsById(teamId))
            throw new TeamNotFoundException("Il team con id " + teamId + " non esiste");
        teamRepository.deleteById(teamId);
        teamRepository.flush();
    }
}
