const express = require('express');
const router = express.Router();
const Community = require('../models/Community');
const auth = require('../middleware/auth');

router.post('/', auth, async (req,res)=>{
  try{
    const { name, schoolName, grade, description } = req.body;
    const c = new Community({ name, schoolName, grade, description, createdBy: req.user._id });
    await c.save();
    res.json(c);
  }catch(err){ console.error(err); res.status(500).json({ error:'Server error' }); }
});

router.get('/', async (req,res)=>{
  const q = req.query.q;
  const filter = q ? { name: new RegExp(q, 'i') } : {};
  const list = await Community.find(filter).limit(50);
  res.json(list);
});

router.get('/:id', async (req,res)=>{
  const c = await Community.findById(req.params.id);
  if(!c) return res.status(404).json({ error:'Not found' });
  res.json(c);
});

module.exports = router;
