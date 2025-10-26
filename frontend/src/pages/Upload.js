import React, { useState } from 'react';
import api from '../api';

export default function Upload({ community, onUploaded }){
  const [file,setFile]=useState(null);
  const [title,setTitle]=useState('');
  const [desc,setDesc]=useState('');
  const [msg,setMsg]=useState('');

  const submit = async (e)=>{
    e.preventDefault();
    if(!file) { setMsg('Choose a file'); return; }
    const fd = new FormData();
    fd.append('file', file);
    fd.append('title', title);
    fd.append('description', desc);
    fd.append('communityId', community._id);
    const res = await api.post('/resources/upload', fd, { headers: {'Content-Type':'multipart/form-data'} });
    setMsg('Uploaded');
    setFile(null); setTitle(''); setDesc('');
    onUploaded();
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <h4 className="card-title mb-3">Upload to {community.name}</h4>
          <form onSubmit={submit}>
            <div className="mb-3">
              <input
                className="form-control"
                placeholder="Title"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                className="form-control"
                type="file"
                onChange={e => setFile(e.target.files[0])}
              />
            </div>
            <div className="mb-3">
              <textarea
                className="form-control"
                placeholder="Description"
                value={desc}
                onChange={e => setDesc(e.target.value)}
              />
            </div>
            <button className="btn btn-primary" type="submit">Upload</button>
          </form>
          {msg && <div className="mt-3 alert alert-info">{msg}</div>}
        </div>
      </div>
    </div>
  );
}
