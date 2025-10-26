import React, { useState } from 'react';
import socket from '../socket';
import api from '../api';

// Simple input that can send text and optional attachment (upload via existing /resources/upload to Cloudinary)
export default function PostInput({ community }){
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState('');
  const textareaRef = React.useRef();
  // Insert formatting at cursor
  const insertFormat = (format) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    let before = text.substring(0, start);
    let selected = text.substring(start, end);
    let after = text.substring(end);
    let markerStart, markerEnd;
    if (format === 'bold') {
      markerStart = '**'; markerEnd = '**';
    } else if (format === 'italic') {
      markerStart = '_'; markerEnd = '_';
    }
    let newText, newCursorPos;
    if (selected) {
      newText = before + markerStart + selected + markerEnd + after;
      newCursorPos = start + markerStart.length + selected.length + markerEnd.length;
    } else {
      newText = before + markerStart + markerEnd + after;
      newCursorPos = start + markerStart.length;
    }
    setText(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const send = async (e)=>{
    e.preventDefault();
    let attachmentUrl = null;
    try{
      if(file){
        const fd = new FormData();
        fd.append('file', file);
        fd.append('title', 'post-attachment');
        fd.append('description','attachment');
        fd.append('communityId', community._id);
        // use /resources/upload which returns resource object with fileUrl
        const res = await api.post('/resources/upload', fd, { headers: {'Content-Type':'multipart/form-data'} });
        attachmentUrl = res.data.fileUrl;
      }
      // emit via socket
      socket.emit('send_post', { communityId: community._id, text, attachmentUrl });
      setText(''); setFile(null); setMsg('Sent');
      setTimeout(()=>setMsg(''), 2000);
    }catch(err){
      console.error(err);
      setMsg('Failed to send');
    }
  };

  return (
    <div className="mb-4">
      <form onSubmit={send}>
        <div className="mb-2 d-flex gap-2">
          <button type="button" className="btn btn-primary" title="Bold" onClick={() => insertFormat('bold')}>
            <i className="bi bi-type-bold"></i>
          </button>
          <button type="button" className="btn btn-primary" title="Italic" onClick={() => insertFormat('italic')}>
            <i className="bi bi-type-italic"></i>
          </button>
        </div>
        <div className="mb-3">
          <textarea
            ref={textareaRef}
            className="form-control"
            placeholder="Write a quick post..."
            value={text}
            onChange={e => setText(e.target.value)}
            style={{height:80}}
          />
        </div>
        <div className="mb-3">
          <input
            className="form-control"
            type="file"
            onChange={e => setFile(e.target.files[0])}
          />
        </div>
        <button className="btn btn-primary" type="submit">Send</button>
        {msg && <span className="ms-3 text-success">{msg}</span>}
      </form>
    </div>
  );
}
