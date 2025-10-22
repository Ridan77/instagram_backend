# 🧩 InstaStam Backend

![Node.js](https://img.shields.io/badge/node-%3E%3D16-green)
![Express](https://img.shields.io/badge/express-4.x-lightgrey)
![MongoDB](https://img.shields.io/badge/database-MongoDB-green)
![Socket.io](https://img.shields.io/badge/realtime-Socket.io-blue)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

**InstaStam Backend** powers the server-side logic for the InstaStam full-stack social media platform — providing **REST APIs**, **real-time communication**, **authentication**, and **media uploads**.

## It’s built with **Node.js**, **Express**, and **MongoDB**, with live updates via **Socket.io**

## 🌍 Live API

🔗 [InstaStam on Render](https://instastam.onrender.com/story)  
🔗 [Frontend Repository](https://github.com/Ridan77/instgram_frontend)

---

## ⚙️ Tech Stack

- **Node.js** + **Express.js** – RESTful API & middleware
- **MongoDB** – NoSQL database & schemas
- **Socket.io** – Real-time chat and notifications
- **JWT** – Authentication and route protection
- **bcrypt** – Secure password hashing
- **dotenv** – Environment configuration
- **CORS** – Cross-origin request handling

---

## 🧱 Architecture Overview

The backend is designed for **clean modularity** and **scalability**:

```plaintext
backend/
├── api/
│   ├── auth/         # Login, signup, logout routes
│   ├── user/         # User CRUD, follow/unfollow, profile
│   └── story/        # Story & post management
│
├── services/
│   ├── auth.service.js
│   ├── user.service.js
│   ├── als.service.js
│   ├── logger.service.js
│   ├── db.service.js
│   └── socket.service.js
│
├── sockets/
│   └── socket.service.js      # Handles connections and rooms
│
├── app.js                     # Express app setup
└── server.js                  # Entry point (with Socket.io)

```

## 🧱 Architecture Overview

User signup/login → credentials verified via bcrypt

JWT token issued and stored in localStorage (frontend)

Protected routes verified using middleware on each request

---

| Method        | Endpoint                | Description                        |
| ------------- | ----------------------- | ---------------------------------- |
| **POST**      | `/api/auth/login`       | Authenticate user & return JWT     |
| **POST**      | `/api/auth/signup`      | Register new user                  |
| **GET**       | `/api/user`             | Get all users                      |
| **GET**       | `/api/user/:id`         | Get user by ID                     |
| **POST**      | `/api/story`            | Create new story/post              |
| **GET**       | `/api/story`            | Get feed stories                   |
| **GET**       | `/api/story/:id`        | Get single story                   |
| **DELETE**    | `/api/story/:id`        | Delete a story                     |
| **POST**      | `/api/comment/:storyId` | Add comment to story               |
| **POST**      | `/api/like/:storyId`    | Add like to story                  |
| **Socket.io** | `/socket.io`            | Real-time mesaging & notifications |

---


## 📜 License

Distributed under the **MIT License**.  
Built with ❤️ by **Dan Ribak** as part of the **Coding Academy Final Project**.
