# Memora (Memory Revision App)

Memora is a full-stack memory revision application designed to help users create, manage, and revise tasks or memories. It features a React-based frontend powered by Vite and GSAP animations, and a Node.js/Express backend backed by MongoDB.

## Features

- **User Authentication**: Secure signup and login with hashed passwords (`bcryptjs`) and session-based tokens (`jsonwebtoken`, `cookie-parser`).
- **Revision Tasks**: Create and organize tasks or topics for memory retention and revision.
- **Modern User Interface**: Responsive design built with React, Vite, and smooth micro-animations powered by GSAP.

---

## Project Structure

```text
memora/
├── backend/      # Express API Server (Node.js & MongoDB)
├── frontend/     # React Client Application (Vite & GSAP)
└── README.md     # Project Documentation
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas URI)

---

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` folder and add your configuration details:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```

---

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.
