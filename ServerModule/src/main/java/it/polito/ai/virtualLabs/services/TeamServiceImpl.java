package it.polito.ai.virtualLabs.services;

import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanBuilder;
import it.polito.ai.virtualLabs.controllers.ModelHelper;
import it.polito.ai.virtualLabs.dtos.*;
import it.polito.ai.virtualLabs.entities.*;
import it.polito.ai.virtualLabs.repositories.*;
import it.polito.ai.virtualLabs.services.exceptions.course.CourseNotEnabledException;
import it.polito.ai.virtualLabs.services.exceptions.course.CourseNotFoundException;
import it.polito.ai.virtualLabs.services.exceptions.file.ParsingFileException;
import it.polito.ai.virtualLabs.services.exceptions.professor.ProfessorNotFoundException;
import it.polito.ai.virtualLabs.services.exceptions.student.*;
import it.polito.ai.virtualLabs.services.exceptions.team.*;
import org.apache.tomcat.util.descriptor.web.SecurityRoleRef;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.transaction.Transactional;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;


@Service
@Transactional
public class TeamServiceImpl implements TeamService {

    private static final int PROPOSAL_EXPIRATION_DAYS = 3;
    private static final int MIN_SIZE_FOR_GROUP = 2;
    private static final int MAX_SIZE_FOR_GROUP = 10;
    private static final int TEAM_PROPOSAL_EXPIRY_DAYS = 30;

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
        if(courseRepository.existsById(course.getName()) ||
                course.getMinTeamSize() < MIN_SIZE_FOR_GROUP ||
                course.getMaxTeamSize() > MAX_SIZE_FOR_GROUP ||
                course.getMaxTeamSize() - course.getMinTeamSize() >= 0)
            return false;

        try {
            File newCourseInfo = new File(getResourcesPath() + course.getName() + ".txt");
            FileOutputStream stream = new FileOutputStream(newCourseInfo);
            stream.write(course.getInfo().getBytes());
            stream.close();
        } catch (IOException ex) {
            return false;
        }

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
    public StudentDTO addStudent(StudentDTO student) {
        student.setPhoto(Base64.getEncoder().withoutPadding().encodeToString(String.valueOf(System.currentTimeMillis()).getBytes()));
        Student s = modelMapper.map(student, Student.class);
        userRepository.saveAndFlush(s);
        return student;
    }

    @Override
    public Optional<StudentDTO> getStudent(String studentId) {

        if (!userRepository.studentExistsById(studentId))
            return Optional.empty();
        return userRepository.findStudentById(studentId)
                .map(s -> modelMapper.map(s, StudentDTO.class));
    }

    @Override
    public Optional<StudentDTO> getStudentByUsername(String username) {
        if (!userRepository.studentExistsByUsername(username))
            return Optional.empty();
        return userRepository.findStudentByUsername(username)
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
        if(userRepository.professorExistsById(professor.getId()))
            return false;
        Professor p = modelMapper.map(professor, Professor.class);
        userRepository.saveAndFlush(p);
        return true;
    }

    @Override
    public Optional<ProfessorDTO> getProfessor(String professorId) {
        if (!userRepository.professorExistsById(professorId))
            return Optional.empty();
        return userRepository.findProfessorById(professorId)
                .map(p -> modelMapper.map(p, ProfessorDTO.class));
    }

    @Override
    public Optional<ProfessorDTO> getProfessorByUsername(String username) {
        if (!userRepository.professorExistsByUsername(username))
            return Optional.empty();
        return userRepository.findProfessorByUsername(username)
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
    public Optional<TeamDTO> getTeamForCourse(String teamName, String courseName) {
        if (!teamRepository.existsByNameAndCourseName(teamName, courseName))
            return Optional.empty();
        return teamRepository.findByNameAndCourseName(teamName, courseName)
                .map(t -> modelMapper.map(t, TeamDTO.class));
    }

    @Override
    public Optional<TeamDTO> getTeam(Long teamId) {
        if (!teamRepository.existsById(teamId))
            return Optional.empty();
        return teamRepository.findById(teamId)
                .map(t -> modelMapper.map(t, TeamDTO.class));
    }

    @Override
    public List<StudentDTO> getEnrolledStudents(String courseName) {
        if(!courseRepository.existsById(courseName))
            throw new CourseNotFoundException("The course named '" + courseName + "' was not found");

        return courseRepository.getOne(courseName).getStudents()
                .stream()
                .map(s -> modelMapper.map(s, StudentDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<StudentDTO> getStudentsNotInCourse(String courseName) {
        if(!courseRepository.existsById(courseName))
            throw new CourseNotFoundException("The course named '" + courseName + "' was not found");

        return userRepository.getStudentsNotInCourse(courseName)
                .stream()
                .map(s -> modelMapper.map(s, StudentDTO.class))
                .collect(Collectors.toList());
    }

    public List<TeamProposalDTO> cleanTeamProposals(List<TeamProposalDTO> list) {
        for(TeamProposalDTO tp : list) {
            if(tp.getExpiryDate().isBefore(LocalDateTime.now().minusDays(TEAM_PROPOSAL_EXPIRY_DAYS))) {
                System.err.println("eccomi");
                teamService.deleteTeamProposal(tp.getId());
                tp.setId(null);
            }
        }
        return list.stream().filter(tp -> tp.getId() != null).collect(Collectors.toList());
    }

    @Override
    public List<CourseDTO> enrichCourses(List<CourseDTO> courses) {
        for(CourseDTO c: courses) {
            ModelHelper.enrich(c);
            String courseInfo = "";
            try {
                courseInfo = new String(getClass().getClassLoader().getResourceAsStream("static/" + c.getName() + ".txt").readAllBytes());
            } catch (Exception ex) {
                courseInfo = "";
            }
            c.setInfo(courseInfo);
        }
        return courses;
    }

    @Override
    public boolean addStudentToCourse(String studentId, String courseName) {
        if(!courseRepository.existsById(courseName))
            throw new CourseNotFoundException("The course named '" + courseName + "' was not found");
        if(!userRepository.studentExistsById(studentId))
            throw new StudentNotFoundException("The student with id '" + studentId + "' was not found");

        Course course = courseRepository.getOne(courseName);
        Optional<Student> student = course.getStudents()
                .stream()
                .filter(s -> s.getId().equals(studentId))
                .findFirst();
        if(student.isPresent())
            return false;
        else {
            Student s = userRepository.getStudentById(studentId);
            course.addStudent(s);
            return true;
        }
    }

    @Override
    public void removeStudentFromCourse(String studentId, String courseName) {
        if(!courseRepository.existsById(courseName))
            throw new CourseNotFoundException("The course named '" + courseName + "' was not found");
        if(!userRepository.studentExistsById(studentId))
            throw new StudentNotFoundException("The student with id '" + studentId + "' was not found");

        Course course = courseRepository.getOne(courseName);
        course.removeStudent(userRepository.getStudentById(studentId));
    }

    @Override
    public void removeStudentFromTeamByCourse(String studentId, String courseName) {
        if(!courseRepository.existsById(courseName))
            throw new CourseNotFoundException("The course named '" + courseName + "' was not found");
        if(!userRepository.studentExistsById(studentId))
            throw new StudentNotFoundException("The student with id '" + studentId + "' was not found");

        Student student = userRepository.getStudentById(studentId);
        Optional<Team> team = teamRepository.findByStudentsContainsAndCourseName(student, courseName);

        if(team.isPresent()) {
            team.get().removeMember(student);
            if(team.get().getStudents().isEmpty())
                this.teamRepository.delete(team.get());
        }
    }

    @Override
    public boolean addProfessorToCourse(String professorId, String courseName) {
        if(!courseRepository.existsById(courseName))
            throw new CourseNotFoundException("The course named '" + courseName + "' non è stato trovato");
        if(!userRepository.professorExistsById(professorId))
            throw new StudentNotFoundException("The professor with id '" + professorId + "' was not found");

        Course course = courseRepository.getOne(courseName);
        Optional<Professor> professor = course.getProfessors()
                .stream()
                .filter(p -> p.getId().equals(professorId))
                .findFirst();
        if(professor.isPresent())
            return false;
        else {
            Professor p = userRepository.getProfessorById(professorId);
            course.addProfessor(p);
            return true;
        }
    }

    @Override
    public void removeProfessorFromCourse(String professorId, String courseName) {
        if(!courseRepository.existsById(courseName))
            throw new CourseNotFoundException("The course named '" + courseName + "' was not found");
        if(!userRepository.professorExistsById(professorId))
            throw new ProfessorNotFoundException("The professor with id '" + professorId + "' was not found");

        Course course = courseRepository.getOne(courseName);
        course.removeProfessor(userRepository.getProfessorById(professorId));
    }

    @Override
    public List<ProfessorDTO> getProfessorsForCourse(String courseName) {
        if(!courseRepository.existsById(courseName))
            throw new CourseNotFoundException("The course named '" + courseName + "' was not found");

        return courseRepository.getOne(courseName).getProfessors()
                .stream()
                .map(p -> modelMapper.map(p, ProfessorDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public void enableCourse(String courseName) {
        if(!courseRepository.existsById(courseName))
            throw new CourseNotFoundException("The course named '" + courseName + "' was not found");
        Course c = courseRepository.getOne(courseName);
        c.setEnabled(true);
    }

    @Override
    public void disableCourse(String courseName) {
        if(!courseRepository.existsById(courseName))
            throw new CourseNotFoundException("The course named '" + courseName + "' was not found");
        Course c = courseRepository.getOne(courseName);
        c.setEnabled(false);
    }

    @Override
    public List<StudentDTO> addAllStudents(List<StudentDTO> students) {
        List<StudentDTO> retList = new ArrayList<>();
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

    @Override
    public List<StudentDTO> addAndEnroll(Reader r, String courseName) {
        List<StudentDTO> studentsFromClient;
        try {
            // create csv bean reader
            CsvToBean<StudentDTO> csvToBean = new CsvToBeanBuilder(r)
                    .withType(StudentDTO.class)
                    .withIgnoreLeadingWhiteSpace(true)
                    .build();
            // convert `CsvToBean` object to list of students
            studentsFromClient = csvToBean.parse();
        } catch(Exception ex) {
           throw new ParsingFileException("Error in parsing file");
        }

        List<StudentDTO> studentsAdded = new ArrayList<>();
        boolean warning = false;

        for(StudentDTO s : studentsFromClient) {
            try {
                // students must be registered to the system and not be enrolled to this course
                Optional<User> studentOpt = userRepository.findByUsernameAndRegisteredTrue(s.getUsername());
                if(studentOpt.isPresent()) {
                    boolean enrolled = addStudentToCourse(s.getId(), courseName);
                    if(enrolled) {
                       studentsAdded.add(s);
                    }
                } else {
                    warning = true;
                }
            } catch(StudentNotFoundException ex) {
                warning = true;
            }
        }

        if(warning)
            studentsAdded.add(new StudentDTO()); // last element will be a students with null id

        for(StudentDTO s : studentsAdded)
            ModelHelper.enrich(s);
        return studentsAdded;
    }

    @Override
    public List<CourseDTO> getCoursesForStudent(String studentId) {
        if (!userRepository.studentExistsById(studentId))
            throw new StudentNotFoundException("The student with id '" + studentId + "' was not found");
        /*
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        userDetails.getAuthorities().forEach(role -> {
            if(role.getAuthority().equals("ROLE_STUDENT")) {
                Optional<User> user = userRepository.findByUsernameAndRegisteredTrue(userDetails.getUsername());
                if(user.isPresent()) {
                    String id = user.get().getId();
                    if(!studentId.equals(id)) {
                        throw new StudentPrivacyException("The student with id '" + studentId + "' does not have permission to view this info");
                    }
                }
            }
        });*/
        Student student = userRepository.getStudentById(studentId);
        return student.getCourses()
                .stream()
                .map(c -> modelMapper.map(c, CourseDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<CourseDTO> getCoursesForProfessor(String professorId) {
        if (!userRepository.professorExistsById(professorId))
            throw new ProfessorNotFoundException("The professor with id '" + professorId + "' was not found");

        Professor professor = userRepository.getProfessorById(professorId);
        return professor.getCourses()
                .stream()
                .map(c -> modelMapper.map(c, CourseDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public Optional<CourseDTO> getCourseForTeam(Long teamId) {
        if(!teamRepository.existsById(teamId))
            throw new TeamNotFoundException("The team with id '" + teamId + "' was not found");

        Course course = teamRepository.getOne(teamId).getCourse();

        return Optional.of(modelMapper.map(course, CourseDTO.class));
    }

    @Override
    public List<TeamDTO> getTeamsForStudent(String studentId) {
        if(!userRepository.studentExistsById(studentId))
            throw new StudentNotFoundException("The student with id '" + studentId + "' was not found");
        /*
        UserDetails userDetails = (UserDetails)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        userDetails.getAuthorities().forEach(role -> {
            if(role.getAuthority().equals("ROLE_STUDENT")) {
                Optional<User> user = userRepository.findByUsernameAndRegisteredTrue(userDetails.getUsername());
                if(user.isPresent()) {
                    String id = user.get().getId();
                    if(!studentId.equals(id)) {
                        throw new StudentPrivacyException("The student with id '" + studentId + "' does not have permission to view this info");
                    }
                }
            }
        });*/
        Student student = userRepository.getStudentById(studentId);
        return student.getTeams()
                .stream()
                .map(t -> modelMapper.map(t, TeamDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<StudentDTO> getTeamMembers(Long teamId) {
        if(!teamRepository.existsById(teamId))
            throw new TeamNotFoundException("The team with id '" + teamId + "' was not found");

        return teamRepository
                .getOne(teamId)
                .getStudents()
                .stream()
                .map(s -> modelMapper.map(s, StudentDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public Long proposeTeam(String courseName, String teamName, List<String> memberIds, String creatorUsername) throws MessagingException {
        if(!courseRepository.existsById(courseName))
            throw new CourseNotFoundException("The course named '" + courseName + "' was not found");

        Optional<TeamProposal> oldProposal = teamProposalRepository.findByTeamNameAndCourseName(teamName, courseName);
        if(oldProposal.isPresent() && oldProposal.get().getStatus() != TeamProposal.TeamProposalStatus.REJECTED)
            throw new TeamAlreadyProposedException("The team '" + teamName + "' for the course named '" + courseName + "' has already a request in progress or accepted");

        Course course = courseRepository.getOne(courseName);
        if(!course.isEnabled())
            throw new CourseNotEnabledException("The course named '" + courseName + "' is not enabled");

        List<String> distinctMembersIds = memberIds.stream().distinct().collect(Collectors.toList());
        if(distinctMembersIds.size() < course.getMinTeamSize() && distinctMembersIds.size() > course.getMaxTeamSize())
            throw new TeamConstraintsNotSatisfiedException("The team '" + teamName + "' does not respect cardinality constraints");

        List<Student> students = new ArrayList<>();
        for(String memberId : distinctMembersIds) {
            if(!userRepository.studentExistsById(memberId))
                throw new StudentNotFoundException("The student with id '" + memberId + "' was not found");

            Student student = userRepository.getStudentById(memberId);
            if(!student.getCourses().contains(course))
                throw new StudentNotEnrolledException("The student with id '" + memberId + "' is not enrolled to the course named '" + courseName +"' ");

            List<Team> studentTeams = student.getTeams();
            for(Team t : studentTeams) {
                if(t.getCourse().getName().equals(courseName))
                    throw new StudentAlreadyTeamedUpException("The student with id '" + memberId + "' is already part of the group named '" + t.getName() + "'");
            }
            students.add(student); //this will be part of the team (if all the controls are verified)
        }

        // Create new team proposal
        TeamProposal proposal = new TeamProposal();
        proposal.setStatus(TeamProposal.TeamProposalStatus.PENDING);
        proposal.setStatusDesc("Still no student has accepted the proposal");
        proposal.setCourse(course);
        proposal.setTeamName(teamName);
        proposal.setExpiryDate(LocalDateTime.now().plusDays(PROPOSAL_EXPIRATION_DAYS));
        proposal.setCreatorId(userRepository.getStudentByUsername(creatorUsername).getId());

        teamProposalRepository.save(proposal);
        for(Student s : students) {
            s.addTeamProposal(proposal);
        }

        //send email to all members
        try {
            notificationService.notifyTeam(proposal.getId(), memberIds);
        }
        catch (MessagingException e) {
            throw new MessagingException("Error on sending the email to the students");
        }

        teamProposalRepository.flush();
        return proposal.getId();
    }

    @Override
    public Optional<TeamProposalDTO> getTeamProposal(Long teamProposalId) {
        if(!teamProposalRepository.existsById(teamProposalId))
            return Optional.empty();
        return teamProposalRepository.findById(teamProposalId)
                .map(t -> modelMapper.map(t, TeamProposalDTO.class));
    }

    @Override
    public Optional<CourseDTO> getTeamProposalCourse(Long teamProposalId) {
        if(!teamProposalRepository.existsById(teamProposalId))
            return Optional.empty();
        Course course = teamProposalRepository.getOne(teamProposalId).getCourse();

        return Optional.of(modelMapper.map(course, CourseDTO.class));
    }

    @Override
    public List<StudentDTO> getTeamProposalMembers(Long teamProposalId) {
        if(!teamProposalRepository.existsById(teamProposalId))
            throw new TeamProposalNotFoundException("The team proposal with id '" + teamProposalId + "' was not found");

        return teamProposalRepository.getOne(teamProposalId)
                .getStudents()
                .stream()
                .map(s -> modelMapper.map(s, StudentDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<TeamProposalDTO> getPendingTeamProposalForCourse(String courseName) {
        if(!courseRepository.existsById(courseName))
            throw new CourseNotFoundException("The course named '" + courseName + "' was not found");
        return teamProposalRepository.findAllByCourseNameAndStatus(courseName, TeamProposal.TeamProposalStatus.PENDING)
                .stream()
                .map(tp -> modelMapper.map(tp, TeamProposalDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<TeamProposalDTO> getTeamProposalsForCourse(String courseName) {
        if(!courseRepository.existsById(courseName))
            throw new CourseNotFoundException("The course named '" + courseName + "' was not found");

        return courseRepository
                .getOne(courseName)
                .getTeamProposals()
                .stream()
                .map(tp -> modelMapper.map(tp, TeamProposalDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<TeamProposalDTO> getTeamProposalsForStudent(String studentId) {
        if(!userRepository.studentExistsById(studentId))
            throw new StudentNotFoundException("The student with id '" + studentId + "' was not found");

        return userRepository
                .getStudentById(studentId)
                .getTeamProposals()
                .stream()
                .map(tp -> modelMapper.map(tp, TeamProposalDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public TeamDTO getTeamForStudentAndCourse(String studentId, String courseName) {
        if(!userRepository.studentExistsById(studentId))
            throw new StudentNotFoundException("The student with id '" + studentId + "' was not found");
        if(!courseRepository.existsById(courseName))
            throw new CourseNotFoundException("The course named '" + courseName + "' was not found");

        Student s = userRepository.getStudentById(studentId);
        Optional<Team> team = teamRepository.findByStudentsContainsAndCourseName(s, courseName);

        return team.map(value -> modelMapper.map(value, TeamDTO.class)).orElse(null);
    }

    @Override
    public boolean hasAcceptedProposals(String studentId, String courseName) {
        if(!userRepository.studentExistsById(studentId))
            throw new StudentNotFoundException("The student with id '" + studentId + "' was not found");

        if(!courseRepository.existsById(courseName))
            throw new CourseNotFoundException("The course named '" + courseName + "' was not found");

        List<Long> teamProposalIds = getPendingTeamProposalIdsForStudent(courseName, studentId);
        if(teamProposalIds.size() == 0)
            return true; // I don't have any proposal -> simulate that I accepted a previous proposal

        for (Long proposalId: teamProposalIds) {
            String token = notificationService.getTokenByStudentId(proposalId, studentId);
            if(token != null)
                return false;
        }
        return true;
    }

    @Override
    public List<TeamDTO> getTeamsForCourse(String courseName) {
        if(!courseRepository.existsById(courseName))
            throw new CourseNotFoundException("The course named '" + courseName + "' was not found");
        /*
        UserDetails userDetails = (UserDetails)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        userDetails.getAuthorities().forEach(role -> {
            if(role.getAuthority().equals("ROLE_STUDENT")) {
                Optional<User> user = userRepository.findByUsernameAndRegisteredTrue(userDetails.getUsername());
                user.ifPresent(value -> {
                    Student student = (Student)value;
                    student.getCourses().forEach(course -> {
                        if (!courseName.equals(course.getName())) {
                            throw new StudentPrivacyException("The student does not have permission to view the information relating to the course named " + courseName);
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
            throw new CourseNotFoundException("The course named '" + courseName + "' was not found");
        return courseRepository
                .getStudentsInTeams(courseName)
                .stream()
                .map(s -> modelMapper.map(s, StudentDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<StudentDTO> getAvailableStudents(String courseName) {
        if(!courseRepository.existsById(courseName))
            throw new CourseNotFoundException("The course named '" + courseName + "' was not found");
        return courseRepository
                .getStudentsNotInTeams(courseName)
                .stream()
                .map(s -> modelMapper.map(s, StudentDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public boolean editCourse(String courseName, CourseDTO courseDTO) {
        if(!courseRepository.existsById(courseName))
            throw new CourseNotFoundException("Il corso '" + courseName + "' non è stato trovato");

        if(courseDTO.getMinTeamSize() < MIN_SIZE_FOR_GROUP ||
                courseDTO.getMaxTeamSize() > MAX_SIZE_FOR_GROUP ||
                courseDTO.getMaxTeamSize() - courseDTO.getMinTeamSize() < 0)
            return false;

        Course course = courseRepository.getOne(courseName);
        course.setMaxTeamSize(courseDTO.getMaxTeamSize());
        course.setMinTeamSize(courseDTO.getMinTeamSize());

        try {
            File infoToEdit = new File(getResourcesPath() + courseDTO.getName() + ".txt");
            FileOutputStream stream = new FileOutputStream(infoToEdit);
            stream.write(courseDTO.getInfo().getBytes());
            stream.close();
        } catch(IOException ex) {
            System.err.println(ex.getMessage());
        }

        courseRepository.saveAndFlush(course);
        return true;
    }

    @Override
    public void removeCourse(String courseName) {
        if(!courseRepository.existsById(courseName))
            throw new CourseNotFoundException("The course named " + courseName + " does not exist");

        //remove course
        Course c = courseRepository.getOne(courseName);
        teamService.getProfessorsForCourse(courseName).forEach(prof ->
                userRepository.getProfessorById(prof.getId()).removeCourse(c));
        teamService.getEnrolledStudents(courseName).forEach(student ->
                userRepository.getStudentById(student.getId()).removeCourse(c));
        courseRepository.deleteById(courseName);
        courseRepository.flush();

        try {
            File infoToDelete = new File(getResourcesPath() + c.getName() + ".txt");
            Files.deleteIfExists(infoToDelete.toPath());
        } catch(IOException ex) {
            System.err.println(ex.getMessage());
        }
    }

    @Override
    public void deleteTeam(Long teamId) {
        if(!teamRepository.existsById(teamId))
            throw new TeamNotFoundException("The team with id " + teamId + " does not exist");
        teamRepository.deleteById(teamId);
        teamRepository.flush();
    }

    @Override
    public void deleteTeamProposal(Long teamProposalId) {
        if(!teamProposalRepository.existsById(teamProposalId))
            throw new TeamProposalNotFoundException("The team proposal with id " + teamProposalId + " does not exist");
        System.err.println(teamProposalId);
        TeamProposal teamProposal = teamProposalRepository.getOne(teamProposalId);
        teamService.getTeamProposalMembers(teamProposalId)
                .forEach(s -> userRepository.getStudentById(s.getId()).removeTeamProposal(teamProposal));
        teamProposal.setCourse(null);
        teamProposalRepository.deleteById(teamProposalId);
        teamProposalRepository.flush();
    }

    @Override
    public List<Long> getPendingTeamProposalIdsForStudent(String courseName, String studentId) {
        // get pending team proposals of the course
        List<TeamProposal> teamProposals = teamProposalRepository
                .findAllByCourseNameAndStatus(courseName, TeamProposal.TeamProposalStatus.PENDING);

        // get the ids of team proposals where current student is part of
        return teamProposals
                .stream()
                .filter(prop ->
                        prop.getStudents().stream().map(User::getId).collect(Collectors.toList()).contains(studentId))
                .map(TeamProposal::getId)
                .collect(Collectors.toList());
    }

    private String getResourcesPath() {
        // return "src/main/resources/static/"; // FOR LOCALHOST
        return getClass().getClassLoader().getResource("static/").getPath();
    }
}
