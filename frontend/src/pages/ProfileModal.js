import React, { useState } from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import api from '../api';

export default function ProfileModal({ show, onHide, user }) {
  const [uploading, setUploading] = useState(false);
  const [picUrl, setPicUrl] = useState(user?.profilePic || '');
  React.useEffect(() => { setPicUrl(user?.profilePic || ''); }, [user]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const token = localStorage.getItem('token');
      const res = await api.post('/auth/upload-profile-pic', fd, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      setPicUrl(res.data.profilePic);
    } catch {
      alert('Upload failed');
    }
    setUploading(false);
  };
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Profile Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {user ? (
          <div className="text-center">
            <div className="mb-3">
              <img
                src={picUrl || 'https://via.placeholder.com/100?text=Avatar'}
                alt="Profile"
                className="rounded-circle border"
                style={{ width: 100, height: 100, objectFit: 'cover' }}
              />
            </div>
            <div className="mb-3">
              <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} />
              {uploading && <Spinner animation="border" size="sm" className="ms-2" />}
            </div>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
        ) : (
          <p>User details not available.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
