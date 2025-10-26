// Simple seed script to create demo user and community
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Community = require('./models/Community');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/schoolazon';
mongoose.connect(MONGODB_URI, { useNewUrlParser:true, useUnifiedTopology:true }).then(async ()=>{
  console.log('Connected');
  await User.deleteMany({});
  await Community.deleteMany({});

  const u = new User({ name:'Demo Student', email:'demo@schoolazon.local', passwordHash: await require('bcrypt').hash('password',10) });
  await u.save();
  const c = new Community({ name:'Demo Grade 10 DPS', schoolName:'DPS', grade:'10', description:'Demo community', createdBy: u._id });
  await c.save();
  console.log('Seed done. Demo user: demo@schoolazon.local / password');
  process.exit(0);
}).catch(err=>{ console.error(err); process.exit(1); });
