# Server Side
Tecnologie utilizzate:
* Java Spring 
* PostgreSQL/MongoDB/MariaDB

API
=================================

**GET**

*Courses*
* GET	https://ip_address:port/api/courses
* GET	https://ip_address:port/api/courses/:courseName
* GET	https://ip_address:port/api/courses/:courseName/enrolled
* GET	https://ip_address:port/api/courses/:courseName/notEnrolled
* GET	https://ip_address:port/api/courses/:courseName/teamedUp
* GET	https://ip_address:port/api/courses/:courseName/notTeamedUp
* GET	https://ip_address:port/api/courses/:courseName/teams
* GET	https://ip_address:port/api/courses/:courseName/teams/:teamName
* GET	https://ip_address:port/api/courses/:courseName/professors
* GET	https://ip_address:port/api/courses/:courseName/vmModel
* GET	https://ip_address:port/api/courses/:courseName/teamProposals
* GET	https://ip_address:port/api/courses/:courseName/assignments

*Professors*
* GET	https://ip_address:port/api/professors
* GET	https://ip_address:port/api/professors/:professorId
* GET	https://ip_address:port/api/professors/:professorId/assignments
* GET	https://ip_address:port/api/professors/:professorId/courses
* GET	https://ip_address:port/api/professors/:professorId/vmModels
* GET	https://ip_address:port/api/professors/:professorId/courses/:courseName/assignments  
  
*Students*
* GET	https://ip_address:port/api/students
* GET	https://ip_address:port/api/students/:studentId
* GET	https://ip_address:port/api/students/:studentId/reports
* GET	https://ip_address:port/api/students/:studentId/courses
* GET	https://ip_address:port/api/students/:studentId/courses/:courseName/checkAcceptedProposals   // TO ADD TO POSTMAN
* GET	https://ip_address:port/api/students/:studentId/courses/:courseName/team                     // TO ADD TO POSTMAN
* GET	https://ip_address:port/api/students/:studentId/teams
* GET	https://ip_address:port/api/students/:studentId/vms
* GET	https://ip_address:port/api/students/:studentId/teamProposals/:teamProposalId/checkToken  // TO ADD TO POSTMAN

*Labs*
* GET	https://ip_address:port/api/labs/assignments/:assignmentId
* GET	https://ip_address:port/api/labs/assignments/:assignmentId/course
* GET	https://ip_address:port/api/labs/assignments/:assignmentId/professor
* GET	https://ip_address:port/api/labs/assignments/:assignmentId/reports
* GET	https://ip_address:port/api/labs/reports/:reportId
* GET	https://ip_address:port/api/labs/reports/:reportId/assignment
* GET	https://ip_address:port/api/labs/reports/:reportId/owner
* GET	https://ip_address:port/api/labs/reports/:reportId/versions
* GET	https://ip_address:port/api/labs/versions/:versionId
* GET	https://ip_address:port/api/labs/versions/:versionId/report

*Teams*
* GET	https://ip_address:port/api/teams/:teamId
* GET	https://ip_address:port/api/teams/:teamId/course
* GET	https://ip_address:port/api/teams/:teamId/members
* GET	https://ip_address:port/api/teams/:teamId/vms
* GET	https://ip_address:port/api/teams/teamProposals/:teamProposalId
* GET	https://ip_address:port/api/teams/teamProposals/:teamProposalId/course
* GET	https://ip_address:port/api/teams/teamProposals/:teamProposalId/creator
* GET	https://ip_address:port/api/teams/teamProposals/:teamProposalId/members

*Vms*
* GET	https://ip_address:port/api/vms/:vmId
* GET	https://ip_address:port/api/vms/:vmId/team
* GET	https://ip_address:port/api/vms/:vmId/owner
* GET	https://ip_address:port/api/vms/vmModels
* GET	https://ip_address:port/api/vms/vmModels/osMap                   //TO ADD TO POSTMAN
* GET	https://ip_address:port/api/vms/vmModels/:vmModelId
* GET	https://ip_address:port/api/vms/vmModels/:vmModelId/course
* GET	https://ip_address:port/api/vms/vmModels/:vmModelId/professor
* GET	https://ip_address:port/api/vms/vmModels/:vmModelId/vms
* GET	https://ip_address:port/api/vms/vmModels/:vmModelId/vmModel      //TO ADD TO POSTMAN

---  
**POST**

*Authentication*
* POST https://ip_address:port/auth/login                                //TO ADD TO POSTMAN
* POST https://ip_address:port/auth/signup                               //TO ADD TO POSTMAN

*Courses*
* POST https://ip_address:port/api/courses
* POST https://ip_address:port/api/courses/:courseName/assignProfessor
* POST https://ip_address:port/api/courses/:courseName/enrollOne
* POST https://ip_address:port/api/courses/:courseName/enrollMany
* POST https://ip_address:port/api/courses/:courseName/unrollMany
* POST https://ip_address:port/api/courses/:courseName/setVmModel
* POST https://ip_address:port/api/courses/:courseName/addAssignment

*Teams*
* POST https://ip_address:port/api/teams/addTeamProposal
* POST https://ip_address:port/api/teams/:teamId/createVm

*Labs*
* POST https://ip_address:port/api/labs/reports/:reportId/submitVersion
* POST https://ip_address:port/api/labs/versions/:versionId/review       TO ADD TO POSTMAN

*Students*
* POST https://ip_address:port/api/students/:studentId/courses/:courseName/assignments/:assignmentId/addReport // TO ADD TO POSTMAN

*Notification*
* POST	https://ip_address:port/notification/private/sendMessage
* POST	https://ip_address:port/notification/acceptByToken?tpId=:tpId&token=:token
* POST	https://ip_address:port/notification/rejectByToken?tpId=:tpId&token=:token
* POST	https://ip_address:port/notification/acceptById?tpId=:tpId&studentId=:studentId
* POST	https://ip_address:port/notification/rejectById?tpId=:tpId&studentId=:studentId

---
**PUT**

*Courses*
* PUT	https://ip_address:port/api/courses/:courseName
* PUT	https://ip_address:port/api/courses/:courseName/editVmModel

*Vms* 
* PUT	https://ip_address:port/api/vms/:vmId
* PUT	https://ip_address:port/api/vms/:vmId/powerOn
* PUT	https://ip_address:port/api/vms/:vmId/powerOff

*Labs* 
* PUT	https://ip_address:port/api/labs/reports/:reportId/gradeReport
* PUT   https://ip_address:port/api/labs/assignments/:assignmentId          //TO ADD TO POSTMAN

---
**DELETE**

*Courses*
* DELETE https://ip_address:port/api/courses/:courseName

*Vms*
* DELETE https://ip_address:port/api/vms/:vmId
* DELETE https://ip_address:port/api/vms/vmModels/:vmModelId

*Teams*
* DELETE https://ip_address:port/api/teams/:teamId
* DELETE https://ip_address:port/api/teams/teamProposals/:teamProposalId

*Labs*
* DELETE https://ip_address:port/api/labs/assignments/:assignmentId      //TO ADD TO POSTMAN
