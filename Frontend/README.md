# PanScience Frontend

A modern task management web application built with React, Vite, Redux Toolkit, and Bootstrap. This frontend interfaces with the PanScience backend to provide a seamless experience for users and administrators to manage tasks, users, and documents.

## Features

- **User Authentication:** Register, log in, and manage your profile securely.
- **Task Management:**
  - View your assigned tasks with filtering, sorting, and pagination.
  - Create new tasks (admin only) with document (PDF) uploads.
  - View detailed task information, including attached documents with preview and download options.
  - Update tasks (admin only).
- **User Management (Admin):**
  - View all users, edit user roles, and delete users.
- **Responsive UI:**
  - Mobile-friendly design with off-canvas filters and modern Bootstrap components.
- **Notifications:**
  - Real-time feedback using React Toastify.

## Main Screens & Routes

- `/login` – User login
- `/register` – User registration
- `/` – Home (your tasks, requires login)
- `/tasks/:id` – Task details
- `/profile` – User profile
- `/create-task` – Create a new task (admin only)
- `/tasks` – All tasks (admin only)
- `/users` – User management (admin only)
- `/update-task/:id` – Update a task (admin only)

## Tech Stack

- **React 19** with functional components and hooks
- **Vite** for fast development and build
- **Redux Toolkit** for state management
- **React Router v7** for routing
- **Bootstrap 5** and **React-Bootstrap** for UI
- **React Toastify** for notifications
- **date-fns** for date formatting
- **ESLint** for code quality

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   The app will be available at [http://localhost:5173](http://localhost:5173) by default.

3. **Build for production:**
   ```bash
   npm run build
   # or
   yarn build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   # or
   yarn preview
   ```

### Linting

Run ESLint to check for code issues:
```bash
npm run lint
# or
yarn lint
```

## Project Structure

- `src/components/` – Reusable UI components (Header, Footer, Route guards, etc.)
- `src/screens/` – Main page components (Home, Login, Register, Task details, etc.)
- `src/routes/` – Route definitions
- `src/slices/` – Redux slices and API logic
- `src/store.js` – Redux store setup

## Environment Variables

This app expects the backend API to be running and accessible. Configure the API base URL in the API slice or via environment variables as needed.

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](../LICENSE)
