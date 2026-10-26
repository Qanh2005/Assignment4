# Assignment 4 - Full-stack Quiz Application

React + Redux frontend and Express + MongoDB backend. Regular users log in and take quizzes. Admins can create, read, update, and delete quizzes and questions.

## Demo accounts

| Username | Password | Role |
| -------- | -------- | ---- |
| John     | 123      | user (take quizzes) |
| Mary     | 123      | admin (CRUD quizzes/questions) |

These accounts are created automatically the first time the backend starts against an empty database.

## Requirements

- Node.js 18+
- MongoDB running locally (`mongodb://127.0.0.1:27017`)

## Setup

```bash
cd backend
npm install
npm start
```

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

- Frontend: http://localhost:3001
- Backend API: http://localhost:5000/api

If MongoDB uses a different URI, edit `backend/.env`.

## Features

### Backend
- Express server with `/api/auth`, `/api/quizzes`, `/api/questions`
- Mongoose models: User, Quiz, Question
- JWT authentication
- Validation and error handling
- Quiz/question CRUD (admin only)
- Score submission (correct answers stay on the server)

### Frontend
- React, Redux Toolkit, React Router
- Bootstrap 5 styling
- Login, register, logout
- Protected dashboard routes
- One-question-at-a-time quiz, then score + restart
- Admin **Manage** page for quiz and question CRUD
