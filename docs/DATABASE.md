Database Setup Instructions
---------------------------
Step 1: Create Database
CREATE DATABASE project_management;
Step 2: Configure Database Connection

Update Backend .env file:

DB_HOST=localhost
DB_PORT=3306
DB_NAME=project_management
DB_USER=root
DB_PASSWORD=your_password
Step 3: Run Application

The application uses Sequelize ORM.

When the server starts, Sequelize automatically creates tables if they do not exist.

npm run dev
Main Tables
Users
----------------------
Stores user information.
-----------------------
Column
id
name
email
password
createdAt
updatedAt
Projects
-------------------------
Stores project information.
------------------------------
Column
id
name
description
status
progress
startDate
dueDate
category
ownerId
Tasks
--------------------------
Stores task information.
-------------------------
Column
id
projectId
title
description
status
priority
dueDate
ownerId