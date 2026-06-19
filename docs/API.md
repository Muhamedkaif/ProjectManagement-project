API Documentation
--------------------------
Base URL:

http://localhost:5000/api
------------------
Authentication APIs
-----------------
Register User
---------------

POST

/api/auth/register

Request:

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response:

{
  "status": "success",
  "message": "Registration successful"
}
-----------------
Login User
----------------

POST

/api/auth/login

Request:

{
  "email": "john@example.com",
  "password": "password123"
}

Response:

{
  "status": "success",
  "token": "jwt_token"
}
----------------
Get Current User
------------------
GET

/api/auth/me

Headers:

Authorization: Bearer <token>
---------------
Project APIs
----------------
Get All Projects
----------

GET

/api/projects
Get Single Project

GET

/api/projects/:id
Create Project

POST

/api/projects

Request:

{
  "name": "Project Name",
  "description": "Project Description",
  "status": "Planning",
  "category": "Web Development"
}
------------------
Update Project
-----------------
PATCH

/api/projects/:id
Delete Project
-----------
DELETE
-----------

/api/projects/:id

------------
Task APIs
------------
Get All Tasks

GET

/api/tasks
Get Task By ID

GET

/api/tasks/:id
--------------
Create Task
----------

POST

/api/tasks

Request:

{
  "projectId": 1,
  "title": "Create Dashboard",
  "description": "Build dashboard page",
  "status": "To Do",
  "priority": "High"
}
---------------
Update Task
-------------
PATCH

/api/tasks/:id
Delete Task

------------
DELETE
-------------

/api/tasks/:id
--------------
Dashboard APIs
-----------------
Get Dashboard Statistics

GET

/api/dashboard/stats

Response:

{
  "totalProjects": 10,
  "completedProjects": 3,
  "totalTasks": 20,
  "completedTasks": 8,
  "pendingTasks": 7
}