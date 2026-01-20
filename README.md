Chappy — Real-Time Chat Application (React + Node + DynamoDB)`

> ℹ️ The application UI is currently in Swedish.

Chappy is a full-stack chat application built with React, TypeScript, Express, JWT Authentication, and AWS DynamoDB.
Users can:

-Register & log in

-Create public or locked channels

-Send messages in channels

-Send private messages (DM)

-Delete their own accounts

-Manage their own channels

-A modern UI built with CSS and React Router

This project was developed as part of the FED24 course (Fullstack).

📌 Features

🔐 Authentication

Register and login with JWT

Passwords safely hashed using bcrypt

Logged-in user stored in localStorage

💬 Channels

Create channel (open or locked)

Only the channel owner can delete it

Messages show username & timestamp

Locked channels require login

📨 Direct Messages

Private DM between two users

Same message stored for both users

Clean sidebar UI for DM list + conversation

👤 User Profiles

Each user can delete only their own account

Users list page

“Send message” button for each user

🌐 Deployment

The app is deployed on Render:

👉 https://chappy-app-hk0i.onrender.com

Frontend

        React (TypeScript)

        React Router

        Zustand (state management)

        Zod (form validation)

        Custom CSS

        Vite build system

Backend

        Node.js + Express

        TypeScript

        JWT authentication

        DynamoDB (AWS)

        AWS SDK v3

        bcrypt for password hashing

Infrastructure

        Render (server deployment)

        GitHub (repository hosting)

        DynamoDB (NoSQL database)
