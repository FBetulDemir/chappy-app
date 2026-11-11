# Chappy — Chat Application

A full-stack chat application built with **React + TypeScript**, **Node/Express**, **JWT authentication**, and **AWS DynamoDB**.

> ℹ️ The user interface is currently in **Swedish**.

**Live demo:** https://chappy-app-hk0i.onrender.com

> ⏳ The demo runs on Render's free plan, so the first load can take up to a minute while the server wakes up.

---

## Features

- **Guest mode**
  - Continue without an account ("Fortsätt som gäst")
  - Read and post in public channels as "guest"
  - Locked channels, DMs and creating channels require login
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
- **Near real-time updates**
  - New channel messages and DMs are fetched every 5 seconds (polling)

This project was developed as part of the **FED24 (Fullstack)** course.

---

## Tech Stack

**Frontend**
- React (TypeScript), React Router
- Custom CSS, Vite

**Backend**
- Node.js + Express (TypeScript)
- JWT auth, bcrypt
- Zod (request validation)
- AWS SDK v3

**Infrastructure**
- AWS DynamoDB (single-table design)
- Render (deployment)
- GitHub (source control)

---

## Local Development

### 1. Create the DynamoDB table

In your AWS account, create a table with these settings (the region and table name are set in [`srcServer/data/dynamoDb.ts`](srcServer/data/dynamoDb.ts)):

| Setting | Value |
|---|---|
| Region | `eu-north-1` |
| Table name | `chappy` |
| Partition key | `PK` (String) |
| Sort key | `SK` (String) |

Then create an IAM user with an access key that can run `GetItem`, `PutItem`, `DeleteItem`, `Query` and `Scan` on that table.

### 2. Add environment variables

Create a `.env` file in the project root:

```
PORT=1337
ACCESS_KEY=<your AWS access key id>
SECRET_ACCESS_KEY=<your AWS secret access key>
JWT_SECRET=<any long random string>
```

### 3. Install and run

```bash
npm install

# Terminal 1 – backend (http://localhost:1337)
npm run build-server
npm run start-server

# Terminal 2 – frontend (http://localhost:5173, proxies /api to the backend)
npm run dev
```

To run the production build locally, run `npm run predeploy` and then `npm run start-server`. The backend then serves the frontend at http://localhost:1337.
