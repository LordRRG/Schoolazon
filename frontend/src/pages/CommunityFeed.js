import React, { useState, useEffect } from 'react';
import MarkdownIt from 'markdown-it';
import api from '../api';
import socket from '../socket';
import PostInput from './PostInput';

export default function CommunityFeed({ community }){
  const md = new MarkdownIt({ breaks: true });
  const [posts, setPosts] = useState([]);

  useEffect(()=>{
    if(!community) return;
    // fetch history
    let cancelled = false;
    api.get('/posts?community=' + community._id).then(r=>{
      if(!cancelled) setPosts(r.data);
    }).catch(()=>{});
    // connect socket and join room
    const token = localStorage.getItem('token');
    socket.connect();
    socket.emit('join_community', { communityId: community._id, token });
    socket.on('new_post', p=>{
      setPosts(prev => [p, ...prev]);
    });
    return ()=> {
      cancelled = true;
      socket.off('new_post');
      socket.disconnect();
    };
  }, [community]);

  return (
    <div className="mt-4">
      <h4 className="mb-3">Feed — {community.name}</h4>
      <PostInput community={community} />
      <div>
        {posts.map(p => (
          <div key={p._id} className="card mb-3 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <strong>{p.author?.name || 'Unknown'}</strong>
                <small className="text-muted">{new Date(p.createdAt).toLocaleString()}</small>
              </div>
              <div dangerouslySetInnerHTML={{ __html: md.render(p.text) }} />
              {p.attachmentUrl && (
                <div className="mt-2">
                  <a href={p.attachmentUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary">Attachment</a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
