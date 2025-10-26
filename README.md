Schoolazon MVP - compact full-stack starter
==========================================
What is included:
- backend/ : Node.js + Express + MongoDB starter with auth, communities, resource upload (Cloudinary)
- frontend/: React app (minimal) to signup/login, create/join communities, upload resources

Quick start (local development)
-------------------------------
1. Backend:
   cd backend
   cp .env.example .env   # edit values
   npm install
   npm run seed
   npm run dev

2. Frontend:
   cd frontend
   npm install
   create a .env with REACT_APP_API_URL=http://localhost:5000/api
   npm start

Notes:
- For file uploads frontend->backend->Cloudinary you must fill Cloudinary keys in backend .env
- This project is a compact starting point. I can expand authentication flows, add email verification, pagination, search, moderation UI, and Tailwind styling on request.


Real-time: This version adds Socket.IO for live posts per community. Frontend uses socket.io-client.
LordRRG#2711