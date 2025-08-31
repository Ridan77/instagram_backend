# Coding Academy Backend Starter

A Node.js backend service supporting the Coding Academy E2E starter project. This service provides RESTful APIs, real-time WebSocket functionality, and MongoDB integration.

## 🚀 Quick Start

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm run dev     # Development mode with hot reload
npm start       # Production mode
```

## 📡 API Endpoints

### Cars API
- `GET /api/car` - Get all cars with optional filtering
- `GET /api/car/:id` - Get car by ID
- `POST /api/car` - Create new car
- `PUT /api/car/:id` - Update car
- `DELETE /api/car/:id` - Delete car
- `POST /api/car/:id/msg` - Add message to car

### Users API
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/user` - Get all users
- `GET /api/user/:id` - Get user by ID

### Reviews API
- `GET /api/review` - Get all reviews
- `POST /api/review` - Create new review
- `DELETE /api/review/:id` - Delete review

## 🏗️ Project Structure

```
api/
├── auth/         # Authentication routes and logic
├── user/         # User management
├── car/          # Car CRUD operations
└── review/       # Review system
services/
├── db.service.js       # Database connectivity
├── socket.service.js   # WebSocket functionality
├── logger.service.js   # Logging utility
└── util.service.js     # Helper functions
middlewares/
├── requireAuth.js      # Authentication middleware
└── setupAls.js        # Async local storage setup
```

## 💾 Database Schema

### Car Collection
```js
{
  vendor: String,
  speed: Number,
  owner: { type: ObjectId, ref: 'User' },
  msgs: [{
    id: String,
    txt: String,
    by: { _id, fullname }
  }]
}
```

### User Collection
```js
{
  username: String,
  password: String,
  fullname: String,
  score: Number,
  isAdmin: Boolean
}
```

### Review Collection
```js
{
  txt: String,
  byUserId: ObjectId,
  aboutUserId: ObjectId
}
```

## 🔒 Authentication

Uses JWT (JSON Web Tokens) for stateless authentication. Tokens are stored in cookies and validated through middleware.

## 🔌 WebSocket Events

- `user-watch` - User status updates
- `chat-new-msg` - New chat messages
- `review-about-you` - New review notifications
- `review-added` - Review created
- `review-removed` - Review deleted

## 🛠️ Development

### Error Handling
```js
try {
  // Your code
} catch (err) {
  logger.error('Failed to do something', err)
  throw err
}
```

### Async Local Storage
Used for tracking request context, especially for logging and user sessions.

## 📝 Logging

Logs are stored in the `/logs` directory with the following levels:
- DEBUG - Development information
- INFO - General application events
- WARN - Warning conditions
- ERROR - Error events

## 🔥 Production Deployment

1. Set production environment variables
2. Build the frontend:
```bash
cd ../frontend-react && npm run build
```
3. Start the server:
```bash
npm start
```

## 📄 License

Coding Academy - Built with ❤️ for teaching modern fullstack development
