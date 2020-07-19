package it.polito.ai.virtualLabs.services;

import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Service
@Transactional
public class TeamServiceImpl implements TeamService {
/*
    @Autowired
    CourseRepository courseRepository;
    @Autowired
    StudentRepository studentRepository;
    @Autowired
    TeamRepository teamRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    NotificationService notificationService;
    @Autowired
    ModelMapper modelMapper;

    @Override
    @PreAuthorize("hasAnyRole('ROLE_PROFESSOR','ROLE_ADMIN')")
    public boolean addCourse(CourseDTO course) {
        if(courseRepository.existsById(course.getName()))
            return false;
        Course c = modelMapper.map(course, Course.class);
        courseRepository.saveAndFlush(c);
        return true;
    }

    @Override
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public Optional<CourseDTO> getCourse(String name) {
        if (!courseRepository.existsById(name))
            return Optional.empty();
        return courseRepository.findById(name)
                .map(c -> modelMapper.map(c, CourseDTO.class));
    }

    @Override
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public List<CourseDTO> getAllCourses() {
        return courseRepository.findAll()
                .stream()
                .map(c -> modelMapper.map(c, CourseDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public boolean addStudent(StudentDTO student) {
        if(studentRepository.existsById(student.getId()))
            return false;
        Student s = modelMapper.map(student, Student.class);
        studentRepository.saveAndFlush(s);
        return true;
    }

    @Override
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public Optional<StudentDTO> getStudent(String studentId) {
        if (!studentRepository.existsById(studentId))
            return Optional.empty();
        return studentRepository.findById(studentId)
                .map(s -> modelMapper.map(s, StudentDTO.class));
    }

    @Override
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public List<StudentDTO> getAllStudents() {
        return studentRepository.findAll()
                .stream()
                .map(s -> modelMapper.map(s, StudentDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public List<StudentDTO> getEnrolledStudents(String courseName) {
        if(!courseRepository.existsById(courseName))
            throw new CourseNotFoundException("Il corso di '" + courseName + "' non è stato trovato");

        return courseRepository.getOne(courseName).getStudents()
                .stream()
                .map(s -> modelMapper.map(s, StudentDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    @PreAuthorize("hasAnyRole('ROLE_PROFESSOR','ROLE_ADMIN')")
    public boolean addStudentToCourse(String studentId, String courseName) {
        if(!courseRepository.existsById(courseName))
            throw new CourseNotFoundException("Il corso di '" + courseName + "' non è stato trovato");
        if(!studentRepository.existsById(studentId))
            throw new StudentNotFoundException("Lo studente con id '" + studentId + "' non è stato trovato");

        Course course = courseRepository.getOne(courseName);
        Optional<Student> student = course.getStudents()
                .stream()
                .filter(s -> s.getId().equals(studentId))
                .findFirst();
        if(student.isPresent())
            return false;
        else {
            Student s = studentRepository.getOne(studentId);
            course.addStudent(s);
            return true;
        }
    }

    @Override
    @PreAuthorize("hasRole('ROLE_PROFESSOR')")
    public void enableCourse(String courseName) {
        if(!courseRepository.existsById(courseName))
            throw new CourseNotFoundException("Il corso di '" + courseName + "' non è stato trovato");
        Course c = courseRepository.getOne(courseName);
        c.setEnabled(true);
    }

    @Override
    @PreAuthorize("hasRole('ROLE_PROFESSOR')")
    public void disableCourse(String courseName) {
        if(!courseRepository.existsById(courseName))
            throw new CourseNotFoundException("Il corso di '" + courseName + "' non è stato trovato");
        Course c = courseRepository.getOne(courseName);
        c.setEnabled(false);
    }

    @Override
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public List<Boolean> addAll(List<StudentDTO> students) {
        List<Boolean> retList = new ArrayList<>();
        for(StudentDTO s : students) {
            retList.add(addStudent(s));
        }
        return retList;
    }

    @Override
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public List<Boolean> enrollAll(List<String> studentIds, String courseName) {
        List<Boolean> retList = new ArrayList<>();
        for(String id : studentIds) {
            retList.add(addStudentToCourse(id, courseName));
        }
        return retList;
    }

    @Override
    @PreAuthorize("hasAnyRole('ROLE_PROFESSOR','ROLE_ADMIN')")
    public List<Boolean> addAndEnroll(Reader r, String courseName) {
        List<StudentDTO> students;
        try {
            // create csv bean reader
            CsvToBean<StudentDTO> csvToBean = new CsvToBeanBuilder(r)
                    .withType(StudentDTO.class)
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
    @PreAuthorize("hasAnyRole('ROLE_STUDENT','ROLE_ADMIN')")
    public List<CourseDTO> getCourses(String studentId) {
        if (!studentRepository.existsById(studentId))
            throw new StudentNotFoundException("Lo studente con id '" + studentId + "' non è stato trovato");

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
        });
        return studentRepository.getOne(studentId)
                .getCourses()
                .stream()
                .map(c -> modelMapper.map(c, CourseDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    @PreAuthorize("hasAnyRole('ROLE_STUDENT','ROLE_ADMIN')")
    public List<TeamDTO> getTeamsForStudent(String studentId) {
        if(!studentRepository.existsById(studentId))
            throw new StudentNotFoundException("Lo studente con id '" + studentId + "' non è stato trovato");

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
        });
        return studentRepository
                .getOne(studentId)
                .getTeams()
                .stream()
                .map(t -> modelMapper.map(t, TeamDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public List<StudentDTO> getMembers(Long teamId) {
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
    @PreAuthorize("hasRole('ROLE_STUDENT')")
    public TeamDTO proposeTeam(String courseId, String name, List<String> memberIds) {
        if(!courseRepository.existsById(courseId))
            throw new CourseNotFoundException("Il corso di '" + courseId + "' non è stato trovato");

        Course course = courseRepository.getOne(courseId);
        if(!course.isEnabled())
            throw new CourseNotEnabledException("Il corso di '" + courseId + "' non è abilitato");

        List<String> distinctMembersIds = memberIds.stream().distinct().collect(Collectors.toList());
        if(distinctMembersIds.size() < course.getMinTeamSize() && distinctMembersIds.size() > course.getMaxTeamSize())
            throw new TeamConstraintsNotSatisfiedException("Il team '" + name + "' non rispetta i vincoli di cardinalità");

        List<Student> students = new ArrayList<>();
        for(String member : distinctMembersIds) {
            if(!studentRepository.existsById(member))
                throw new StudentNotFoundException("Lo studente con id '" + member + "' non è stato trovato");

            Student student = studentRepository.getOne(member);
            if(!student.getCourses().contains(course))
                throw new StudentNotEnrolledException("Lo studente con id '" + member + "' non è iscritto al corso '" + "' " + courseId);

            List<Team> studentTeams = student.getTeams();
            for(Team t : studentTeams) {
                if(t.getCourse().getName().equals(courseId))
                    throw new StudentAlreadyTeamedUpException("Lo studente con id '" + member + "' fa già parte del gruppo '" + t.getName() + "'");
            }
            students.add(student); //this will be part of the team (if all the controls are verified)
        }
        // Create new team
        Team proposedTeam = new Team();
        proposedTeam.setName(name);
        proposedTeam.setCourse(course);
        //proposedTeam.setStatus(Team.INACTIVE);

        //IMPORTANTE: se uso 'new' (come abbiamo fatto prima con Team) ho bisogno della save(), mentre se modifico
        // qualcosa di già esistente nel db, la update è fatta in automatico grazie a @Transactional.
        //Questo perchè se durante la transazione si crea un oggetto marcato con @Entity tramite new, l’ORM non lo sta
        // ancora tracciando: per questo motivo c’è il metodo save() che aggiunge semplicemente l’istanza che gli
        // passiamo alle entity tracciate.
        teamRepository.saveAndFlush(proposedTeam);
        for(Student s : students) {
            s.addToTeam(proposedTeam);
        }

        return modelMapper.map(proposedTeam, TeamDTO.class);
    }

    @Override
    @PreAuthorize("hasAnyRole('ROLE_STUDENT','ROLE_ADMIN')")
    public List<TeamDTO> getTeamsForCourse(String courseName) {
        if(!courseRepository.existsById(courseName))
            throw new CourseNotFoundException("Il corso '" + courseName + "' non è stato trovato");

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
        });
        return courseRepository
                .getOne(courseName)
                .getTeams()
                .stream()
                .map(t -> modelMapper.map(t, TeamDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    @PreAuthorize("hasRole('ROLE_STUDENT')")
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
    @PreAuthorize("hasRole('ROLE_STUDENT')")
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
    public void changeTeamState(Long teamId, int newStatus) {
        if(!teamRepository.existsById(teamId))
            throw new TeamNotFoundException("Il team con id " + teamId + " non esiste");
        //teamRepository.getOne(teamId).setStatus(newStatus);
    }

    @Override
    public void evictTeam(Long teamId) {
        if(!teamRepository.existsById(teamId))
            throw new TeamNotFoundException("Il team con id " + teamId + " non esiste");
        teamRepository.deleteById(teamId);
    }

    */
}
