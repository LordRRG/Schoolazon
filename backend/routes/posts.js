const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const auth = require('../middleware/auth');

// Get posts for a community
router.get('/', async (req,res)=>{
  try{
    const community = req.query.community;
    if(!community) return res.status(400).json({ error:'community required' });
    const posts = await Post.find({ community }).populate('author','name').sort({ createdAt: -1 }).limit(200);
    res.json(posts);
  }catch(err){ console.error(err); res.status(500).json({ error:'Server error' }); }
});

module.exports = router;
