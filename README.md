# Chappy — Real-Time Chat Application

A full-stack chat application built with **React + TypeScript**, **Node/Express**, **JWT authentication**, and **AWS DynamoDB**.

> ℹ️ The user interface is currently in **Swedish**.

**Live demo:** https://chappy-app-hk0i.onrender.com

---

## Features

- **Authentication**
  - Register/login with JWT
  - Passwords hashed with bcrypt
  - Session persisted in localStorage
- **Channels**
  - Create **public** or **locked** channels
  - Channel owner can delete/manage their channels
  - Messages display **username** and **timestamp**
  - Locked channels require login to access
- **Direct Messages (DM)**
  - Private 1:1 messaging between users
  - DM list + conversation UI
- **User & Account Management**
  - Users list with “Send message”
  - Users can delete **only their own** accounts

This project was developed as part of the **FED24 (Fullstack)** course.

---

## Tech Stack

**Frontend**
- React (TypeScript), React Router
- Zustand (state management)
- Zod (form validation)
- Custom CSS, Vite

**Backend**
- Node.js + Express (TypeScript)
- JWT auth, bcrypt
- AWS DynamoDB, AWS SDK v3

**Infrastructure**
- Render (deployment)
- GitHub (source control)
- DynamoDB (NoSQL database)

---

## Local Development (high-level)

1. Install dependencies for frontend and backend (depending on your repo structure).
2. Configure environment variables (JWT secret + DynamoDB/AWS settings).
3. Start the backend, then start the frontend.

---
