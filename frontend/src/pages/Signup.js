import React, { useState } from 'react';
import api from '../api';

export default function Signup({ setToken }){
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  // ...existing code...
  const [msg,setMsg]=useState('');

  // ...existing code...

  const submit = async (e)=>{
    e.preventDefault();
    try{
      const r = await api.post('/auth/signup', { name, email, password });
      setToken(r.data.token);
    }catch(err){ setMsg(err.response?.data?.error || 'Error'); }
  };
  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <h3 className="card-title mb-3">Signup</h3>
          <form onSubmit={submit}>
            {/* ...existing code... */}
            <div className="mb-3">
              <input
                className="form-control"
                placeholder="Name"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                className="form-control"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                className="form-control"
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <button className="btn btn-primary" type="submit">Signup</button>
          </form>
          {msg && <div className="mt-3 alert alert-danger">{msg}</div>}
        </div>
      </div>
      <div className="mt-3 text-center">
        <span>Already have an account? </span>
        <a href="/login" className="text-primary">Log in</a>
      </div>
    </div>
  );
}
