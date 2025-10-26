const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Signup
router.post('/signup', async (req,res)=>{
  try{
    const { name, email, password } = req.body;
    if(!name||!email||!password) return res.status(400).json({ error:'Missing fields' });
    const existing = await User.findOne({ email });
    if(existing) return res.status(400).json({ error:'Email exists' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ name, email, passwordHash });
    await user.save();
    const token = jwt.sign({ id:user._id }, process.env.JWT_SECRET || 'devsecret', { expiresIn:'7d' });
    res.json({ token, user: { id:user._id, name:user.name, email:user.email } });
  }catch(err){
    console.error(err);
    res.status(500).json({ error:'Server error' });
  }
});

// Login
router.post('/login', async (req,res)=>{
  try{
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if(!user) return res.status(400).json({ error:'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if(!ok) return res.status(400).json({ error:'Invalid credentials' });
    const token = jwt.sign({ id:user._id }, process.env.JWT_SECRET || 'devsecret', { expiresIn:'7d' });
    res.json({ token, user: { id:user._id, name:user.name, email:user.email } });
  }catch(err){
    console.error(err);
    res.status(500).json({ error:'Server error' });
  }
});

// Get profile (requires JWT)
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    const token = authHeader.replace('Bearer ', '');
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
    } catch {
      return res.status(401).json({ error: 'Invalid token' });
    }
    const user = await User.findById(payload.id).select('-passwordHash');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ id: user._id, name: user.name, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
