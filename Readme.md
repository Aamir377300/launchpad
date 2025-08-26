# 🚀 Launchpad

A full-stack web application for student onboarding, authentication, and test management built with **React + Vite** (frontend) and **Express + MongoDB** (backend).

🌐 **Live Deployment:**  
[Launchpad on Vercel](https://launchpadsfinal.vercel.app/mainpage)

---

## 📁 Folder Structure

```
project/
├── backend/       → Node.js + Express API
└── frontend/      → React + Vite app
```

---

## 🧪 Features

- User Signup & Login
- Admin Panel for control
- Student Dashboard
- Test instructions page
- MongoDB backend with JWT authentication
- Deployment-ready on Vercel

---

## 🔧 Full Setup Guide

### ✅ Backend Setup

1. **Go to the backend folder**  
   ```bash
   cd backend
   ```

2. **Initialize Node.js project (if not already initialized)**  
   ```bash
   npm init -y
   ```

3. **Install backend dependencies**  
   ```bash
   npm install bcryptjs cors dotenv express jsonwebtoken mongoose
   ```

4. **Setup `.env` file**  
   Create a `.env` file inside `/backend`:
   ```
   MONGO_URI=your mongodb string
   JWT_SECRET=mystrongsecretkey123
   PORT=5002

   SMTP_EMAIL=abc724805@gmail.com
   SMTP_PASS=pquy ooaz xwth oqtx
   ```

5. **Update package.json scripts**  
   In `backend/package.json`, set:
   ```json
   "scripts": {
     "start": "nodemon server.js"
   }
   ```

6. **Start the backend server**
   ```bash
   npm start
   ```

---

### ✅ Frontend Setup

1. **Open a new terminal & go to the frontend folder**  
   ```bash
   cd frontend
   ```

2. **Initialize frontend project (if not already initialized)**  
   ```bash
   npm init -y
   ```

3. **Install frontend dependencies**  
   ```bash
   npm install react react-dom react-icons react-router-dom axios
   ```

4. **Install Vite & ESLint as dev dependencies**  
   ```bash
   npm install --save-dev eslint @vitejs/plugin-react vite
   ```

5. **Install everything again (for safety)**  
   ```bash
   npm install
   ```

6. **Update package.json scripts**
   In `frontend/package.json`, set:
   ```json
   "scripts": {
     "dev": "vite"
   }
   ```

7. **Run the frontend dev server**  
   ```bash
   npm run dev
   ```

---

🔴 .env file **Run the frontend dev server**  
   ```bash
   VITE_API_URL = https://launchpad-2.onrender.com
   ```

---

## 👨‍💻 Contributors
- Aamir Khan 
- Abhishek Kumar Chauhan  
-Devansh Verma  
