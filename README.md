# PanScience

A full-stack task management application with a modern React frontend and a Node.js/Express backend, using MongoDB for data storage. The project supports user authentication, task management, document uploads, and admin features, and is easily deployable with Docker Compose.

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Running with Docker Compose](#running-with-docker-compose)
- [API Overview](#api-overview)
- [Environment Variables](#environment-variables)
- [Workflow](#workflow)
- [Admin Credentials](#admin-credentials)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **User Authentication:** Register, log in, and manage your profile securely.
- **Task Management:**
  - View, create, update, and delete tasks (admin only for create/update/delete).
  - Assign tasks to users, set priorities, due dates, and upload PDF documents.
  - Filter, sort, and paginate tasks.
  
- **User Management (Admin):**
  - View all users, edit user roles, and delete users.
- **Document Management:**
  - Upload and preview PDF documents for tasks.
- **Responsive UI:**
  - Mobile-friendly design with Bootstrap components.
- **Notifications:**
  - Real-time feedback using React Toastify.
- **API:**
  - RESTful endpoints for users and tasks.
- **Dockerized:**
  - Easy local development with Docker Compose and MongoDB.

---

## Tech Stack

- **Frontend:**
  - React 19, Vite, Redux Toolkit, React Router v7, Bootstrap 5, React-Bootstrap, React Toastify, date-fns, ESLint
- **Backend:**
  - Node.js, Express, MongoDB (via Mongoose), JWT, Multer (file uploads), Cloudinary (document storage), dotenv, bcryptjs, CORS
- **Database:**
  - MongoDB (Dockerized)
- **DevOps:**
  - Docker Compose

---

## Project Structure

```
PanScience/
  ├── Backend/         # Express backend API
  ├── Frontend/        # React frontend app
  ├── docker-compose.yml  # Docker Compose for MongoDB
  └── README.md        # Project root documentation
```

---

## Getting Started

### Backend Setup

1. **Install dependencies:**
   ```bash
   cd Backend
   npm install
   ```
2. **Configure environment variables:**
   - Copy `.env.example` to `.env` and set values for:
     - `MONGO_URI` (e.g., `mongodb://localhost:27017/panscience`)
     - `JWT_SECRET`
     - `CLOUDINARY_*` (if using Cloudinary for document storage)
3. **Start the backend server:**
   ```bash
   npm run dev
   # or
   npm start
   ```
   The backend runs on [http://localhost:3000](http://localhost:3000)

### Frontend Setup

1. **Install dependencies:**
   ```bash
   cd Frontend
   npm install
   ```
2. **Start the frontend dev server:**
   ```bash
   npm run dev
   ```
   The app will be available at [http://localhost:5173](http://localhost:5173)

### Running with Docker Compose

1. **Set up environment variables:**
   - Create a `.env` file in the root or Backend directory with MongoDB credentials:
     ```env
     MONGO_INITDB_ROOT_USERNAME=youruser
     MONGO_INITDB_ROOT_PASSWORD=yourpassword
     ```
   - Update `MONGO_URI` in Backend's `.env` to:
     ```env
     MONGO_URI=mongodb://youruser:yourpassword@localhost:27017/panscience?authSource=admin
     ```
2. **Start MongoDB with Docker Compose:**
   ```bash
   docker-compose up -d
   ```
   This will start a MongoDB container accessible at `localhost:27017`.

---

## API Overview

### User Endpoints
- `POST   /api/users/register` – Register a new user
- `POST   /api/users/login` – Log in
- `PUT    /api/users/mine` – Update own credentials (auth required)
- `GET    /api/users/` – List all users (admin only)
- `PUT    /api/users/:id` – Update user role (admin only)
- `DELETE /api/users/mine` – Delete own account
- `GET    /api/users/:id` – Get user by ID (admin only)
- `DELETE /api/users/:id` – Delete user (admin only)

### Task Endpoints
- `POST   /api/tasks/` – Create task (admin only, supports PDF upload)
- `GET    /api/tasks/` – List all tasks (admin only)
- `GET    /api/tasks/my` – List my tasks
- `GET    /api/tasks/:id` – Get task by ID
- `PUT    /api/tasks/:id` – Update task (admin only, supports PDF upload)
- `DELETE /api/tasks/:id` – Delete task (admin only)

---

## Environment Variables

- **Backend:**
  - `MONGO_URI` – MongoDB connection string
  - `JWT_SECRET` – Secret for JWT authentication
  - `CLOUDINARY_*` – Cloudinary credentials for document storage
- **Frontend:**
  - API base URL (set in API slice or via environment variable)
- **Docker Compose:**
  - `MONGO_INITDB_ROOT_USERNAME`, `MONGO_INITDB_ROOT_PASSWORD`

---


## Workflow

### Authentication
**Register/Login**  
![Login Screenshot](/images/login.png)  
*Secure JWT-based authentication flow*

### Normal User Experience
**Home Page**  
![Homepage Screenshot](/images/homepage.png)  
*Tasks assigned to current user with status indicators*

**Task Details**  
*View task details and attached documents (PDF preview)*


**Update Profile**  
*Edit personal credentials*

### Admin Experience
**Admin Dashboard**  
![Admin Homepage Screenshot](/images/adminHomepage.png)  
*Overview with quick access to all management features*

**User Management**  
![All Users Screenshot](/images/allUsers.png)  
*View/edit user roles and accounts*

**Task Management**  
![All Tasks Screenshot](/images/allTasks.png)  
*Global task list with filtering/sorting*

**Create Task**  
![Create Task Screenshot](/images/createTask.png)  
*Assign tasks with priority/dates/attachments*

**Update Task**  
![Update Task Screenshot](/images/updateTask.png)  
*Modify existing tasks and documents*


---

## Admin Credentials

For testing purposes, you can use the following admin account:
Email: admin@gmail.com
Password: 654321 or 123456

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---




