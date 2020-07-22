package it.polito.ai.virtualLabs.services;

import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Service
@Transactional
public class NotificationServiceImpl implements NotificationService {
/*
    @Autowired
    JavaMailSender emailSender;

    @Autowired
    TokenRepository tokenRepository;

    @Autowired
    TeamRepository teamRepository;

    @Autowired
    TeamService teamService;


    @Override
    public void sendMessage(String address, String subject, String body) throws MailException {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(address);
        message.setSubject(subject);
        message.setText(body);
        emailSender.send(message);
    }

    @Override
    public boolean confirm(String token) {
        if(!tokenRepository.existsById(token))
            throw new TokenNotFoundException("Token not found");

        Token t = tokenRepository.getOne(token);
        Timestamp now = new Timestamp(System.currentTimeMillis());
        if(t.getExpiryDate().before(now))
            throw new TokenExpiredException("Token expired");

        tokenRepository.delete(t);
        Long teamId = t.getTeamId();
        List<Token> pendingTokens = tokenRepository.findAllByTeamId(teamId);
        if(pendingTokens.isEmpty()) {
            try {
                //teamService.changeTeamState(teamId, Team.ACTIVE);
            } catch (TeamNotFoundException ex) {
                return false;
            }
            return true;
        }
        return false;
    }

    @Override
    public boolean reject(String token) {
        if(!tokenRepository.existsById(token))
            throw new TokenNotFoundException("Token not found");

        Token t = tokenRepository.getOne(token);
        Long teamId = t.getTeamId();
        List<Token> pendingTokens = tokenRepository.findAllByTeamId(teamId);
        tokenRepository.deleteAll(pendingTokens);
        try {
            teamService.evictTeam(teamId);
        } catch (TeamNotFoundException ex) {
            return false;
        }
        return true;
    }

    @Override
    public void notifyTeam(TeamDTO dto, List<String> memberIds) {
        if(!teamRepository.existsById(dto.getId()))
            throw new TeamNotFoundException("The team with id " + dto.getId() + " was not found");

        //verify that all memberIds are inside the team 'dto'
        List<String> teamMembers = teamRepository.getOne(dto.getId())
                                        .getStudents()
                                        .stream()
                                        .map(Student::getId)
                                        .collect(Collectors.toList());
        if(memberIds.size() != teamMembers.size())
            throw new NotifyTeamException("All members must be enrolled in the team: " + dto.getName());
        for(String memberId : teamMembers) {
            if(!memberIds.contains(memberId))
                throw new NotifyTeamException("All members must be enrolled in the team: " + dto.getName());
        }

        //generate tokens for each member and send email
        for(String id : memberIds) {
            Token t = new Token();
            t.setId(UUID.randomUUID().toString());
            t.setTeamId(dto.getId());
            t.setExpiryDate(new Timestamp(System.currentTimeMillis() + TimeUnit.HOURS.toMillis(3)));
            tokenRepository.saveAndFlush(t);
            sendMessage(calcEmail(t.getId()), "TEAM PROPOSAL", calcBody(t.getId()));
        }
    }

    private String calcEmail(String id) {
        final String prefixEmail = "s";
        final String suffixEmail = "@studenti.polito.it";
        return prefixEmail + id + suffixEmail;
    }

    private String calcBody(String id) {
        final String prefixConfirmURL = "http://localhost:8080/notification/confirm/";
        final String prefixRejectURL = "http://localhost:8080/notification/reject/";
        final String confirmBody = "Click here to confirm the proposal: ";
        final String rejectBody = "Click here to reject the proposal: ";

        String confirmURL = prefixConfirmURL + id;
        String rejectURL = prefixRejectURL + id;
        return confirmBody + confirmURL + "\n\n" + rejectBody + rejectURL;
    }
    */
}
