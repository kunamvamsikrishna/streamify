# Streamify

A full-stack video calling and chat application built with React, Node.js, Express, and Stream.io.

## Features

- 🔐 User Authentication (Signup/Login)
- 👥 Friend Management System
- 💬 Real-time Chat
- 📹 Video Calling
- 🔔 Notifications
- 🎨 Dark/Light Theme Support

## Tech Stack

### Frontend
- React 19
- Vite
- React Router
- Stream.io Video SDK
- Stream.io Chat SDK
- Axios
- React Query
- Tailwind CSS + DaisyUI
- Zustand

### Backend
- Node.js
- Express
- MongoDB (Mongoose)
- Stream.io
- JWT Authentication
- Bcrypt

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB database
- Stream.io account (for API keys)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/kunamvamsikrishna/streamify.git
cd streamify
```

2. Backend Setup:
```bash
cd BACKEND
npm install
```

Create a `.env` file in the `BACKEND` directory:
```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
SECRET_KEY=your_jwt_secret_key
STREAM_API_KEY=your_stream_api_key
STREAM_SECRET_KEY=your_stream_secret_key
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

3. Frontend Setup:
```bash
cd FRONTEND
npm install
```

Create a `.env` file in the `FRONTEND` directory:
```env
VITE_API_URL=http://localhost:5001/api
VITE_STREAM_API_KEY=your_stream_api_key
```

### Running the Application

1. Start the backend:
```bash
cd BACKEND
npm run dev
```

2. Start the frontend (in a new terminal):
```bash
cd FRONTEND
npm run dev
```

The application will be available at `http://localhost:5173`

## Deployment on Render

### Backend Deployment

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure:
   - **Build Command**: `cd BACKEND && npm install`
   - **Start Command**: `cd BACKEND && npm start`
   - **Environment**: Node
4. Add environment variables:
   - `PORT` (Render will provide this automatically)
   - `MONGO_URI` (your MongoDB connection string)
   - `SECRET_KEY` (your JWT secret)
   - `STREAM_API_KEY` (your Stream API key)
   - `STREAM_SECRET_KEY` (your Stream secret key)
   - `FRONTEND_URL` (your frontend URL, e.g., `https://streamify-frontend.onrender.com`)
   - `NODE_ENV=production`

### Frontend Deployment

1. Create a new Static Site on Render
2. Connect your GitHub repository
3. Configure:
   - **Build Command**: `cd FRONTEND && npm install && npm run build`
   - **Publish Directory**: `FRONTEND/dist`
4. Add environment variables:
   - `VITE_API_URL` (your backend URL, e.g., `https://streamify-backend.onrender.com/api`)
   - `VITE_STREAM_API_KEY` (your Stream API key)

**Note**: After adding environment variables, you need to rebuild the frontend service.

## Project Structure

```
streamify/
├── BACKEND/
│   ├── src/
│   │   ├── controllers/
│   │   ├── lib/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   ├── package.json
│   └── .env
├── FRONTEND/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── store/
│   │   └── App.jsx
│   ├── package.json
│   └── .env
└── README.md
```

## Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 5001)
- `MONGO_URI` - MongoDB connection string
- `SECRET_KEY` - JWT secret key
- `STREAM_API_KEY` - Stream.io API key
- `STREAM_SECRET_KEY` - Stream.io secret key
- `FRONTEND_URL` - Frontend URL for CORS
- `NODE_ENV` - Environment (development/production)

### Frontend (.env)
- `VITE_API_URL` - Backend API URL
- `VITE_STREAM_API_KEY` - Stream.io API key

## License

ISC

## Author

Kunam Vamsi Krishna

