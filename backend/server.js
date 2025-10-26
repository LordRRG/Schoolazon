require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');

const authRoutes = require('./routes/auth');
const communityRoutes = require('./routes/communities');
const resourceRoutes = require('./routes/resources');
const postsRoutes = require('./routes/posts');

const Post = require('./models/Post');
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/schoolazon';

mongoose.connect(MONGODB_URI, { useNewUrlParser:true, useUnifiedTopology:true })
  .then(()=> console.log('MongoDB connected'))
  .catch(err=> console.error('MongoDB connection error', err));

app.use('/api/auth', authRoutes);
app.use('/api/communities', communityRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/posts', postsRoutes);

app.get('/', (req,res)=> res.send({ ok:true, msg:'Schoolazon backend running with realtime' }));

// create HTTP server and attach Socket.IO
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: { origin: true, methods: ['GET','POST'] }
});

// Simple token auth helper for socket (re-using JWT secret)
const jwt = require('jsonwebtoken');
const authMiddleware = async (token) => {
  try{
    if(!token) return null;
    const data = jwt.verify(token.replace('Bearer ','') , process.env.JWT_SECRET || 'devsecret');
    const user = await User.findById(data.id).select('-passwordHash');
    return user;
  }catch(err){
    return null;
  }
};

io.on('connection', (socket) => {
  console.log('Socket connected', socket.id);

  // join community room
  socket.on('join_community', async ({ communityId, token })=>{
    const user = await authMiddleware(token);
    if(!user) {
      socket.emit('error', { message: 'Authentication failed for socket' });
      return;
    }
    socket.join('community_' + communityId);
    socket.data.user = user;
    socket.emit('joined', { communityId });
  });

  // handle sending a new post (with optional attachmentUrl)
  socket.on('send_post', async ({ communityId, text, attachmentUrl })=>{
    const user = socket.data.user;
    if(!user) {
      socket.emit('error', { message: 'Not authenticated' });
      return;
    }
    if(!communityId) { socket.emit('error', { message:'communityId required' }); return; }
    const post = new Post({
      text: text || '',
      author: user._id,
      community: communityId,
      attachmentUrl: attachmentUrl || null
    });
    await post.save();
    const populated = await Post.findById(post._id).populate('author','name');
    io.to('community_' + communityId).emit('new_post', populated);
  });

  socket.on('disconnect', ()=> {
    console.log('Socket disconnected', socket.id);
  });
});

server.listen(PORT, ()=> console.log('Server running on port', PORT));
