const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function auth(req,res,next){
  const header = req.headers.authorization;
  if(!header) return res.status(401).json({ error:'No token' });
  const token = header.split(' ')[1];
  try{
    const data = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
    const user = await User.findById(data.id).select('-passwordHash');
    if(!user) return res.status(401).json({ error:'Invalid token' });
    req.user = user;
    next();
  }catch(err){
    return res.status(401).json({ error:'Invalid token' });
  }
}

module.exports = auth;
