Backend setup
-------------
1. Copy .env.example -> .env and fill values (MONGODB_URI, JWT_SECRET, Cloudinary keys)
2. npm install
3. npm run seed   # to create demo user/community
4. npm run dev    # requires nodemon
5. API endpoints:
   - POST /api/auth/signup
   - POST /api/auth/login
   - GET  /api/communities?q=...
   - POST /api/communities  (auth required)
   - POST /api/resources/upload (auth, multipart/form-data field 'file')


Socket.IO: Backend now serves Socket.IO on the same port. Clients should connect to the backend origin.
