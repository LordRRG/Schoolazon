const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const Resource = require('../models/Resource');
const auth = require('../middleware/auth');

// configure cloudinary from env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

router.post('/upload', auth, upload.single('file'), async (req,res)=>{
  try{
    const { title, description, communityId, tags } = req.body;
    if(!req.file) return res.status(400).json({ error:'File required' });
    // upload buffer to cloudinary
    const streamifier = require('streamifier');
    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
          if (result) resolve(result);
          else reject(error);
        });
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };
    const result = await streamUpload(req.file.buffer);
    const resDoc = new Resource({
      title,
      description,
      fileUrl: result.secure_url,
      filePublicId: result.public_id,
      uploadedBy: req.user._id,
      community: communityId || null,
      tags: tags ? tags.split(',').map(t=>t.trim()) : []
    });
    await resDoc.save();
    res.json(resDoc);
  }catch(err){ console.error(err); res.status(500).json({ error:'Upload failed' }); }
});

router.get('/', async (req,res)=>{
  const community = req.query.community;
  const filter = community ? { community } : {};
  const list = await Resource.find(filter).populate('uploadedBy','name').sort({ createdAt: -1 }).limit(100);
  res.json(list);
});

module.exports = router;
