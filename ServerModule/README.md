# Server Side
Tecnologie utilizzate:
* Java Spring 
* PostgreSQL/MongoDB/MariaDB

API
=================================

**GET**

*Courses*
* GET	http://ip_address:port/api/courses
* GET	http://ip_address:port/api/courses/:courseName
* GET	http://ip_address:port/api/courses/:courseName/enrolled
* GET	http://ip_address:port/api/courses/:courseName/teams
* GET	http://ip_address:port/api/courses/:courseName/professors
* GET	http://ip_address:port/api/courses/:courseName/vmModel
* GET	http://ip_address:port/api/courses/:courseName/teamProposals
* GET	http://ip_address:port/api/courses/:courseName/assignments

*Professors*
* GET	http://ip_address:port/api/professors
* GET	http://ip_address:port/api/professors/:professorId
* GET	http://ip_address:port/api/professors/:professorId/courses
* GET	http://ip_address:port/api/professors/:professorId/vmModels
* GET	http://ip_address:port/api/professors/:professorId/courses/:courseName/assignments  
  
*Students*
* GET	http://ip_address:port/api/students
* GET	http://ip_address:port/api/students/:studentId
* GET	http://ip_address:port/api/students/:studentId/courses
* GET	http://ip_address:port/api/students/:studentId/courses/:courseName/assignments/:assignmentId/reports
* GET	http://ip_address:port/api/students/:studentId/teams
* GET	http://ip_address:port/api/students/:studentId/vms
* GET	http://ip_address:port/api/students/:studentId/teamProposals

*Labs*
* GET	http://ip_address:port/api/labs/assignments/:assignmentId
* GET	http://ip_address:port/api/labs/assignments/:assignmentId/reports
* GET	http://ip_address:port/api/labs/reports/:reportId
* GET	http://ip_address:port/api/labs/reports/:reportId/versions
* GET	http://ip_address:port/api/labs/versions/:versionId

*Teams*
* GET	http://ip_address:port/api/teams/:teamId/vms 

*Vms*
* GET	http://ip_address:port/api/vms/:vmId
* GET	http://ip_address:port/api/vms/vmModels
* GET	http://ip_address:port/api/vms/vmModels/:vmModelId

---  
**POST**

*Courses*
* POST http://ip_address:port/api/courses
* POST http://ip_address:port/api/courses/:courseName/assignProfessor
* POST http://ip_address:port/api/courses/:courseName/enrollOne
* POST http://ip_address:port/api/courses/:courseName/enrollMany
* POST http://ip_address:port/api/courses/:courseName/setVmModel

*Teams*
* POST http://ip_address:port/api/teams/addTeamProposal
* POST http://ip_address:port/api/teams/:teamId/createVm

*Labs*
* POST http://ip_address:port/api/labs/reports/:reportId/submitVersion

---
**PUT**

*Courses*
* PUT	http://ip_address:port/api/courses/:courseName
* PUT	http://ip_address:port/api/courses/:courseName/editVmModel

*Vms* 
* PUT	http://ip_address:port/api/vms/:vmId/edit
* PUT	http://ip_address:port/api/vms/:vmId/powerOn
* PUT	http://ip_address:port/api/vms/:vmId/powerOff

*Labs* 
* PUT	http://ip_address:port/api/labs/reports/:reportId/gradeReport

*Notification*
* PUT	http://ip_address:port/api/notification/:teamProposalId/accept
* PUT	http://ip_address:port/api/notification/:teamProposalId/reject

---
**DELETE**

*Courses*
* DELETE http://ip_address:port/api/courses/:courseName
* DELETE http://ip_address:port/api/courses/:courseName/students

*Vms*
* DELETE http://ip_address:port/api/vms/:vmId
