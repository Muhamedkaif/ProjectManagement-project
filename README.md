# Project Management System

## Overview

Project Management System is a full-stack web application that helps users manage projects and tasks efficiently. The platform provides project tracking, task management, dashboard analytics, user authentication, and profile management features.

The application is designed to improve team productivity by providing a centralized workspace for organizing projects, monitoring progress, and tracking task completion.

---

## Features

### Authentication

* User Registration
* User Login
* JWT Authentication
* Protected Routes
* User Profile Management
* Account Deletion

### Project Management

* Create Projects
* View Projects
* Update Projects
* Delete Projects
* Project Progress Tracking
* Project Categories
* Project Status Management

### Task Management

* Create Tasks
* View Tasks
* Update Tasks
* Delete Tasks
* Task Priority Levels
* Task Status Tracking
* Due Date Management

### Dashboard

* Total Projects
* Completed Projects
* Total Tasks
* Completed Tasks
* Pending Tasks
* Real-time Statistics

---

## Technology Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* Axios
* React Router DOM
* Lucide React

### Backend

* Node.js
* Express.js
* Sequelize ORM
* JWT Authentication

### Database

* MySQL

### Deployment

* Frontend: Vercel
* Backend: Render
* Database: MySQL

---

## Installation

### Clone Repository

```bash
git clone https://github.com/Muhamedkaif/ProjectManagement-project.git
cd Project-Management-project
```

### Backend Setup

```bash
cd Backend
npm install
npm start
```

### Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

---

## Environment Variables

### Backend (.env)

```env
PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_NAME=project_management
DB_USER=root
DB_PASSWORD=password

JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

---

## API Endpoints

### Authentication

| Method | Endpoint           |
| ------ | ------------------ |
| POST   | /api/auth/register |
| POST   | /api/auth/login    |
| GET    | /api/auth/me       |

### Projects

| Method | Endpoint          |
| ------ | ----------------- |
| GET    | /api/projects     |
| GET    | /api/projects/:id |
| POST   | /api/projects     |
| PATCH  | /api/projects/:id |
| DELETE | /api/projects/:id |

### Tasks

| Method | Endpoint       |
| ------ | -------------- |
| GET    | /api/tasks     |
| GET    | /api/tasks/:id |
| POST   | /api/tasks     |
| PATCH  | /api/tasks/:id |
| DELETE | /api/tasks/:id |

### Dashboard

| Method | Endpoint             |
| ------ | -------------------- |
| GET    | /api/dashboard/stats |

---

## Future Enhancements

* Team Collaboration
* File Attachments
* Notifications
* Activity Logs
* Email Reminders
* Project Reports
* Calendar Integration

---

## Author

Muhamed Kaif K

Full Stack Developer
