# Server Side
Tecnologie utilizzate:
* Java Spring 
* PostgreSQL/MongoDB/MariaDB

API
=================================

**GET**

* GET	http://ip_address:port/api/professors
* GET	http://ip_address:port/api/professors/:professorId
* GET	http://ip_address:port/api/professors/:professorId/courses
* GET	http://ip_address:port/api/professors/:professorId/vmModels
* GET	http://ip_address:port/api/professors/:professorId/courses/:courseName/assignments
* GET	http://ip_address:port/api/courses
* GET	http://ip_address:port/api/courses/enrolled
* GET	http://ip_address:port/api/courses/teams
* GET	http://ip_address:port/api/courses/professors
* GET	http://ip_address:port/api/course/:courseName
* GET	http://ip_address:port/api/courses/:courseName/vmModel
* GET	http://ip_address:port/api/courses/:courseName/assignments
* GET	http://ip_address:port/api/courses/:courseName/teamProposals
* GET	http://ip_address:port/api/courses/:courseName/assignments
* GET	http://ip_address:port/api/courses/:courseName/teams/:teamId/vms 
* GET	http://ip_address:port/api/students
* GET	http://ip_address:port/api/students/:studentId
* GET	http://ip_address:port/api/students/:studentId/courses
* GET	http://ip_address:port/api/students/:studentId/teams
* GET	http://ip_address:port/api/students/:studentId/vms
* GET	http://ip_address:port/api/students/:studentId/teamProposals
* GET	http://ip_address:port/api/students/:studentId/courses/:courseName/assignments/:assignmentId/reports -> `List of reports of an assignment of the course for a specific student`

**POST**


